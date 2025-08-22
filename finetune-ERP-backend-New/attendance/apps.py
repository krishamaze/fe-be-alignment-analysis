"""App configuration for the attendance app."""

from django.apps import AppConfig


class AttendanceConfig(AppConfig):
    """Default configuration for the attendance app."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'attendance'
