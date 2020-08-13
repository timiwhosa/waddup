var jambscore= document.getElementById("jambscore");
var faculty = document.getElementById("faculty");
var dpt = document.getElementById("dpt");
var calculate = document.getElementById("calculate");
var postutmemin = document.getElementById("postutmemin");
var correctqmin = document.getElementById("correctqmin");
var dptdiv = document.getElementById("dpt-div");
var dat = document.getElementById("dat");

var fac;
//
function getcutdpt(hh){
    var he;
    const uri = `/postutme-cal/${hh}`;

    let h = new Headers();
    h.append("Accept", "application/json");
    let req = new Request(uri, {
        method: "GET",
        headers: h,
        mode: "cors"
    });

    fetch(req).then((res) => {
        if (res.ok) {
            dptdiv.scrollIntoView();
            return res.json();
        }
        else {
            new Error("not bad");
        }
    }).then((jsondata) => {
         fac= jsondata;
        var dpts = "";
        for (i = 0; i < fac.department.length; i++) {
            dpts += `<li onclick="setcutoff(${fac.department[i].cutoff})"> <input type="radio" name="${fac.faculty}" id="">${fac.department[i].dpt}</li>`
        }
        dpt.innerHTML = dpts;
    }).catch((err) => {
        console.log(err);
    });
    
}
var he = "";
var postutmescore=0;
function setcutoff(cut) {
    dat.scrollIntoView();
    if(jambscore.value!=""){
        he = parseFloat(jambscore.value/8);
        postutmescore = Math.ceil(cut-he)*2;
        
    }
    else if(jambscore.value ==""){
        alert("pls enter your jamb score");
    }
}

document.getElementById("calculate").addEventListener("click", calc)
function calc(){
    if (jambscore.value != "") {
        for (i = 1; i < 100; i++) {
            if (postutmescore % 4 == 0 && postutmescore >= 60 && postutmescore < 100) {
                postutmemin.innerHTML = postutmescore;
                correctqmin.innerHTML = parseInt(postutmescore / 4)
                break
            }
            else if (postutmescore < 60) {
                postutmemin.innerHTML = 60;
                correctqmin.innerHTML = parseInt(60 / 4)
                break
            }
            else if (postutmescore % 4 != 0 && postutmescore >= 60 && postutmescore < 100) {
                postutmescore++
            }
            else if (postutmescore >= 100) {
                postutmemin.innerHTML = 100
                correctqmin.innerHTML = parseInt(100 / 4)
                break
            }

        }
    }
    else if (jambscore.value == "") {
        alert("pls enter your jamb score");
    }
}
var b = 1;
// faculty.addEventListener("click", showfac);
function showfac(){
    if(b==1){
        document.getElementById("faculty-div").style.height = "auto";
        b=2;
    }
    else if (b == 2){
        document.getElementById("faculty-div").style.height = "0px";
        b = 1;
    }
}