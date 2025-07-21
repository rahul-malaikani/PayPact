from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Group, GroupMember, Expense, Split

# Custom User admin (optional customization)
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    pass  # You can add custom fields here later if needed

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'created_at')
    search_fields = ('name', 'created_by__username')
    list_filter = ('created_at',)

@admin.register(GroupMember)
class GroupMemberAdmin(admin.ModelAdmin):
    list_display = ('group', 'user')
    search_fields = ('group__name', 'user__username')
    list_filter = ('group',)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('description', 'group', 'amount', 'paid_by', 'created_at')
    search_fields = ('description', 'group__name', 'paid_by__username')
    list_filter = ('group', 'paid_by', 'created_at')

@admin.register(Split)
class SplitAdmin(admin.ModelAdmin):
    list_display = ('group', 'owed_by', 'owed_to', 'amount')
    search_fields = ('group__description', 'owed_by__username', 'owed_to__username')
    list_filter = ('group',)
