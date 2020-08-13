var a = 1;
$("#menu-toggle").click(function () {
    if (a==1){
        $(".menu").css("left", "0px");
         a = 2;
         console.log(a)
    }
    else if (a==2){
        $(".menu").css("left", "-100%");
        a=1;
    }
});

$(".container, footer").click(function(){
    $(".menu").css("left", "-100%");
    a = 1;
});

 




window.onscroll = function(){
    scrollshow()
};

function scrollshow() {
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop >20){
        document.getElementById("scrollup").style.display = "flex";
    }
    else{
        document.getElementById("scrollup").style.display = "none";
    }
}

function scrollup(){
    document.documentElement.scrollBy(
        {
            top: `-${document.documentElement.scrollTop}`
        }
    );
}


var scrolltot = document.createElement("div");
scrolltot.setAttribute("class", "to-top");
scrolltot.setAttribute("id", "scrollup");
scrolltot.innerHTML = `<span>&#8896;</span>`;

scrolltot.addEventListener("click", scrollup);
/*
`<div class="to-top" id="scrollup" onclick="scrollup()">
        
    </div>`;*/

var body = document.querySelector("body");
body.appendChild(scrolltot);

var selcover = document.createElement("div");
selcover.setAttribute("id", "selcover");
var selinst = document.createElement("div");
selinst.setAttribute("class", "select-institution")
selinst.setAttribute("id", "select-institution")

var selhtmll = `<div class="">
            <h4>JETbooks || JET-Archive</h4>
            <p>Please select your institution</p>
            <select name="institution" id="selectinsti" onchange="institution(this.value)">
                <option value="none">Your University</option>
                <option value="futa">FUTA</option>
                <option value="oau">OAU</option>
                <option value="unilag">UNILAG</option>
                <option value="unn">UNN</option>
            </select>
        </div>`;
selinst.innerHTML= selhtmll;
body.appendChild(selcover);
body.appendChild(selinst);
function institution(data) {
    var selcover = document.getElementById("selcover");
    var selecti = document.getElementById("select-institution");
    if(data != "none"){
        if (window.location.pathname === "/archive/" || window.location.pathname === "/uploadnow" || window.location.pathname === "/cbt/" || window.location.pathname.includes(`/archive/course`)) {
            var myschool = document.getElementById("myschool");
            myschool.innerText = data;
            myschool.value = data;
        }
        else if(window.location.pathname == "/"){
            sec();
        }

        localStorage.setItem("jetbooks-school", data);

        selcover.style.display = "none";
        selecti.style.display = "none";

        getrecentupload();
    }
}
function getschool(){
    var chosenschool = localStorage.getItem("jetbooks-school");
    var selcover=document.getElementById("selcover");
    var selecti =document.getElementById("select-institution");
    // console.log(chosenschool);
    if (chosenschool != null) {
        institution(chosenschool);
        selcover.style.display = "none";
        selecti.style.display = "none";
    }
    else {
        selcover.style.display = "block";
        selecti.style.display = "flex";
    }
}
getschool()


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


function getrecentupload() {
    var recentupload;
    var uri = "/archive/recent/uploads"
    let h = new Headers();
    h.append("Accept", "application/json");
    let req = new Request(uri, {
        method: "GET",
        headers: h,
        mode: "cors",
    });
    var mysch = localStorage.getItem("jetbooks-school")
    if (mysch != null) {
        if (window.location.pathname == "/archive/") {
            fetch(req)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        new Error("not bad");
                    }
                })
                .then((jsondata) => {
                    // myquestion={};
                    recentupload = jsondata;
                    // console.log(recentupload);
                    recentuploadfunction(recentupload);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
}

function recentuploadfunction(data) {
    for (i = 0; i < data.length; i++) {
        var he = document.getElementById("uploads");
        if (data[i].type != "textbook" && data[i].type != "video" && data[i].type != "link") {
            he.innerHTML += `          
                <a href="/archive/course/download/${data[i].filename.escape()}" download><div class="upload-div">
                            <p class="course">${data[0].course.escape()}</p>
                            <p class="ty"><span class="com">Type:</span>  ${data[i].type.escape()}</p>
                            <p class="ty"><span class="com">Uploaded by:</span>  ${data[i].name.escape()}</p>
                            <p class="ty"><span class="com">Date:</span>  ${data[i].date.escape()}
                            <p class="jet">JETBOOKS</p>
                        </div></a>
                        `;
        }
    }
}


    //  /* menu */
//     .menu{
//     display: block;
//     left: -100 %;
// }  
//     .menu ul {
//     display: block;
// }
//     .menu ul li{
//     display: flex;
//     align - items: center;
//     justify - content: center;
//     /* line-height: 42px; */
//     padding: 20px 0;
// }
//     .menu ul li #menu - icons{
//     max - width: 20px;
//     max - height: 20px;
//     margin - right: 5px;
// }
//     .menu ul li span{
//     padding: 0 8px;
// }
//     #jet - logo img{
//     width: 90px;
//     height: 90px;
// }
//     .need - bk{
//     background - color: #000;
//     border - radius: 50 %;
// }
//     .menu - pq{
//     display: block;
//     margin: 0 20px;
// }
//     .im{
//     display: flex;
//     align - items: center;
//     justify - content: center;
//     width: auto;
//     max - width: 174px;
//     margin: 0 0 10px 0;
//     padding: 10px;
//     height: 50px;
//     font - weight: 900;
//     font - family: "helveticaneuemedium";
// }
//     .im a{
//     color: white;
// }
//     .jb{
//     background - color: #fbb710;
// }
//     .jc{
//     background - color: #000000;
// }

// /* nav */
// nav{
//     grid - template - columns: .5fr 3fr;
// }
// nav.nav - logo img{
//     width: 40px;
//     height: 40px;
// }
// nav ul li{
//     display: none;
// }
// nav ul li: nth - child(1), nav ul li: last - child{
//     display: block;
// }
// nav ul li: nth - child(1) input{
//     width: 119px;
// }
// nav ul li: last - child span{
//     display: block;
//     background - color: #000;
//     width: 25px;
//     height: 3px;
//     border - radius: 100px;
//     margin - bottom: 5px;
// }