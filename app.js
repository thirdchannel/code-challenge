
const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const Parser = require('./parser.js');

const argv = yargs
    //set up values
    .option('templatePath', {
        alias: 't',
        description: 'Path to the template you want to parse',
        type: 'string',
        demandOption:true,
        count:0
    })
    .option('dataPath', {
        alias: 'd',
        description: 'Path to the data you want to interpolate',
        type: 'string',
        demandOption:true
    })
    .option('outputPath', {
        alias: 'o',
        description: 'Path to where you want to output a file',
        type: 'string',
        demandOption:true
    })
    .help()
    .alias('help', 'h')
    .argv;

    //read the template file
    fs.readFile(path.join(__dirname,argv.templatePath),(err,templateString)=>{
        
        templateString = templateString.toString('utf-8');
        //read input file
        fs.readFile(path.join(__dirname,argv.dataPath),(err,data)=>{
            
            //parse data file
            var templateData = Parser.dataParser(data.toString('utf-8'));
            

            //apply data to template
            var templateResult = Parser.templateParser(templateString,templateData);

            //begin output
            var dataPathChunks = argv.dataPath.split('/');
            var outputFileName = dataPathChunks[dataPathChunks.length-1];
            var outputDirectory = path.join(__dirname,argv.outputPath);
            var outputPath = path.join(outputDirectory,outputFileName);
            
            //overwrite file?
            if (!fs.existsSync(outputDirectory)) {
                fs.mkdir(outputDirectory),{mode:777},(err)=>{
                    if (err) throw err;
                    fs.writeFile(outputPath, templateResult, (err) => {
                        if (err) throw err;
                        console.log('The file has been saved!');
                    });
                };
            }else{
                fs.writeFile(outputPath, templateResult, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            }
        });

    });
    