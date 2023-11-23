let express = require("express");
let fs = require("fs");
let mysql = require("mysql");

let app = express();
let port = 8080;

const path = require("path");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  "default-src*; style-src 'self' *;"
  next();
});

let httpServer = app.listen(port, function () {
  console.log(`Webbserver körs på port ${port}`);
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/startpage.html"));
});

app.get("/guestbook", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/guestbook.html"));
});

app.get("/startpage", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/startpage.html"));
});

app.post("/guestbook", function (req, res) {
  let messagesFile = fs.readFileSync("messages.json");
  let data = JSON.parse(messagesFile);
  let messages = data["messages"];

  const submission = {
    name: req.body.name,
    email: req.body.email,
    title: req.body.title,
    message: req.body.message,
  };

  messages.push(submission);
  data["messages"] = messages;

  const submissionJSON = JSON.stringify(data);
  fs.writeFileSync("messages.json", submissionJSON);

  res.redirect("/guestbook");

});
