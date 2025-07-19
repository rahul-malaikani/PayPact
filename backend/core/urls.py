from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('create-group/', CreateGroupView.as_view(), name='create-group'),
    path('groups/<int:user_id>/', UserGroupsView.as_view(), name='user-groups'),
    path('add-member/', AddMemberToGroupView.as_view(), name='add-member'),
    path('add-expense/', AddExpenseView.as_view(), name='add-expense'),
    path('expenses/<int:group_id>/', GroupExpensesView.as_view(), name='group-expenses'),
    path('users/<str:username>/', GetUserByUsernameView.as_view(), name='get-user-by-username'),
    path("group/<int:pk>/", GroupDetailView.as_view()),
    path('groups/<int:group_id>/members/', GroupMembersView.as_view(), name='group-members'),
    path('group/<int:group_id>/analytics/', GroupAnalyticsView.as_view(), name='group-analytics'),
    path('createpaymentorder/', CreatePaymentOrderView.as_view(), name='create-payment-order'),
    path('verifypayment/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('updatesplitstatus/', UpdateSplitStatusView.as_view(), name='update-split-status'),
    path('groups/<int:group_id>/splits-status/', GroupSplitsStatusView.as_view(), name='group-splits-status'),
]
