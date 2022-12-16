const express=require("express")

const FacultyRouter = express.Router();
const connection = require("../connection")

FacultyRouter.route("/getAllNewFaculty").get(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const faculty_query = `select * from faculty where assign=0;`;
        console.log(faculty_query);

        await connection.query(faculty_query, async function(err,resp) 
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

FacultyRouter.route("/getAssignedFaculty").get(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const faculty_query = `select * from faculty where assign=1;`;
        console.log(faculty_query);

        await connection.query(faculty_query, async function(err,resp) 
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

FacultyRouter.route("/updateFaculty").put(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const { id, subject } = req.body;
        console.log(id,subject);
        
        const update_sub_fac = `update faculty set subject='${subject}', assign=1 where id=${id};`;
        console.log(update_sub_fac);
        await connection.query(update_sub_fac , function(err,resp) 
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

FacultyRouter.route("/branchSubjects/:branchname").get(async (req,res,next) => {
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

FacultyRouter.route("/delete/:id").delete(async(req,res,next) =>{
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const id=req.params['id'];
        const mysql_delete_faculty = `delete from faculty where id=${id}`;
        await connection.query(mysql_delete_faculty, function(err,resp) 
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

module.exports = FacultyRouter;
