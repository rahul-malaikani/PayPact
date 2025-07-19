from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User, Group, GroupMember, Expense
from .serializers import *
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .permissions import IsMember
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterUserView(APIView):
    permission_classes = [AllowAny]

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


class LoginUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            })
        return Response({"error": "Invalid credentials"}, status=401)


class CreateGroupView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class UserGroupsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, user_id):
        print("User authenticated:", request.user.is_authenticated)
        print("User:", request.user)
        print("Request Headers:", request.headers)
        groups = Group.objects.filter(groupmember__user__id=user_id).order_by('-created_at')
        return Response(GroupSerializer(groups, many=True).data)


class AddMemberToGroupView(APIView):
    permission_classes = [IsAuthenticated]

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


class AddExpenseView(CreateAPIView):
    permission_classes = [IsAuthenticated, IsMember]
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer


class GroupExpensesView(APIView):
    permission_classes = [IsAuthenticated, IsMember]

    def get(self, request, group_id):
        expenses = Expense.objects.filter(group_id=group_id).order_by('-created_at')
        return Response(ExpenseSerializer(expenses, many=True).data)


class GetUserByUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            return Response(UserSerializer(user).data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class GroupDetailView(APIView):
    permission_classes = [IsAuthenticated, IsMember]

    def get(self, request, pk):
        try:
            group = Group.objects.get(pk=pk)
            serializer = GroupSerializer(group)
            return Response(serializer.data)
        except Group.DoesNotExist:
            return Response({"error": "Group not found"}, status=404)


class GroupMembersView(APIView):
    permission_classes = [IsAuthenticated, IsMember]

    def get(self, request, group_id):
        members = GroupMember.objects.filter(group_id=group_id).select_related('user')
        data = [{"id": m.user.id, "username": m.user.username} for m in members]
        return Response(data)


class GroupAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsMember]

    def get(self, request, group_id):
        expenses = Expense.objects.filter(group__id=group_id)
        members = GroupMember.objects.filter(group__id=group_id)

        total_amount = sum(float(e.amount) for e in expenses)

        user_totals = {}
        for member in members:
            username = member.user.username
            user_total = sum(float(e.amount) for e in expenses.filter(paid_by=member.user))
            user_totals[username] = user_total

        return Response({
            "total_spent": total_amount,
            "user_contributions": user_totals
        })


# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.contrib.auth import authenticate
# from .models import User, Group, GroupMember, Expense
# from .serializers import *
# from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
# from django.db import models
# from rest_framework.permissions import AllowAny,IsAuthenticated
# from .permissions import IsMember 

# # REGISTER
# class RegisterUserView(APIView):
#     permission_classes=[AllowAny]
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
#         email = request.data.get('email')

#         if User.objects.filter(username=username).exists():
#             return Response({'error': 'Username already exists'}, status=400)
#         if User.objects.filter(email=email).exists():
#             return Response({'error': 'Email already exists'}, status=400)

#         user = User.objects.create_user(username=username, password=password, email=email)
#         return Response(UserSerializer(user).data)

# # LOGIN
# class LoginUserView(APIView):
#     permission_classes = [AllowAny]
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
#         user = authenticate(username=username, password=password)

#         if user:
#             return Response({
#                 "id": user.id,
#                 "username": user.username,
#                 "email": user.email
#             })
#         return Response({"error": "Invalid credentials"}, status=401)

# # CREATE GROUP
# class CreateGroupView(CreateAPIView):
#     permission_classes=[IsAuthenticated]
#     queryset = Group.objects.all()
#     serializer_class = GroupSerializer

# # GET USER GROUPS
# class UserGroupsView(APIView):
#     permission_classes=[IsAuthenticated,IsMember]
#     def get(self, request, user_id):
#         groups = Group.objects.filter(groupmember__user__id=user_id).order_by('-created_at')
#         return Response(GroupSerializer(groups, many=True).data)

# # ADD MEMBER TO GROUP
# class AddMemberToGroupView(APIView):
#     permission_classes=[IsAuthenticated,IsMember]
#     def post(self, request):
#         group_id = request.data.get('group')
#         user_id = request.data.get('user')

#         if GroupMember.objects.filter(group_id=group_id, user_id=user_id).exists():
#             return Response({"message": "User already in group"}, status=400)

#         serializer = GroupMemberSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "User added to group"}, status=201)
#         return Response(serializer.errors, status=400)

# # ADD EXPENSE
# class AddExpenseView(CreateAPIView):
#     permission_classes=[IsAuthenticated,IsMember]
#     queryset = Expense.objects.all()
#     serializer_class = ExpenseSerializer

# # GET EXPENSES FOR GROUP
# class GroupExpensesView(APIView):
#     permission_classes=[IsAuthenticated,IsMember]
#     def get(self, request, group_id):
#         expenses = Expense.objects.filter(group_id=group_id).order_by('-created_at')
#         return Response(ExpenseSerializer(expenses, many=True).data)

# #GET ALL USERS
# class GetUserByUsernameView(APIView):
#     permission_classes=[IsAuthenticated,IsMember]
#     def get(self, request, username):
#         try:
#             user = User.objects.get(username=username)
#             return Response(UserSerializer(user).data)
#         except User.DoesNotExist:
#             return Response({"error": "User not found"}, status=404)

# #GROUP DETAILS FROM ID
# class GroupDetailView(APIView):
#     permission_classes=[IsAuthenticated,IsMember]
#     def get(self, request, pk):
#         try:
#             group = Group.objects.get(pk=pk)
#             serializer = GroupSerializer(group)
#             return Response(serializer.data)
#         except Group.DoesNotExist:
#             return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

# class GroupMembersView(APIView):
#     permission_classes=[IsAuthenticated,IsMember]
#     def get(self, request, group_id):
#         members = GroupMember.objects.filter(group_id=group_id).select_related('user')
#         data = [
#             {
#                 "id": m.user.id,
#                 "username": m.user.username
#             }
#             for m in members
#         ]
#         return Response(data)


# class GroupAnalyticsView(APIView):
#     permission_classes=[IsAuthenticated,IsMember]
#     def get(self, request, group_id):
#         expenses = Expense.objects.filter(group__id=group_id)
#         members = GroupMember.objects.filter(group__id=group_id)
        
#         total_amount = sum([float(e.amount) for e in expenses])
        
#         user_totals = {}
#         for member in members:
#             username = member.user.username
#             user_exp = expenses.filter(paid_by=member.user)
#             user_total = sum([float(e.amount) for e in user_exp])
#             user_totals[username] = user_total
        
#         return Response({
#             "total_spent": total_amount,
#             "user_contributions": user_totals
#         })

