const getReferendumData = require("./urls/referendum.js");
const fs = require("fs");

var needed = 0;
var done = 0;
var results = {};

function addResult(Name , Func){
    console.log(`[URL] ${Name} Processing....`);
    needed++;
    Func.then(res => {
        results[Name] = res;
        done++;
        console.log(`[URL] ${Name} Done!`);
    })
}


var owo = setInterval(() => {
    if (done == needed){
        console.log("[URL] All done !")
        fs.writeFile("../urls.json",JSON.stringify(results,null,2),'utf8',()=>{})        
        clearInterval(owo)
    }
},100)


addResult("Referendum",getReferendumData())