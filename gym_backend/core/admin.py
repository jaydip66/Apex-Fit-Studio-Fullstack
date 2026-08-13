from django.contrib import admin
from .models import Plan, Trainer, Member

# Models Admin Panel 
admin.site.register(Plan)
admin.site.register(Trainer)
admin.site.register(Member)