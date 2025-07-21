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
    owed_by_username = serializers.CharField(source='owed_by.username', read_only=True)
    owed_to_username = serializers.CharField(source='owed_to.username', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)

    class Meta:
        model = Split
        fields = ['id', 'group', 'group_name', 'owed_by', 'owed_to', 
                  'owed_by_username', 'owed_to_username', 'amount', 'status']
