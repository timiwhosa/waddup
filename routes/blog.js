var bodyparser = require("body-parser");
var urlencodedParser = bodyparser.urlencoded({ extended: false });
var path = require("path");
var fs = require("fs");
var jsonparser = bodyparser.json();
var p = path.join(__dirname, "../public");
var util = path.join(__dirname ,"../utils")

var blog = function(app){
    // BLOG SECTION
    app.get("/blog/:section/:link",urlencodedParser,(req, res) => {
        // console.log(req.params.link);
        res.sendFile(p + `/blog/${req.params.section}/${req.params.link}.html`
        );
    }
    );

    app.get("/postutme-cal2/all", jsonparser, (req, res) => {
        var hi = JSON.parse(fs.readFileSync(util + "/fac.json"));
        res.json(hi);
            
    });
    app.get("/postutme-cal/:fac", jsonparser, (req, res) => {
        var hi = JSON.parse(fs.readFileSync(util + "/fac.json"));
        for (i = 0; i < hi.length; i++) {
            if (hi[i].faculty == req.params.fac) {
                res.json(hi[i]);
            }
        }
    });
}
module.exports = {blog};