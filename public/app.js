let express = require("express");
let fs = require("fs");

let app = express();
let port = 8080;


let httpServer = app.listen(port, function () {
  console.log(`Webbserver körs på port ${port}`);
});

app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/startpage.html");
});

const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get("/guestbook", function (req, res) {
  res.sendFile(__dirname + "/guestbook.html");
});

app.get("/startpage", function (req, res) {
  res.sendFile(__dirname + "/startpage.html");
});

app.post("/guestbook", function (req, res){
  // let name = req.body.name;
  // let email = req.body.email;
  // let title = req.body.title;
  // let message = req.body.message;
  let messagesFile = fs.readFileSync("messages.json")
  let data = JSON.parse(messagesFile);
  let messages = data["messages"];

  const submission = {
    name: req.body.name,
    email: req.body.email,
    title: req.body.title,
    message: req.body.message
  }
  
  
  const submissionJSON = JSON.stringify(submission);

  fs.writeFile("messages.json", )  
});