const express=require('express')

const cors=require('cors')

const app=express();

app.use(cors());
app.use(express.json());

const authroute=require("./Routes/AuthenticationRoute.js");
const branchroute = require("./Routes/BranchRoute.js");
const subjectroute = require("./Routes/SubjectRoute");
const facultyroute=require("./Routes/FacultyRoute");
const studentroute=require("./Routes/StudentRoute");
const examroute=require("./Routes/ExamRoute.js");

app.use("/auth",authroute);
app.use("/branch", branchroute);
app.use("/subject", subjectroute);
app.use("/faculty",facultyroute);
app.use("/student",studentroute);
app.use("/exam", examroute);

app.listen(3000, () => {
    console.log("port connected");
})

