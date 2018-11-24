import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

require('./assets/main.css')

new Vue({
  render: h => h(App),
}).$mount('#app')

var results = {};
var current = {};

var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(xhr.responseText);
        console.log(data)
        for(const key in data["Referendum"]){
            let btn = document.createElement("button");
            btn.className = "ts button";
            btn.innerHTML = key;
            btn.onclick = () => {
                Array.from(document.getElementsByClassName("ts button")).forEach(btn => {btn.className = "ts button"})
                tippy('.country').destroyAll();
                btn.className = "ts active button"
                current = data["Referendum"][key]
                //for(const cy in current){
                //    tippy('#'+cy, { 
                //        content: `  ${cy} <br><br>
                //                    同意票數 : ${current[cy]["Agree"]}<br>
                //                    不同意票數 : ${current[cy]["Disagree"]}<br>
                //                    有效票數 : ${current[cy]["Effective"]}<br>
                //                    無效票數 : ${current[cy]["Invalid"]}<br>
                //                    投票數 : ${current[cy]["Votes"]}<br>
                //                    投票權人數 : ${current[cy]["VotingRights"]}<br>
                //                    投票率(%) : ${current[cy]["VoteRate"]}%<br>
                //                    有效同意票數對投票權人數百分比(%) : ${current[cy]["EffectiveVotingRights"]}%`,
                //        arrow: true,
                //        arrowType: 'round',
                //        size: 'large',
                //        placement:"right"
                //    })
                //}
                updateNum(current[nowCT]);
            }
            document.getElementById("btns").appendChild(btn);
        }
    }
};
xhr.open("GET", "results.json", true);
xhr.send();

var nowPos = "";
var nowCT = "";

var selectedColor = "black";
var unselectColor = "white";

document.body.onmousedown = () => {
    if(nowPos){
        nowCT = nowPos;
        updateNum(current[nowCT]);
        Array.from(document.getElementsByClassName("country")).forEach(ct => {ct.style.fill = "white"});
        document.getElementById(nowCT).style.fill = selectedColor;
    }
}

Array.from(document.getElementsByClassName("country")).forEach(c => {
    c.style.fill = "white";
    c.addEventListener("mouseover",() => {
        nowPos = c.id;
        c.style.fill = selectedColor;
    })
    c.addEventListener("mouseout",() => {
        if(nowCT != nowPos){
            c.style.fill = unselectColor;
        }
        nowPos = "";
    })
})

function updateNum(data){
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
    VoteRate.update(data["VoteRate"]+"%");
    EffectiveVotingRights.update(data["EffectiveVotingRights"]+"%");
}

var Agree = new Odometer({el: document.getElementById("Agree"),value: 0,format: 'd',theme: 'minimal'});
var Disagree = new Odometer({el: document.getElementById("Disagree"),value: 0,format: 'd',theme: 'minimal'});
var Effective = new Odometer({el: document.getElementById("Effective"),value: 0,format: 'd',theme: 'minimal'});
var Invalid = new Odometer({el: document.getElementById("Invalid"),value: 0,format: 'd',theme: 'minimal'});
var Votes = new Odometer({el: document.getElementById("Votes"),value: 0,format: 'd',theme: 'minimal'});
var VotingRights = new Odometer({el: document.getElementById("VotingRights"),value: 0,format: 'd',theme: 'minimal'});
var VoteRate = new Odometer({el: document.getElementById("VoteRate"),value: 0,format: '',theme: 'minimal'});
var EffectiveVotingRights = new Odometer({el: document.getElementById("EffectiveVotingRights"),value: 0,format: '',theme: 'minimal'});