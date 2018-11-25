

const request = require("request");
const fs = require("fs");

const ReferendumURL_JS = "http://referendum.2018.nat.gov.tw/pc/zh_TW/js/treeFF.js";
const ReferendumURL_Base = "http://referendum.2018.nat.gov.tw/pc/zh_TW/";

var finalResults = {};
var results = {};
var nowTop = "";
var nowC = "";

const funcs = `

function padding (s, p) {
	return(p.substr(0,(p.length-s.length))+s.toString());
}

function checkOrder(){return("n")}
function insDoc(a){return("n")}
function insFld(a){return("n")}
function gFld(a,b,c){
    if(a.includes("案") && a.includes("第") ){nowTop = a; results[nowTop] = {}; nowC = a;}else{nowC = a;}
    if(results[nowTop]){results[nowTop][nowC] = {}; results[nowTop][nowC][nowC] = ReferendumURL_Base + b.replace("../","")}
}
function gLnk(a,b,c){
    if(results[nowTop]){results[nowTop][nowC][b] = ReferendumURL_Base + c.replace("../","")}
}
`

const end = `
`
console.log("[Info] Processing Referendum")
request({
    url: ReferendumURL_JS
}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        eval(funcs+body+end);
        finalResults["Referendum"] = results;
        console.log("[Info] Referendum Done")
        fs.writeFile("./urls.json",JSON.stringify(finalResults),"utf8",()=>{})

    }
})