const input = document.querySelector('.display');
const buttons = document.querySelectorAll('.buttons button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        let value = button.innerText;
        handleClickedButtons(value);
    })
})

function handleClickedButtons(value) {
    if (value === 'AC') {
        handleAcButton();
    }
    else if (value === 'DEL') {
        handleDelButton();
    }
    else if (value === '=') {
        calculate();
    }
    else {
        handleRestOfTheButtons(value);
    }
}

function handleAcButton() {
    input.innerText = '0';
}

function handleDelButton() {
    let currentText = input.innerText;
    if (currentText !== '0') {
        input.innerText = currentText.slice(0, -1);
        if (input.innerText === '') {
            input.innerText = '0';
        }
    }
}

function handleRestOfTheButtons(value) {
    if (input.innerText === '0') {
        input.innerText = value;
    } else {
        input.innerText += value;
    }
}

function calculate() {
    try {
        input.innerText = eval(input.innerText);
    }
    catch (error) {
        input.innerText = 'Invalid Expression';
    }
}