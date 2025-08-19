# run_migrations.py
import os
import django
from django.core.management import call_command
from django.contrib.auth import get_user_model

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

print("📦 Running makemigrations + migrate...")
call_command("makemigrations")
call_command("migrate")

print("🧼 Running collectstatic...")
call_command("collectstatic", interactive=False, verbosity=0)

User = get_user_model()
if not User.objects.filter(username=os.getenv("DJANGO_SUPERUSER_USERNAME")).exists():
    print("👤 Creating superuser...")
    User.objects.create_superuser(
        username=os.getenv("DJANGO_SUPERUSER_USERNAME"),
        email=os.getenv("DJANGO_SUPERUSER_EMAIL"),
        password=os.getenv("DJANGO_SUPERUSER_PASSWORD")
    )
    print("✅ Superuser created.")
else:
    print("⚠️ Superuser already exists.")
