require("dotenv").config();
const express = require('express');
const app = express()
const {Sequelize, DataTypes} = require('sequelize')
const PORT = process.env.PORT || 5000



app.use(express.json())

const sequelize = new Sequelize(process.env.DB_URL,{
    dialect : "postgres",
    logging : false,
    dialectOptions :{
        ssl : {
            require : true,
            rejectUnauthorized : false,
        },
    },
})

sequelize.sync().then(()=>{
    console.log("database connected");
})
.catch((error)=>{
    console.log(error);
})



//modal schema // modal name = posted, table name = posted
const posted = sequelize.define("posted", {

    title : {
        type : DataTypes.STRING,
        allowNull : false 
    },
    content : {
        type : DataTypes.STRING,
        allowNull : false
    },

})

const task = sequelize.define("task" , {
    task_id : {
        type : DataTypes.NUMBER,
        unique : true,
        primaryKey : true,
        autoIncrement : true
    }
    ,
    title : {
        type : DataTypes.STRING,
    }
    ,
    description : {
        type : DataTypes.STRING,
    }
    ,
    technologies :{
        type : DataTypes.STRING,
    }
    ,
    ideal_skills : {
        type : DataTypes.STRING,
    }

})

app.post("/enter-task",async(req,res)=>{
    const {task_id, title, description, technologies, ideal_skills} = req.body;
    try {
        const newTask = await task.create({task_id, title, description, technologies, ideal_skills});
        res.json(newTask);
    } catch (error) {
        console.log(error);   
    }
})

app.get("/task-table" , async(req,res)=>{
    try {
        const taskTable = await task.findAll();
        res.json(taskTable)
    } catch (error) {
        console.log(error);
    }
})

app.post("/create-post", async (req,res) => {
    const { title, content } = req.body;
    try {
        const newPost = await posted.create({title,content});
        res.json(newPost);
    } catch (error) {
        console.log(error);
    }
})


app.get("/get-posts", async(req,res)=>{
    try {
        const allPosts = await posted.findAll();
        res.json(allPosts)
    } catch (error) {
        console.log(error);
    }
})

app.get("/",(req,res)=>{
    res.send('Hello world')
})

app.listen(PORT, ()=>{
    console.log(`server is listening at http://localhost:${5000}/`);
})