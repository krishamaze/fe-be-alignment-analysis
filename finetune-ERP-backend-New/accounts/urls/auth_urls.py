from django.urls import path
from accounts.views.auth import (
    MyTokenObtainPairView,
    RegisterUserView,
    LogoutView,
    MeAPIView,
)


urlpatterns = [
    path(
        "login", MyTokenObtainPairView.as_view(), name="token_obtain_pair"
    ),  # 🔐 JWT login
    path("register", RegisterUserView.as_view(), name="register"),  # 🧑 Create user
    path("logout", LogoutView.as_view(), name="logout"),  # ✅ New logout route
    path("me", MeAPIView.as_view(), name="me"),
]
