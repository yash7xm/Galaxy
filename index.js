import { Configuration, OpenAIApi } from "openai";
import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.API_KEY
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(bodyParser.json());
app.use(cors());

let code = '';
app.post('/dog', async(req,res) => {
    code  = req.body.code;
    await check();
    res.sendStatus(200);
})

async function check() {
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{
            role: 'user', 
            content: `'${code}' check if this code is creating a new div with class name as header and adding a list with 4 li items in it, only response in yes or no`
        }]
    })

    let checkedCode = completion.data.choices[0].message.content
    console.log(checkedCode);
}



app.get('/code', (req,res) => {
    res.send(code);
    res.send('hl');
})


app.listen(8080, () => {
    console.log('running');
});