var bodyparser = require("body-parser");
var urlencodedParser = bodyparser.urlencoded({ extended: false });
var path = require("path");
var fs = require("fs");
var jsonparser = bodyparser.json();
var p = path.join(__dirname, "../public");
var util = path.join(__dirname ,"../utils")

var blog = function(app){
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
    // BLOG SECTION
    app.get("/blog/:section/:link",urlencodedParser,(req, res) => {
        // console.log(req.params.link);
    visits(`blog-${req.params.section}`);
    visits(`blog-${req.params.link}`);
        res.sendFile(p + `/blog/${req.params.section}/${req.params.link}.html`
        );
    }
    );

    app.get("/postutme-cal2/all", jsonparser, (req, res) => {
    visits(`postutmecal-all`);
        var hi = JSON.parse(fs.readFileSync(util + "/fac.json"));
        res.json(hi);
            
    });
    app.get("/postutme-cal/:fac", jsonparser, (req, res) => {
        
    visits(`postutme-cal-${req.params.fac}`);
        var hi = JSON.parse(fs.readFileSync(util + "/fac.json"));
        for (i = 0; i < hi.length; i++) {
            if (hi[i].faculty == req.params.fac) {
                res.json(hi[i]);
            }
        }
    });
}
module.exports = {blog};