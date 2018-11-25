const getReferendumData = require("./data/referendum.js");
const urls = require("../urls.json");
const fs = require("fs");

var needed = 0;
var done = 0;
var running = {}
var results = {};

function getCount(Data){
    tmp = 0;
    for(const CaseName in Data){
        if (typeof Data[CaseName] == 'string' || Data[CaseName] instanceof String) {
            tmp++;
        } else {
            tmp = tmp + getCount(Data[CaseName]);
        }
    }
    return(tmp)
}

function addResult(Name , Func , Data){
    console.log(`[Info] ${Name} Processing....`);
    needed++;
    var tmp = {};
    tmp["Data"] = Data;
    tmp["Count"] = getCount(tmp["Data"]);
    tmp["Done"] = 0;
    running[Name] = tmp;
    Func(running[Name])
}

var owo = setInterval(() => {
    for (const Name in running){
        console.log(`[Info] ${Name} Progressing.....${Math.round((running[Name]["Done"] / running[Name]["Count"])*100)}%`)
        if(running[Name]["Count"] == running[Name]["Done"]){
            results[Name] = running[Name]["Data"];
            done++
            delete running[Name]
            console.log(`[Info] ${Name} Done!`)
        }
    }
    if (done == needed){
        console.log("[Info] All done ! Writing File...")
        fs.writeFile("../results.json",JSON.stringify(results,null,2),'utf8',()=>{})        
        clearInterval(owo)
    }
},300)


addResult("Referendum",getReferendumData,urls["Referendum"])