const express = require("express");
const fs = require("fs");
const mysql = require("mysql");
const path = require("path");

const app = express();
const port = 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


let httpServer = app.listen(port, function () {
  console.log(`Webbserver körs på port ${port}`);
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/startpage.html"));
});

app.get("/guestforum", function (req, res) {
  con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test",
  });

  con.connect(function (err) {
    sendPopulatedGuestbook(con, err, res);
  });

});

app.get("/startpage", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/startpage.html"));
});

app.post("/guestforum", function (req, res) {
  con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test",
  });
  
  // skriva till databasen
  con.connect(function (err) {
    const currentDate = new Date().toDateString();
    console.log("Uppkopplad till databas!");
    let sql = `INSERT INTO messages (name, email, title, message, date)
    VALUES ('${req.body.name}', '${req.body.email}', '${req.body.messageTitle}', '${req.body.message}', '${currentDate}')`;
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) console.log(err); 
    });

    sendPopulatedGuestbook(con, err, res);
  });
});

function sendPopulatedGuestbook(con, err, res){
  if (err) throw err;
  con.query("SELECT * FROM messages", function (err, result, fields) {
    if (err) throw err;
    fs.readFile("./public/guestforum.html", "utf-8", function (err, data) {
      
      let messages = "";
      for (let message of result) {
        messages += "<tr>";
        messages += `<td>${message["Title"]}</td>`;
        messages += `<td>${message["Message"]}</td>`;
        messages += `<td>${message["Name"]}</td>`;
        messages += `<td>${message["Date"]}</td>`;
        messages += "</tr>";
      }

      let htmlFile = data;
      htmlFile = htmlFile.replace("***MESSAGES***", messages);
      res.send(htmlFile);
    });
  });
}

// Ofärdig kod för att skriva till JSON fil

// app.post("/guestforum", function (req, res) {
//   let messagesFile = fs.readFileSync("messages.json");
//   let data = JSON.parse(messagesFile);
//   let messages = data["messages"];

//   const submission = {
//     name: req.body.name,
//     email: req.body.email,
//     title: req.body.title,
//     message: req.body.message,
//   };

//   messages.push(submission);
//   data["messages"] = messages;

//   const submissionJSON = JSON.stringify(data);
//   fs.writeFileSync("messages.json", submissionJSON);

//   res.redirect("/guestforum");

// });
