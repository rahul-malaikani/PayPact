from rest_framework import serializers
from .models import User, Group, GroupMember, Expense, Split

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

class GroupMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMember
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    paid_by_username = serializers.CharField(source='paid_by.username', read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'group', 'amount', 'description', 'paid_by', 'paid_by_username', 'created_at']


class SplitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Split
        fields = '__all__'
