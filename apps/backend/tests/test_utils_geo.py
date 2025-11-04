import pytest
from attendance.utils import within_radius_m
from store.models import StoreGeofence


@pytest.mark.django_db
def test_point_at_center_inside(store_s1):
    gf = StoreGeofence(store=store_s1, latitude=0, longitude=0, radius_m=1)
    assert within_radius_m(0, 0, gf) is True


@pytest.mark.django_db
def test_point_about_157m_east_inside(geofence_s1):
    assert within_radius_m(0, 0.0015, geofence_s1) is True


@pytest.mark.django_db
def test_far_point_outside(geofence_s1):
    assert within_radius_m(10, 10, geofence_s1) is False
