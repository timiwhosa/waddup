var startbtn = document.getElementById("start-btn");
var note = document.getElementById("note");
var firstdisplay = document.getElementById("first-display");
var mainctn = document.getElementById("main-ctn");
var mainctnq = document.getElementById("main-ctn-question-ctn");
var subjects = document.getElementById("subjects");
var endsubjects = document.getElementById("subjects2");
var timer = document.getElementById("timer");
var submit = document.getElementById("subjects");
var question = document.getElementById("question");
var questionnumber = document.getElementById("question-number");
var questionoption = document.getElementById("question-option");
var optionul = document.getElementById("option-ul");
var questionpagination = document.getElementById("question-pagination");
var nextq = document.getElementById("next-q");
var q1 = document.getElementById("q1");
var q2 = document.getElementById("q2");
var q3 = document.getElementById("q3");
var q4 = document.getElementById("q4");
var q5 = document.getElementById("q5");
var hi2;
// var hasanswered = false;
var noofans = 0;
var score = 0;

var song = document.createElement("audio");
song.setAttribute("src", "/cbt/mp3/just-saying.mp3");

// question from server
var myquestion;
// function for timer
var startintime = 5;
let time = startintime * 60;
var continuetime;

startbtn.style.display = "none";
// fetch data from server
$(document).ready(function(){
  myquestion= "";
const uri = `/question/${window.location.href.split("single/")[1]}`;

let h = new Headers();
h.append("Accept", "application/json");
let req = new Request(uri, {
  method: "GET",
  headers: h,
  mode: "cors"
});
fetch(req).then((res) => {
  if (res.ok) {
    startbtn.style.display = "flex";
    return res.json();
  }
  else {
    new Error("not bad");
    var hty = confirm("Sorry no upload for this subject yet");
    // if(hty){
      window.location = `/cbt/${window.location.href.split("single/")[1]}`;
    // }
  }
}).then((jsondata) => {
  // myquestion={};
  myquestion = jsondata;
  // console.log(jsondata)

  rendersubject(myquestion.subject);
}).catch((err) => {
  console.log(err);
});


  
});

startbtn.addEventListener("click", startquiz);
document.getElementById("retakesametest").addEventListener("click",startquiz);
var interval;
function startquiz(){
  saveu()
  
}




function saveu() {

  var name = document.getElementById("username");
  var surn = document.getElementById("surname");
  var nametos = name.value;
  var sname = surn.value;

  score = 0;
  firstdisplay.style.display = "none";
  document.getElementById("scorediv").style.display = "none";
  mainctn.style.display = "block";
  rendersubject(myquestion.subject);
  renderquestion(myquestion, myquestion.questiondata.length);
  hii();
  noofans = 0;
  time = startintime * 60;
  countdown();
  interval = setInterval(countdown, 600);

  if (nametos.trim() != "" && sname.trim() != "" && nametos.length <= 12 && sname.length <= 12){
    // score = 0;
    // firstdisplay.style.display = "none";
    // document.getElementById("scorediv").style.display = "none";
    // mainctn.style.display = "block";
    // rendersubject(myquestion.subject);
    // renderquestion(myquestion, myquestion.questiondata.length);
    // hii();
    // noofans = 0;
    // time = startintime * 60;
    // countdown();
    // interval = setInterval(countdown, 600);

    const uri2 = "/savenewuseroh";
    var options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${nametos}`, surname: sname
      })
    };

    fetch(uri2, options);
  }
  else if (nametos.trim() == ""){
    document.getElementById("usernameerror").innerHTML = "username is required";
  }
  else if (sname.trim() == ""){
    document.getElementById("surnameerror").innerHTML = "surname is required";
  }
  else if (nametos.length >= 12 || sname.length >= 12){
    alert("name and username cannot be more than 12 characters");
  }
  name.addEventListener("keyup", function(){document.getElementById("usernameerror").innerHTML ="";})
  surn.addEventListener("keyup", function () { document.getElementById("surnameerror").innerHTML = ""; })
  
}

  
function hii() {
    document.getElementById("question1").style.display = "block";
    document.getElementById("question2").style.display = "none";
    document.getElementById("question3").style.display = "none";
    document.getElementById("question4").style.display = "none";
    document.getElementById("question5").style.display = "none";
    checkifanswered();
}
function hi2() {
  // checkifanswered();
  document.getElementById("question1").style.display = "none";
  document.getElementById("question2").style.display = "block";
  document.getElementById("question3").style.display = "none";
  document.getElementById("question4").style.display = "none";
  document.getElementById("question5").style.display = "none";
  if (document.getElementById("passage2")){
    document.getElementById("passage2").style.display = "none";
  }
  checkifanswered();
}
function hi3() {

  document.getElementById("question1").style.display = "none";
  document.getElementById("question2").style.display = "none";
  document.getElementById("question3").style.display = "block";
  document.getElementById("question4").style.display = "none";
  document.getElementById("question5").style.display = "none";
  checkifanswered();
  }
function hi4() {
  document.getElementById("question1").style.display = "none";
  document.getElementById("question2").style.display = "none";
  document.getElementById("question3").style.display = "none";
  document.getElementById("question4").style.display = "block";
  document.getElementById("question5").style.display = "none";
  checkifanswered();
  }
function hi5() {
  document.getElementById("question1").style.display = "none";
  document.getElementById("question2").style.display = "none";
  document.getElementById("question3").style.display = "none";
  document.getElementById("question4").style.display = "none";
  document.getElementById("question5").style.display = "block";
  checkifanswered();
  }

//  switching questions

// console.log()

// function to render subject
function rendersubject(data){
  // console.log(data);
    subjects.innerHTML = "<ul> <li>"+ data+ "</li></ul>";
    endsubjects.innerHTML = data;
}
document.getElementById("submit").addEventListener("click", sub);
function sub() {
  song.play();
  clearInterval(interval);
  checkifcorrect(); 
  checknoofanswered()
  firstdisplay.style.display = "block";
  renderscore();
  mainctn.style.display = "none";
  mainctnq.innerHTML = `<div id="question-pagination">
                   <span id="q1" onclick="hii();">1</span>
                   <span id="q2" onclick="hi2();">2</span>
                   <span id="q3" onclick="hi3();">3</span>
                   <span id="q4" onclick="hi4();">4</span>
                   <span id="q5" onclick="hi5();">5</span>
                </div>`;
  continuetime = 0;
  play.style.zIndex = "-2";
  pause.style.zIndex = "2";
}

function countdown() {
    let minute = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timer.innerHTML = `${ minute }: ${ seconds }`;
    time--;
    continuetime = time;
    // console.log(continuetime)
  if (seconds == 0 && minute == 0 || timer << -1) {
      song.play();
      checknoofanswered()
      clearInterval(interval);
      checkifcorrect();
      firstdisplay.style.display = "block";
      renderscore();
    continuetime = 0;
    play.style.zIndex = "-2";
    pause.style.zIndex = "2";
     
      mainctn.style.display = "none";
      mainctnq.innerHTML = `<div id="question-pagination">
                   <span id="q1" onclick="hii();">1</span>
                   <span id="q2" onclick="hi2();">2</span>
                   <span id="q3" onclick="hi3();">3</span>
                   <span id="q4" onclick="hi4();">4</span>
                   <span id="q5" onclick="hi5();">5</span>
                </div>`;
      // for (i = 0; i < myquestion.questiondata.length; i++){
      //   mainctn.removeChild
      //   document.getElementById(`question${i}`).innerHTML =" ";
      // }
    }
  }
// function to render question
function renderquestion(data, nfq) {
  // if (myquestion.subject != "english") {
    for(m=1; m<=nfq; m++){
      var hi = m-1;
      var qn, q ,op, opul, mq, oph, mmq, pasg;
      
          q = `<div class="question">
               <!-- question is placed here -->
               <ul> <li>
               ${data.questiondata[hi].question} </li></ul>
            </div>`;
          qn = `<span id="question-number"><!--Q1:--> Q${m}</span>`;
          oph = "";
          for (k = 0; k <= data.questiondata[hi].option.length - 2; k++) {
            var he = ["A", "B", "C", "D", "E", "F", "G", "H"]
            // 
            oph += `
           <li><input type="radio" onclick="checkifcorrectandshow(${hi});" name="question${hi}-options" value ="${he[k]}" id="option${k}"><span id="${hi}${k}"> ${data.questiondata[hi].option[k]}</span></li>
                `;
            opul = `<ul id="option-ul"> ${oph}</ul>`;
          }
          // 
          // 
          op = `<div id="question-option">${opul}</div>`;
          mq = `<div id="main-ctn-question">${qn} ${q}</div>`;
          mmq = `<div id="question${m}" class = "questiondisplayed"> ${mq} ${op}</div>`
          jQuery("#main-ctn-question-ctn").prepend(mmq);
        }
      // }

      // else if (myquestion.subject == "english" ){
      //  var hh;
      //  for(i in myquestion.questiondata){
         
      //    if(myquestion.questiondata[i].passage){
      //       hh = i;
      //      console.log(hh);
      //    }
      //    else{
      //      console.log("hi")
      //    }
      //  }
    
      // }
    }
       
       
    
    
    
    
    
    
  
     
// pause play
var pause = document.getElementById("pause");
var  play = document.getElementById("play");
pause.addEventListener("click", function(){
  clearInterval(interval);
  pause.style.zIndex = "-2";
  play.style.zIndex = "2";
} );
play.addEventListener("click", function () {
  time = continuetime;
  countdown();
  interval = setInterval(countdown, 600);
  play.style.zIndex = "-2";
  pause.style.zIndex = "2";
});

// function checkifcorrect(index) {
//   var ha = index + 1;
//   var hhb ="q";
//   // var hhhg = `q`
//   for (i = 0; i < optionselected.length; i++) {
//     if (myquestion.questiondata[1].option[[i].checked == true){
//       if (optionselected[i].value == myquestion.questiondata[0].option[myquestion.questiondata[0].option.length - 1]){

//         score++;
//         // console.log(optionselected[i].value);
//         // document.getElementById(`${hhb}${ha}`).style.backgroundColor = "green";
//       }
//       // console.log("score: ", score);
//     }
//   }
//   // console.log(score);
// }

// function checkifanswered(index) {
//   var ha = index + 1;
//   var hhb = "q";
//   console.log(`${hhb}${ha}`);
//   // var hhhg = `q`
//   for (i = 0; i < optionselected.length; i++) {
//     if (optionselected[i].checked == true) {
//         document.getElementById(`${hhb}${ha}`).style.backgroundColor = "green";
//       }
//   }
// }
// function checkifcorrect() {
//   for (j = 0; j < myquestion.questiondata.length; j++) {
//     for (i = 0; i < myquestion.questiondata[j].option.length; i++) {
//       if (myquestion.questiondata[j].option[i].checked == true) {
//         if (myquestion.questiondata[j].option[i] == myquestion.questiondata[j].option[myquestion.questiondata[j].option.length - 1]) {
//           score++;
//           console.log(j);
//           console.log(score);
//         }
//       }

//     }

//   }

// }
function toggler(){
  document.getElementById("sosduh").style.display = "block";
  document.getElementById("forduh").style.display = "block";
}
function togglerr() {
  document.getElementById("sosduh").style.display = "none";
  document.getElementById("forduh").style.display = "none";
}
jQuery("#playagain").on("click", toggler);
jQuery("#forduh, footer , .first-display").on("click", togglerr);
function renderscore(){
  document.getElementById("score").innerHTML = (score/(myquestion.questiondata.length))* 100 + "%";
  document.getElementById("noofanswered").innerHTML = noofans;
  document.getElementById("totalnoofquestions").innerHTML = myquestion.questiondata.length;
  if(screen.width > 480){

    document.getElementById("scorediv").style.display = "flex";
  }
  else{

    document.getElementById("scorediv").style.display = "block";
  }
  firstdisplay.style.opacity = "0.3";
}





function checkifcorrect() {
  for (j = 0; j < myquestion.questiondata.length; j++) {
    var optionselected = document.getElementsByName(`question${j}-options`);
    for (i = 0; i < optionselected.length; i++) {

      if ( optionselected[i].checked == true){
        if (optionselected[i].value.trim() == myquestion.questiondata[j].option[myquestion.questiondata[j].option.length - 1].trim()){

          score++;
        }
      }
    }
  }
  // console.log(score);
}


function checkifcorrectandshow(q) {
  // for (j = 0; j < myquestion.questiondata.length; j++) {
    var optionselected = document.getElementsByName(`question${q}-options`);
    for (i = 0; i < optionselected.length; i++) {

        if (optionselected[i].value.trim() == myquestion.questiondata[q].option[myquestion.questiondata[q].option.length - 1].trim()) {
            document.getElementById(`${q}${i}`).style.backgroundColor = "green";
            document.getElementById(`${q}${i}`).style.padding = "4px";
            // console.log(optionselected[i]);
            // console.log(optionselected[i].value ,":", myquestion.questiondata[j][k].option[myquestion.questiondata[j][k].option.length - 1]);
        }
          if (optionselected[i].checked == true) {
            // console.log(optionselected[i]);
            // console.log(optionselected[i].value + ":" + myquestion.questiondata[j][k].option[myquestion.questiondata[j][k].option.length - 1].toString());
            if (optionselected[i].value.toString().trim() == myquestion.questiondata[q].option[myquestion.questiondata[q].option.length - 1].toString().trim()) {
              document.getElementById(`${q}${i}`).style.backgroundColor = "green";
              document.getElementById(`${q}${i}`).style.padding = "4px";
              // console.log(optionselected[i]);
              // console.log(optionselected[i].value ,":", myquestion.questiondata[j][k].option[myquestion.questiondata[j][k].option.length - 1]);
            }
            else if (optionselected[i].value.toString().trim() != myquestion.questiondata[q].option[myquestion.questiondata[q].option.length - 1].toString().trim()) {
              document.getElementById(`${q}${i}`).style.backgroundColor = "red";
              document.getElementById(`${q}${i}`).style.padding = "4px";
              // console.log("h",optionselected[i]);
              // console.log(optionselected[i].value ,":", myquestion.questiondata[j][k].option[myquestion.questiondata[j][k].option.length - 1]);
            }
        }
      // }
    }
  }
  // console.log(score);


function checknoofanswered() {
  for (j = 0; j < myquestion.questiondata.length; j++) {
    var ha = "q" + parseInt(j + 1);
    var optionselected = document.getElementsByName(`question${j}-options`);
    for (i = 0; i < optionselected.length; i++) {

      if (optionselected[i].checked == true) {
        noofans++;
      }
      // else if (optionselected[i].checked == false){

      //   document.getElementById(`${ha}`).style.backgroundColor = "white";
      //   document.getElementById(`${ha}`).style.border = "1px solid #000000";
      // }
    }
  }
  // console.log(score);
}

function checkifanswered() {
  for (j = 0; j < myquestion.questiondata.length; j++) {
    var ha = "q" + parseInt( j + 1);
    var optionselected = document.getElementsByName(`question${j}-options`);
    for (i = 0; i < optionselected.length; i++) {

      if (optionselected[i].checked == true) {
        document.getElementById(`${ha}`).style.backgroundColor = "#2579bb";
        document.getElementById(`${ha}`).style.border = "1px solid #2579bb";
      }
      // else if (optionselected[i].checked == false){

      //   document.getElementById(`${ha}`).style.backgroundColor = "white";
      //   document.getElementById(`${ha}`).style.border = "1px solid #000000";
      // }
    }
  }
  // console.log(score);
}

// function checkifanswered() {
//   var ha, hhb;
//   for (j = 0; j < myquestion.questiondata.length; j++){
//     // var hhhg = `q`
//     for (i = 0; i < myquestion.questiondata[j].option.length; i++) {
//       if (myquestion.questiondata[j].option[i].checked == true) {
//         ha  = parseInt(`${j}`) + 1;
//         hhb = "q";
//         document.getElementById(`${hhb}${ha}`).style.backgroundColor = "green";
//       }

//       console.log(`${hhb}${ha}`);
//     }

//   }

// }

// var chooseop = myquestion.questiondata[0].option[myquestion.questiondata[0].option.length - 1];
// window.onload = renderquestion(myquestion,1);
// console.log(myquestion[1].option[myquestion[1].option.length - 1]);
// console.log(myquestion[1].option.length);