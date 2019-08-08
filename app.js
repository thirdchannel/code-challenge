// Ensure Node.js is installed
const fs = require("fs");

// Finds keys inside ((double-parentheses))
const dblPrn = new RegExp(/\([()]*(\([^()]*\)[^()]*)*\)/gim);
const templateFile = fs.readFileSync(('./' + process.argv[2])).toString();
const dataFile = fs.readFileSync(0).toString();
const matches = templateFile.match(dblPrn);
const keysAndVals = dataFile.split(new RegExp(/=|\n/gmi));

var keys = [], json = {}, regexVals = [];

matches.forEach(i => {
  let result = i.replace(new RegExp(/\(\(|\)\)/gim), "");
  keys.push(result);
});

// Separates Key/Value pairs and creates JSON
for (var i = 0; i < keysAndVals.length; i++) {
  if (!keysAndVals[i] || keysAndVals[i] == '' || keysAndVals[i].length < 2) keysAndVals.splice(i, 1);
  if (!keysAndVals[i]) continue;
    //after this point we've determined that the key/value pair does exist
  const trimmedKey = keysAndVals[i].replace(new RegExp(/\s|\n/g), "");
  i++;
  if (!keysAndVals[i] || keysAndVals[i] == '') keysAndVals.splice(i, 1);
  if (!keysAndVals[i]) continue;
  const trimmedVal = keysAndVals[i].replace(new RegExp(/^\s+|\s+$/g), "")
  json[trimmedKey] = trimmedVal;
}

for (var a = 0; a < keys.length; a++) {
  let regex = new RegExp("\\(\\(" + keys[a] + "\\)\\)");
  regexVals.push(regex);
}

var adjustedText = templateFile;

for (var b = 0; b < regexVals.length; b++) {
  if (!json[keys[b]]) {
    process.stdout.write('')
    return;
  }
  let result = adjustedText.replace(regexVals[b], json[keys[b]]);
  adjustedText = result;
}
process.stdout.write(adjustedText)

