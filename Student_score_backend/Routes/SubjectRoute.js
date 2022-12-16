const express=require("express")

const SubjectRouter = express.Router();
const connection = require("../connection")

SubjectRouter.route("/addSubject").post(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const { id, name, branch } = req.body;

        const check_subject = `select * from subject where name='${name}';`;
        console.log(check_subject);

        await connection.query(check_subject, async function(err,resp) 
        {
            console.log("check subject : ", resp);
            if(resp.length > 0)
            {
                console.log("Error already exists");
                console.log(resp);
                res.setHeader('Content-Type', 'application/json');
                res.send({"message": "Error", "response": "Subject Name was already exists!!!"});
                // next();
            }
            else
            {
                const mysql_subject_query = `insert into subject(id, name, branch) values('${id}','${name}','${branch}');`;
                console.log(mysql_subject_query);
                await connection.query(mysql_subject_query , function(err,resp) 
                {
                    if(err)
                    {
                        // console.log(err);
                        res.send({"message": "Error","response": "Subject already Exists!!!"})
                    }
                    else
                    {
                        // console.log(resp);
                        res.send({"message": resp})
                    }
                })
            }
        })
    }
    catch(err)
    {
        console.log(err);
        res.send({"message": "Error"})
    }
})

SubjectRouter.route("/getSubjects").get(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }
        
        const mysql_sub_query = `select * from subject;`;
        console.log(mysql_sub_query);
        await connection.query(mysql_sub_query , function(err,resp) 
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

SubjectRouter.route("/branchSubjects/:branchname").get(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const branchname= req.params['branchname']
        console.log(branchname);
        
        const mysql_sub_query = `select * from subject where branch='${branchname}';`;
        console.log(mysql_sub_query);
        await connection.query(mysql_sub_query , function(err,resp) 
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

module.exports = SubjectRouter;
