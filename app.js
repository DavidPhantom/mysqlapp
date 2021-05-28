const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const urlencodedParser = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "usersdb2",
    password: "root"
});

app.set("view engine", "hbs");

app.get("/", function (request, response)
{
    pool.query("SELECT * FROM users", function(error, data)
    {
        if (error) throw error;
        else
        {
            response.render("index.hbs",
                {
                users: data
            });
        }
    });
});

app.get("/create", function (request, response)
{
    response.render("create.hbs");
});

app.post("/create", urlencodedParser, function (request, response)
{
    if (!request.body) return response.sendStatus(400);
    const name = request.body.name;
    const age = request.body.age;
    pool.query("INSERT INTO users (name,age) VALUES(?,?)", [name,age], function (error,data)
    {
        if (error) throw error;
        response.redirect("/");
    });
});

app.get("/edit/:id", function (request, response)
{
    const id=request.params.id;
    pool.query("SELECT * FROM users WHERE id=?", [id], function (error, data)
    {
        if (error) throw error;
        response.render("edit.hbs",
            {
            user: data[0]
        });
    });
});

app.post("/edit", urlencodedParser, function (request, response)
{

    if(!request.body) return response.sendStatus(400);
    const name = request.body.name;
    const age = request.body.age;
    const id = request.body.id;

    pool.query("UPDATE users SET name=?, age=? WHERE id=?", [name, age, id], function (error, data)
    {
        if (error) throw error;
        response.redirect("/");
    });
});

app.post("/delete/:id", function (request, response)
{
    const id = request.params.id;
    pool.query("DELETE FROM users WHERE id=?", [id], function(error, data)
    {
        if(error) throw error;
        response.redirect("/");
    });
});

app.listen(3000, function ()
{
    console.log("Сервер ожидает подключения...");
});