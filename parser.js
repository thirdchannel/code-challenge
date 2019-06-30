module.exports.templateParser=(templateString,templateData)=>{
    var customTagsRegex = /\(\((#[a-z]+ )?[a-z]+.[a-z]*\)\)/g;
    try{
        var renderedTemplate = templateString.replace(customTagsRegex,(m,n)=>{
            var variableName = m.replace('((','').replace('))','');
            if(!templateData[variableName]){
                throw('no variable');
            }
            return templateData[variableName];
        });
    }catch(e){
        return "";
    }
    return renderedTemplate;
}
module.exports.dataParser=(data)=>{
    
    var lines = data.split(/\r?\n/);
    var dataValue = {};
    for(let line of lines){
        if(line.length){
            var keyValuePair = line.split('=');
            dataValue[keyValuePair[0].trim()]=keyValuePair[1].trim();
        }
    }
    return dataValue;
}
