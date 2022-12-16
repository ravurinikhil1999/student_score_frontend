from django.shortcuts import render, redirect
import requests
import json
import uuid

# Create your views here.

def getStudentsList(branch):
    try:
        resp_data=requests.get("http://localhost:3000/student/branchstudents/"+branch)
        resp_data_json=json.loads(resp_data.text)
        all_students=resp_data_json['message']
        if(all_students=="Error"):
            return []
        return all_students
    except:
        return []

def getExamNames(faculty_id):
    try:
        exam_names_data = requests.get("http://localhost:3000/exam/getfacultyExamNames/"+str(faculty_id))
        exam_names_data=json.loads(exam_names_data.text)
        exam_names_data=exam_names_data["message"]
        # print(exam_names_data)
        if(exam_names_data=="Error" or len(exam_names_data)==0):
            return []
        else:
            return exam_names_data
    except:
        return []

def getExamScoresById(exam_id):
    try:
        exam_scores_data = requests.get("http://localhost:3000/exam/getExamScoresById/"+str(exam_id))
        exam_scores_data=json.loads(exam_scores_data.text)
        exam_scores_data=exam_scores_data["message"]
        # print(exam_scores_data)
        if(exam_scores_data=="Error" or len(exam_scores_data)==0):
            return []
        else:
            return exam_scores_data
    except:
        return []

def ViewStudentScores(request,test="sample"):
    try:
        faculty_id= request.session['id']
        exam_names_data=getExamNames(faculty_id)
        if(request.method=="POST"):
            if "newexam" in request.POST:
                exam_name=request.POST['exam_name']
                exam_id_resp = requests.get("http://localhost:3000/exam/getExamID/"+exam_name)
                exam_id_resp=json.loads(exam_id_resp.text)
                exam_id= exam_id_resp['message']
                if(exam_id=="Error"):
                    return render(request,"fct_std_Scores.html",{"new":"new","exam_names": exam_names_data,"error": "Select other exams"})

                scores_data = getExamScoresById(exam_id[0]['id'])
                print(scores_data)
                return render(request,"fct_std_Scores.html",{"exam_names": exam_names_data,"scores_data": scores_data,"exam_name": exam_name})

            else:
                print("edit test")
        else:
            return render(request,"fct_std_Scores.html",{"new":"new","exam_names": exam_names_data})
    except Exception as e:
        print(e)
    return render(request,"fct_std_Scores.html")

def AddTestScore(request):
    try:
        branch=request.session['branch']
        if(branch==None):
            return redirect("login")

        if(request.method=="POST"):
            print("post req")
            print(request.POST)
            examname=request.POST['examname']
            subject=request.session['subject']
            faculty_id= request.session['id']
            print(faculty_id)
            id=uuid.uuid4().hex
            send_obj = {
                "id": id,
                "faculty_id": faculty_id,
                "branch": branch,
                "subject": subject,
                "exam_name": examname
            }
            exam_rec_resp = requests.post("http://localhost:3000/exam/addExamRecord",json=send_obj)
            exam_rec_json=json.loads(exam_rec_resp.text)
            print("exam",exam_rec_json)
            exam_rec_json=exam_rec_json['message']

            if(exam_rec_json=="Error"):
                all_students=getStudentsList(branch)
                return render(request,"fct_home.html",{"students": all_students,"error": "Please try After some time"})
            
            id_list=request.POST.getlist('id')
            grade_list=request.POST.getlist('grade')
            score_list=request.POST.getlist('score')
            n=len(id_list)
            for i in range(n):
                send_data= {
                    "id": id,
                    "student_id": int(id_list[i]),
                    "grade": grade_list[i],
                    "score": score_list[i]
                }
                print(send_data)
                exam_score_rec_resp = requests.post("http://localhost:3000/exam/addExamScore",json=send_data)
                print(exam_score_rec_resp.text)

        all_students=getStudentsList(branch)
        return render(request,"fct_home.html",{"students": all_students})

    except Exception as e:
        print(e)
        return redirect("login")
    return render(request,"fct_home.html")

def Logoutfaculty(request):
    try:
        del request.session['username']
        del request.session['email']
        del request.session['id']
        del request.session['branch']
        del request.session['profession']
        del request.session['subject']
        del request.session['branch']
        return redirect("login")
    except:
        return redirect("login")