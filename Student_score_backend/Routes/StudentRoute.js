const express=require("express")

const StudentRouter = express.Router();
const connection = require("../connection")

StudentRouter.route("/getAllStudents").get(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const std_query = `select * from student where assign=0;`;
        console.log(std_query);

        await connection.query(std_query, async function(err,resp) 
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

// StudentRouter.route("/updatestudent").put(async (req,res,next) => {
//     try
//     {
//         if(connection == {"Error": "Error"})
//         {
//             res.send({"message":"Error","response": "database not connected"});
//             return;
//         }

//         const { id, subject } = req.body;
//         console.log(id,subject);
        
//         const update_sub_fac = `update student set subject='${subject}', assign=1 where id=${id};`;
//         console.log(update_sub_fac);
//         await connection.query(update_sub_fac , function(err,resp) 
//         {
//             if(err)
//             {
//                 console.log(err);
//                 res.send({"message": "Error"})
//             }
//             else
//             {
//                 // console.log(resp);
//                 res.send({"message": resp})
//             }
//         })
//     }
//     catch(err)
//     {
//         console.log(err);
//         res.send({"message": "Error"})
//     }
// })

StudentRouter.route("/branchstudents/:branchname").get(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const branchname= req.params['branchname']
        console.log(branchname);
        
        const mysql_branch_query = `select * from student where branch='${branchname}';`;
        console.log(mysql_branch_query);
        await connection.query(mysql_branch_query , function(err,resp) 
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

StudentRouter.route("/delete/:id").delete(async(req,res,next) =>{
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const id=req.params['id'];
        const mysql_delete_std = `delete from student where id=${id}`;
        await connection.query(mysql_delete_std, function(err,resp) 
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

module.exports = StudentRouter;
