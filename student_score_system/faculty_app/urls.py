from django.urls import path
from . import views

urlpatterns = [
    path('',views.AddTestScore,name="addtestscore"),
    path('scores/<str:test>',views.ViewStudentScores,name="viewscores"),
    path('logoutfaculty', views.Logoutfaculty, name="logoutfct")
]