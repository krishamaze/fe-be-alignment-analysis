from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("spares", "0001_initial")]

    operations = [
        migrations.AddField(
            model_name="spare",
            name="type",
            field=models.CharField(max_length=50, default=""),
            preserve_default=False,
        ),
        migrations.RenameField(
            model_name="spare",
            old_name="is_active",
            new_name="is_available",
        ),
    ]
