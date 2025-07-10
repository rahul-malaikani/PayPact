from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Group, GroupMember, Expense, Split
from .serializers import *

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=400)
    user = User.objects.create_user(username=username, password=password, email=email)
    return Response(UserSerializer(user).data)

@api_view(['POST'])
def create_group(request):
    serializer = GroupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def add_expense(request):
    serializer = ExpenseSerializer(data=request.data)
    if serializer.is_valid():
        expense = serializer.save()
        return Response(ExpenseSerializer(expense).data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_user_groups(request, user_id):
    groups = Group.objects.filter(groupmember__user__id=user_id)
    return Response(GroupSerializer(groups, many=True).data)


@api_view(['POST'])
def add_member_to_group(request):
    group_id = request.data.get('group')
    user_id = request.data.get('user')

    # Prevent duplicates
    if GroupMember.objects.filter(group_id=group_id, user_id=user_id).exists():
        return Response({"message": "User already in group"}, status=400)

    serializer = GroupMemberSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User added to group"}, status=201)
    return Response(serializer.errors, status=400)
