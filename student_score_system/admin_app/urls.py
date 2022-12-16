from django.urls import path
from . import views

urlpatterns = [
    path('', views.AdminAddBranch, name="add_branch"),
    path('add_subject', views.AddSubject, name="add_subject"),
    path('newFaculty',views.AssignNewFaculty,name="new_faculty"),
    path('facultyDetails',views.ViewFacultyDetails,name="facultydetails")
]