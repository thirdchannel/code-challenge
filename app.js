// Ensure Node.js is installed on your system
var fs = require('fs');

if (process.argv.length < 5) {
    console.log('Error: Template file, data file, and output file required.');
    return;
}

const templateFileName = './' + process.argv[2];
const dataFileName = './' + process.argv[3];
const outputFileName = './' + process.argv[4];

const templateFile = fs.readFileSync(templateFileName, 'utf-8')
const dataFile = fs.readFileSync(dataFileName, 'utf-8')
const lines = dataFile.split('\n')
var json = {};

if (!dataFile || lines.length < 1) {
    console.log('Error: No values in data file.');
    return;
}

for (var i = 0; i < lines.length; i++){
    let split = lines[i].split(new RegExp(/=/));
    json[split[0]] = split[1];
}

console.log('Template: \n' + templateFile);
    
var regexVals = [];
var keys = ['name','product','gift','gift-value', 'representative'];

for (var a = 0; a < keys.length; a++){
    if(!json[keys[a]]) {
        console.log('Error: Incomplete data file');
        return;
    } else {   
        let regex = new RegExp(('\\([()]*(\\('+keys[a]+'[^()]*\\)[^()]*)*\\)'));
        regexVals.push(regex);
    }
}

var adjustedText = templateFile;

for (var b = 0; b < regexVals.length; b++){
    let result = adjustedText.replace(regexVals[b], (json[keys[b]]));
    adjustedText = result;
}

let writeStream = fs.createWriteStream(outputFileName);
let buf = Buffer.from(adjustedText, 'utf-8');
writeStream.write(buf);
writeStream.end();

console.log('New File: \n' + adjustedText);


