import { addCommentsInHtml, addCommentsInCss, addCommentsInJs } from './project.js'

var editor = ace.edit("editor");
var exEditor = ace.edit("ex-editor");
exEditor.setTheme("ace/theme/twilight");
exEditor.clearSelection();
editor.setTheme("ace/theme/twilight");

exEditor.setReadOnly(true);

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
    exEditor.session.setMode(`ace/mode/${language}`);
    if(language == 'js')
    editor.session.setMode('ace/mode/javascript');
    else
    editor.session.setMode(`ace/mode/${language}`);
    let codeFromDataBase = playerData.projects[0].question[questionNumber].editor[language];
    if(questionNumber!=0) loadCode(codeFromDataBase);
    else editor.setValue(codeFromDataBase);
    console.log(language);
})

async function loadCode(codeFromDataBase) {
    let code = codeFromDataBase;
    let htmlClass = ''
    if(language == 'html'){
    htmlClass = questionsData[0].project[0].question[questionNumber].selectedClassForHtml;
    code =  addCommentsInHtml(code, htmlClass);
    }
    else if(language == 'css'){
        code = addCommentsInCss(code);
    }
    else{
        code = addCommentsInJs(code);
    }
    await fetch('/p', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            lang: language
        })
    })
    .then(response => response.json())
    .then(data => {
      editor.setValue(data);
    });
}

run.addEventListener('click', handleRunBtn);

async function handleRunBtn() {
    let code = editor.getValue();
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
            lang: questionsData[0].project[0].question[questionNumber].lang,
            quesNo: questionsData[0].project[0].question[questionNumber].quesNumber,
        })
    })
}

const langBtns = document.querySelectorAll('.editor-btns span');

let cache = '';
let cacheFlag = false;

langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        // console.log('click')
        // console.log(language)
        if(btn.className === language) {
            // console.log(cache)
            editor.setValue(cache);
            cacheFlag = false;
        }
        else {
            if(cacheFlag == false)
                cache = editor.getValue();
            const value = language;
            editor.setValue(value);
            cacheFlag = true;
        }
    })
})
