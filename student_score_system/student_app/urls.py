from django.urls import path
from . import views

urlpatterns = [
    path('',views.Subject_List,name="subjectlist"),
    path('score/<str:subject>/<str:test>',views.Student_Subject_Score,name="sub_score"),
    path('logoutstudent', views.LogoutStudent, name="logoutstd")
]