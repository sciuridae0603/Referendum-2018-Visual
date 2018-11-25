import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

require('./assets/main.css')

new Vue({
    render: h => h(App),
}).$mount('#app')

var results = {};
var current = {};
var nowPage = "Referendum";
var tempData = {};

function getResults() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            results = JSON.parse(xhr.responseText);
            console.log(results)

            document.getElementById("updateAt").innerHTML = "資料更新於 : " + new Date(results["updateAt"]).toLocaleString('zh-TW', { timeZone: 'UTC' })

            if (nowPage == "Referendum") {
                initReferendum()
            }
            document.getElementById("loader").style.display = "none";
        }
    };
    xhr.open("GET", "results.json", true);
    xhr.send();
}

getResults();

function initReferendum() {

    document.getElementById("navNotice").innerHTML = "公投"
    tempData["Referendum"] = {}
    tempData["nowPos"] = "";
    tempData["Referendum"]["nowCT"] = "";

    for (const key in results["Referendum"]) {
        let btn = document.createElement("button");
        btn.className = "ts button";
        btn.innerHTML = key;
        btn.onclick = () => {
            Array.from(document.getElementsByClassName("ts button")).forEach(btn => {
                btn.className = "ts button"
            })
            tippy('.country').destroyAll();
            btn.className = "ts active button"
            current["Referendum"] = results["Referendum"][key]
            //for(const cy in current["Referendum"]){
            //    tippy('#'+cy, { 
            //        content: `  ${cy} <br><br>
            //                    同意票數 : ${current["Referendum"][cy]["Agree"]}<br>
            //                    不同意票數 : ${current["Referendum"][cy]["Disagree"]}<br>
            //                    有效票數 : ${current["Referendum"][cy]["Effective"]}<br>
            //                    無效票數 : ${current["Referendum"][cy]["Invalid"]}<br>
            //                    投票數 : ${current["Referendum"][cy]["Votes"]}<br>
            //                    投票權人數 : ${current["Referendum"][cy]["VotingRights"]}<br>
            //                    投票率(%) : ${current["Referendum"][cy]["VoteRate"]}%<br>
            //                    有效同意票數對投票權人數百分比(%) : ${current["Referendum"][cy]["EffectiveVotingRights"]}%`,
            //        arrow: true,
            //        arrowType: 'round',
            //        size: 'large',
            //        placement:"right"
            //    })
            //}
            updateReferendumNum(current["Referendum"][tempData["Referendum"]["nowCT"]][tempData["Referendum"]["nowCT"]]);
        }
        document.getElementById("ReferendumBtns").appendChild(btn);
    }

    document.body.onmousedown = () => {
        if (tempData["nowPos"]) {
            tempData["Referendum"]["nowCT"] = tempData["nowPos"];
            updateReferendumNum(current["Referendum"][tempData["Referendum"]["nowCT"]][tempData["Referendum"]["nowCT"]]);
            Array.from(document.getElementsByClassName("country")).forEach(ct => {
                ct.style.fill = "white"
            });
            document.getElementById(tempData["Referendum"]["nowCT"]).style.fill = selectedColor;
        }
    }

    function updateReferendumNum(data) {
        Agree.update(data["Agree"]);
        document.getElementById("AgreeP").innerHTML = Math.round((data["Agree"] / (data["Agree"] + data["Disagree"])) * 100) + "%";
        Disagree.update(data["Disagree"]);
        document.getElementById("DisagreeP").innerHTML = Math.round((data["Disagree"] / (data["Agree"] + data["Disagree"])) * 100) + "%";
        Effective.update(data["Effective"]);
        document.getElementById("EffectiveP").innerHTML = Math.round((data["Effective"] / (data["Effective"] + data["Invalid"])) * 100) + "%";
        Invalid.update(data["Invalid"]);
        document.getElementById("InvalidP").innerHTML = Math.round((data["Invalid"] / (data["Effective"] + data["Invalid"])) * 100) + "%";
        Votes.update(data["Votes"]);
        VotingRights.update(data["VotingRights"]);
        VoteRate.update(data["VoteRate"] + "%");
        EffectiveVotingRights.update(data["EffectiveVotingRights"] + "%");
    }

    var Agree = new Odometer({
        el: document.getElementById("Agree"),
        value: 0,
        format: 'd',
        theme: 'minimal'
    });

    var Disagree = new Odometer({
        el: document.getElementById("Disagree"),
        value: 0,
        format: 'd',
        theme: 'minimal'
    });

    var Effective = new Odometer({
        el: document.getElementById("Effective"),
        value: 0,
        format: 'd',
        theme: 'minimal'
    });

    var Invalid = new Odometer({
        el: document.getElementById("Invalid"),
        value: 0,
        format: 'd',
        theme: 'minimal'
    });

    var Votes = new Odometer({
        el: document.getElementById("Votes"),
        value: 0,
        format: 'd',
        theme: 'minimal'
    });

    var VotingRights = new Odometer({
        el: document.getElementById("VotingRights"),
        value: 0,
        format: 'd',
        theme: 'minimal'
    });

    var VoteRate = new Odometer({
        el: document.getElementById("VoteRate"),
        value: 0,
        format: '',
        theme: 'minimal'
    });

    var EffectiveVotingRights = new Odometer({
        el: document.getElementById("EffectiveVotingRights"),
        value: 0,
        format: '',
        theme: 'minimal'
    });

}


// Mouseover

var selectedColor = "black";
var unselectColor = "white";

Array.from(document.getElementsByClassName("country")).forEach(c => {
    c.style.fill = "white";
    c.addEventListener("mouseover", () => {
        tempData["nowPos"] = c.id;
        c.style.fill = selectedColor;
    })
    c.addEventListener("mouseout", () => {
        if (tempData["Referendum"]["nowCT"] != tempData["nowPos"]) {
            c.style.fill = unselectColor;
        }
        tempData["nowPos"] = "";
    })
})