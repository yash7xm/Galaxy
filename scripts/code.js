import { addCommentsInHtml, addCommentsInCss, addCommentsInJs } from './project.js'

var editor = ace.edit("editor");
var exEditor = ace.edit("ex-editor");

let questionsData = {};
let playerData = {};
let lang = '';
const questionNo = document.querySelector('.ques-no').innerText - 1;

document.addEventListener('DOMContentLoaded', async () => {
    await example();
    await player();

    lang = questionsData[0].project[0].question[questionNo].lang;
    let playerSubmissionLen = (playerData.projects[0].question[questionNo].submissions).length;
    let code = '';

    var commentFunctions = {
        html: addCommentsInHtml,
        css: addCommentsInCss,
        js: addCommentsInJs
    };      

    if(lang == 'html')
        code = commentFunctions[lang](playerData.projects[0].question[questionNo].editor[lang], questionsData[0].project[0].question[questionNo].selectedClassForHtml, playerSubmissionLen);
    else 
        code = commentFunctions[lang](playerData.projects[0].question[questionNo].editor[lang], playerSubmissionLen);
    prettierReq(code);

    await fetch('/clearIframe', {
        method: 'POST',
    })

    iframe.contentWindow.location.reload();

    exEditor.session.setMode("ace/mode/" + lang);
    editor.session.setMode("ace/mode/" + lang);
})

exEditor.setTheme("ace/theme/twilight");
exEditor.clearSelection();
exEditor.setReadOnly(true);
editor.setTheme("ace/theme/twilight");
editor.setOption('enableLiveAutocompletion', true);

const questionHeading = document.querySelector('.ques-heading');
const questionInfo  = document.querySelector('.ques-info');
const iframe = document.querySelector('.result iframe');

const run = document.querySelector('.run-btn');
const submit = document.querySelector('.submit-btn');

run.addEventListener('click', handleRunBtn);

async function handleRunBtn() {
    let code = editor.getValue();
    if(code) {
        prettierReq(code);
    
        let htmlCode = '', cssCode = '', jsCode = '';
        if(lang == 'html') {
            htmlCode = editor.getValue();
            console.log(playerData.projects[0].question[questionNo].editor['css'])
            cssCode = playerData.projects[0].question[questionNo].editor['css'];
            jsCode = playerData.projects[0].question[questionNo].editor['js'];
        }
        else if(lang == 'css') {
            htmlCode = playerData.projects[0].question[questionNo].editor['html'];
            cssCode = editor.getValue();
            jsCode = playerData.projects[0].question[questionNo].editor['js'];
        }
        else {
            htmlCode = playerData.projects[0].question[questionNo].editor['html'];
            cssCode = playerData.projects[0].question[questionNo].editor['css'];
            jsCode = editor.getValue();
        }
    
        await fetch('/handleRunBtn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quesNo: questionsData[0].project[0].question[questionNo].quesNumber,
                lang: lang,
                html: htmlCode,
                css: cssCode,
                js: jsCode,
            })
        })
        
        fetch('/dog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({  
                code: code,
                info: questionsData[0].project[0].question[questionNo].info,
                solution: questionsData[0].project[0].question[questionNo].solution,
                prompt: questionsData[0].project[0].question[questionNo].prompt
            })
        })
            .then(res => res.json())
            .then(data => {
                const feedback = data.feedback;
                const feedbackDiv = document.querySelector('.feedback');
                feedbackDiv.textContent = feedback;
                console.log('done');
            })
            .catch(error => {
                const feedbackDiv = document.querySelector('.feedback');
                feedbackDiv.textContent = 'Oops! server error';
            })
             
        consoleArea.classList.remove('hidden');
        consoleArea.classList.add('visible');

        iframe.contentWindow.location.reload();
    }
}

async function prettierReq(code) {
    await fetch('/p', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            lang: lang
        })
    })
    .then(response => response.json())
    .then(data => {
    editor.setValue(data);
    });
}

async function example() {
    try {
        const response = await fetch('/exampleData', {
            method: 'POST'
        });
        questionsData = await response.json();
        const exampleValue = questionsData[0].project[0].question[questionNo].example;
        exEditor.setValue(exampleValue);
        // console.log(questionsData[0].project[0].question[10].lang)
    } catch (error) {
        console.error(error);
    }

    // console.log((questionsData[0].project[0].question).length)
}

async function player() {
    await fetch('/playerData', {
        method: "POST"
    })
    .then(response => response.json())
    .then(data => playerData = data)
}

const consoleBtn = document.querySelector('.console');
const consoleArea = document.querySelector('.console-area');

consoleBtn.addEventListener('click', handleConsoleBtn);

function handleConsoleBtn() {
    consoleArea.classList.toggle('hidden');
    consoleArea.classList.toggle('visible');
}

const fullscreenBtn = document.querySelector('.fullscreen-btn');
const userIframe = document.querySelector('.result iframe');

fullscreenBtn.addEventListener('click', handleFullscreenBtn);

function handleFullscreenBtn() {
    userIframe.classList.toggle('fullscreen');
    if (userIframe.classList.contains('fullscreen')) {
        fullscreenBtn.innerHTML = '<i class="fa-solid fa-minimize"></i>';
        fullscreenBtn.classList.remove('smallscreenBtn');
        fullscreenBtn.classList.add('fullscreenBtn');
    }
    else {
        fullscreenBtn.innerHTML = '<i class="fa-solid fa-maximize"></i>';
        fullscreenBtn.classList.remove('fullscreenBtn');
        fullscreenBtn.classList.add('smallscreenBtn');
    }
}

const result = document.querySelector('.console-area .middle .result');
const feedback = document.querySelector('.console-area .middle .feedback');
const resultBtn = document.querySelector('.console-area .header span');
const feedbackBtn = document.querySelector('.console-area .header span:last-child');

feedbackBtn.addEventListener('click', () => {
    if (feedback.classList.contains('hidden')) {
        feedback.classList.remove('hidden');
        result.classList.add('hidden');
    }
})

resultBtn.addEventListener('click', () => {
    if (result.classList.contains('hidden')) {
        result.classList.remove('hidden');
        feedback.classList.add('hidden');
    }
})

const prevBtn = document.querySelector('.move-btns span:first-child');
const nextBtn = document.querySelector('.move-btns span:last-child');

prevBtn.addEventListener('click', handlePrevBtn);
nextBtn.addEventListener('click', handleNextBtn);

function handlePrevBtn() {
    if(questionNo > 0){
        fetch('/prevBtn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quesNo: questionNo
            })      
        })
        .then(() => {
            window.location.href = '/path';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

function handleNextBtn() {
    if(questionNo < (questionsData[0].project[0].question).length - 1) {
        fetch('/nextBtn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quesNo: questionNo
            })      
        })
        .then(() => {
            window.location.href = '/path';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

submit.addEventListener('click', handleSubmitBtn);

async function handleSubmitBtn() {
    let code = editor.getValue();

    await fetch('/submit', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        body: JSON.stringify({
            code: code,
            lang: lang,
            quesNo: questionsData[0].project[0].question[questionNo].quesNumber,
        })
    })
}

const langBtns = document.querySelectorAll('.editor-btns span');

let cache = '';
let cacheFlag = false;
let againClicked = false;

langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        // console.log('click')
        // console.log(language)
        if(btn.className === lang) {
            // console.log(cache)
            editor.setReadOnly(false);
            if(!againClicked)
                editor.setValue(cache);
            cacheFlag = false;
            againClicked = true;
        }
        else {
            editor.setReadOnly(true);
            if(cacheFlag == false)
                cache = editor.getValue();
            const value = playerData.projects[0].question[questionNo].editor[btn.className];
            if(btn.className == 'js')
                editor.session.setMode("ace/mode/javascript");
            else
                editor.session.setMode("ace/mode/css");
            editor.setValue(value);

            cacheFlag = true;
            againClicked = false;
        }
    })
})
