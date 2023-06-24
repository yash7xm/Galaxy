var editor = ace.edit("editor");
var exEditor = ace.edit("ex-editor");
exEditor.setTheme("ace/theme/twilight");
exEditor.session.setMode("ace/mode/css");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/html");

editor.setOption('enableLiveAutocompletion', true);


const run = document.querySelector('.run-btn');

var initialHTML = 'body {\n' +
'\tbackground-color: #000;\n' +
'\tdisplay: flex;\n' +
'\tjustify-content: center;\n' +
'\talign-items: center;\n' +
'\tmin-height: 100vh;\n' +
'}';
exEditor.setValue(initialHTML);
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