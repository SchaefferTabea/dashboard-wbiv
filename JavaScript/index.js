import {makeBarChart} from "./barChart.js";
import {makeBubbleChart} from "./bubbleChart.js";
import {makeWorldMap} from "./worldMap.js";
let ele = document.getElementsByClassName("year");

export function getData() {
    let data = "Data/world_happiness_report_2020.csv";
    for (let i = 0; i < ele.length; i++) {
        if (ele[i].checked)
            if (ele[i].value == "2015") {
                data = "Data/world_happiness_report_2015.csv";
            } else if (ele[i].value == "2016") {
                data = "Data/world_happiness_report_2016.csv";
            } else if (ele[i].value == "2017") {
                data = "Data/world_happiness_report_2017.csv";
            } else if (ele[i].value == "2018") {
                data = "Data/world_happiness_report_2018.csv";
            } else if (ele[i].value == "2019") {
                data = "Data/world_happiness_report_2019.csv";
            } else if (ele[i].value == "2020") {
                data = "Data/world_happiness_report_2020.csv";
            }
    }

    return data;
}

changeYear();

[...ele].forEach((year) => {
    year.addEventListener("click", changeYear);
});

export function changeYear() {
    let dataSet = getData();
    makeBarChart(dataSet);
    makeBubbleChart(dataSet);
    makeWorldMap(dataSet);
}
