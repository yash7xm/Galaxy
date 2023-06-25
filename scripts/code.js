var editor = ace.edit("editor");
var exEditor = ace.edit("ex-editor");
exEditor.setTheme("ace/theme/twilight");
exEditor.session.setMode("ace/mode/css");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/css");


editor.setOption('enableLiveAutocompletion', true);

let questionsData = {};
const run = document.querySelector('.run-btn');

fetchData();

exEditor.setReadOnly(true);

run.addEventListener('click', handleRunBtn);

function handleRunBtn() {
    const code = editor.getValue();
    fetch('/dog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            info: questionsData[0].project[0].question[3].info,
            solution: questionsData[0].project[0].question[3].solution
        })
    })
        .then(() => {
            console.log('correct');
        })
}



async function fetchData() {
    await fetch('/data', {
        method: 'POST',
    })
    .then(res => res.json())
    .then(data => questionsData = data);
    let aa = questionsData[0].project[0].question[3].example;
    exEditor.setValue(aa);
}