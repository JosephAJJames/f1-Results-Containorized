const http = require("axios");
const express = require("express");
const helpers = require("./ejs-helpers.js")

const app = express();
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views', './views');

const get_race_name = (res) => {
    const year = res.data.MRData.RaceTable.season;
    const round_num = res.data.MRData.RaceTable.round;
    const race_name = res.data.MRData.RaceTable.Races[0].raceName;
    const title = `${year} ${race_name}, Round ${round_num}`
    return {title, round_num};
};


const race_results_array = (res) => {
    return res.data.MRData.RaceTable.Races[0].Results;
};

const get_circuit_map = (round_num) => {
    return circuit_to_round_map[round_num];
};

app.get("/", (req, page_res) => {
    http.get("https://api.jolpi.ca/ergast/f1/current/last/results.json", (res) => {
        console.log("got a response:", res);
    }).then((res) => {
        const {title, round_num} = get_race_name(res);
        const race_results = race_results_array(res);

        page_res.render("results", {round_num, gp_title: title, results: race_results, helpers});
    }).catch((err) => {
        console.log(err);
    });
});

app.listen(3000, () => {
    console.log("litening.....");
});