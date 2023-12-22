import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    database: "permalist",
    host: "localhost",
    password: "Aditya470@",
    port: 5432
});
db.connect();

async function checkTasks(){
    const result = await db.query("SELECT * FROM list ORDER BY id ASC");
    let taskArr = [];
    if(result.rows !== undefined){
        result.rows.forEach((element) => {
            taskArr.push(element);
        });
    }
    return taskArr;
}

app.get("/", async (req,res) => {
    const taskList = await checkTasks();
    res.render("today.ejs", {
        taskName: taskList,
    });
});

app.post("/add", async (req,res) => {
    const task = req.body.taskValue.trim();
    try{
        await db.query("INSERT INTO list(task) VALUES ($1)",[task]);
        res.redirect("/");
    } catch(err){
        console.log(err);
    }
});

app.post("/edit", async (req,res) => {
    const updatedTask = req.body.updatedTask.trim();
    const id = req.body.updatedTaskId;
    try{
        await db.query("UPDATE list SET task = $1 WHERE id = $2",[updatedTask,id]);
        res.redirect("/");
    } catch(err){
        console.log(err);
    }
});

app.post("/delete", async (req,res) => {
    try{
        await db.query("DELETE FROM list WHERE id = $1",[req.body.taskDone]);
        res.redirect("/");
    } catch(err){
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server started at https://localhost:${port}`);
});