
var path = require("path");
var fs = require("fs");
var zlib = require("zlib");
var compress =zlib.createGzip();
var decompress =zlib.createGunzip();
var bodyparser = require("body-parser");
var moment = require("moment");
var jsonparser = bodyparser.json();
var fs= require("fs");
var multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req,res,cb){
            cb(null, `./public/uploads/${req.query.section}/${req.query.school}`);
    },
    filename: function(req,res,cb){

        // console.log(res, req.query)
        cb(null, res.originalname.replace(/\s/g, "-").split(".")[0] + "-jetbooks-" + req.query.name + "." + res.originalname.replace(/\s/g, "-").split(".")[1])
    }
});
const upload = multer({storage: storage, limits:{
    fileSize: 1024 *1024 * 30
}});
var urlencodedParser = bodyparser.urlencoded({ extended: false });
var public = path.join(__dirname, "../public");

var uploads = JSON.parse(fs.readFileSync(path.join(__dirname, "../uploads.json")));
var books = JSON.parse(fs.readFileSync(path.join(__dirname, "../public/archive/book/books.json")));


// function upl(){
//     var ht = [];
//     uploads["futa"].filter((facul)=>{
//         ht.push(facul.faculty);
//     });
//     var hty = new Set(ht);
//     var htty = Array.from(hty)
//     console.log(htty);
// }
// upl();
var view = JSON.parse(fs.readFileSync(path.join(__dirname, "../views.json")));
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
var visit = JSON.parse(fs.readFileSync(path.join(__dirname,"../views.json")));

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

var archive = function (app){

    //****************ARCHIVE HOME PAGE****************** */ //
    app.get("/archive", (req,res)=>{
        visits("archive");
        res.sendFile(public + "/archive/archive.html");        
    });
    app.get("/archive/dpt", (req, res) => {
        visits(req.query.dpt);
        res.sendFile(public + "/archive/archive-level.html");
    });
    app.get("/archive/school/:inst", jsonparser, (req,res)=>{
        visits(req.params.inst);
        var institution = JSON.parse(fs.readFileSync(path.join(__dirname, `../institution/${req.params.inst}.json`)))
        res.status(200).json(institution);
    });

    app.get("/archive/course/download/:data", urlencodedParser, (req, res) => {
        visits(req.params.data);

        var download = path.join(__dirname, `../public/uploads/${req.query.section}/${req.query.school}/${req.params.data}`);
        console.log(download)
        fs.readFile(download, (err, content) => {
            if (err) {
                res.status(404).json({
                    message: "File not found"
                })
            }
            else {
                res.status(200).end(content);
            }
        });
    });

    app.get("/archive/dpt/level", (req, res) => {
        visits(req.query.fac);
        var faculty = JSON.parse(fs.readFileSync(path.join(__dirname, `../schools/${req.query.fac}.json`)));
        for (i = 0; i < faculty.length; i++) {
            if (faculty[i].department === req.query.dpt) {
                res.json(faculty[i]);
            }
        }
    });


    app.get("/archive/course/:course", (req, res) => {
        visits(`course-${req.params.course}`);
        res.sendFile(public + "/archive/archive-course.html");
        
    });
    // archive reviews
    var archivereview = JSON.parse(fs.readFileSync(path.join(__dirname, "../user-responses/archive/archivereview.json")))
    app.get("/archivereview", (req, res) => {
        visits("archivereview");
        res.json(archivereview);
    });
    app.post("/archivereview", jsonparser, (req, res) => {
        visits("archivereview-post");
        var data = {
            name: req.body.name.escape(),
            time: req.body.time.escape(),
            review: req.body.review.escape(),
            date: req.body.date.escape()
        }
        archivereview.unshift(data);
        fs.writeFileSync(path.join(__dirname, "../user-responses/archive/archivereview.json"), JSON.stringify(archivereview, null, 2));
        res.end();
    });

    app.get("/uploads/course/:course", jsonparser, (req, res) => {
        var test = uploads[req.query.school].filter((course) => {
            return course.course == req.params.course
        });
        if (test.length > 0) {
            res.status(200).json(test);
        }
        else {
            res.status(404).json({ error: "sorry no uploads for this course yet, Pls help others by uploading the materials you have for this course... Thanks!!" })
        }
    });
    // **********************uploading a file **********************
    app.post("/archive/upload", upload.single("upload"), urlencodedParser, (req, res) => {
        visits(`uploads-${req.query.course.toString().escape()}`);
        visits(`uploads-${req.query.school.toString().escape()}`);
        visits(`uploads-${req.query.type.toString().escape()}`);
        visits(`uploads-${req.query.level.toString().escape()}`);
        visits(`uploads-${req.query.faculty.toString().escape()}`);
        var school = req.query.school;

        if (uploads[school]) {
            if (req.query.to) {
                visits(`uploads-${req.query.to.toString().escape()}`);
                var year = new Date().getFullYear();
                var data = {
                    course: req.query.course.trim().toLowerCase().escape(),
                    type: req.query.type.trim().toLowerCase().escape(),
                    description: req.query.description.trim().toLowerCase().escape(),
                    level: req.query.level.toString().trim().escape(),
                    recommendation: req.query.recommendation.trim().escape(),
                    faculty: req.query.faculty.trim().toLowerCase().escape(),
                    name: req.query.name.trim().toLowerCase().escape(),
                    year,
                    date: req.query.date.trim().toLowerCase().toString().escape(),
                    time: req.query.time.trim().toLowerCase().toString().escape()
                }
                var t = [];
                var test1 = uploads[school].filter(function (cour) {
                    return cour.course == data.course;
                });
                if (test1.length == 0) {
                    t = [];
                }
                else {
                    t = test1[0].uploads.filter(function (he) {

                        return he.course == data.course && he.type == data.type && he.level == data.level && he.faculty == data.faculty && he.year == data.year && he.file.split("-jetbooks-")[0] == data.file.split("-jetbooks-")[0];
                    });
                }
                if (t.length === 0) {
                    var test = uploads[school].filter((cour) => {
                        return cour.course == req.query.course;
                    });
                    if (test.length == 0) {
                        uploads[school].unshift({
                            "course": req.query.course.trim().escape(),
                            "faculty": req.query.faculty.trim().escape(),
                            "level": req.query.level.trim().escape(),
                            "uploads": [
                                data
                            ]
                        });
                        fs.writeFileSync(path.join(__dirname, "../uploads.json"), JSON.stringify(uploads, null, 2));
                    }
                    else if (test.length > 0) {
                        for (i = 0; i < uploads.length; i++) {
                            if (uploads[school][i].course.toLowerCase() == data.course) {
                                uploads[school][i].uploads.unshift(data);
                                fs.writeFileSync(path.join(__dirname, "../uploads.json"), JSON.stringify(uploads, null, 2));
                            }

                        }
                    }
                    res.status(200).json({
                        message: "Thanks for your recommendation "
                    });
                }
                else {
                    res.status(403).json({
                        message: "Thanks for your contribution but this file already exist. if it doesn't , pls contact us using the contact section"
                    });
                }

            }
            else {
                var year = "";
                if (req.query.type.trim().toLowerCase() == "test" || req.query.type.trim().toLowerCase() == "exam") {
                    year = req.query.year;
                }
                else {
                    year = new Date().getFullYear();
                }
                var data = {
                    course: req.query.course.trim().toLowerCase().escape(),
                    type: req.query.type.trim().toLowerCase().escape(),
                    description: req.query.description.trim().toLowerCase().escape(),
                    level: req.query.level.toString().trim().escape(),
                    faculty: req.query.faculty.trim().toLowerCase().escape(),
                    name: req.query.name.trim().toLowerCase().escape(),
                    year,
                    date: req.query.date.toString().trim().toLowerCase().escape(),
                    time: req.query.time.toString().trim().toLowerCase().escape(),
                    filename: req.file.originalname.escape().replace(/\s/g, "-").split(".")[0] + "-jetbooks-" + req.query.name + "." + req.file.originalname.replace(/\s/g, "-").split(".")[1]
                }
                var t = [];
                var test1 = uploads[school].filter(function (cour) {
                    return cour.course == data.course;
                });
                if (test1.length == 0) {
                    t = [];
                }
                else {
                    t = test1[0].uploads.filter(function (he) {

                        return he.course == data.course && he.type == data.type && he.level == data.level && he.faculty == data.faculty && he.year == data.year && he.filename.split("-jetbooks-")[0] == data.filename.split("-jetbooks-")[0];
                    });
                }
                if (t.length === 0) {
                    var test = uploads[school].filter((cour) => {
                        return cour.course == req.query.course;
                    });
                    if (test.length == 0) {
                        uploads[school].unshift({
                            "course": req.query.course.trim().escape(),
                            "faculty": req.query.faculty.trim().escape(),
                            "level": req.query.level.trim().escape(),
                            "uploads": [
                                data
                            ]
                        });
                        fs.writeFileSync(path.join(__dirname, "../uploads.json"), JSON.stringify(uploads, null, 2));
                    }
                    else if (test.length > 0) {
                        for (i = 0; i < uploads.length; i++) {
                            if (uploads[school][i].course.toLowerCase() == data.course) {
                                uploads[school][i].uploads.unshift(data);
                                fs.writeFileSync(path.join(__dirname, "../uploads.json"), JSON.stringify(uploads, null, 2));
                            }

                        }
                    } 
                    res.status(200).json({
                        message: "file successfully uploaded"
                    });
                }
                else {
                    res.status(403).json({
                        message: "Thanks for your contribution but this file already exist. if it doesn't , pls contact us using the contact section"
                    });
                }
            }
        }
        else {
            if (req.query.to) {
                // console.log(req.query);
                var year = new Date().getFullYear();
                var data = {
                    course: req.query.course.trim().toLowerCase().escape(),
                    type: req.query.type.trim().toLowerCase().escape(),
                    description: req.query.description.trim().toLowerCase().escape(),
                    level: req.query.level.toString().trim().escape(),
                    recommendation: req.query.recommendation.trim().escape(),
                    faculty: req.query.faculty.trim().toLowerCase().escape(),
                    name: req.query.name.trim().toLowerCase().escape(),
                    year,
                    date: req.query.date.trim().toLowerCase().toString().escape(),
                    time: req.query.time.trim().toLowerCase().toString().escape()
                }
                uploads[school] = [{
                    "course": req.query.course.trim().escape(),
                    "faculty": req.query.faculty.trim().escape(),
                    "level": req.query.level.trim().escape(),
                    "uploads": [
                        data
                    ]
                }];
                fs.writeFileSync(path.join(__dirname, "../uploads.json"), JSON.stringify(uploads, null, 2));
                res.status(200).json({
                    message: "file successfully uploaded"
                });
            }
            else {
                var year = "";
                if (req.query.type.trim().toLowerCase() == "test" || req.query.type.trim().toLowerCase() == "exam") {
                    year = req.query.year;
                }
                else {
                    year = new Date().getFullYear();
                }
                var data = {
                    course: req.query.course.trim().toLowerCase().escape(),
                    type: req.query.type.trim().toLowerCase().escape(),
                    description: req.query.description.trim().toLowerCase().escape(),
                    level: req.query.level.toString().trim().escape(),
                    faculty: req.query.faculty.trim().toLowerCase().escape(),
                    name: req.query.name.trim().toLowerCase().escape(),
                    year,
                    date: req.query.date.toString().trim().toLowerCase().escape(),
                    time: req.query.time.toString().trim().toLowerCase().escape(),
                    filename: req.file.originalname.escape().replace(/\s/g, "-").split(".")[0] + "-jetbooks-" + req.query.name + "." + req.file.originalname.replace(/\s/g, "-").split(".")[1]
                }
                uploads[school] = [{
                    "course": req.query.course.trim().escape(),
                    "faculty": req.query.faculty.trim().escape(),
                    "level": req.query.level.trim().escape(),
                    "uploads": [
                        data
                    ]
                }];
                fs.writeFileSync(path.join(__dirname, "../uploads.json"), JSON.stringify(uploads, null, 2));
                res.status(200).json({
                    message: "file successfully uploaded"
                });
            }
        }
    });


    app.post("/archive/section/upload", upload.single("upload"), urlencodedParser, (req, res) => {
        visits(`section-uploads-${req.query.school.toString().escape()}`);
        visits(`section-uploads-${req.query.section.toString().escape()}`);
        visits(`section-uploads-${req.query.subject.toString().escape()}`);
        visits(`section-uploads-${req.query.type.toString().escape()}`);
        var school = req.query.school;
        var uploads = JSON.parse(fs.readFileSync(path.join(__dirname, `../institution-uploads/${req.query.section}.json`)))
        if (uploads) {
            if (uploads[school]) {
                var data = {
                    subject: req.query.subject.trim().toLowerCase().escape(),
                    type: req.query.type.trim().toLowerCase().escape(),
                    school: req.query.school.trim().toString().toLowerCase().escape(),
                    "uploadedby": req.query.name.trim().toLowerCase().escape(),
                    year: req.query.year.toString().trim().escape(),
                    date: req.query.date.toString().trim().toLowerCase().escape(),
                    time: req.query.time.toString().trim().toLowerCase().escape(),
                    file: req.file.originalname.escape().replace(/\s/g, "-").split(".")[0] + "-jetbooks-" + req.query.name + "." + req.file.originalname.replace(/\s/g, "-").split(".")[1]
                }
                var test1 = uploads[school].filter(function (he) {
                    return he.subject == data.subject && he.type == data.type && he.year == data.year && he.file.split("-jetbooks-")[0] == data.file.split("-jetbooks-")[0];
                });
                // console.log("test:", t);
                if (test1.length === 0) {
                    uploads[school].unshift(data);
                    fs.writeFileSync(path.join(__dirname, `../institution-uploads/${req.query.section}.json`), JSON.stringify(uploads, null, 2));
                    res.status(200).json({
                        message: "file successfully uploaded"
                    });
                }
                else {
                    res.status(403).json({
                        message: "Thanks for your contribution but this file already exist. if it doesn't , pls contact us using the contact section"
                    });
                }

            }
            else {
                var data = {
                    subject: req.query.subject.trim().toLowerCase().escape(),
                    type: req.query.type.trim().toLowerCase().escape(),
                    school: req.query.school.trim().toString().toLowerCase().escape(),
                    "uploadedby": req.query.name.trim().toLowerCase().escape(),
                    year: req.query.year.toString().trim().escape(),
                    date: req.query.date.toString().trim().toLowerCase().escape(),
                    time: req.query.time.toString().trim().toLowerCase().escape(),
                    file: req.file.originalname.escape().replace(/\s/g, "-").split(".")[0] + "-jetbooks-" + req.query.name + "." + req.file.originalname.replace(/\s/g, "-").split(".")[1]
                }
                uploads[school] = [data];
                fs.writeFileSync(path.join(__dirname, `../institution-uploads/${req.query.section}.json`), JSON.stringify(uploads, null, 2));
                res.status(200).json({
                    message: "file successfully uploaded"
                });
            }
        }

    });


    // videos
    app.get("/archive/recent/:type", jsonparser, (req, res) => {
        visits(`recent-${req.params.type.toString().escape()}`);
        var hi = JSON.parse(fs.readFileSync(path.join(__dirname, `../public/archive/recent.json`)));
        if (hi[req.params.type]) {
            res.json(hi[req.params.type]);
        }
        else{
            req.json({message: "error"})
        }



    });

    // category suggestion

    var catsuggest = JSON.parse(fs.readFileSync(path.join(__dirname, "../user-responses/archive/categorysuggestion.json")));
    app.post("/catsuggest", jsonparser, (req, res) => {
        
        visits(`catsuggest`);
        var data = {
            name: req.body.name.escape(),
            whatsapp_number: req.body.whatsapp_number.toString().escape(),
            category_name: req.body.category_name.escape(),
            details: req.body.details.escape(),
            reason: req.body.reason.escape()
        }
        catsuggest.unshift(data);
        fs.writeFileSync("categorysuggestion.json", JSON.stringify(catsuggest, null, 2));
        res.end();
    });

    //uploadnow
    app.get("/uploadnow", (req, res) => {
        
        visits(`uploadnow`);
        res.sendFile(path.join(__dirname, "../public/archive/upload.html"));
        view[8].visit += 1;
        
    });





    // ************ARCHIVE SEARCH**************//

    app.post("/search/category", jsonparser, (req,res)=>{
        visits(`search-${req.body.school.toString().escape()}`);
        visits(`search-${req.body.input.toString().escape()}`);
        var school = req.body.school.toLowerCase();
        var course = uploads[school].filter((course)=>{
            return course.course.includes(req.body.input)
        });
        var book = books.filter((book)=>{
            return book.title.includes(req.body.input.replace(/-/g, " ")) || book.author.includes(req.body.input.replace(/-/g, " ")) || book.type.includes(req.body.input.replace(/-/g, " "))
        });

        if(course.length== 1 && book.length == 0){
            res.status(200).redirect(`/archive/course/${course[0].course}?school=${school}`)
        }
        else if(course.length >1 && book.length == 0){
            var data = ["course"];
            for(i=0; i<course.length; i++){
                data.push(course[i].course);
            }
            res.status(200).redirect(`/search/category/${data}?school=${school}`)
            
        }
        else if(course.length == 0 && book.length == 1){
            res.status(200).redirect(`/archive/books/book?title=${book[0].title.replace(/\s/g, "%20")}&author=${book[0].author.replace(/\s/g, "%20")}`)
        }
        else if (course.length == 0 && book.length > 1) {
            var data = ["book"];
            for (i = 0; i < book.length; i++) {
                data.push(book[i].title);
            }
            res.status(200).redirect(`/search/category/${data}`)

        }
        else if (course.length > 0 && book.length >0 ){
            res.status(501).json({
                message: "Please give more details on what you are searching for"
            })
        }
        else if (course.length == 0 && book.length == 0) {
            res.status(404).json({
                message: "Sorry but no upload has been made for this yet!! You can help by uploading materials "
            })
        }
    });

    



    app.get("/search/category/:data", urlencodedParser, (req, res) => {
        // visits(`search-category-${req.params.data.toString().escape()}`);
        res.status(200).sendFile(path.join(__dirname, "../public/archive/search.html"));

    });
    app.get("/archive/search/:data", urlencodedParser, async (req,res)=>{
        var sec = req.params.data.split(",")[0];
        var h = req.params.data.split(",");
        visits(`archive-search-${sec.toString().escape()}`);
        if(sec=="course"){
            var school = req.query.school.toLowerCase();
            visits(`archive-search-${school.toString().escape()}`);
        }
        for (i = 1; i < h.length; i++) {
            visits(`archive-search-course-${h[i].toString().escape()}`);
        }

        var datt =[];
        if(sec== "course"){
            var course = [];
            uploads[school].filter((cours) => {
                
                for(i = 1; i< h.length; i++){
                    
                    if (cours.course.includes(h[i])) {
                        course.push(cours)
                    };
                }
            });
            if(course.length>0){
                datt =[];
                for(j=0; j< course.length; j++){
                    datt.push({
                        course: course[j].course.escape(),
                        faculty: course[j].faculty.escape(),
                        level: course[j].level.toString().escape(),
                        uploads: course[j].uploads.length
                    })
                }
                res.status(200).json(datt);
            }

            else if(course.length==0){
                res.status(404).json({
                    message:"No file found"
                });
            }
        }
        else if(sec=="book"){
            var book = [];
            books.filter((bk) => {
                
                for (i = 1; i < h.length; i++) {
                    if (bk.title.includes(h[i]) || bk.type.includes(h[i]) || bk.type.includes(h[i])) {
                        book.push(bk)
                    };
                }
            });
            if (book.length > 0) {
                for (j = 0; j < book.length; j++) {
                    datt.push({
                        title: book[j].title.escape(),
                        author: book[j].author.escape(),
                        edition: book[j].edition.escape(),
                        type: book[j].type.escape(),
                        image: book[j].image.escape()
                    });
                }
                res.status(200).json(datt);
            }

            else if (book.length == 0) {
                res.status(404).json({
                    message: "No file found"
                });
            }
        }
        else{
            res.status(501).json({
                message: "Can't find file"
            })
        }
        view[3].visit += 1;
        
    });



    // *************************ARCHIVE SECTION PAGE******************//


    app.get("/archive/section/:section", (req, res) => {

        visits(`archive-section-${req.params.section.toString().escape()}`);
        res.sendFile(public + "/archive/section.html");
    });

    app.get("/archive/section/uploads/:section", (req, res) => {
        if(req.params.section == "staylite"){
            var courses = uploads[req.query.school].filter((cours) => {
                return cours.course.includes(req.query.dpt)
            });
            if (courses.length > 0) {
                var data = [];
                for (i = 0; i < courses.length; i++) {
                visits(`archive-section-uploads-${courses[i].course.toString().escape()}`);
                    data.push({
                        course: courses[i].course,
                        faculty: courses[i].faculty,
                        level: courses[i].level,
                        uploads: courses[i].uploads.length
                    })
                }
                res.status(200).json(data);
            }
            else {
                res.status(404).json({
                    message: "Sorry but there seems to be no upload for this course yet... Pls help others by uploading whatever material you have for this course."
                });
            }
        }
        else{
            var sectionuploads = JSON.parse(fs.readFileSync(path.join(__dirname,`../institution-uploads/${req.params.section}.json`)))

            var data  = sectionuploads[req.query.school];
            res.status(200).json(data);
        }
    });

    app.get("/archive/section/download/:section/:subject", (req, res) => {
        visits(
          `archive-section-download-${req.params.section
            .toString()
            .escape()}-${req.params.subject.toString().escape()}`
        );
        var download = path.join(__dirname, `../public/uploads/${req.params.section}/${req.query.school}/${req.params.subject}`);
        fs.readFile(download, (err, content) => {
            if (err) {
                res.status(404).json({
                    message: "File not found"
                })
            }
            else {
                res.status(200).end(content);
            }
        });

    });



    // ************************JUST TESTING O!!*********************************//
    // app.get("/archive-copy.html", (req,res)=>{
    //     res.sendFile(path.join(__dirname, "../public/archive/archive-copy.html"))
    // });


    // ****************** Book section**********************//
    app.get("/archive/books", (req, res) => {

        visits(`archive-books`);        
        res.sendFile(public + "/archive/archive-books.html");
    });
    app.get("/archive/books/recent", (req, res) => {
        res.json( JSON.parse(fs.readFileSync(path.join(__dirname, `../public/archive/book/recent-books.json`))))
     });
    app.get("/archive/books/book", (req, res) => {
        res.sendFile(public + "/archive/book/book.html");

    });
    app.get("/archive/books/book-img/:book", (req, res) => {
        res.sendFile(public + `/archive/book/img/${req.params.book.toLowerCase().trim()}.jpeg`);

    });

    app.post("/book/review", jsonparser, (req,res)=>{
        var book = books.filter((bk)=>{
            return bk.title.trim().toLowerCase() == req.body.title.trim().toLowerCase() && bk.author.trim().toLowerCase() == req.body.author.trim().toLowerCase()
        });
        
        if(book.length>0){
            var data = {
                name: req.body.name.escape(),
                review: req.body.review.escape(),
                time: req.body.time.escape(),
                date: req.body.date.escape()
            };
            for (i = 0; i < books.length; i++) {
                if (books[i].title.toLowerCase().trim() == req.body.title.toLowerCase().trim() && books[i].author.toLowerCase().trim() == req.body.author.toLowerCase().trim()  ) {
                    // console.log(books);
                    books[i].reviews.unshift(data);
                    fs.writeFileSync(path.join(__dirname, "../public/archive/book/books.json"), JSON.stringify(books, null, 2));

                    res.status(200).json({
                        message: "Thanks for helping others by sharing a review"
                    })
                }
            }

        }
        else{
            res.status(200).json({
                message: "An error ocurred.. pls try sending your review again... Thank you"
            })
        }
    });

    app.get("/book/review/:title/:author", urlencodedParser, (req, res) => {
        visits(`book-${req.params.title.replace(/\s/g, "-").trim().toLowerCase().toString().escape()}`);
        var book = books.filter((bk) => {
            return bk.title.trim().toLowerCase() == req.params.title.trim().toLowerCase() && bk.author.trim().toLowerCase() == req.params.author.trim().toLowerCase()
        });
        if(book.length>0){
            res.status(200).json(book);
        }
        else{
            res.status(404).json({
                message:"Sorry but it seems this book doesn't exist on our database.."
            })
        }
    });

    //******************Book section SELL REQUEST*********************** */ //

    app.post("/sell-request", jsonparser, (req, res) => {
        // console.log(req.body);
        var sellrequest = JSON.parse(fs.readFileSync(path.join(__dirname, "../public/archive/book/sell-request1.json")))
        // console.log(sellrequest);
        var check = sellrequest.filter((seller) => {
            return seller.name == req.body.name && seller.number == req.body.number && seller.location == req.body.location
        });
        var check2 = sellrequest.filter((seller) => {
            return seller.number == req.body.number
        });

        if (check.length == 0 && check2.length == 0) {
            var data = {
                name: req.body.name.escape(),
                number: req.body.number.escape(),
                price: req.body.price.escape(),
                location: req.body.location.escape(),
                time: req.body.time.escape()
            }
            sellrequest.unshift(data);
            fs.writeFileSync(path.join(__dirname, "../public/archive/book/sell-request1.json"), JSON.stringify(sellrequest, null, 2));
            res.status(200).json({
                message: "Your application has been received and will be reviewed... Thanks for your interest in JETBooks"
            });
        }
        else {
            res.status(501).json({
                message: "Seems you have applied before, Please be Patient as we will contact you... Thanks for your interest in JETBooks"
            });
        }

    });


    // ***********************video section***********************//

    app.get("/archive/videos", (req, res) => {
        visits(`archive-videos`);
        res.sendFile(public + "/archive/archive-video.html");
    });


   


    // uploads retrieval

    // app.get("/uploads", jsonparser, (req, res) => {
    //     res.json(uploads);
    // });
   
    var contact_suggest = JSON.parse(fs.readFileSync(path.join(__dirname,"../user-responses/archive/contact_suggest.json")));
    app.post("/contact_suggest", jsonparser,(req,res)=>{
        visits(`contact_suggest`);
        if (req.body.name.trim() && req.body.number.trim() && req.body.message.trim()){
            // console.log(req.body);
            var data = {
                name: req.body.name.escape(),
                number: req.body.number.toString().escape(),
                message: req.body.message.escape(),
                time: req.body.time.escape()
            }
            contact_suggest.unshift(data);
            fs.writeFileSync(path.join(__dirname, "../user-responses/archive/contact_suggest.json"), JSON.stringify(contact_suggest, null ,2));
            res.status(200).json({ message: "So nice to hear from you, We are very grateful"});
        }
        else{
            res.status(404).json({ message: "We really need to hear from you!!, Pls fill form correctly.." });
        }

    });

    


}

module.exports={archive}