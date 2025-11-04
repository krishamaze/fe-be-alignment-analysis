from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from attendance.tasks import autoclose_for_date


class Command(BaseCommand):
    """Auto-close open attendances and create ABSENT records.

    Cron examples::

        # Run daily at 23:59 IST to close the day
        59 23 * * * /path/to/venv/bin/python manage.py attendance_autoclose --date=$(TZ=Asia/Kolkata date -I)
        # Or run each morning for yesterday (default)
        10 00 * * * /path/to/venv/bin/python manage.py attendance_autoclose
    """

    help = "Finalize open attendances and mark absents for a given date"

    def add_arguments(self, parser):
        parser.add_argument(
            "--date",
            dest="date",
            help="Target date in YYYY-MM-DD format (defaults to yesterday in local tz)",
        )

    def handle(self, *args, **options):
        date_str = options.get("date")
        if date_str:
            target_date = date.fromisoformat(date_str)
        else:
            target_date = timezone.localdate() - timedelta(days=1)

        result = autoclose_for_date(target_date)
        self.stdout.write(
            f"attendance_autoclose {target_date}: finalized={result['finalized']} absents={result['absents_created']}"
        )
