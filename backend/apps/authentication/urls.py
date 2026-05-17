from django.urls import path

from .views import AuthMeAPIView, LoginAPIView, RefreshAPIView, SignupAPIView

urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('refresh/', RefreshAPIView.as_view(), name='refresh'),
    path('me/', AuthMeAPIView.as_view(), name='me'),
]
