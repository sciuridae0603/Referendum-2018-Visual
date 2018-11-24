<template>
    <div id="app">
        <div class="ts container">
            <div class="ts grid">
                <div class="sixteen wide column">
                    <div class="ts stackable secondary menu">
                        <a class="item">首頁</a>
                        <div class="right menu">
                            <div id="btns" class="ts fluid stackable buttons"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ts stackable grid">
                <div class="six wide column">
                    <Country id="map" :stroke="stroke" :scale="scale" :width="width" :height="height" :lon="lon/100" :lat="lat/100" :fill="fill" :fit="fit"></Country>
                </div>
                <div class="ten wide column">
                    <br>
                    <div class="ts fluid medium divided statistics">
                        <div class="statistic">
                            <div class="label" id="AgreeP">0%</div>
                            <div class="value" id="Agree">0</div>
                            <div class="label">同意票數</div>
                        </div>
                        <div class="statistic">
                            <div class="label" id="DisagreeP">0%</div>
                            <div class="value" id="Disagree">0</div>
                            <div class="label">不同意票數</div>
                        </div>
                    </div>
                    <br>
                    <div class="ts fluid medium divided statistics">
                        <div class="statistic">
                            <div class="label" id="EffectiveP">0%</div>
                            <div class="value" id="Effective">0</div>
                            <div class="label">有效票數</div>
                        </div>
                        <div class="statistic">
                            <div class="label" id="InvalidP">0%</div>
                            <div class="value" id="Invalid">0</div>
                            <div class="label">無效票數</div>
                        </div>
                    </div>
                    <br>
                    <div class="ts fluid medium divided statistics">
                        <div class="statistic">
                            <div class="value" id="Votes">0</div>
                            <div class="label">投票數</div>
                        </div>
                        <div class="statistic">
                            <div class="value" id="VotingRights">0</div>
                            <div class="label">投票權人數</div>
                        </div>
                    </div>
                    <br>
                    <div class="ts fluid medium divided statistics">
                        <div class="statistic">
                            <div class="value" id="VoteRate">0</div>
                            <div class="label">投票率(%)</div>
                        </div>
                        <div class="statistic">
                            <div class="value" id="EffectiveVotingRights">0</div>
                            <div class="label">有效同意票數對投票權人數百分比(%)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        Country
    } from "taiwan-vue-components";

    export default {
        name: "app",
        components: {
            Country
        },
        mounted: function() {
            this.resizeHandler()
            window.addEventListener('resize', this.resizeHandler)
        },
        methods: {
            resizeHandler: function() {
                this.width =  window.innerWidth - 30
                this.height = window.innerHeight - 30
            }
        },
        data: {
            fit: true,
            width: 800,
            height: 600,
            lon: 12135,
            lat: 2364,
            stroke: '#000000',
            fill: '#F9F9F9',
            scale: 7800
        }
    };
</script>