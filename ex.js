const data = [
    {
        question: "How old is You ?",
        a: '10',
        b: '15',
        c: '18',
        d: '21',
        correct: 'd'
    },
    {
        question: "Which is the beginner friendly programming language ?",
        a: 'C programming language',
        b: 'Python',
        c: 'Java',
        d: 'Javascript',
        correct: 'b'
    },
    {
        question: "Which is the best place on the earth to visit ?",
        a: 'India',
        b: 'USA',
        c: 'France',
        d: 'Finland',
        correct: 'a'
    },
    {
        question: "Who is the Prime Minister of India ?",
        a: 'Narendra Modi',
        b: 'Rahul Gandhi',
        c: 'Sonia Gandhi',
        d: 'Amit Shah',
        correct: 'a'
    },
    {
        question: "Green city of India ?",
        a: 'Chandigarh',
        b: 'Delhi',
        c: 'Indore',
        d: 'Mumbai',
        correct: 'a'
    }
]

const quiz = document.querySelector('.card');
const question = document.getElementById('question');
const a_text = document.getElementById('a-text');
const b_text = document.getElementById('b-text');
const c_text = document.getElementById('c-text');
const d_text = document.getElementById('d-text');
const submitBtn = document.getElementById('submit');
const answer = document.querySelectorAll('.answer');

let currentQuiz = 0;
let score = 0;

submitBtn.addEventListener('click', () => {
    const answer = getSelected();
    check(answer);
})

function check(answer) {
    if (answer) {
        if (answer === data[currentQuiz].correct) {
            score++;
        }
        currentQuiz++;

        if (currentQuiz < data.length) {
            loadQuiz();
        }
        else {
            currentQuiz = 0;
            quiz.innerHTML = '';
            const resultHeading = document.createElement('h2');
            const btn = document.createElement('button');
            resultHeading.innerText = `You answered correctly ${score}/${data.length} questions.`
            btn.setAttribute('onclick', 'location.reload()');
            btn.textContent = 'Reload';
            quiz.appendChild(resultHeading);
            quiz.appendChild(btn);
        }
    }
}


loadQuiz();
function loadQuiz() {
    deSelectAnswer();
    const currentQuizData = data[currentQuiz];

    question.innerText = currentQuizData.question;

    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
}

function getSelected() {
    let ans = undefined;
    answer.forEach(answers => {
        if (answers.checked) {
            ans = answers.id;
        }
    });
    return ans;
}

function deSelectAnswer() {
    answer.forEach(answers => {
        answers.checked = false;
    });
}