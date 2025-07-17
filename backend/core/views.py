from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User, Group, GroupMember, Expense
from .serializers import *
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from django.db import models

# REGISTER
class RegisterUserView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=400)

        user = User.objects.create_user(username=username, password=password, email=email)
        return Response(UserSerializer(user).data)

# LOGIN
class LoginUserView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email
            })
        return Response({"error": "Invalid credentials"}, status=401)

# CREATE GROUP
class CreateGroupView(CreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

# GET USER GROUPS
class UserGroupsView(APIView):
    def get(self, request, user_id):
        groups = Group.objects.filter(groupmember__user__id=user_id).order_by('-created_at')
        return Response(GroupSerializer(groups, many=True).data)

# ADD MEMBER TO GROUP
class AddMemberToGroupView(APIView):
    def post(self, request):
        group_id = request.data.get('group')
        user_id = request.data.get('user')

        if GroupMember.objects.filter(group_id=group_id, user_id=user_id).exists():
            return Response({"message": "User already in group"}, status=400)

        serializer = GroupMemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User added to group"}, status=201)
        return Response(serializer.errors, status=400)

# ADD EXPENSE
class AddExpenseView(CreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

# GET EXPENSES FOR GROUP
class GroupExpensesView(APIView):
    def get(self, request, group_id):
        expenses = Expense.objects.filter(group_id=group_id).order_by('-created_at')
        return Response(ExpenseSerializer(expenses, many=True).data)

#GET ALL USERS
class GetUserByUsernameView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            return Response(UserSerializer(user).data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

#GROUP DETAILS FROM ID
class GroupDetailView(APIView):
    def get(self, request, pk):
        try:
            group = Group.objects.get(pk=pk)
            serializer = GroupSerializer(group)
            return Response(serializer.data)
        except Group.DoesNotExist:
            return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

class GroupMembersView(APIView):
    def get(self, request, group_id):
        members = GroupMember.objects.filter(group_id=group_id).select_related('user')
        data = [
            {
                "id": m.user.id,
                "username": m.user.username
            }
            for m in members
        ]
        return Response(data)


class GroupAnalyticsView(APIView):
    def get(self, request, group_id):
        expenses = Expense.objects.filter(group__id=group_id)
        members = GroupMember.objects.filter(group__id=group_id)
        
        total_amount = sum([float(e.amount) for e in expenses])
        
        user_totals = {}
        for member in members:
            username = member.user.username
            user_exp = expenses.filter(paid_by=member.user)
            user_total = sum([float(e.amount) for e in user_exp])
            user_totals[username] = user_total
        
        return Response({
            "total_spent": total_amount,
            "user_contributions": user_totals
        })



# from django.shortcuts import render
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from .models import User, Group, GroupMember, Expense, Split
# from .serializers import *

# @api_view(['POST'])
# def register_user(request):
#     username = request.data.get('username')
#     password = request.data.get('password')
#     email = request.data.get('email')
#     if User.objects.filter(username=username).exists():
#         return Response({'error': 'Username already exists'}, status=400)
#     if User.objects.filter(email=email).exists():
#         return Response({'error': 'Email already exists'}, status=400)
#     user = User.objects.create_user(username=username, password=password, email=email)
#     return Response(UserSerializer(user).data)

# @api_view(['POST'])
# def create_group(request):
#     serializer = GroupSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=201)
#     return Response(serializer.errors, status=400)

# @api_view(['POST'])
# def add_expense(request):
#     serializer = ExpenseSerializer(data=request.data)
#     if serializer.is_valid():
#         expense = serializer.save()
#         return Response(ExpenseSerializer(expense).data, status=201)
#     return Response(serializer.errors, status=400)

# @api_view(['GET'])
# def get_user_groups(request, user_id):
#     groups = Group.objects.filter(groupmember__user__id=user_id)
#     return Response(GroupSerializer(groups, many=True).data)


# @api_view(['POST'])
# def add_member_to_group(request):
#     group_id = request.data.get('group')
#     user_id = request.data.get('user')

#     # Prevent duplicates
#     if GroupMember.objects.filter(group_id=group_id, user_id=user_id).exists():
#         return Response({"message": "User already in group"}, status=400)

#     serializer = GroupMemberSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({"message": "User added to group"}, status=201)
#     return Response(serializer.errors, status=400)

# @api_view(['POST'])
# def login_user(request):
#     from django.contrib.auth import authenticate

#     username = request.data.get('username')
#     password = request.data.get('password')

#     user = authenticate(username=username, password=password)

#     if user:
#         return Response({
#             "id": user.id,
#             "username": user.username,
#             "email": user.email
#         })
#     return Response({"error": "Invalid credentials"}, status=401)

# @api_view(['GET'])
# def get_group_expenses(request, group_id):
#     expenses = Expense.objects.filter(group_id=group_id).order_by('-created_at')
#     serializer = ExpenseSerializer(expenses, many=True)
#     return Response(serializer.data)
