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

let htmlCode = '<body>\n\n</body>'
editor.setValue(htmlCode);
run.addEventListener('click', handleRunBtn);

async function handleRunBtn() {
    let code = editor.getValue();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = code;

    console.log(code);
    

    const divA = tempDiv.querySelector('div .a');
    divA.innerHTML = '\n<!-- Write you code here -->\n';

    code = tempDiv.innerHTML;
    console.log(htmlCode);
    fetch('/p', {
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
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;
    

    const divA = tempDiv.querySelector('div .a');
    divA.innerHTML += '\n\n';

    code = tempDiv.innerHTML;
    editor.setValue(code);
    });
    
    // fetch('/dog', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         code: code,
    //         info: questionsData[0].project[0].question[3].info,
    //         solution: questionsData[0].project[0].question[3].solution
    //     })
    // })
    //     .then(() => {
    //         console.log('correct');
    //     })
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