const mysql=require("mysql")

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "student_score"
});

try
{
    con.connect(function(err) {
        if (err)
        { console.log(err);
            con = {"Error": "Error"};
            module.exports = con;
            return;
        }
        console.log("Connected!");
    });
}
catch(err) 
{
    con = {"Error" : "Error"}
}

module.exports = con;