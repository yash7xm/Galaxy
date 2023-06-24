var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/html");

editor.setOption('enableLiveAutocompletion', true);


const run = document.querySelector('.run-btn');

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
    .then( () => {
        console.log('correct');
    })
}