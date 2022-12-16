from django.shortcuts import render, redirect
import uuid
import requests
import json
import re

def getBranches():
    allbranches = requests.get("http://localhost:3000/branch/getBranches")
    branches = json.loads(allbranches.text)
    branches=branches["message"]
    print("all branches = ",branches)
    if(branches=="Error"):
        return []
    return branches

def getSubjects():
    allsubjects=requests.get("http://localhost:3000/subject/getSubjects")
    subjects = json.loads(allsubjects.text)
    subjects=subjects["message"]
    # print("allsubjects", subjects)
    if(subjects=="Error"):
        subjects=[]
    return subjects

def getAllNewFacultyList():
    allfaculty = requests.get("http://localhost:3000/faculty/getAllNewFaculty")
    faculty_lists = json.loads(allfaculty.text)
    faculty_lists=faculty_lists["message"]
    # print("all New faculty : ", faculty_lists)
    if(faculty_lists=="Error"):
        return []
    return faculty_lists

def getAllFacultyList():
    allfaculty = requests.get("http://localhost:3000/faculty/getAssignedFaculty")
    faculty_lists = json.loads(allfaculty.text)
    faculty_lists=faculty_lists["message"]
    # print("all Assigned faculty : ", faculty_lists)
    if(faculty_lists=="Error"):
        return []
    return faculty_lists


def getNonAssignedFacultyDetails():
    all_subjects=getSubjects()
    branch_sub={}
    for i in all_subjects:
        if i['branch'] in branch_sub.keys():
            branch_sub[i['branch']].append(i['name'])
        else:
            branch_sub[i['branch']]=[i['name']]
    # print(branch_sub)
    newfaculty=getAllNewFacultyList()
    faculty_details = []
    for i in newfaculty:
        myobj = {
            "id": i['id'],
            "username": i['username'],
            "email": i['email'],
            "branch": i['branch'],
            "subjects": branch_sub[i['branch']] if i['branch'] in branch_sub.keys() else []
        }
        faculty_details.append(myobj)
    return faculty_details

# Create your views here.
def AdminAddBranch(request):
    try:
        if(request.method=="POST"):
            branch=request.POST['branch']
            print(branch)
            if(len(branch)==0):
                branches=getBranches()
                return render(request,"add_branch.html",{"error": "Branch Must be required","branches": branches})
            send_data = {
                "name": branch
            }
            print(send_data)
            
            resp_data=requests.post("http://localhost:3000/branch/addBranch", json=send_data)
            print(resp_data.text)

            resp_data_json = json.loads(resp_data.text)
            print(resp_data_json)
            if(resp_data_json['message']=="Error"):
                branches=getBranches()
                return render(request,"add_branch.html",{"error": branch+" is already Exists!!","branches": branches})

            branches=getBranches()

            return render(request,"add_branch.html",{"branches": branches})
        else:
            branches=getBranches()

            return render(request,"add_branch.html",{"branches": branches})
    except Exception as e:
        return render(request,"add_branch.html")

def AddSubject(request):
    try:
        error = None
        message=None
        if(request.method=="POST"):
            subject=request.POST['subject']
            branch=request.POST['branch']
            id=uuid.uuid4().hex

            if(subject=="" or subject==None or branch==""):
                subjects=getSubjects()
                branches= getBranches()
                return render(request,"add_subject.html",{"subjects": subjects,"branches": branches,"error": "Subject and Branch name must be required"})

            send_data = {
                "id": id,
                "name": subject,
                "branch": branch
            }
            print(send_data)

            sub_resp = requests.post("http://localhost:3000/subject/addSubject", json=send_data)
            print(sub_resp.text)
            sub_resp_json = json.loads(sub_resp.text)
            if(sub_resp_json['message']=="Error"):
                print("Error in adding subject")
                error="Subject name was already Exists!!!"
                message=None
            else:
                message="Subject Addedd Successfully"
                error=None
            
        subjects=getSubjects()
        branches=getBranches()

        return render(request,"add_subject.html",{"subjects": subjects,"branches": branches,"error": error,"message":message})
    except Exception as e:
        print("Add Subject Error")
        print(e)
        subjects=getSubjects()
        branches=getBranches()
        return render(request,"add_subject.html",{"subjects": subjects,"branches": branches})

def ViewFacultyDetails(request):
    try:
        if request.method=="POST":
            if "search" in request.POST:
                data=request.POST['searchval']
                print(data)
                faculty_list=getAllFacultyList()
                
                faculty_search_Details=[]
                c=0
                for i in faculty_list:
                    if re.match(data, i['username'], re.IGNORECASE) or re.match(data, i['email'], re.IGNORECASE) or re.match(data, str(i['id']), re.IGNORECASE) or re.match(data, i['subject'], re.IGNORECASE) or re.match(data, i['branch'], re.IGNORECASE):
                        faculty_search_Details.append(i)
                c=c+1
                if c!=0:
                    return render(request,'faculty_details.html',{'faculty_details': faculty_search_Details})
                
                return render(request,"faculty_details.html",{"faculty_details": faculty_list,"error": "No results found, so we are displaying all the results"})
            else:
                id=request.POST.get("deletefaculty")
                print(id)
                resp_data = requests.delete("http://localhost:3000/faculty/delete/"+id)
                print(resp_data.text)

                faculty_list=getAllFacultyList()
                return render(request,"faculty_details.html",{"faculty_details": faculty_list,"message": "Faculty was deleted Successfully"})

        faculty_list=getAllFacultyList()
        return render(request,"faculty_details.html",{"faculty_details": faculty_list})
    except Exception as e:
        print("error in view faculty",e)
        faculty_list=getAllFacultyList()
        return render(request,"faculty_details.html",{"faculty_details": faculty_list})
    return render(request,"faculty_details.html")

def AssignNewFaculty(request):
    try:
        if(request.method=="POST"):
            print("assign faculty")
            subject=request.POST['subject']
            id=request.POST.get("assignid")
            send_data= {
                "id": id,
                "subject": subject
            }

            resp_data = requests.put("http://localhost:3000/faculty/updateFaculty",json=send_data)
            print(resp_data.text)
        

        faculty_details=getNonAssignedFacultyDetails()
        return render(request,"new_faculty.html",{"faculty_details": faculty_details})

    except Exception as e:
        faculty_details=getNonAssignedFacultyDetails()
        print("Error in assign new faculty",e)
    return render(request,"new_faculty.html",{"error": "Error in assign new faculty","faculty_details": faculty_details})