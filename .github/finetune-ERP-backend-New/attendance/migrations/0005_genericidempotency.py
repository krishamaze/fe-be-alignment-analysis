from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ("attendance", "0004_attendancerequest"),
    ]

    operations = [
        migrations.CreateModel(
            name="GenericIdempotency",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("key", models.CharField(max_length=64, unique=True, db_index=True)),
                ("endpoint", models.CharField(max_length=64)),
                ("object_pk", models.CharField(blank=True, max_length=64)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.ForeignKey(on_delete=models.CASCADE, related_name="+", to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
