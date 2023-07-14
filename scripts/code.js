import { addCommentsInHtml, addCommentsInCss, addCommentsInJs } from './project.js'

var editor = ace.edit("editor");
var exEditor = ace.edit("ex-editor");
exEditor.setTheme("ace/theme/twilight");
exEditor.session.setMode("ace/mode/css");
exEditor.clearSelection();
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/html");


editor.setOption('enableLiveAutocompletion', true);

const questionHeading = document.querySelector('.ques-heading');
const questionInfo  = document.querySelector('.ques-info');

const iframe = document.querySelector('.result iframe');

let questionsData = {};
let playerData = {};
let language = '';
let questionNumber = document.querySelector('.v').textContent;
const run = document.querySelector('.run-btn');
const submit = document.querySelector('.submit-btn');
document.addEventListener('DOMContentLoaded', async () =>{
    await example();
    await player();
    language = questionsData[0].project[0].question[questionNumber].lang;
    console.log(language);
})




exEditor.setReadOnly(true);

run.addEventListener('click', handleRunBtn);

async function handleRunBtn() {
    let code = editor.getValue();

    code =  addCommentsInHtml(code, 'a');
    await fetch('/p', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code
        })
    })
    .then(response => response.json())
    .then(data => {
    editor.setValue(data);
    });
    console.log(playerData);

    let htmlCode = '', cssCode = '', jsCode = '';
    if(language == 'html') {
        htmlCode = editor.getValue();
        console.log(playerData.projects[0].question[questionNumber].editor['css'])
        cssCode = playerData.projects[0].question[questionNumber].editor['css'];
        jsCode = playerData.projects[0].question[questionNumber].editor['js'];
    }
    else if(language == 'css') {
        htmlCode = playerData.projects[0].question[questionNumber].editor['html'];
        cssCode = editor.getValue();
        jsCode = playerData.projects[0].question[questionNumber].editor['js'];
    }
    else {
        htmlCode = playerData.projects[0].question[questionNumber].editor['html'];
        cssCode = playerData.projects[0].question[questionNumber].editor['css'];
        jsCode = editor.getValue();
    }

    fetch('/handleRunBtn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quesNo: questionsData[0].project[0].question[questionNumber].quesNumber,
            lang: questionsData[0].project[0].question[questionNumber].lang,
            html: htmlCode,
            css: cssCode,
            js: jsCode,
        })
    })



    if (code) {
        fetch('/dog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code,
                info: questionsData[0].project[0].question[questionNumber].info,
                solution: questionsData[0].project[0].question[questionNumber].solution,
                prompt: questionsData[0].project[0].question[questionNumber].prompt
            })
        })
            .then(res => res.json())
            .then(data => {
                const feedback = data.feedback;
                const feedbackDiv = document.querySelector('.feedback');
                feedbackDiv.textContent = feedback;
                console.log('done');
            })
        consoleArea.classList.remove('hidden');
        consoleArea.classList.add('visible');
    }

    iframe.contentWindow.location.reload();
}


async function example() {
    await fetch('/exampleData', {
        method: "POST"
    })
    .then(response => response.json())
    .then(data => questionsData = data)
    .then(() => {
        const exampleData = questionsData[0].project[0].question[questionNumber].example;
        exEditor.setValue(exampleData)
    })
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

function handlePrevBtn() {
    questionHeading = questionsData[0].project[0].question[questionNumber].heading;
    questionInfo = questionsData[0].project[0].question[questionNumber].info;
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
            lang: questionsData[0].project[0].question[0].lang,
            quesNo: questionsData[0].project[0].question[0].quesNumber,
        })
    })
}

const langBtns = document.querySelectorAll('.editor-btns span');

let cache = '';
let cacheFlag = false;

langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        // console.log('click')
        const language = questionsData[0].project[0].question[0].lang;
        // console.log(language)
        if(btn.className === questionsData[0].project[0].question[0].lang) {
            // console.log(cache)
            editor.setValue(cache);
            cacheFlag = false;
        }
        else {
            if(cacheFlag == false)
                cache = editor.getValue();
            const value = playerData[0].projects[0].question[0].editor[language];
            editor.setValue(value);
            cacheFlag = true;
        }
    })
})
