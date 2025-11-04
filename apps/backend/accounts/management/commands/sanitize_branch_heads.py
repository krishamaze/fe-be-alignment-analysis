from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import CustomUser
from store.models import Store


class Command(BaseCommand):
    help = "Ensure Store.branch_head and CustomUser.store are consistent"

    def add_arguments(self, parser):
        group = parser.add_mutually_exclusive_group()
        group.add_argument(
            "--dry-run",
            action="store_true",
            help="List issues without fixing (default)",
        )
        group.add_argument(
            "--apply", action="store_true", help="Apply fixes to simple mismatches"
        )

    def handle(self, *args, **options):
        apply = options.get("apply")
        dry_run = not apply
        mismatches = 0
        fixed = 0
        conflicts = 0

        for store in Store.objects.select_related("branch_head").all():
            bh = store.branch_head
            if bh:
                if bh.store_id is None:
                    mismatches += 1
                    if apply:
                        with transaction.atomic():
                            user = CustomUser.objects.select_for_update().get(pk=bh.pk)
                            locked_store = Store.objects.select_for_update().get(
                                pk=store.pk
                            )
                            user.store = locked_store
                            user.save(update_fields=["store"])
                        fixed += 1
                    else:
                        self.stdout.write(f"Fix: set user {bh.id} store to {store.id}")
                elif bh.store_id != store.id:
                    conflicts += 1
                    self.stdout.write(
                        f"Conflict: store {store.id} -> user {bh.id} but user points to store {bh.store_id}"
                    )

                extras = CustomUser.objects.filter(
                    store=store, role="branch_head", deleted=False, is_active=True
                ).exclude(pk=bh.pk)
                if extras.exists():
                    ids = ",".join(str(u.id) for u in extras)
                    count = extras.count()
                    conflicts += count
                    self.stdout.write(
                        f"Conflict: extra branch heads for store {store.id}: {ids}"
                    )
                    if apply:
                        with transaction.atomic():
                            for user in CustomUser.objects.select_for_update().filter(
                                pk__in=extras.values_list("pk", flat=True)
                            ):
                                user.store = None
                                user.save(update_fields=["store"])
                        fixed += count
            else:
                qs = CustomUser.objects.filter(
                    store=store, role="branch_head", deleted=False, is_active=True
                )
                if qs.count() == 1:
                    mismatches += 1
                    user = qs.first()
                    if apply:
                        with transaction.atomic():
                            user = CustomUser.objects.select_for_update().get(
                                pk=user.pk
                            )
                            locked_store = Store.objects.select_for_update().get(
                                pk=store.pk
                            )
                            locked_store.branch_head = user
                            locked_store.save(update_fields=["branch_head"])
                        fixed += 1
                    else:
                        self.stdout.write(
                            f"Fix: set store {store.id} branch_head to user {user.id}"
                        )
                elif qs.count() > 1:
                    conflicts += 1
                    ids = ",".join(str(u.id) for u in qs)
                    self.stdout.write(
                        f"Conflict: multiple branch heads for store {store.id}: {ids}"
                    )

        summary = f"mismatches={mismatches} fixed={fixed} conflicts={conflicts}"
        self.stdout.write(summary)
        exit_code = 0 if mismatches == 0 and conflicts == 0 else 1
        raise SystemExit(exit_code)
