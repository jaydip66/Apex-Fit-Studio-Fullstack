from django.db import models

class Plan(models.Model):
    name = models.CharField(max_length=100)
    duration_months = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Trainer(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    specialization = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Member(models.Model):
    full_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    gender = models.CharField(max_length=10)
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True)
    joining_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.full_name

class Booking(models.Model):
    member_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=15)
    facility_type = models.CharField(max_length=100)  # Cardio, CrossFit, Personal Training, Yoga
    booking_date = models.DateField()
    time_slot = models.CharField(max_length=50)       # Morning Batch, Evening Batch
    status = models.CharField(max_length=20, default='Confirmed')

    def __str__(self):
        return f"{self.member_name} - {self.facility_type}"