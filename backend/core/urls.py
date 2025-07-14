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
]
