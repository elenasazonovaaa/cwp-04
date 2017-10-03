// client.js
const net = require('net');
const fs = require('fs');
const port = 3001;

let questions = [];
let correct = [];
let qNumber = 0;

const client = new net.Socket();
client.setEncoding('utf8');

client.connect(port, function() {
    console.log('Connected');
    client.write('QA');
});

client.on('data', function(data,err) {
    if(err) console.log('Error in get data');
    else
    {
        if(data === 'ASC')
        {
            console.log('WOW!Server ASC!');
            getJSON();
        }
        if(data === 'DSC')
        {
            console.log('Server DSC!');
            client.destroy();
        }
    }
});
client.on('data',function (data,err) {
    if(err) console.log('Error in client get data');
    else
    {
        if(data !== 'ASC' && data !== 'DSC')
        {
            console.log('-------------------------');
            if(data.toString() === correct[qNumber - 1].toString())
            {
                console.log(questions[qNumber-1].toString());
                console.log(`Client ans: ` + correct[qNumber - 1].toString());
                console.log(`Server ans: ` + data.toString() + ` ---true`);
            }
            else
            {
                console.log(questions[qNumber-1].toString());
                console.log(`Client ans: ` + correct[qNumber - 1].toString());
                console.log(`Server ans: ` + data.toString() + ` ---false`);
            }
            if(qNumber < questions.length)
                client.write(questions[qNumber++].toString());
            else client.destroy();
        }
    }
});

client.on('close', function() {
    console.log('Connection closed');
});
function getJSON()
{
    fs.readFile('qa.json',function (err,data) {
        if(err) console.log('Error in read JSON');
        else
        {
            let json = JSON.parse(data);
            for(let i = 0; i < json.length;i++)
            {
                questions[i] = json[i].question;
                correct[i] = json[i].correct;
            }
            correct.sort((a,b)=>{
                if(Date.now()%2 === 0) return a;
                else return b;
            });
            client.write(questions[qNumber++].toString());
        }
    })
}
