from django.shortcuts import render
from django.shortcuts import redirect
import requests
import json

# Create your views here.

def CheckData(request):
    # try:
    #     pro=request.session['profession']
    #     if(pro=="student"):
    #         print("student")
    #         return redirect("subjectlist")
    #     elif pro=="faculty":
    #         print("fac")
    #         return redirect("addtestscore")
    #     return pro
    # except:
    #     return None
    return None

def HomePage(request):
    try:
        CheckData(request)
    except:
        return render(request,'home.html')
    return render(request,'home.html')

def RegisterPage(request):
    return render(request,'register.html')

def LoginPage(request):
    if request.method=="POST":
        id=request.POST['id']
        password=request.POST['password']
        if id=="admin@gmail.com" and password=="admin":
            return redirect("add_branch")
        category=request.POST['category']
        if(category==None):
            return render(request,'login.html',{'error':'Please select the category'})
        
        cred_obj = {
            "id": id,
            "password": password
        }

        if category=="student":
            try:
                std_resp = requests.post("http://localhost:3000/auth/student/login", json=cred_obj)
                recv_text= std_resp.text
                recv_text_json = json.loads(recv_text)
                print(recv_text_json)

                if(recv_text_json['message'] == "Error"):
                    print("err")
                    return render(request,'login.html',{'error':'invalid email or password'})

                user_Details =recv_text_json['message']

                AddSession(request,user_Details)
                request.session['profession']="student"

                return redirect("subjectlist")
                
            except:
                return render(request,'login.html',{'error':'invalid email or password'})
        else:
            try:
                std_resp = requests.post("http://localhost:3000/auth/faculty/login", json=cred_obj)
                recv_text= std_resp.text
                recv_text_json = json.loads(recv_text)
                print(recv_text_json)

                if(recv_text_json['message'] == "Error"):
                    print("Error")
                    return render(request,'login.html',{'error':'invalid email or password'})

                user_Details =recv_text_json['message']
                if(user_Details['assign']==0):
                    return render(request,'invalidfaculty.html')

                AddSession(request,user_Details)
                request.session['profession']="faculty"
                request.session['subject']=user_Details['subject']
                request.session['branch']=user_Details['branch']
                return redirect("addtestscore")
            except:
                return render(request,'login.html',{'error':'invalid email or password'})
    CheckData(request)
    return render(request,"login.html")

def StudentRegister(request):
    if(request.method=="POST"):
        try:
            print("student req, POST")
            id=request.POST['id']
            if(len(id)!=6):
                allbranches = requests.get("http://localhost:3000/branch/getBranches")
                branches = json.loads(allbranches.text)
                branches=branches["message"]
                return render(request,'studentRegister.html',{'error':'ID must contains only 6 digits!!!',"branches": branches})
            email=request.POST['email']
            username=request.POST['username']
            branch=request.POST['branch']
            password=request.POST['password']
            senddata = {
                "id": id,
                "username": username,
                "email": email,
                "branch": branch,
                "password": password
            }
            print(senddata)

            resp = requests.post("http://localhost:3000/auth/studentReg", json=senddata)
            print(resp.text)
            recv_data=json.loads(resp.text)
            recvmessage=recv_data['message']
            if(recvmessage=="success"):
                inc_std_val=requests.get("http://localhost:3000/branch/increment/student/"+branch)
                print(inc_std_val)
                return redirect("login")

            return render(request,'studentRegister.html',{'error':'This Id was already registered'})
        except:
            print("error")
            return render(request,"studentRegister.html")
    try:
        allbranches = requests.get("http://localhost:3000/branch/getBranches")
        branches = json.loads(allbranches.text)
        branches=branches["message"]
        print(branches)
        return render(request,"studentRegister.html",{"branches": branches})
    except:
        return render(request,"studentRegister.html")

def FacultyRegister(request):
    if(request.method=="POST"):
        try:
            print("student req, POST")
            id=request.POST['id']
            if(len(id)!=4):
                allbranches = requests.get("http://localhost:3000/branch/getBranches")
                branches = json.loads(allbranches.text)
                branches=branches["message"]
                return render(request,'facultyregister.html',{'error':'ID must contains only 4 digits!!!',"branches": branches})
            email=request.POST['email']
            username=request.POST['username']
            branch=request.POST['branch']
            password=request.POST['password']

            senddata = {
                "id": id,
                "username": username,
                "email": email,
                "branch": branch,
                "password": password
            }

            resp = requests.post("http://localhost:3000/auth/facultyReg", json=senddata)
            print(resp.text)
            recv_data=json.loads(resp.text)
            recvmessage=recv_data['message']
            if(recvmessage=="success"):
                inc_fctval=requests.get("http://localhost:3000/branch/increment/faculty/"+branch)
                print(inc_fctval)
                return redirect("login")
            return render(request,'facultyregister.html',{'error':'This Id was already registered!!'})
        except:
            return render(request,"facultyregister.html")
    try:
        allbranches = requests.get("http://localhost:3000/branch/getBranches")
        branches = json.loads(allbranches.text)
        branches=branches["message"]
        # print(branches)
        return render(request,"facultyregister.html",{"branches": branches})
    except:
        return render(request,"facultyregister.html")

def AddSession(request,detail):
    request.session['username']=detail['username']
    request.session['email']=detail['email']
    request.session['id']=detail['id']
    request.session['branch']=detail['branch']
    print("added session")