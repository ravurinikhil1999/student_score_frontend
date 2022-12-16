const express=require("express")

const mysql=require("mysql")

const AuthRouter=express.Router();

const connection = require("../connection");

AuthRouter.route("/student/login").post(async(req,res,next) => {
    try
    {
        const { id, password} = req.body;
        console.log(req.body);
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }
        const mysql_std_query = `select * from student where id=${id} and password='${password}';`;
        console.log(mysql_std_query);
        await connection.query(mysql_std_query , function(err,resp) 
        {
            if(err || resp.length == 0)
            {
                console.log(err);
                res.send({"message": "Error"})
            }
            else
            {
                console.log(resp);
                res.send({"message": resp[0]})
            }
        })
    }
    catch(err)
    {
        console.log(err);
        res.send({"message": "Error"})
    }
})

AuthRouter.route("/faculty/login").post(async(req,res,next) => {
    try
    {
        const { id, password} = req.body;
        console.log(req.body);
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }
        const mysql_std_query = `select * from faculty where id=${id} and password='${password}';`;
        console.log(mysql_std_query);
        await connection.query(mysql_std_query , function(err,resp) 
        {
            if(err || resp.length == 0)
            {
                console.log(err);
                res.send({"message": "Error"})
            }
            else
            {
                console.log(resp);
                res.send({"message": resp[0]})
            }
        })
    }
    catch(err)
    {
        console.log(err);
        res.send({"message": "Error"})
    }
})

AuthRouter.route("/studentReg").post((req,res,next) => {
    
    try
    {
        const { id, username, email, branch, password  } = req.body;
        console.log(req.body);
        if(connection == {"Error": "Error"})
        {
            res.send({"message": "database not connected"});
            return;
        }
        const student_register_query = `insert into student values(${id},'${username}','${email.toString()}','${branch}','${password}');`;
        console.log(student_register_query);
        connection.query(student_register_query, function (err, resp) {
            if(err)
            {
                console.log("in erro r  , ", err);
                res.send({"message":"Error in inserting the data"});
            }
            else
            {
                console.log("response : ", resp);
                res.send({"message": "success"})
            }
        })
    }
    catch(err)
    {
        console.log(err);
        res.send({"message": "Error"});
    }
})


AuthRouter.route("/facultyReg").post((req,res,next) => {
    
    try
    {
        const { id, username, email, branch, password  } = req.body;
        const assign=false;
        console.log(req.body);
        if(connection == {"Error": "Error"})
        {
            res.send({"message": "database not connected"});
            return;
        }
        const student_register_query = `insert into faculty(id,username,email,branch,password) values(${id},'${username}','${email.toString()}','${branch}','${password}');`;
        console.log(student_register_query);
        connection.query(student_register_query, function (err, resp) {
            if(err)
            {
                console.log("in erro r  , ", err);
                res.send({"message":"Error in inserting the data"});
            }
            else
            {
                console.log("response : ", resp);
                res.send({"message": "success"})
            }
        })
    }
    catch(err)
    {
        console.log(err);
        res.send({"message": "Error"});
    }
})


module.exports = AuthRouter