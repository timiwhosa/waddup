var firstdisplay = document.getElementById("first-display");
var note = document.getElementById("note");
var mainctn = document.getElementById("main-ctn");
var startbtn = document.getElementById("start-btn");
var subjectsul = document.getElementById("subjects");
var timer = document.getElementById("timer");
var submit = document.getElementById("submit");
var toappend = document.getElementById("toappend");
var song = document.createElement("audio");
song.setAttribute("src", "/cbt/mp3/just-saying.mp3");
var section = window.location.href.split("?")[0].split("multiple/")[1];

var myquestion;
var noofans = 0;
var score = 0;
// function for timer
var startintime = 30;
let time = startintime * 60;
var interval;
var continuetime;
startbtn.style.display = "none";

startbtn.addEventListener("click", startquiz);
document.getElementById("retakesametest").addEventListener("click", startquiz);
function startquiz() {
    saveu();
    

}

var totalnoofquestions = 0;

function totalnoofquestionsfunction(data) {
    for (j = 0; j < data.questiondata.length; j++) {
        for (k = 0; k < data.questiondata[j].length; k++) {
            totalnoofquestions++;
        }
    }
    // console.log(totalnoofquestions)
}


window.onload = function () {
    var quest = window.location.href.split("?")[1];
    const uri = `/multiplequestion/${section}/?${quest}`;

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
            window.location = `/cbt/${section}`
        }
    }).then((jsondata) => {
        myquestion = jsondata;
        totalnoofquestionsfunction(myquestion);

        // const uri2 = "/multiple";
        // var options = {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(myquestion.subject)
        // };

        // fetch(uri2, options);

        // console.log(myquestion)
        // rendersubject(myquestion.subject);
        // renderquestion();
    }).catch((err) => {
        console.log(err);
    });


    // time = startintime * 60;
    // interval = setInterval(countdown, 1000);

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
    renderquestion();
    noofans = 0;
    time = startintime * 60;
    countdown();
    interval = setInterval(countdown, 600);
    document.getElementsByTagName("footer")[0].style.marginTop = "8vw";

    if (nametos.trim() != "" && sname.trim() != "" && nametos.length <=12 && sname.length <=12) {
        // score = 0;
        // firstdisplay.style.display = "none";
        // document.getElementById("scorediv").style.display = "none";
        // mainctn.style.display = "block";
        // rendersubject(myquestion.subject);
        // renderquestion();
        // noofans = 0;
        // time = startintime * 60;
        // countdown();
        // interval = setInterval(countdown, 1000);
        // document.getElementsByTagName("footer")[0].style.marginTop = "8vw";
        // document.getElementsByTagName("footer")[0].style.marginTop = ` calc(100vh - 140px)`; //not needed

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
    else if (nametos.trim() == "") {
        document.getElementById("usernameerror").innerHTML = "username is required";
    }
    else if (sname.trim() == "") {
        document.getElementById("surnameerror").innerHTML = "surname is required";
    }
    else if (nametos.length >= 12 || sname.length >= 12) {
        alert("name and username cannot be more than 12 characters");
    }
    name.addEventListener("keyup", function () { document.getElementById("usernameerror").innerHTML = ""; })
    surn.addEventListener("keyup", function () { document.getElementById("surnameerror").innerHTML = ""; })

}
document.getElementById("submit").addEventListener("click", sub);
function sub() {
    song.play();
    checkifcorrect();
    checknoofanswered();
    clearInterval(interval);
    subjectsul.innerHTML="";
    firstdisplay.style.display = "block";
    renderscore();
    continuetime = 0;
    play.style.zIndex = "-2";
    pause.style.zIndex = "2";
    mainctn.style.display = "none";
    toappend.innerHTML = "";
    document.getElementsByTagName("footer")[0].style.marginTop = ` 0`; //not needed
}

function toggler() {
    document.getElementById("sosduh").style.display = "block";
    document.getElementById("forduh").style.display = "block";
}
function togglerr() {
    document.getElementById("sosduh").style.display = "none";
    document.getElementById("forduh").style.display = "none";
}
jQuery("#playagain").on("click", toggler);
jQuery("#forduh, footer , .first-display").on("click", togglerr);

var subjecttorender="";
function rendersubject(data){
    for(i=0; i<data.length; i++){
        subjectsul.innerHTML += `<li id="subject${i+1}" class="${data[i]}" onclick="renderdesiredquestion(${data.length},${i+1})">${data[i]} </li>`
        document.getElementById("subject1").style += `    background-color: rgb(40, 113, 168);
    box-shadow: inset 2px 2px 2px #0000005c, inset -2px -2px 2px #ffffff42;
    padding: 0 4px;
    border-radius: 7px`;
    }
}

function questiontodisplay(index,number1,number2) {
    // console.log(index,number1, number2);
    for(i=0; i<index; i++){
        document.getElementById(`question${number1}${i+1}`).style.display = "none";
    }
    // console.log(number1, number2);
    document.getElementById(`question${number1}${number2}`).style.display = "block";
    checkifanswered();
}
function renderdesiredquestion(index, number1) {
    // console.log(number1);
    for (i = 1; i <=index; i++) {
        document.getElementById(`main-ctn-question-ctn${i}`).style.display = "none";
        document.getElementById(`subject${i}`).style= "background-color:#2579bb";
    }
    // console.log(number1, index);
    document.getElementById(`main-ctn-question-ctn${number1}`).style.display = "block";
    document.getElementById(`subject${number1}`).style += `    background-color: rgb(40, 113, 168);
    box-shadow: inset 2px 2px 2px #0000005c, inset -2px -2px 2px #ffffff42;
    padding: 0 4px;
    border-radius: 7px`;
    // main - ctn - question - ctn${ h } 
}

function renderquestion(){
    for(j=0; j<myquestion.questiondata.length; j++){
        // var help = [];
        var h = j + 1;
        var mainquestiondiv = `<div class="main-ctn-question-ctn" id="main-ctn-question-ctn${h}"></div>`;
        document.getElementById("toappend").innerHTML += mainquestiondiv;
        // console.log(mainquestiondiv);
        var index ;
        for(i=0; i<myquestion.questiondata[j].length; i++){
            index = myquestion.questiondata[j].length;
            var qn, q, op, opul, mq, oph, mmq;

            q = `<div class="question">
                    <!-- question is placed here -->
                    ${myquestion.questiondata[j][i].question}
                </div>`;
            qn = `<span id="question-number"><!--Q1:--> Q${i+1}</span>`;
            oph = "";
            for (k = 0; k <= myquestion.questiondata[j][i].option.length - 2; k++) {
                var he = ["A","B","C","D","E","F","G","H"]
                // var hm = ``;
                oph += `
                <li><input type="radio" name="question${j}${i + 1}-options" onclick="checkifcorrectandshow(${j} , ${i + 1});" value ="${he[k]}" id="option${k}"><span id="${j}${i+1}${k}"> ${myquestion.questiondata[j][i].option[k]}</span></li>
                    `;
                opul = `<ul id="option-ul"> ${oph}</ul>`;
            }


            op = `<div id="question-option">${opul}</div>`;
            mq = `<div id="main-ctn-question" class="main-ctn-question">${qn} ${q}</div>`;
            mmq = `<div id="question${j}${i+1}" class = "questiondisplayed"> ${mq} ${op}</div>`

            jQuery(`#main-ctn-question-ctn${h}`).prepend(mmq);
            if(i>=1){
                document.getElementById(`question${j}${i+1}`).style.display = "none"; 
            }
            
        }

        var questionpagination;
        var pag = "";
        for (m = 1; m <= 5; m++) {

            pag += `<span id="q${j}${m}" onclick = questiontodisplay(${index},${j},${m})>${m}</span>`;

            // help.push(pag);
        }
        // console.log(help.length);
        if (h < myquestion.subject.length){
            // console.log(h);
            questionpagination = `<div id="question-pagination"> ${pag} 
            <span id="next${h}" onclick="checkifanswered(), renderdesiredquestion(${myquestion.subject.length}, ${h + 1})">NEXT <span>&#8250;</span></span>
               </div > 
            `;
        }
        else{
            questionpagination = `<div id="question-pagination"> ${pag} 
            <span id="next${h}" onclick="renderdesiredquestion(${myquestion.subject.length}, 1)">NEXT <span>&#8250;</span></span>
               </div > 
            `;
        }
        
        
        // console.log(questionpagination)
        jQuery(`#main-ctn-question-ctn${h}`).append(questionpagination);

        // for(mm=1; mm<=help.length; mm++){
        //     console.log(document.getElementById(`q${j}${mm}`));
        //     // ;
        // }
        // console.log(j);
        if (h >= 2) {
            document.getElementById(`main-ctn-question-ctn${h}`).style.display = "none";
        }
    }
    

}

function countdown() {
    let minute = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timer.innerHTML = `${minute}:${seconds}`;
    time--;
    continuetime = time;
    if (seconds == 0 && minute == 0 || timer << -1) {
        song.play();
        checkifcorrect()
        checknoofanswered()
        clearInterval(interval);
        subjectsul.innerHTML = "";
        firstdisplay.style.display = "block";
        renderscore();
        continuetime = 0;
        play.style.zIndex = "-2";
        pause.style.zIndex = "2";
        document.getElementsByTagName("footer")[0].style.marginTop = `0`;
        mainctn.style.display = "none";
        toappend.innerHTML = "";
    }
}

var pause = document.getElementById("pause");
var play = document.getElementById("play");
pause.addEventListener("click", function () {
    clearInterval(interval);
    pause.style.zIndex = "-2";
    play.style.zIndex = "2";
});
play.addEventListener("click", function () {
    time = continuetime;
    countdown();
    interval = setInterval(countdown, 600);
    play.style.zIndex = "-2";
    pause.style.zIndex = "2";
});

function renderscore() {
    document.getElementById("score").innerHTML = (score / totalnoofquestions) * 100 + "%";
    document.getElementById("noofanswered").innerHTML = noofans;
    document.getElementById("totalnoofquestions").innerHTML = totalnoofquestions;
    
    if (screen.width > 480) {

        document.getElementById("scorediv").style.display = "flex";
    }
    else {

        document.getElementById("scorediv").style.display = "block";
    }
    firstdisplay.style.opacity = "0.3";
}

function checkifanswered() {
    for (j = 0; j < myquestion.questiondata.length ; j++) {
        for(k=0; k<myquestion.questiondata[j].length; k++){
            // console.log(a, b);
            var he = k+1

            var optionselected = document.getElementsByName(`question${j}${he}-options`);
            // console.log(optionselected);
            for (i = 0; i < optionselected.length; i++) {

                if (optionselected[i].checked == true) {
                    // console.log(ha, "2");
                    document.getElementById(`q${j}${he}`).style.backgroundColor = "#2579bb";
                    document.getElementById(`q${j}${he}`).style.border = "1px solid #2579bb";
                }
                // else if (optionselected[i].checked == false){

                //   document.getElementById(`${ha}`).style.backgroundColor = "white";
                //   document.getElementById(`${ha}`).style.border = "1px solid #000000";
                // }
            }
        }
        
    }
    // console.log(score);
}

function checknoofanswered() {
    for (j = 0; j < myquestion.questiondata.length; j++) {
        for (k = 0; k < myquestion.questiondata[j].length; k++) {
            // console.log(a, b);
            var he = k + 1

            var optionselected = document.getElementsByName(`question${j}${he}-options`);
            // console.log(optionselected);
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

    }
    // console.log(noofans);
}

function checkifcorrect() {
    for (j = 0; j < myquestion.questiondata.length; j++) {
        for (k = 0; k < myquestion.questiondata[j].length; k++) {
            // console.log("a, b");
            var he = k + 1

            var optionselected = document.getElementsByName(`question${j}${he}-options`);
            // console.log(optionselected);
            for (i = 0; i < optionselected.length; i++) {
                if (optionselected[i].checked == true) {
                    // console.log(optionselected[i].value + ":" + myquestion.questiondata[j][k].option[myquestion.questiondata[j][k].option.length - 1].toString());
                    if (optionselected[i].value.toString().trim() == myquestion.questiondata[j][k].option[myquestion.questiondata[j][k].option.length - 1].toString().trim()) {
                        score++;
                        console.log(score);
                        // console.log(optionselected[i].value ,":", myquestion.questiondata[j][k].option[myquestion.questiondata[j][k].option.length - 1]);
                    }
                }
                // else if (optionselected[i].checked == false){

                //   document.getElementById(`${ha}`).style.backgroundColor = "white";
                //   document.getElementById(`${ha}`).style.border = "1px solid #000000";
                // }
            }
        }

    }
    // console.log("you scored:",score);
}

function checkifcorrectandshow(p,q) {
    // for (j = 0; j < myquestion.questiondata.length; j++) {
    //     for (k = 0; k < myquestion.questiondata[j].length; k++) {
    //         // console.log("a, b");
    //         var he = k + 1
console.log(p,q)
    var optionselected = document.getElementsByName(`question${p}${q}-options`);
            // console.log(optionselected);
            for (i = 0; i < optionselected.length; i++) {
                if (optionselected[i].value.toString().trim() == myquestion.questiondata[p][q-1].option[myquestion.questiondata[p][q-1].option.length - 1].toString().trim()) {
                    document.getElementById(`${p}${q}${i}`).style.backgroundColor = "green";
                    document.getElementById(`${p}${q}${i}`).style.padding = "4px";
                    // console.log(optionselected[i]);
                    // console.log(optionselected[i].value ,":", myquestion.questiondata[j][k].option[myquestion.questiondata[j][k].option.length - 1]);
                }
                if (optionselected[i].checked == true) {
                    // console.log(optionselected[i]);
                    // console.log(optionselected[i].value + ":" + myquestion.questiondata[j][k].option[myquestion.questiondata[j][k].option.length - 1].toString());
                    if (optionselected[i].value.toString().trim() == myquestion.questiondata[p][q-1].option[myquestion.questiondata[p][q-1].option.length - 1].toString().trim()) {
                        document.getElementById(`${p}${q}${i}`).style.backgroundColor = "green";
                        document.getElementById(`${p}${q}${i}`).style.padding = "4px";
                        // console.log(optionselected[i]);
                        // console.log(optionselected[i].value ,":", myquestion.questiondata[j][k].option[myquestion.questiondata[j][k].option.length - 1]);
                    }
                    else if (optionselected[i].value.toString().trim() != myquestion.questiondata[p][q-1].option[myquestion.questiondata[p][q-1].option.length - 1].toString().trim()) {
                        document.getElementById(`${p}${q}${i}`).style.backgroundColor = "red";
                        document.getElementById(`${p}${q}${i}`).style.padding = "4px";
                        // console.log("h",optionselected[i]);
                        // console.log(optionselected[i].value ,":", myquestion.questiondata[j][k].option[myquestion.questiondata[j][k].option.length - 1]);
                    }
                    
                }
                // else if (optionselected[i].checked == false){

                //   document.getElementById(`${ha}`).style.backgroundColor = "white";
                //   document.getElementById(`${ha}`).style.border = "1px solid #000000";
                // }
        //     }
        // }

    }
    // console.log("you scored:",score);
}
{/* <span id="q1">2</span>
    <span id="q1">3</span>
    <span id="q1">4</span>
    <span id="q1">5</span>
    */}