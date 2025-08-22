from django.db import migrations, models


def migrate_admin_role(apps, schema_editor):
    User = apps.get_model('accounts', 'CustomUser')
    User.objects.filter(role='admin').update(role='system_admin')


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_remove_customuser_hourly_rate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='role',
            field=models.CharField(
                max_length=12,
                choices=[
                    ('system_admin', 'System Admin'),
                    ('branch_head', 'Branch Head'),
                    ('advisor', 'Advisor'),
                ],
                default='advisor',
            ),
        ),
        migrations.RunPython(migrate_admin_role, migrations.RunPython.noop),
    ]

