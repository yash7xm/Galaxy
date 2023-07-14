const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const app = express();
const ejs = require('ejs');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const prettier = require("prettier");
const fs = require('fs');

const configuration = new Configuration({
    apiKey: process.env.API_KEY
});

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

app.use("/styles", express.static(__dirname + "/styles"));
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use("/images", express.static(__dirname + "/images"));

const openai = new OpenAIApi(configuration);
mongoose.connect(process.env.MONGO_PROD_URL)
    .then(() => console.log('connected db'));



const PlayerSchema = new mongoose.Schema({
    name: String,
        projects: [
            {
                question: [
                    {
                        editor: {
                            html: String,
                            css: String,
                            js: String
                          },
                        submissions: [
                            {
                                type: String
                            }
                            ],
                        like: Boolean,
                        dislike: Boolean
                    }
                ]
            }
        ]
})


const Player = mongoose.model('Player', PlayerSchema);
const newPlayer = new Player({
    name: 'a',
    projects: [
        {
            question: [
                {
                    editor: {
                        html: "<body>\n\n</body>",
                        css: "",
                        js: ""
                    }
                }
            ]
        }
    ]
});

// newPlayer.save();

const ProjectSchema = new mongoose.Schema({
    project: [
        {
            question: [
                {
                    quesNumber: Number,
                    heading: String,
                    info: String,
                    hint: String,
                    example: String,
                    preview: Boolean,
                    solution: String,
                    like: Number,
                    dislike: Number,
                    difficulty: String,
                    previewHtml: String,
                    previewCss: String,
                    previewJs: String,
                    lang: String,
                    selectedClassForHtml: String
                }
            ]
        }
    ]
});

const project = mongoose.model('project', ProjectSchema);

const data = new project({
    project: [
        {
            question: [
                {
                    quesNumber: 1,
                    heading: "Creating a simple Calculator card.",
                    info: `
                    In this task, your goal is to create a user interface for a simple calculator by utilizing
                    HTML. The calculator will be presented as a card, structured with a main <code>div</code>
                    element having the class name "calculator-card". Within this card, you will need to include
                    two additional <code>div</code> elements to organize the content.
                    
                    <ul>
                        <li> The first inner <code>div</code>, with the class name "display" and insert "0" as
                            default content in this div, this will serve as a container for the calculator's
                            input field. This field will be used to display the numbers and results of
                            calculations to the user.
                        </li>
                        <li> The second inner <code>div</code>, with the class name "buttons", will act as a
                            container for the calculator's buttons. These buttons will enable users to perform
                            basic mathematical operations such as addition, subtraction, multiplication, and
                            division.
                        </li>
                    </ul>
                    `,
                    example: '<div class="class-name">\n\t<div class="nested-class">\n\t</div>\n</div>',
                    solution: '<div class="calculator-card">\n\t<div class="display">\n\t</div>\n\t<div class="buttons">\n\t</div>\n</div>',
                    difficulty: 'Easy',
                    prompt: 'create a div with class as "calculator-card" and two nested divs in it with classes "display" and "buttons" respectively in this order and "0" as default content of display',
                    preview: false,
                    lang: 'html',
                },
                {
                    quesNumber: 2,
                    heading: 'Adding buttons in Calculator.',
                    info:
                        `<p> As part of the calculator card creation, you are required to initialize and include 20 button elements inside the <code>div</code> element with the class name "buttons". These buttons will provide functionality for various operations and numerical inputs in the calculator.
                        Each button should have a specific content associated with it. The content of the buttons should be initialized in the following order:</p>
                        <ul>
                            <li>"AC" - Represents the clear all (reset) functionality.</li>
                            <li>"DEL" - Represents the delete (backspace) functionality.</li>
                            <li>"%" - Represents the percentage functionality.</li>
                            <li>"/" - Represents the division operation.</li>
                            <li>"7" - Represents the number 7.</li>
                            <li>"8" - Represents the number 8.</li>
                            <li>"9" - Represents the number 9.</li>
                            <li>"*" - Represents the multiplication operation.</li>
                            <li>"4" - Represents the number 4.</li>
                            <li>"5" - Represents the number 5.</li>
                            <li>"6" - Represents the number 6.</li>
                            <li>"-" - Represents the subtraction operation.</li>
                            <li>"1" - Represents the number 1.</li>
                            <li>"2" - Represents the number 2.</li>
                            <li>"3" - Represents the number 3.</li>
                            <li>"+" - Represents the addition operation.</li>
                            <li>"^" - Represents the exponentiation (power) operation.</li>
                            <li>"0" - Represents the number 0.</li>
                            <li>"." - Represents the decimal point.</li>
                            <li>"=" - Represents the calculation (equal) operation.</li>
                        </ul> 
                        <p>By including these 20 button elements within the "buttons" <code>div</code>, you will provide users with a comprehensive set of options to perform various mathematical operations and numerical inputs on the calculator interface.</p>`,
                    example: '<button> AC </button>',
                    solution: '<div class="buttons">\n\t<button>AC</button>\n\t<button>DEL</button>\n\t<button>%</button>\n\t<button>/</button>\n\t<button>7</button>\n\t<button>8</button>\n\t<button>9</button>\n\t<button>*</button>\n\t<button>4</button>\n\t<button>5</button>\n\t<button>6</button>\n\t<button>-</button>\n\t<button>1</button>\n\t<button>2</button>\n\t<button>3</button>\n\t<button>+</button>\n\t<button>^</button>\n\t<button>0</button>\n\t<button>.</button>\n\t<button>=</button>\n</div>',
                    difficulty: 'Easy',
                    preview: false,
                    lang: 'html',
                },
                {
                    quesNumber: 3,
                    heading: 'Center the Calculator card.',
                    info: ` <p>For the time being, the HTML is finished. <br>
                    You constructed a <code>div</code> with the class calculator-card in the previous questions to hold the Calculator. Now that you're done, we want it to look decent, so you must center the calculator and give the <code>body</code> a background color. <br>
                    In order to do so, you need to apply the styling to the <code>body</code>.</p>`,
                    example: 'body {\n\tbackground-color: #000;\n}',
                    solution: 'body {\n' +
                        '\tbackground-color: #000;\n' +
                        '\tdisplay: flex;\n' +
                        '\tjustify-content: center;\n' +
                        '\talign-items: center;\n' +
                        '\tmin-height: 100vh;\n' +
                        '}',
                    difficulty: 'Easy',
                    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Calculator</title><link rel="stylesheet" href="ex.css"></head><body><div class="calculator-card"><div class="display">0</div><div class="buttons"><button>AC</button><button>DEL</button><button>%</button><button>/</button><button>7</button><button>8</button><button>9</button><button>*</button><button>4</button><button>5</button><button>6</button><button>-</button><button>1</button><button>2</button><button>3</button><button>+</button><button>^</button><button>0</button><button>.</button><button>=</button></div></div><script src="ex.js"></script></body></html>',
                    css: '* { margin: 0; padding: 0; box-sizing: border-box; } body { background-color: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; }',
                    preview: true,
                    lang: 'css',
                },
                {
                    quesNumber: 4,
                    heading: 'Styling the Buttons',
                    info: `<p>Now is the moment to style the <code>buttons</code> to improve their appearance because they are now stacked in a single column. <br>
                    We must arrange the buttons within the <code>div</code> with the class "buttons" in a <code>grid</code> with four equal-sized columns and five equal-sized rows. <br>
                    To make it look more appealing, you can also add additional styling such as gap, padding, margin, text-color, background-color, border-radius, etc.</p>`,
                    hint: 'Use grid',
                    example: '.buttons {\n' +
                        '\tcolor: white;\n' +
                        '\tbackground-color: #333;\n' +
                        '\tborder-radius: 5px;\n' +
                        '}',
                    solution: '.buttons {\n' +
                        '\tdisplay: grid;\n' +
                        '\tgrid-template-columns: repeat(4, 1fr);\n' +
                        '\tgap: 15px;\n' +
                        '\tmargin-top: 20px;\n' +
                        '\tcolor: white;\n' +
                        '\tbackground-color: #333;\n' +
                        '\tpadding: 10px;\n' +
                        '\tborder-radius: 5px;\n' +
                        '}',
                    difficulty: 'Medium',
                    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Calculator</title><link rel="stylesheet" href="ex.css"></head><body><div class="calculator-card"><div class="display">0</div><div class="buttons"><button>AC</button><button>DEL</button><button>%</button><button>/</button><button>7</button><button>8</button><button>9</button><button>*</button><button>4</button><button>5</button><button>6</button><button>-</button><button>1</button><button>2</button><button>3</button><button>+</button><button>^</button><button>0</button><button>.</button><button>=</button></div></div><script src="ex.js"></script></body></html>',
                    css: '* { margin: 0; padding: 0; box-sizing: border-box; } body { background-color: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; } .buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 20px; color: white; background-color: #333; padding: 10px; border-radius: 5px; }',
                    preview: true,
                    lang: 'css',
                },
                {
                    quesNumber: 5,
                    heading: "Finishing the calculator's overall design",
                    info: `<p>You need to add some specific styling to the calculator <code>buttons</code> and the <code>divs</code> with class of "calculator-card" and "display" in order to improve the calculator's overall appearance. <br>
                            You can use font-size, cursor-style, padding, background-color, border-radius, text-color, and more.</p>`,
                    example: 'button {\n' +
                            '\tcursor: pointer;\n' +
                            '}\n\n' +
                            '.display {\n' +
                            '\ttext-align: end;\n' +
                            '}\n\n' +
                            '.calculator-card {\n' +
                            '\tbackground-color: #222;\n' +
                            '}',
                    solution: '.display {\n' +
                        '\tfont-size: 1.2rem;\n' +
                        '\tpadding: 5px 15px;\n' +
                        '\ttext-align: end;\n' +
                        '\tcolor: white;\n' +
                        '}\n\n' +
                        '.buttons button {\n' +
                        '\tfont-size: 0.7rem;\n' +
                        '\tpadding: 2.5px;\n' +
                        '\tbackground-color: #555;\n' +
                        '\tborder-radius: 5px;\n' +
                        '\tcursor: pointer;\n' +
                        '}\n\n' +
                        '.calculator-card {\n' +
                        '\tpadding: 0.8rem;\n' +
                        '\tbackground-color: #222;\n' +
                        '\tborder-radius: 10px;\n' +
                        '}',
                    difficulty: 'Easy',
                    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Calculator</title><link rel="stylesheet" href="ex.css"></head><body><div class="calculator-card"><div class="display">0</div><div class="buttons"><button>AC</button><button>DEL</button><button>%</button><button>/</button><button>7</button><button>8</button><button>9</button><button>*</button><button>4</button><button>5</button><button>6</button><button>-</button><button>1</button><button>2</button><button>3</button><button>+</button><button>^</button><button>0</button><button>.</button><button>=</button></div></div><script src="ex.js"></script></body></html>',
                    css: '* { margin: 0; padding: 0; box-sizing: border-box; } body { background-color: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; } .buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 20px; color: white; background-color: #333; padding: 10px; border-radius: 5px; } .display { font-size: 1.2rem; padding: 5px 15px; text-align: end; color: white; } .buttons button { font-size: 0.7rem; padding: 2.5px; background-color: #555; border-radius: 5px; cursor: pointer; } .calculator-card{padding:0.8rem;background-color:#222;border-radius:10px;}',
                    difficulty: 'Easy',
                    preview: true,
                    lang: 'css',
                },
                {
                    quesNumber: 6,
                    heading: "Selecting elements for DOM manipulation.",
                    info: `<p>To make your calculator interactive with JavaScript, your task is to carefully select the <code>display</code> and all the <code>button</code> elements from the <code>html</code> you wrote previously.<br>
                    By targeting and manipulating these elements, you can achieve dynamic functionality for your calculator later. <br>
                    This can be achieved by using javascript's DOM selectors. <br>
                    <b>NOTE:</b> <i>You need to select all the <code>buttons</code>.</i> </p>`,
                    example: "const variableName = document.querySelector('.class-name');",
                    solution: "const input = document.querySelector('.display');\n"+
                    "const buttons = document.querySelectorAll('button');",
                    lang: 'js',
                    difficulty: 'Easy',
                    preview: true,
                },
                {
                    quesNumber: 7,
                    heading: "Adding Event-Listener for Buttons",
                    info: `<p>You have a calculator with multiple buttons representing digits, operators, and other functionalities. Each <code>button</code> needs to be assigned a <code>click</code> event listener to perform specific actions when clicked.<br>
                        Your task is to write JavaScript code that accomplishes this functionality. Here are the steps you can follow:
                        <ul>
                            <li>Iterate through each <code>button</code> using appropriate method.</li>
                            <li>Add a <code>click</code> event listener to each button.</li>
                            <li>When a <code>button</code> is clicked, capture its displayed value.</li>
                            <li>Pass the captured value to a function, such as <code>handleClickedButtons()</code></li>
                        </ul>
                    </p>`,
                    example: "element.addEventListener('click', functionName);",
                    solution: "buttons.forEach(button => {\n" +
                            "\tbutton.addEventListener('click', () => {\n" +
                            "\t\tlet value = button.innerText;\n" +
                            "\t\thandleClickedButtons(value);\n" +
                            "\t})\n" +
                            "})",
                    lang: 'js',
                    difficulty: 'Medium',
                    preview: true
                },
                {
                    quesNumber: 8,
                    heading: "Defining handleClickButton() function",
                    info: ` <p>In the question, you called a function in the event listener for each <code>button</code>, now you need to define that function. <br>
                    The function should perform these functionalities: 
                    <ul>
                        <li>If value is "AC", it calls <code>handleAcButton(args)</code></li>
                        <li>If value is "DEL", it calls <code>handleDelButton(args)</code></li>
                        <li>If value is "=", it calls <code>calculate(args)</code></li>
                        <li>Otherwise, it calls <code>handleRestOfTheButtons(args)</code></li>
                    </ul>
                    </p>`,
                    example: "function functionName(args){\n"+
                       "\tif(condition) secondFunction(args);\n"+
                        "\t else thirdFunction(args);\n"+
                    "}",
                    solution: "function handleClickedButtons(value) {\n" +
                    "\tif (value === 'AC') {\n" +
                    "\t\thandleAcButton();\n" +
                    "\t}\n" +
                    "\telse if (value === 'DEL') {\n" +
                    "\t\thandleDelButton();\n" +
                    "\t}\n" +
                    "\telse if (value === '=') {\n" +
                    "\t\tcalculate();\n" +
                    "\t}\n" +
                    "\telse {\n" +
                    "\t\thandleRestOfTheButtons(value);\n" +
                    "\t}\n" +
                    "}",
                    preview: true,
                    lang: 'js',
                    difficulty: 'Easy',
                },
                {
                    quesNumber: 9,
                    heading: "Defining the handleAcButton() function",
                    info: `<p>In the previous question, you called a function in the conditional statement for the <code>AC</code> button. Now you need to define that function. <br>
                    The function should simulate the functionality of the "AC" button in a calculator. <br>
                    Your task is to implement this function, which will reset the calculator's display to <code>0</code>.</p>`,
                    example: "function handleAcButton() {\n" +
                        "\t//statements\n" +
                        "}",
                    solution: "function handleAcButton() {\n" +
                        "\tinput.innerText = '0';\n" + 
                        "}",
                    lang: 'js',
                    preview: true,
                    difficulty: 'Easy'
                },
                {
                    quesNumber: 10,
                    heading: "Defining the handleDelButton() function",
                    info: `<p>In the 8th question, you called a function in the conditional statement for the <code>DEL</code> button. Now you need to define that function. <br>
                    The function should simulate the functionality of the "DEL" button in a calculator. <br>
                    The function should perform these functionalities:
                    <ul>
                        <li>It should remove the last digit or character from the current display and update the display accordingly.
                        </li>
                        <li>It should be able to handle various scenarios, such as deleting a single digit, removing the decimal point, or eliminating an entire character. It should also account for cases where the display is already empty or contains only a single digit or character.</li>
                    </ul></p>`,
                    example: "function handleDelButton() {\n" +
                    "\t//statements\n" +
                    "}",
                    solution: "function handleDelButton() {\n" +
                        "\tlet currentText = input.innerText;\n" +
                        "\tif (currentText !== '0') {\n" +
                            "\t\tinput.innerText = currentText.slice(0, -1);\n" +
                            "\t\tif (input.innerText === '') {\n" +
                                "\t\t\tinput.innerText = '0';\n" +
                            "\t\t}\n" +
                        "\t\}\n" +
                    "}",
                    lang: 'js',
                    preview: true,
                    difficulty: 'Medium'
                },
                {
                    quesNumber: 11,
                    heading: "Defining the calculate() function",
                    info: `<p>In the 8th question, you called a function in the conditional statement for the <code>=</code> button. Now you need to define that function. <br>
                    The function should simulate the functionality of the "=" button in a calculator. <br>
                    The function should use the expression present on the <code>display</code>, parse and evaluate it according to the standard mathematical rules, and display the computed result.<br>
                    <b>Follow up:</b><i> Can you do this without using inbuilt functions.</i>
                   </p>`,
                   example: "function calculate() {\n" +
                    "\t//statements\n" +
                    "}",
                    solution: "function calculate() {\n" +
                    "\ttry {\n" +
                    "\t\tinput.innerText = eval(input.innerText);\n" +
                    "\t}\n" +
                    "\tcatch (error) {\n" +
                    "\t\tinput.innerText = 'Invalid Expression';\n" +
                    "\t}\n" +
                    "}",
                    difficulty: 'Hard',
                    lang: 'js',
                    preview: true,

                },
                {
                    quesNumber: 12,
                    heading: "Defining the handleRestOfTheButtons() function",
                    info: `<p>In the 8th question, you called a function in the conditional statement for rest of the buttons. Now you need to define that function. <br>
                    The function should simulate the functionality of all the buttons other than <code>AC</code>, <code>DEL</code>, <code>=</code> in a calculator. <br>
                    The function should perform these functionalities:
                    <ul>
                        <li>It should update the display by concating the expression at display with the value of pressed button.</li>
                        <li>If the current expression of display is <code>0</code> then it should replace it with the value of the pressed button.</li>
                    </ul>
                   </p>`,
                   example: "function handleRestOfTheButtons() {\n" +
                   "\t//statements\n" +
                   "}",
                   solution: "function handleRestOfTheButtons(value) {\n" +
                   "\tif (input.innerText === '0') {\n" +
                       "\t\tinput.innerText = value;\n" +
                   "\t} else {\n" +
                       "\t\tinput.innerText += value;\n" +
                   "\t}\n" +
               "}",
               difficulty: 'Easy',
               lang: 'js',
               preview: true,
                }

            ]
        }
    ]
})

// data.save();
app.get('/save', async (req, res) => {
    // await project.deleteMany({});
    const data = await project.find({});
    res.send(data);
})

app.use(bodyParser.json());
app.use(cors());


let code = '';
let info = '';
let solution = '';
let checkedCode = '';
app.post('/dog', async (req, res) => {
    code = req.body.code;
    info = req.body.info;
    solution = req.body.solution;
    prompt = req.body.prompt;
    // console.log(code);
    // console.log(prompt)
    const feedback = await check();
    res.json({ feedback });
    // res.sendStatus(200);
})

app.post('/p', async (req, res) => {
    let code = req.body.code;
    let lang = req.body.lang;
    const formattedCode = await prettier.format(code, {
        parser: lang,
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 80, // Set the desired line width for indentation
        htmlWhitespaceSensitivity: 'ignore', // Ignore HTML indentation rules
        embeddedLanguageFormatting: 'off', // Disable formatting for embedded languages
    });
    console.log(formattedCode);
    res.json(formattedCode);
});

app.post('/submit', async (req, res) => {
    let code = req.body.code;
    let lang = req.body.lang;
    const number= req.body.quesNo;
    const PlayerData = await Player.findOne({ name: 'a' });
    PlayerData.projects[0].question[number-1].editor[lang] = code;
    PlayerData.projects[0].question[number-1].submissions.push(code)
    if(PlayerData.projects[0].question[number])
    console.log('hello');
    else{
        const newQuestion = {
            editor: {
                html: "",
                css: "",
                js: ""
            },
            submissions: [],
            like: true,
            dislike: true
        }
        newQuestion.editor['html'] = PlayerData.projects[0].question[number-1].editor['html'];
        newQuestion.editor['css'] = PlayerData.projects[0].question[number-1].editor['css'];
        newQuestion.editor['js'] = PlayerData.projects[0].question[number-1].editor['js'];
        PlayerData.projects[0].question.push(newQuestion);
    }
    await PlayerData.save();
    res.send(PlayerData);
});

app.post('/handleRunBtn', async (req, res) => {
    const quesNo = req.body.quesNo;
    let html = req.body.html;
    const css = req.body.css;
    const js = req.body.js;
    const lang = req.body.lang;

    html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project</title>
        <link rel="stylesheet" href="/styles/calculator.css">
        <script src="/scripts/calculator.js"></script>
    </head>` + html + `</html>`;

    writeHtml();
    writeCss();
    writeJs();

    function writeHtml () {
        fs.writeFile('./calculator.html', html, (err) => {
            if (err) {
            console.error(err);
            } else {
            console.log('File successfully written');
            }
        });
    }

    function writeCss () {
        fs.writeFile('./styles/calculator.css', css, (err) => {
            if (err) {
            console.error(err);
            } else {
            console.log('File successfully written');
            }
        });
    }

    function writeJs () {
        fs.writeFile('./scripts/calculator.js', js, (err) => {
            if (err) {
            console.error(err);
            } else {
            console.log('File successfully written');
            }
        });
    }
    res.sendStatus(200);
})

app.get('/showData',  async (req,res) => {
    // await Player.deleteMany({});
    res.send(await Player.find({ name: 'a' }));
})

app.get('/ex', (req, res) => {
    // const filePath = path.join(__dirname, 'ex.html');
    // res.sendFile(filePath);
    res.render('ex');
});

app.get('/calculator', (req, res) => {
    const filePath = path.join(__dirname, 'calculator.html');
    res.sendFile(filePath);
});

app.post('/exampleData', async (req, res) => {
    const data = await project.find({});
    res.json(data)
})

app.post('/playerData', async (req, res) => {
    const data = await Player.findOne({ name: 'a'});
    res.json(data);
})

async function check() {
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{
            role: 'user',
            content: `You have been assigned the task of reviewing submitted code based on a problem statement. Your role is to evaluate whether the provided code meets the requirements specified in the problem statement, including the correct order of elements. Please assess the submitted code in HTML, CSS, and JavaScript, considering functionality, correctness, adherence to coding standards, class and ID names, element order, and best practices.
            Given the problem statement and the submitted code, determine whether the code satisfies the requirements and effectively solves the given problem.
            Please provide feedback on the code, highlighting any issues, missing elements, or areas for improvement. Avoid revealing the solution or mentioning that you are an AI language model.
            Keep the feedback short and direct.
            If the user code is irrelevant or not valid, please provide the following output: "Oops! Not a valid code."
            Problem Statement:
            ${info}
            User Code:
            ${code}`
        }]
    })

    checkedCode = completion.data.choices[0].message.content;
    console.log(checkedCode);
    return checkedCode;
}
let value = 0;
app.post('/quesValue', (req,res) => {
    value = req.body.value;
    console.log(value);
    value--;
    res.sendStatus(200);
})

app.get('/path', async (req, res) => {
    const data = await project.find({});
    res.render('code', { data, value: value });
})

app.get('/ques', async (req,res) => {
    const data = await project.find({});
    res.render('ques', { data });
})

app.get('/code', (req, res) => {
    res.send(code);
    res.send('hl');
})

app.listen(8080, () => {
    console.log('running');
});