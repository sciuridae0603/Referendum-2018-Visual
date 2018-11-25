
const request = require('then-request');

const ReferendumURL_JS = "http://referendum.2018.nat.gov.tw/pc/zh_TW/js/treeFF.js";
const ReferendumURL_Base = "http://referendum.2018.nat.gov.tw/pc/zh_TW/";

var results = {};
var nowCase = "";
var nowCounty = "";
var nowRegion = "";

const funcs = `
function padding (s, p) {
	return(p.substr(0,(p.length-s.length))+s.toString());
}
function checkOrder(){return("n")}
function insDoc(a){return("n")}
function insFld(a){return("n")}
function gFld(a,b,c){
    if(b){
        if(a.includes("第") && a.includes("案")){
            nowCase = a;
            results[nowCase] = {};
        }
        nowCounty = a;
        if(nowCase == nowCounty){
            results[nowCase][nowCounty] = b.replace("../",ReferendumURL_Base);
        }else{
            results[nowCase][nowCounty] = {}
            results[nowCase][nowCounty][nowCounty] = b.replace("../",ReferendumURL_Base);
        }
    }
}
function gLnk(a,b,c){
    if(results[nowCase]){
        results[nowCase][nowCounty][b] = c.replace("../",ReferendumURL_Base);
    }
}
` 

const end = `
`

function getReferendumData(){
    return request('GET', ReferendumURL_JS).then(res =>  {
        eval(funcs+res.getBody()+end);
        return(results)
    })
}

module.exports = getReferendumData