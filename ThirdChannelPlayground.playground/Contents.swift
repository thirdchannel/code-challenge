//: A Cocoa based Playground to present user interface

import AppKit
import PlaygroundSupport

//let nibFile = NSNib.Name("MyView")
//var topLevelObjects : NSArray?
//
//Bundle.main.loadNibNamed(nibFile, owner:nil, topLevelObjects: &topLevelObjects)
//let views = (topLevelObjects as! Array<Any>).filter { $0 is NSView }
//
//// Present the view in Playground
//PlaygroundPage.current.liveView = views[0] as! NSView

func readAFile(_ fileName : String) -> (String,String)
{
    let filePath = Bundle.main.path(forResource: fileName, ofType: "txt")
    let content: String = try! String(contentsOfFile: filePath!, encoding: .utf8)
    var workString = content.replacingOccurrences(of: ".", with: "")
    //workString = workString.replacingOccurrences(of: ",", with: " ")
    workString = workString.replacingOccurrences(of: "\n", with: "#")
    
    return (content, workString)
}

func readA2File(_ fileName : String) -> (String,[String])
{
    var workingStrArray : [String] = []
    let filePath = Bundle.main.path(forResource: fileName, ofType: "txt")
    let content: String = try! String(contentsOfFile: filePath!, encoding: .utf8)
    var workString = content.replacingOccurrences(of: ".", with: "")
    //workString = workString.replacingOccurrences(of: ",", with: " ")
    workString = workString.replacingOccurrences(of: "\n", with: "#")
    let tempArry = workString.split(separator: "#")
    for subStr in tempArry
    {
        workingStrArray.append(String(subStr))
    }
    
    return (content, workingStrArray)
}

func validateTemplate(_ aCandidate : String) -> (Bool, Bool)
{
    var aTemplate = false
    var isValidTemplate = false
    if aCandidate.contains("(")
    {
        aTemplate = true
        let leftCount = aCandidate.filter { $0 == "(" }.count
        let rightCount = aCandidate.filter { $0 == ")" }.count
        if leftCount == rightCount
        {
            isValidTemplate = true
        }
    }
    return (aTemplate, isValidTemplate)
}

func extractTemplate(_ aTemplate : String) -> String
{
    let theKey = aTemplate.split(separator: ",")
    return String(theKey[1])
}

func collectTemplates(_ wordArray : [String]) -> [String]
{
    var theTemplates : [String] = []
    
    for candidate in wordArray
    {
        let theResult = validateTemplate(candidate)
        if theResult.0
        {
            if theResult.1
            {
                theTemplates.append(candidate)
            }
        }
    }
    return theTemplates
    
}

func dataKeyValue(_ aData : String) -> (String, String)
{
    let someStrs = aData.split(separator: "=")

    
    return (String(someStrs[0]), String(someStrs[1]))
}

func mergeData (_ theTemplates : [String], _ data : [(String,Int)], _ theKeys : [(String, Int)]) -> [(String,Int)]
{
    var mergedData : [(String,Int)] = []
    var outerCounter = 0
    for aTemplate in theTemplates
    {
        let tempTemplate = extractTemplate(aTemplate)
        var theAnswer = ""
        var counter = 0
        for aKey in theKeys
        {
            if tempTemplate.contains(aKey.0)
            {
                let anAnswer =  data[aKey.1]
                theAnswer = aTemplate.replacingOccurrences(of: tempTemplate, with: anAnswer.0)
                mergedData.append((theAnswer,aKey.1))
            }
            counter += 1
        }
        outerCounter += 1
    }
    return mergedData
}

let template = readA2File("Template")
let data = readAFile("Data")
let dataArray = data.1.split(separator: ",")
var theMergeAnswers : [(String, Int)] = []
var theMergeKeys : [(String, Int)] = []
var counter = 0
for splitor in dataArray
{
    let tempAnswer = String(splitor.split(separator: "=")[1])
    let anAnswer = tempAnswer.replacingOccurrences(of: "#", with:"")
    let keyTemp = String(splitor.split(separator: "=")[0])
    let theKey = keyTemp.replacingOccurrences(of: "#", with:"")
    theMergeAnswers.append((anAnswer,counter))
    theMergeKeys.append((theKey, counter))
    counter += 1
}

let splitTemplate = template.1.split(separator: " ")

let isolatedTemplates = collectTemplates(template.1)
let temper1 = template.1
let aMerge = mergeData(isolatedTemplates, theMergeAnswers, theMergeKeys)

print("A Merge \(aMerge)")


