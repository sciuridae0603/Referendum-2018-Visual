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

function ReferendumRequest(CaseName,CountyName,RegionName){
    request({
        url: voteurls["Referendum"][CaseName][CountyName][RegionName],
        timeout:5000
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const dom = new JSDOM(body);
            let resp = Array.from(dom.window.document.querySelectorAll("#divContent > table > tbody > tr:nth-child(4) > td > table > tbody > tr.trT > td")).map(x => x.innerHTML.replace(/,/g,""));
            results["Referendum"][CaseName][CountyName][RegionName] = {};
            results["Referendum"][CaseName][CountyName][RegionName]["Agree"] = parseInt(resp[0]);
            results["Referendum"][CaseName][CountyName][RegionName]["Disagree"] = parseInt(resp[1]);
            results["Referendum"][CaseName][CountyName][RegionName]["Effective"] = parseInt(resp[2]);
            results["Referendum"][CaseName][CountyName][RegionName]["Invalid"] = parseInt(resp[3]);
            results["Referendum"][CaseName][CountyName][RegionName]["Votes"] = parseInt(resp[4]);
            results["Referendum"][CaseName][CountyName][RegionName]["VotingRights"] = parseInt(resp[5]);
            results["Referendum"][CaseName][CountyName][RegionName]["VoteRate"] = parseFloat(resp[6].replace("%",""));
            results["Referendum"][CaseName][CountyName][RegionName]["EffectiveVotingRights"] = parseFloat(resp[7].replace("%",""));
            console.log("Referendum",CaseName,CountyName,RegionName,"Done","      " + ( count["Referendum"] - done["Referendum"]) + " Left");
            done["Referendum"]++;
            if(done["Referendum"] == count["Referendum"]){
                fs.writeFile("results.json",JSON.stringify(results),'utf8',()=>{})
            }
        }else{
            ReferendumRequest(CaseName,CountyName,RegionName)
        }
    })
}

function getReferendum(CaseName){
    results["Referendum"][CaseName] = {};
    for(const CountyName in voteurls["Referendum"][CaseName]){
        results["Referendum"][CaseName][CountyName] = {}
        for(const RegionName in voteurls["Referendum"][CaseName][CountyName]){
            ReferendumRequest(CaseName,CountyName,RegionName)
        }
    }
}

for (const CaseName in voteurls["Referendum"]){
    for(const CountyName in voteurls["Referendum"][CaseName]){
        for(const RegionName in voteurls["Referendum"][CaseName][CountyName]){
            count["Referendum"]++;
        }
    }
}

for (const CaseName in voteurls["Referendum"]){
    getReferendum(CaseName)
}

var waitInt = setInterval(() => {
    var done = true;
    for(const Name in count){
        if(count[Name] != done[Name]){
            done = false;
        }
    }
    if(done){clearInterval(waitInt)}
},10)