// console.log("hello")

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


function showsection(index) {
    for (i = 1; i <= 3; i++) {
        document.getElementById(`rowsection${i}`).style.borderBottom = "none";
        document.getElementById(`row${i}`).style.display = " none";
        document.getElementById(`fac`).style.display = " none";

    }

    document.getElementById(`rowsection${index}`).style.borderBottom = " 5px solid #ffc107";
    document.getElementById(`row${index}`).style.display = " block";
}
showsection(2)
var c = 1;
function showans(index) {
    if (c == 1) {
        for (i = 1; i <= 7; i++) {
            document.getElementById(`ans${i}`).style.display = " none";

        }

        document.getElementById(`ans${index}`).style.display = " block";
        c = 2;
    }
    else if (c == 2) {
        for (i = 1; i <= 7; i++) {
            document.getElementById(`ans${i}`).style.display = " none";

        }
        c = 1;
    }
}


function populateright(){
    if(screen.width<= 480){
        document.getElementById(`row2-right`).style.display = "block";
        document.getElementById(`close-fac`).style += ` position: fixed; display: flex; top: 15%; right: 7%;`;
    }
    
    document.getElementById(`right-notice`).style.display = " none";
    document.getElementById(`fac`).style.display = " none";
    document.getElementById(`sty-first-display`).style.display = " block";
    getschool();
}

function closefac(){
    if (screen.width <= 480) {
        document.getElementById(`row2-right`).style.display = "none";
        document.getElementById(`close-fac`).style.display = "none";
    }
}
function showfaculties() {
    document.getElementById(`sty-first-display`).style.display = " none";
    document.getElementById(`fac`).style.display = " block";
}

var b = 1;
function showdepartment(index,length) {
    if(b==1){
        for (i = 1; i <= length; i++) {
            document.getElementById(`drop${i}`).style.display = " none";

        }
    
        document.getElementById(`drop${index}`).style.display = " block";
        b = 2;
    }
    else if (b == 2) {
        for (i = 1; i <= length; i++) {
            document.getElementById(`drop${i}`).style.display = " none";

        }
        b=1;
    }
}

function getschool(){
    var mysch = localStorage.getItem("jetbooks-school")
    if (mysch != null) {
        if (window.location.pathname == "/archive/") {
            var urll2 = `/archive/school/${mysch}`
            var hed = new Headers();
            var reqs = new Request(urll2,{
                method: "GET",
                headers: hed,
                mode: "cors"
            });
            fetch(reqs).then((res)=>{
                return res.json()
            }).then((data)=>{
                console.log(data);
                loadsch(data)
            }).catch((err)=>{
                console.log(err);
            })
        }
    }
}

function loadsch(data){
    var fac = document.getElementById("facc");
    fac.innerHTML="";
    for(let s=0;s<data.length; s++){
        var li="";
        var ul="";
        var div="";
        var h2 =` <div class="ff-heading" onclick="showdepartment(${s+1}, ${data.length})">${data[s].faculty.toUpperCase().escape()}</div>`
        for(l=0; l<data[s].department.length; l++){
            li += `<a href="/archive/section/staylite?fac=${data[s].faculty.toLowerCase().escape()}&dpt=${data[s].department[l].toLowerCase()}"><li>${data[s].department[l].toUpperCase().escape()}</li></a>`
            ul= `<ul>${li}</ul>`
        }
        div = `<div class="ff-dropdown" id="drop${s+1}">${ul}</div>`

        var htm1 = ` <div class="ff">${h2} ${div} </div>`;
        fac.innerHTML += htm1;
    }
}
