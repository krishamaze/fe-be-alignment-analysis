import io
import pytest
from django.contrib.auth import get_user_model
from django.core.management import call_command
from rest_framework.test import APIClient
from django.core.exceptions import ValidationError
from django.contrib.admin.sites import AdminSite
from accounts.admin import CustomUserAdmin


@pytest.mark.django_db
def test_assign_branch_head_success(admin_user, store_s2):
    User = get_user_model()
    bh = User.objects.create_user(
        username="newbh", password="pw", email="newbh@example.com", role="branch_head"
    )
    client = APIClient()
    client.force_authenticate(admin_user)
    resp = client.post(
        f"/api/stores/{store_s2.id}/assign-branch-head", {"user_id": bh.id}, format="json"
    )
    assert resp.status_code == 200
    store_s2.refresh_from_db(); bh.refresh_from_db()
    assert store_s2.branch_head_id == bh.id
    assert bh.store_id == store_s2.id
    resp = client.post(
        f"/api/stores/{store_s2.id}/assign-branch-head", {"user_id": bh.id}, format="json"
    )
    assert resp.status_code == 200


@pytest.mark.django_db
def test_assign_branch_head_auth_failure(branch_head, store_s2):
    User = get_user_model()
    other = User.objects.create_user(
        username="bhx", password="pw", email="bhx@example.com", role="branch_head"
    )
    client = APIClient()
    client.force_authenticate(branch_head)
    resp = client.post(
        f"/api/stores/{store_s2.id}/assign-branch-head", {"user_id": other.id}, format="json"
    )
    assert resp.status_code == 403


@pytest.mark.django_db
def test_unassign_branch_head_success(admin_user, store_s1):
    User = get_user_model()
    bh = User.objects.create_user(
        username="bh", password="pw", email="bh@example.com", role="branch_head"
    )
    store_s1.branch_head = bh
    store_s1.save(update_fields=["branch_head"])
    bh.store = store_s1
    bh.save(update_fields=["store"])
    client = APIClient()
    client.force_authenticate(admin_user)
    resp = client.post(f"/api/stores/{store_s1.id}/unassign-branch-head")
    assert resp.status_code == 200
    store_s1.refresh_from_db(); bh.refresh_from_db()
    assert store_s1.branch_head_id is None
    assert bh.store_id is None
    resp = client.post(f"/api/stores/{store_s1.id}/unassign-branch-head")
    assert resp.status_code == 200


@pytest.mark.django_db
def test_unassign_branch_head_auth_failure(branch_head, store_s1):
    client = APIClient()
    client.force_authenticate(branch_head)
    resp = client.post(f"/api/stores/{store_s1.id}/unassign-branch-head")
    assert resp.status_code == 403


@pytest.mark.django_db
def test_sanitize_branch_heads_dry_run(store_s1):
    User = get_user_model()
    bh = User.objects.create_user(
        username="bh1", password="pw", email="bh1@example.com", role="branch_head", store=store_s1
    )
    out = io.StringIO()
    with pytest.raises(SystemExit) as exc:
        call_command("sanitize_branch_heads", stdout=out)
    assert exc.value.code == 1
    store_s1.refresh_from_db(); bh.refresh_from_db()
    assert store_s1.branch_head_id is None
    assert bh.store_id == store_s1.id


@pytest.mark.django_db
def test_sanitize_branch_heads_apply(store_s1):
    User = get_user_model()
    bh = User.objects.create_user(
        username="bh2", password="pw", email="bh2@example.com", role="branch_head", store=store_s1
    )
    out = io.StringIO()
    with pytest.raises(SystemExit) as exc:
        call_command("sanitize_branch_heads", "--apply", stdout=out)
    assert exc.value.code == 1
    store_s1.refresh_from_db(); bh.refresh_from_db()
    assert store_s1.branch_head_id == bh.id
    assert bh.store_id == store_s1.id
    out2 = io.StringIO()
    with pytest.raises(SystemExit) as exc2:
        call_command("sanitize_branch_heads", stdout=out2)
    assert exc2.value.code == 0


@pytest.mark.django_db
def test_branch_head_creation_requires_no_store(admin_user, store_s1):
    client = APIClient()
    client.force_authenticate(admin_user)
    payload = {
        "username": "bhc",
        "email": "bhc@example.com",
        "password": "pw",
        "role": "branch_head",
    }
    resp = client.post("/api/users", payload, format="json")
    assert resp.status_code == 201
    assert resp.data["store"] is None
    payload["username"] = "bhc2"
    payload["email"] = "bhc2@example.com"
    payload["store"] = store_s1.id
    resp = client.post("/api/users", payload, format="json")
    assert resp.status_code == 400


@pytest.mark.django_db
def test_sanitize_branch_heads_extra_users(store_s1):
    User = get_user_model()
    bh1 = User.objects.create_user(
        username="bhx1", password="pw", email="bhx1@example.com", role="branch_head"
    )
    store_s1.branch_head = bh1
    store_s1.save(update_fields=["branch_head"])
    bh1.store = store_s1
    bh1.save(update_fields=["store"])
    extra = User.objects.create_user(
        username="bhx2", password="pw", email="bhx2@example.com", role="branch_head", store=store_s1
    )
    out = io.StringIO()
    with pytest.raises(SystemExit) as exc:
        call_command("sanitize_branch_heads", stdout=out)
    assert exc.value.code == 1
    assert str(extra.id) in out.getvalue()
    out2 = io.StringIO()
    with pytest.raises(SystemExit) as exc2:
        call_command("sanitize_branch_heads", "--apply", stdout=out2)
    assert exc2.value.code == 1
    extra.refresh_from_db()
    assert extra.store_id is None


@pytest.mark.django_db
def test_customuser_clean_conflict(store_s1):
    User = get_user_model()
    bh1 = User.objects.create_user(
        username="mainbh", password="pw", email="mainbh@example.com", role="branch_head", store=store_s1
    )
    store_s1.branch_head = bh1
    store_s1.save(update_fields=["branch_head"])
    bh2 = User(
        username="otherbh", email="otherbh@example.com", role="branch_head", store=store_s1
    )
    bh2.set_password("pw")
    with pytest.raises(ValidationError):
        bh2.full_clean()


@pytest.mark.django_db
def test_admin_save_model_calls_full_clean(store_s1):
    User = get_user_model()
    bh1 = User.objects.create_user(
        username="admibh1", password="pw", email="admibh1@example.com", role="branch_head", store=store_s1
    )
    store_s1.branch_head = bh1
    store_s1.save(update_fields=["branch_head"])
    bh2 = User(
        username="admibh2", email="admibh2@example.com", role="branch_head", store=store_s1
    )
    bh2.set_password("pw")
    admin_site = AdminSite()
    admin = CustomUserAdmin(User, admin_site)
    with pytest.raises(ValidationError):
        admin.save_model(None, bh2, form=None, change=False)
