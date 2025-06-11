const http = require("axios");
const circuit_to_round_map = require("./circuit_image.js");
const express = require("express");

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');


const get_race_name = (res) => {
    const year = res.data.MRData.RaceTable.season;
    const round_num = res.data.MRData.RaceTable.round;
    const race_name = res.data.MRData.RaceTable.Races[0].raceName;
    const title = `${year} ${race_name}, Round ${round_num}`
    return {title, round_num};
};


const get_circuit_map = (round_num) => {
    return circuit_to_round_map[round_num];
};

app.get("/", (req, page_res) => {
    http.get("https://api.jolpi.ca/ergast/f1/current/last/results.json", (res) => {
        console.log("got a response:", res);
    }).then((res) => {
        const {title, round_num} = get_race_name(res);
        page_res.render("results", {url: get_circuit_map(round_num), gp_title: title});
    }).catch((err) => {
        console.log(err);
    });
});

app.listen(3000, () => {
    console.log("litening.....");
});
