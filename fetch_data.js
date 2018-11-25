const voteurls = require("./voteurls.json");
const request = require("request")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var fs = require('fs');

var results = {};

var count = {};
var done = {};

// Referendum

count["Referendum"] = 0;
done["Referendum"] = 0;
results["Referendum"] = {};

function getReferendum(CaseName){
    results["Referendum"][CaseName] = {};
    for(const CountyName in voteurls["Referendum"][CaseName]){
        request({
            url: voteurls["Referendum"][CaseName][CountyName]
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
                console.log("Referendum",CaseName,CountyName,"Done");
                done++;
                if(done["Referendum"] == count["Referendum"]){
                    fs.writeFile("results.json",JSON.stringify(results),'utf8',()=>{})
                }
            }                
        })
    }
}

for (const CaseName in voteurls["Referendum"]){
    for(const CountyName in voteurls["Referendum"][CaseName]){
        count["Referendum"]++;
    }
}

for (const CaseName in voteurls["Referendum"]){
    console.log(CaseName)
    getReferendum(CaseName)
}
