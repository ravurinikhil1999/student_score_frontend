const express=require("express")

const BranchRouter = express.Router();
const connection = require("../connection")

BranchRouter.route("/increment/student/:branchname").get(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const branchname= req.params.branchname

        const mysql_std_query = `update branch set student_count = student_count + 1 where name='${branchname}';`;
        console.log(mysql_std_query);
        await connection.query(mysql_std_query , function(err,resp) 
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

BranchRouter.route("/increment/faculty/:branchname").get(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const branchname= req.params.branchname

        const mysql_fct_query = `update branch set faculty_count = faculty_count + 1 where name='${branchname}';`;
        console.log(mysql_fct_query);
        await connection.query(mysql_fct_query , function(err,resp) 
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

BranchRouter.route("/addBranch").post(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }

        const { name } = req.body;

        const check_branch = `select * from branch where name='${name}';`;

        const mysql_branch_query = `insert into branch(name) values('${name}');`;
        console.log(mysql_branch_query);
        await connection.query(mysql_branch_query , function(err,resp) 
        {
            if(err)
            {
                console.log(err);
                res.send({"message": "Error","response": "Branch already Exists!!!"})
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

BranchRouter.route("/getBranches").get(async (req,res,next) => {
    try
    {
        if(connection == {"Error": "Error"})
        {
            res.send({"message":"Error","response": "database not connected"});
            return;
        }
        
        const mysql_std_query = `select * from branch;`;
        console.log(mysql_std_query);
        await connection.query(mysql_std_query , function(err,resp) 
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

module.exports = BranchRouter;
