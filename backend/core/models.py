from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # You can extend this later with profile_pic, phone, etc.

    def __str__(self):
        return self.username or self.email or f"User {self.id}"


class Group(models.Model):
    name = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_groups')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Expense(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses_paid')
    created_at = models.DateTimeField(auto_now_add=True)

class Split(models.Model):
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE)
    owed_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='splits_owed')
    owed_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='splits_to_get')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
