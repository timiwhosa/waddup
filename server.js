var express= require("express");
var app = express();
var fs = require("fs");
var bodyparser = require("body-parser");
var moment = require("moment");
var path = require("path");
var crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var session = require("express-session");
// var multer = require("multer");

var urlencodedParser = bodyparser.urlencoded({ extended: false });
var jsonparser = bodyparser.json();
app.use(express.static(__dirname + "/public"));
var {archive} = require("./routes/archive.js");
var { cbt } = require("./routes/cbt");
var { blog } = require("./routes/blog");
var salt = 10;

var port =process.env.PORT || 3001;
app.use(
  session({
    secret: "randomise it all",
    resave: true,
    saveUninitialized: false,
  })
);
// archive
archive(app);
cbt(app);
blog(app);

String.prototype.escape = function () {
  var tagtoreplace = {
    "&": "&amp;",
    "<": "&lt",
    ">": "&gt",
    "=": "",
    "script": " ",
    "Script": " ",
    '"': " ",
    "`": " "
  };
  return this.replace(/[&<>`=]/g, function (tag) {
    return tagtoreplace[tag] || tag;
  });
}


  var visit = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/views.json"))
  );

  async function visits(page) {
    var vv = 0;
    for (let v = 0; v < visit.length; v++) {
      if (visit[v].page == page) {
        visit[v].visit += 1;
        fs.writeFileSync(
          path.join(__dirname, "/views.json"),
          JSON.stringify(visit, null, 2)
        );
        vv = 1;
      }
    }
    if (vv == 0) {
      visit.push({
        page,
        visit: 1,
      });
      fs.writeFileSync(
        path.join(__dirname, "/views.json"),
        JSON.stringify(visit, null, 2)
      );
    }
  }

// var view = JSON.parse(fs.readFileSync(path.join(__dirname, "./views.json")));
// console.log(view)
app.get("/", (req,res)=>{
    visits("index");
    res.sendFile(__dirname + "/public/index.html");
});
app.get("/index", (req,res)=>{
  visits("index");
  res.end();
})
// app.get("/library", (req, res) => {
//   res.sendFile(__dirname + "/public/home.html");
//      view[2].visit +=1;
//     fs.writeFileSync(path.join(__dirname,"./views.json"), JSON.stringify(view, null,2));
// });
// change this later ******************
app.get("/home", (req, res) => {
  visits("index");
  res.sendFile(__dirname + "/public/index.html");
  view[0].visit += 1;
  fs.writeFileSync(path.join(__dirname, "./views.json"), JSON.stringify(view, null, 2))
});

app.get("/category", (req,res)=>{
  visits("category");
  // console.log(req.session)
  res.sendFile(path.join(__dirname,"/public/category.html"))
})
app.get("/schools/:school", (req, res) => {
  // visits(``);
  res.sendFile(__dirname + `/public/schools/age.html`);
  
//   
});
app.get("/dpt/:school/:dpt", jsonparser, async (req, res)=>{
  var alldpt=[];
  var faculty = JSON.parse(fs.readFileSync(__dirname + `/schools/${req.params.school}.json`));
  for (i = 0; i < faculty.length; i++) {
    alldpt.push(faculty[i].department)
  }
  var dpt = faculty.filter((dp)=>{
    return dp.department == req.params.dpt
  })
  res.json({ dpt, school: req.params.school , alldpt: alldpt});
});

app.get("/contact", (req,res)=>{
  
  visits(`contact`);
  res.sendFile(__dirname + "/public/complaint.html");
});
var comp = JSON.parse(fs.readFileSync(__dirname + "/user-responses/archive/complaint.json"))
app.post("/contact", jsonparser, (req,res)=>{
  
  visits(`contact-post`);
  var time = moment().format("MMMM Do,YYYY, h:mm a");
  comp.unshift({
    section: req.body.section.escape(),
    time: time.escape(),
    name: req.body.name.escape(),
    email: req.body.email.escape(),
    level: req.body.level.escape(),
    request: req.body.request.escape(),
  });
  fs.writeFileSync( "user-responses/archive/complaint.json",JSON.stringify(
    comp, null , 2));
    res.end();
});

app.get("/miscellaneous", (req,res)=>{
  res.sendFile(__dirname + "/public/miscellaneous/miscellaneous.html")
});

// miscellaneous

var miscellaneous = JSON.parse(fs.readFileSync(__dirname + "/miscellaneous.json"));
// console.log(miscellaneous[0])
app.get("/miscellaneous-pq", jsonparser, (req,res)=>{
  res.json(miscellaneous);
});

app.post("/miscellaneous/upload", (req,res)=>{
  console.log(req);
});



app.get("/cgpa_cal", urlencodedParser, (req, res) => {
  
  
  visits(`cgpa_cal`);
  res.sendFile(path.join(__dirname, "/public/cgpa_cal/cgpa.html"));
});

//message
app.post("/message", jsonparser,(req,res)=>{
  
  visits(`message`);
  var hhhhh = JSON.parse(fs.readFileSync(__dirname+ "/newsletter.json"));
  
  hhhhh.unshift(req.body);
  fs.writeFileSync("newsletter.json", JSON.stringify(hhhhh, null , 2));
  res.end();
});

// ***********************************
//ADMIN

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/public/admin/admin.html")
});

app.post("/newsubject", jsonparser, (req, res) => {
  var subject = req.body;
  var he = JSON.parse(fs.readFileSync(__dirname+`/schools/${subject.school.toLowerCase().trim()}.json`));
  // console.log(subject.department)
  for (i = 0; i < he.length; i++) {
    // console.log(he[i].department.toLowerCase())
    if (he[i].department.toLowerCase() == subject.department.toLowerCase() ){
      var hh= 0 ;
      for (j = 0; j < he[i].level[subject.level].length;j++){
        if (he[i].level[subject.level][j].course == subject.course && he[i].level[subject.level][j].faculty == subject.faculty ){
         return  hh=1;
        }
        else{
          hh=0;
        }
      }
      if(hh ==0){
      he[i].level[subject.level].push({ "course": subject.course, "faculty": subject.faculty });
      console.log(he[i].level[subject.level]);
        fs.writeFileSync(__dirname + `/schools/${subject.school.toLowerCase().trim()}.json`, JSON.stringify(he, null , 2));
      
      }
      else{
        return
      }
    }
  }
  res.send(true);
  
});

// var he = fs.readFileSync(__dirname + "/public/admin/js/admin.js").toString();
// he.map({"home":"home"});
// comment section

var comm = JSON.parse(fs.readFileSync("user-responses/archive/comment.json"));
var hhh = [];
for (i = 0; i < comm.length; i++) {
  hhh.push(comm[i]);
}
app.get("/admincomment", (req, res) => {
  res.json(hhh);
});

app.post("/admincomment", jsonparser, (req, res) => {
  //console("hello" ,req.body);
  comm.unshift(req.body)
  fs.writeFile("user-responses/archive/comment.json", JSON.stringify(comm, null, 2), (err) => {
    //console("err: ", err);
  });
  res.end();
});
// complaint
app.get("/complaint", jsonparser, (req,res)=>{
  var comp = JSON.parse(fs.readFileSync("user-responses/archive/complaint.json"));
  res.json(comp);
});

// cart

app.get("/cart", (req, res) => {
  
  visits(`cart`);
  res.sendFile(__dirname + "/public/cart.html");
});

// about 
app.get("/about", (req, res) => {
  
  visits(`about`);
  res.sendFile(__dirname + "/public/about.html");
});

app.get("/download/:fac/:dpt/:file", (req,res)=>{
  
  visits(`download-${req.params.fac}`);
  visits(`download-${req.params.dpt}`);
  visits(`download-${req.params.file}`);

  var pq = path.join(__dirname, `./public/pq/${req.params.fac}/${req.params.dpt}/${req.params.file}`);
  fs.readFile(pq, (err, content)=>{
    if(err){
      res.status(404).json({
        message: "No uploads yet, Pls check the archive section in the menu "
      })
    }
    else{
      res.status(200).end(content);
    }
  });
});

function exist(users, objid){
  var exist = users.filter((user) => {
    return user.id == objid
  });
  if (exist.length == 0) {
    return objid;
  }
  else{
    objid = crypto.randomBytes(12).toString("base64").slice(0, 12);
    exist(users, objid);
  }
}

app.post("/signup", jsonparser, async (req, res) => {
  visits(`signup`);
  // console.log(req.body)
  var time = moment().format("MMMM Do,YYYY, h:mm a");
  var users = JSON.parse(fs.readFileSync(path.join(__dirname,"./store.json")));
  var objid = crypto.randomBytes(12).toString("base64").slice(0, 12);
  var id = exist(users, objid);
  // console.log(id)
  var user = users.filter((user1) => {
    return user1.email == req.body.email
  });
  if(user.length > 0){
    var pasw = await bcrypt.hash(req.body.password, salt);
    res.status(501).json({message:"Sorry an error occured, try using a different email or First name"})
  }
  else{
    var password = await bcrypt.hash(req.body.password, salt);
    // console.log(password)
    
    var data = {
      id,
      name: req.body.name.toString().escape(),
      email: req.body.email.toString().escape(),
      category: req.body.category.toString().escape(),
      password,
      time,
      role: "student"
    }
    users.unshift(data);
    fs.writeFileSync("./store.json", JSON.stringify(users, null, 2));
    req.session.userId = id;
    res.status(200).json("Successful");
  
    
  }
});
app.post("/login", jsonparser, async (req, res) => {
  visits(`login`);
  // console.log(req.body)
  var users = JSON.parse(fs.readFileSync(path.join(__dirname, "./store.json")));
  var user = users.filter((user1) => {
    return user1.email == req.body.email
  });
  if (user.length > 0) {
    // console.log(user);
    var pasw = await bcrypt.compare(req.body.password, user[0].password);
    // console.log(pasw)
    if(pasw == true){
      req.session.userId = user[0].id;
      visits(`login-${user[0].id}`);
      res.status(200).json({message: "welcome back"});
    }
    else {
      res.status(501).json({ message: "Authentication failed" });

    }
  }
  else{
    // console.log(user);
    var pasw = await bcrypt.compare(req.body.password, "loremipsumdolarsor");
    console.log(pasw)
      res.status(501).json({ message: "Authentication failed" });
  }


});
///////////////////// COMEBACK HERE ////////////////////////////////

// app.get("/postutme", (req,res)=>{
//   res.sendFile(path.join(__dirname, "/public/postutme/home.html"));
// });
app.get("/postutme/calculator", (req, res) => {
  visits(`postutme-calculator`);
  res.sendFile(path.join(__dirname, "/public/calculator/postutme/futa-postutme-calculator.html"));
});
app.get("/comment/:section", (req, res) => {
  res.sendFile(path.join(__dirname, `/user-responses/${req.params.section}/comment.json`));
});

//////////////////////CONTRIBUTORS///////////////////////////////////
app.get("/contributors", (req, res) => {
  visits(`contributors`);
  res.sendFile(path.join(__dirname, "/public/contrib.html"));
});




app.listen(port);