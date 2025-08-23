from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import CustomUser
from store.models import Store, StoreGeofence


class MeAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.store = Store.objects.create(store_name="S1", code="S1")
        StoreGeofence.objects.create(
            store=self.store, latitude=12.34, longitude=56.78, radius_m=100
        )
        self.user = CustomUser.objects.create_user(
            username="adv",
            password="pw",
            role="advisor",
            store=self.store,
            email="adv@example.com",
        )
        self.client.force_authenticate(self.user)

    def test_me_returns_store_geofence(self):
        resp = self.client.get("/api/auth/me")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["id"], self.user.id)
        self.assertEqual(resp.data["store_ids"], [self.store.id])
        self.assertTrue(resp.data["workledger_enabled"])
        self.assertEqual(resp.data["store_geofences"][0]["store_id"], self.store.id)
