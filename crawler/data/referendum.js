const request = require("request")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var fs = require('fs');

// Setting
var ShowRequestInfo = true;

var OrigData = null;

function getReferendumData(Data){
    OrigData = Data;
    processURL(OrigData["Data"]);
}

function processURL(Data){
    for(const CaseName in Data){
        if (typeof Data[CaseName] == 'string' || Data[CaseName] instanceof String) {
            Data[CaseName] = sendRequest(Data,CaseName,Data[CaseName]);
        } else {
            Data[CaseName] = processURL(Data[CaseName]);
        }
    }
    return(Data)
}

function sendRequest(Data,Name,URL){
    request({
        url: URL,
        timeout:5000
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const dom = new JSDOM(body);
            let resp = Array.from(dom.window.document.querySelectorAll("#divContent > table > tbody > tr:nth-child(4) > td > table > tbody > tr.trT > td")).map(x => x.innerHTML.replace(/,/g,""));
            Data[Name] = {};
            Data[Name]["Agree"] = parseInt(resp[0]);
            Data[Name]["Disagree"] = parseInt(resp[1]);
            Data[Name]["Effective"] = parseInt(resp[2]);
            Data[Name]["Invalid"] = parseInt(resp[3]);
            Data[Name]["Votes"] = parseInt(resp[4]);
            Data[Name]["VotingRights"] = parseInt(resp[5]);
            Data[Name]["VoteRate"] = parseFloat(resp[6].replace("%",""));
            Data[Name]["EffectiveVotingRights"] = parseFloat(resp[7].replace("%",""));
            OrigData["Done"]++;
        }else{
            sendRequest(Data,Name,URL)
        }
    })
}

module.exports = getReferendumData;