import pytest
from datetime import datetime, time
from zoneinfo import ZoneInfo
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model


@pytest.fixture(autouse=True)
def _set_timezone(settings):
    settings.TIME_ZONE = "Asia/Kolkata"
    settings.SECURE_SSL_REDIRECT = False  # Disable SSL redirect for all tests
    timezone.activate("Asia/Kolkata")
    yield
    timezone.deactivate()


@pytest.fixture
def localdt():
    tz = ZoneInfo("Asia/Kolkata")

    def _make(y, m, d, hh=0, mm=0):
        return datetime(y, m, d, hh, mm, tzinfo=tz)

    return _make


@pytest.fixture
def store_s1(db):
    from store.models import Store

    return Store.objects.create(store_name="Store1", code="S1")


@pytest.fixture
def store_s2(db):
    from store.models import Store

    return Store.objects.create(store_name="Store2", code="S2")


@pytest.fixture
def geofence_s1(store_s1):
    from store.models import StoreGeofence

    gf, _ = StoreGeofence.objects.get_or_create(
        store=store_s1,
        defaults={"latitude": 0, "longitude": 0, "radius_m": 500},
    )
    return gf


@pytest.fixture
def day_shift(db):
    from attendance.models import Shift

    return Shift.objects.create(name="Day", start_time=time(9, 0), end_time=time(18, 0))


@pytest.fixture
def night_shift(db):
    from attendance.models import Shift

    return Shift.objects.create(
        name="Night", start_time=time(22, 0), end_time=time(6, 0), is_overnight=True
    )


@pytest.fixture
def admin_user(db):
    User = get_user_model()
    return User.objects.create_user(
        username="admin", password="pw", email="admin@example.com", role="system_admin"
    )


@pytest.fixture
def branch_head(db, store_s1):
    User = get_user_model()
    return User.objects.create_user(
        username="bh",
        password="pw",
        email="bh@example.com",
        role="branch_head",
        store=store_s1,
    )


@pytest.fixture
def advisor1(db, store_s1):
    from store.models import StoreGeofence

    StoreGeofence.objects.get_or_create(
        store=store_s1,
        defaults={"latitude": 0, "longitude": 0, "radius_m": 500},
    )
    User = get_user_model()
    return User.objects.create_user(
        username="adv1",
        password="pw",
        email="adv1@example.com",
        role="advisor",
        store=store_s1,
    )


@pytest.fixture
def advisor2(db, store_s2):
    User = get_user_model()
    return User.objects.create_user(
        username="adv2",
        password="pw",
        email="adv2@example.com",
        role="advisor",
        store=store_s2,
    )


@pytest.fixture
def fake_selfie():
    def _make(name="in.jpg"):
        # minimal JPEG bytes
        return SimpleUploadedFile(
            name, b"\xff\xd8\xff\xe0\x00\x00\xff\xd9", content_type="image/jpeg"
        )

    return _make
