const referendum2018urls = require("./referendum2018urls.json");
const request = require("request")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var fs = require('fs');

var results = {};

var count = 0;
var done = 0;

for (const CaseName in referendum2018urls){
    for(const CountyName in referendum2018urls[CaseName]){
        count++;
    }
}

function getByCase(CaseName){
    results["Referendum"][CaseName] = {};
    for(const CountyName in referendum2018urls[CaseName]){
        request({
            url: referendum2018urls[CaseName][CountyName]
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const dom = new JSDOM(body);
                let resp = Array.from(dom.window.document.querySelectorAll("#divContent > table > tbody > tr:nth-child(4) > td > table > tbody > tr.trT > td")).map(x => x.innerHTML.replace(/,/g,""));
                results["Referendum"][CaseName][CountyName] = {};
                results["Referendum"][CaseName][CountyName]["Agree"] = parseInt(resp[0]);
                results["Referendum"][CaseName][CountyName]["Disagree"] = parseInt(resp[1]);
                results["Referendum"][CaseName][CountyName]["Effective"] = parseInt(resp[2]);
                results["Referendum"][CaseName][CountyName]["Invalid"] = parseInt(resp[3]);
                results["Referendum"][CaseName][CountyName]["Votes"] = parseInt(resp[4]);
                results["Referendum"][CaseName][CountyName]["VotingRights"] = parseInt(resp[5]);
                results["Referendum"][CaseName][CountyName]["VoteRate"] = parseFloat(resp[6].replace("%",""));
                results["Referendum"][CaseName][CountyName]["EffectiveVotingRights"] = parseFloat(resp[7].replace("%",""));
                console.log(CaseName,CountyName,"Done");
                done++;
                if(done == count){
                    fs.writeFile("results.json",JSON.stringify(results),'utf8',()=>{})
                }
            }                
        })
    }
}

results["Referendum"] = {};

for (const CaseName in referendum2018urls){
    console.log(CaseName)
    getByCase(CaseName)
}

