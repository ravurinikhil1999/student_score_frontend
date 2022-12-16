from django.urls import path
from . import views

urlpatterns = [
    path('', views.HomePage, name="homepage"),
    path('login', views.LoginPage, name="login"),
    path('register', views.RegisterPage, name="register"),
    path('studentregister', views.StudentRegister,name="studentReg"),
    path('facultyregister',views.FacultyRegister,name="facultyReg")
]