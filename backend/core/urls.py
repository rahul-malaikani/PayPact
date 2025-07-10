from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user),
    path('create-group/', views.create_group),
    path('add-expense/', views.add_expense),
    path('groups/<int:user_id>/', views.get_user_groups),
    path('add-member/', views.add_member_to_group),
]
