var editor = ace.edit("editor");
var exEditor = ace.edit("ex-editor");
exEditor.setTheme("ace/theme/twilight");
exEditor.session.setMode("ace/mode/html");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/html");


editor.setOption('enableLiveAutocompletion', true);

let questionsData = {};
const run = document.querySelector('.run-btn');

fetchData();

exEditor.setReadOnly(true);

run.addEventListener('click', handleRunBtn);

function handleRunBtn() {
    const code = editor.getValue();
    fetch('http://localhost:8080/dog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code
        })
    })
        .then(() => {
            console.log('correct');
        })
}



async function fetchData() {
    await fetch('/dog', {
        method: 'POST',
    })
    .then(res => res.json())
    .then(data => questionsData = data);
    let aa = questionsData[0].project[0].question[0].example;
    exEditor.setValue(aa);
}