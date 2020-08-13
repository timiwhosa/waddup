var startbtn = document.getElementById("start-btn");
var note = document.getElementById("note");
var firstdisplay = document.getElementById("first-display");
var mainctn = document.getElementById("main-ctn");
var subjects = document.getElementById("subjects");
var timer = document.getElementById("timer");
var submit = document.getElementById("subjects");
var question = document.getElementById("question");
var questionnumber = document.getElementById("question-number");
var questionoption = document.getElementById("question-option");
var optionul = document.getElementById("option-ul");
var optionselected = document.getElementsByName("question-options");
var questionpagination = document.getElementById("question-pagination");
var nextq = document.getElementById("next-q");
var q1 = document.getElementById("q1");
var q2 = document.getElementById("q2");
var q3 = document.getElementById("q3");
var q4 = document.getElementById("q4");
var q5 = document.getElementById("q5");
var hi2;
var hasanswered = false;
var score = 0;


// fetch data from server
window.onload = function(){
const uri = "/question";

let h = new Headers();
h.append("Accept", "application/json");

let req = new Request(uri, {
  method: "GET",
  headers: h,
  mode: "cors"
});

fetch(req).then((res) => {
  if (res.ok) {
    return res.json();
  }
  else {
    new Error("not bad");
  }
}).then((jsondata) => {
  myquestion = jsondata;
}).catch((err) => {
  console.log(err);
});


}
// question from server
var myquestion;
var questiontoshow = [];
// function for timer
var startintime = .1;
let time = startintime * 60;
// startbtn.addEventListener("click", startquiz);

function startquiz(){
  saveu();
  firstdisplay.style.display ="none";
  mainctn.style.display = "block";

  rendersubject(myquestion.subject);
  renderquestion(myquestion, 0);
  setInterval(countdown, 1000);
}







//  switching questions
function hii(){
    renderquestion(myquestion, 0);
}
function hi2() {
  renderquestion(myquestion, 1);
}
function hi3() {
  renderquestion(myquestion, 2);
}
function hi4() {
  renderquestion(myquestion, 3);
}
function hi5() {
  renderquestion(myquestion, 4);
}
q1.addEventListener("click", hii);
q2.addEventListener("click", hi2);
q3.addEventListener("click", hi3);
q4.addEventListener("click", hi4);
q5.addEventListener("click", hi5);
// console.log()

// function to render subject
function rendersubject(data){
  console.log(data);
    subjects.innerHTML = "<ul> <li>"+ data+ "</li></ul>";
}
  
  
  function countdown() {
    let minute = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timer.innerHTML = `${ minute }: ${ seconds }`;
    time--;
    if (seconds ==0 && minute==0){
      time = 0;
      clearInterval(countdown);

      mainctn.style.display = "none";
      firstdisplay.style.display = "block";
    }
  }
// function to render question
function renderquestion(data, index) {
  //   optionul.innerHTML ="";
  //   var hi = index + 1;
  //   questionnumber.innerHTML = `Q${hi}`;
  // question.innerHTML = "<ul> <li>" + questiontoshow[index].question + "</li></ul>";
  
  // for(i=0; i<=data[index].option.length - 2; i++){
  //   optionul.innerHTML += `
  //           <li><input type="radio" name="question-options" id="option${i}"> ${questiontoshow[index].option[i]}</li>
  //               `;
                
  // }
    for (k = 0; k < data.questiondata.length; k++) {
      questiontoshow.push(data.questiondata[k]);
    }
    // questiontoshow.push(data.questiondata.forEach(function(dats){
    //   return dats;
    // }));
    optionul.innerHTML = "";
    var hi = index + 1;
    questionnumber.innerHTML = `Q${hi}`;
    question.innerHTML = "<ul> <li>" + questiontoshow[index].question + "</li></ul>";

    for (i = 0; i <= questiontoshow[index].option.length - 2; i++) {
      optionul.innerHTML += `
              <li><input type="radio" name="question-options" value ="${questiontoshow[index].option[i]}" id="option${i}"> ${questiontoshow[index].option[i]}</li>
                  `;

    }
    checkifcorrect(index);
    

    
    
//   questionoption.innerHTML = optionul;
}
function checkifcorrect(index) {
  for (i = 0; i < optionselected.length; i++) {
    if (optionselected[i].checked){
      if(optionselected[i].value == questiontoshow[index].option[questiontoshow[index].option.length - 1]){

        score++;
        console.log(optionselected[i].value);
        `q${index}`.style.backgroundColor = "green";
      }
      score ++;
      console.log(score);
      `q${index}`.style.backgroundColor = "green";
    }
  }
}

// window.onload = renderquestion(myquestion,1);
// console.log(myquestion[1].option[myquestion[1].option.length - 1]);
// console.log(myquestion[1].option.length);