from django.shortcuts import render, redirect
import requests
import json

# Create your views here.

def getExamNamesBySubjectBranch(subject, branch):
    try:
        exam_names_data = requests.get("http://localhost:3000/exam/getExamName/{}/{}".format(branch,subject))
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

def Subject_List(request):
    try:
        branch=request.session['branch']
        if(branch==None):
            return redirect("login")

        resp_data=requests.get("http://localhost:3000/subject/branchSubjects/"+branch)
        # print(resp_data.text)
        resp_data_json=json.loads(resp_data.text)
        subjects_List=resp_data_json['message']
        if(subjects_List=="Error"):
            subjects_List=[]
        
        return render(request,"std_home.html",{"subjects": subjects_List})
    except:
        print("Error occurred in get Subject List")
    return render(request,"std_home.html")

def Student_Subject_Score(request,subject,test="sample"):
    try:
        branch= request.session['branch']
        exam_names_data=getExamNamesBySubjectBranch(subject,branch)
        # print(exam_names_data)
        if(request.method=="POST"):
            exam_name=request.POST['exam_name']
            exam_id_resp = requests.get("http://localhost:3000/exam/getExamID/"+exam_name)
            exam_id_resp=json.loads(exam_id_resp.text)
            exam_id= exam_id_resp['message']
            if(exam_id=="Error"):
                return render(request,"std_subject_score.html",{"new":"new","exam_names": exam_names_data,"error": "Select other exams"})

            scores_data = getExamScoresById(exam_id[0]['id'])
            print(scores_data)
            return render(request,"std_subject_score.html",{"exam_names": exam_names_data,"scores_data": scores_data,"exam_name": exam_name})

        else:
            return render(request,"std_subject_score.html",{"new":"new","exam_names": exam_names_data})
    except Exception as e:
        print(e)
    return render(request,"std_subject_score.html")

def LogoutStudent(request):
    try:
        del request.session['username']
        del request.session['email']
        del request.session['id']
        del request.session['branch']
        del request.session['profession']
        return redirect("login")
    except:
        return redirect("login")