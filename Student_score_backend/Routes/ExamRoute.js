const express=require("express")

const ExamRouter = express.Router();
const connection = require("../connection")

ExamRouter.route("/addExamRecord").post(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }
        const { id, faculty_id, branch, subject, exam_name } = req.body;
        const exam_query = `insert into exam(id, faculty_id, branch, subject, exam_name) values('${id}',${faculty_id},'${branch}','${subject}','${exam_name}')`;
        console.log(exam_query);

        await connection.query(exam_query, async function(err,resp) 
        {
            if(err)
            {
                res.send({"message": "Error"});
                // next();
            }
            else
            {
                // console.log(resp);
                res.send({"message": resp})
            }
        })
    }
    catch(err)
    {
        console.log(err);
        res.send({"message": "Error"})
    }
})

ExamRouter.route("/getfacultyExamNames/:id").get(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }
        const faculty_id=req.params['id']

        const exam_query = `select exam_name from exam where faculty_id=${faculty_id};`;
        console.log(exam_query);

        await connection.query(exam_query, async function(err,resp) 
        {
            if(err)
            {
                res.send({"message": "Error"});
                // next();
            }
            else
            {
                // console.log(resp);
                res.send({"message": resp})
            }
        })
    }
    catch(err)
    {
        console.log(err);
        res.send({"message": "Error"})
    }
})

ExamRouter.route("/getExamID/:exam_name").get(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }
        const exam_name=req.params['exam_name']

        const exam_query = `select id from exam where exam_name='${exam_name}';`;
        console.log(exam_query);

        await connection.query(exam_query, async function(err,resp) 
        {
            if(err)
            {
                res.send({"message": "Error"});
                // next();
            }
            else
            {
                // console.log(resp);
                res.send({"message": resp})
            }
        })
    }
    catch(err)
    {
        console.log(err);
        res.send({"message": "Error"})
    }
})

ExamRouter.route("/getExamScoresById/:id").get(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }
        const exam_id=req.params['id']

        const exam_query = `select * from exam_score where id='${exam_id}';`;
        console.log(exam_query);

        await connection.query(exam_query, async function(err,resp) 
        {
            if(err)
            {
                res.send({"message": "Error"});
                // next();
            }
            else
            {
                console.log(resp);
                res.send({"message": resp})
            }
        })
    }
    catch(err)
    {
        console.log(err);
        res.send({"message": "Error"})
    }
})

ExamRouter.route("/getExamName/:branch/:subject").get(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const branch=req.params['branch']
        const subject=req.params['subject']
        
        const exam_query = `select * from exam where branch='${branch}' and subject='${subject}';`;
        console.log(exam_query);
        await connection.query(exam_query , function(err,resp) 
        {
            if(err)
            {
                console.log(err);
                res.send({"message": "Error"})
            }
            else
            {
                // console.log(resp);
                res.send({"message": resp})
            }
        })
    }
    catch(err)
    {
        console.log(err);
        res.send({"message": "Error"})
    }
})

ExamRouter.route("/addExamScore").post(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        
        console.log(req.body);
        const { id, student_id, grade, score } = req.body;
        
        const mysql_score_query = `insert into exam_score(id, student_id, grade, score) values('${id}',${student_id},'${grade}','${score}');`;
        console.log(mysql_score_query);
        await connection.query(mysql_score_query , function(err,resp) 
        {
            if(err)
            {
                console.log(err);
                res.send({"message": "Error"})
            }
            else
            {
                console.log(resp);
                res.send({"message": resp})
            }
        })
    }
    catch(err)
    {
        console.log(err);
        res.send({"message": "Error"})
    }
})

ExamRouter.route("/updateExamScore").put(async(req,res,next) =>{
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const { id, grade, score } = req.body;
        const mysql_upd_faculty = `upd from faculty where id=${id}`;
        await connection.query(mysql_upd_faculty, function(err,resp) 
        {
            if(err)
            {
                console.log(err);
                res.send({"message": "Error"})
            }
            else
            {
                console.log(resp);
                res.send({"message": "success"})
            }
        });
    }
    catch(err)
    {
        console.log(err);
        res.send({"message": "Error"})
    }
})

module.exports = ExamRouter;
