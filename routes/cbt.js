var bodyparser = require("body-parser");
var fs = require("fs");
var urlencodedParser = bodyparser.urlencoded({ extended: false });
var jsonparser = bodyparser.json();
var path = require("path");
var cbt = function(app){

  var visit = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../views.json"))
  );

  async function visits(page) {
    var vv = 0;
    for (let v = 0; v < visit.length; v++) {
      if (visit[v].page == page) {
        visit[v].visit += 1;
        fs.writeFileSync(
          path.join(__dirname, "../views.json"),
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
        path.join(__dirname, "../views.json"),
        JSON.stringify(visit, null, 2)
      );
    }
  }

  var util = path.join(__dirname, "../user-responses/postutme");
  var p = path.join(__dirname , "../public");


// app.get("/", urlencodedParser, (req, res) => {
      

//       res.sendFile(path.join(__dirname, "../index.html"));

//       // res.end();
//     });
    // app.get("/futa-postutme/pastquestions", urlencodedParser, (req, res) => {
    //   res.sendFile(p+   "/post-utme-pastquestions/post-utme-pastquestions.html"
    //   );

    //   // res.end();
    // });

    // app.get("/home", (req, res) => {
    //   res.sendFile(p+"/home.html");
    // });
    // app.get("/homevisits", (req, res) => {
      
    //   res.json({ page: "home", visits: visits });
    // });
    // app.get("/pastquestions", (req, res) => {
    //   res.sendFile(p+"/comingsoon.html");
    // });
    // app.get("/online-tutorialvideo", (req, res) => {
    //   res.sendFile(p+"/comingsoon.html");
    // });
    // app.get("/futa-cinema", (req, res) => {
    //   res.sendFile(p+"/comingsoon.html");
    // });
    // app.get("/cgpa_cal", urlencodedParser, (req, res) => {
    //   res.sendFile(p+"/cgpa_cal/cgpa.html");

    //   // res.end();
    // });
    // app.get("/getstarted", urlencodedParser, (req, res) => {
      
    //   res.sendFile(p+"/free-mode.html");
    // });

    // var comm = JSON.parse(fs.readFileSync(util+"/comment.json"));
    // var hhh = [];
    // for (i = 0; i < 6; i++) {
    //   hhh.push(comm[i]);
    // }
    // // //console(hhh);
    // app.get("/comment", (req, res) => {
    //   res.json(hhh);
    // });

    // app.post("/comment", jsonparser, (req, res) => {
    //   //console("hello" ,req.body);
    //   comm.unshift(req.body);
    //   fs.writeFile(
    //     util+"/comment.json",
    //     JSON.stringify(comm, null, 2),
    //     (err) => {
    //       //console("err: ", err);
    //     }
    //   );
    //   res.end();
    // });
  app.get("/cbt", (req, res) => {
    visits("cbt");
    res.sendFile(path.join(__dirname, "../public/cbt.html"));
  });
  app.get("/cbt/:section", (req, res) => {
    visits(`cbt-${req.params.section}`);
    if(req.params.section == "postutme"){
      res.sendFile(path.join(__dirname, "../public/cbt/postutme/free-mode.html"));
    }
    else{
      res.sendFile(path.join(__dirname, `../public/cbt/${req.params.section}/${req.query.school}/${req.params.section}.html`));
    }
  });

    app.get("/favicon.ico", (req, res) => {
      res.send("hi");
    });
    var hll = [];
    var singlesubject;
    app.get("/single/:section", (req, res) => {
    visits(`single-${req.params.section}`);
      res.sendFile(p +"/cbt/postutme/single.html");
    });
    app.get("/question/:section", (req, res) => {
      // console.log(req.params.section)
      var { questions } = require(path.join(__dirname, `../public/cbt/cbt-question/${req.params.section}-questions.js`));
      hll = [];
      singlesubject = req.query.subject;
      
    visits(`cbt-question-${singlesubject}`);
      function myran(l, y) {
        let one = y + 1;
        let two = Math.random() * one;
        let result = Math.floor(two) + l;
        // //console("result:", result);
        return result;
      }

      function creatarray(start, end) {
        let agricquestion = [];
        for (i = start; i <= end; i++) {
          agricquestion.push(questions[singlesubject][i]);
        }
        return agricquestion;
      }

      let numarray = creatarray(0, questions[singlesubject].length - 1);
      // //console( "numarray : ",numarray)

      for (i = 0; i <= 4; i++) {
        let randomindex = myran(0, numarray.length - 1);
        let rannumber = numarray[randomindex];
        numarray.splice(randomindex, 1);
        hll.push(rannumber);
      }
      res.json({ subject: singlesubject, questiondata: hll });
    });
    // var hhhy = JSON.parse(fs.readFileSync(util+"/single-user.json"));
    // app.post("/savenewuseroh", jsonparser, (req, res) => {
    //   //console(req.body);
    //   hhhy.unshift(req.body);
    //   fs.writeFile(
    //     util+"/single-user.json",
    //     JSON.stringify(hhhy, null, 2),
    //     (err) => {
    //       //console(err);
    //     }
    //   );

    //   // var hh = fs.readFileSync("user.json");
    //   // var words = JSON.parse(hh);
    //   // //console(words);

    //   res.end();
    // });
    // //console(questions.agric.length)
    // var subject;
    // app.post("/multiple/:section", urlencodedParser, (req, res) => {

    //   // console.log(req.body)
    //   // if (req.body.multiple.length > 5) {
    //   //   subject = [req.body.multiple];
    //   // } else {
    //   //   subject = req.body.multiple;
    //   // }

    //   // console.log(subject.length);
    //   res.sendFile(p+"/postutme/multiple.html");
    // });
    app.get("/multiple/:section", (req,res)=>{
      // console.log(req.query)
      
    visits(`cbt-${req.params.section}`);
      res.sendFile(p + "/cbt/postutme/multiple.html");
      // res.end()
    })
  app.get("/multiplequestion/:name", (req, res) => {
    // var section = req.params.section
    // if (req.query.multiple.length > 5) {
    //   subject = [req.query.multiple];
    // } else {
    // console.log(req.params.name)
      subject = req.query.multiple;
    // }
    var { questions } = require(path.join(__dirname, `../public/cbt/cbt-question/${req.params.name}-questions.js`));
      var hl = [];
      function myran(l, y) {
        let one = y + 1;
        let two = Math.random() * one;
        let result = Math.floor(two) + l;
        // //console("result:", result);
        return result;
      }
      // console.log("subject length is" + subject);
      function creatarray(start) {
        let agricquestion = [];
        for (j = 0; j < subject.length; j++) {
          visits(`cbt-question-${subject[j]}`);
          var hello = [];
          for (i = start; i <= questions[subject[j]].length - 1; i++) {
            hello.push(questions[subject[j]][i]);
          }
          agricquestion.push(hello);
        }
        //console.log(agricquestion);
        return agricquestion;
      }
      let numarray = creatarray(0);
      // //console( "numarray : ",numarray)
      for (j = 0; j < numarray.length; j++) {
        var hello = [];
        for (i = 0; i <= 4; i++) {
          let randomindex = myran(0, numarray[j].length - 1);
          let rannumber = numarray[j][randomindex];
          numarray[j].splice(randomindex, 1);
          // //console("rannumber", rannumber);
          // //console("numarray", numarray)
          hello.push(rannumber);
          //console(hello);
        }
        hl.push(hello);
      }
      // //console(hl);
      //     }
      // }
      // res.send("hi "+ req.params.name);

      // //console(hl , ":now")
      res.json({ subject: subject, questiondata: hl });
      hl = [];
      // //console(hl); //console("final subject:",subject);
    });
    // app.post("/multiple", urlencodedParser, (req, res) => {
    //   //console(JSON.stringify(req.body));
    //   if (req.body.physics){
    //     res.sendFile(p+"/multiple.html");
    //     res.send(hl);
    //   }
    // //   next();
    // });

    // app.get("/signup", (req, res) => {
    //   res.sendFile(p+"/signup.html");
    // });

    // app.get("/login", (req, res) => {
    //   res.sendFile(p+"/comingsoon.html");
    // });
    // app.get("/about", (req, res) => {
    //   res.sendFile(p+"/about.html");
    // });
    // app.get("/contact", (req, res) => {
    //   res.sendFile(p+"/contact.html");
    // });

    // app.get("/contact/:name", (req, res) => {
    //   // //console(req.params);
    //   var contactreason = req.params.name;
    //   res.sendFile(p+"/complaint.html");
    //   app.get("/contactparam", (req, res) => {
    //     // //console(req.params);
    //     res.json({ name: contactreason });
    //   });
    // });
    // app.post("/contact", jsonparser, (req, res) => {
    //   //console(req.body);
    //   var he = JSON.parse(fs.readFileSync(`./utils/${req.body.section}.json`));
    //   he.unshift(req.body);
    //   //console(he);
    //   fs.writeFileSync(
    //     `./utils/${req.body.section}.json`,
    //     JSON.stringify(he, null, 2)
    //   );
    //   res.end();
    // });

    // app.get("/pq/:data", (req, res) => {
    //   res.sendFile(p+"/pq/" + req.params.data);
    // });

    // // POST UTME CALCULATOR

    // app.get("/postutme-cal/:fac", jsonparser, (req, res) => {
    //   var hi = JSON.parse(fs.readFileSync( util+"/fac.json"));
    //   for (i = 0; i < hi.length; i++) {
    //     if (hi[i].faculty == req.params.fac) {
    //       res.json(hi[i]);
    //     }
    //   }
    // });
}

module.exports = {cbt};