import {mainOrange, mixOfColors} from "./colors.js";

// Request data using D3
export function makeBarChart(dataSet) {
    d3.csv(dataSet).then(makeChart);
}

let char;

function makeChart(data) {
    // Bar chart
    const ctx = document.getElementById("barChart");

    let gdpData = data.map((d) => {
        let gdp = Math.round(d.gdp_per_capita * 100) / 100;
        return gdp;
    });
    let happinessData = data.map((d) => {
        let happiness = Math.round(d.happiness_score * 100) / 100;
        return happiness;
    });

    let healthData = data.map((d) => {
        let health = Math.round(d.health * 100) / 100;
        return health;
    });

    let generosityData = data.map((d) => {
        let generosity = Math.round(d.generosity * 100) / 100;
        return generosity;
    });

    let socialSupportData = data.map((d) => {
        let socialSupport = Math.round(d.social_support * 100) / 100;
        return socialSupport;
    });

    let countries = data.map((d) => {
        return d.Country;
    });

    // check if char is allready drawn
    if (char != null) {
        char.destroy();
    }

    char = new Chart(ctx, {
        type: "bar",
        data: {
            labels: happinessData,
            datasets: [
                {
                    label: "Generosity",
                    data: generosityData,
                    backgroundColor: mixOfColors[5],
                },
                {
                    label: "GDP per capita",
                    data: gdpData,
                    backgroundColor: mixOfColors[3],
                },
                {
                    label: "Life expectancy",
                    data: healthData,
                    backgroundColor: mixOfColors[1],
                },
                {
                    label: "Social Support",
                    data: socialSupportData,
                    backgroundColor: mixOfColors[0],
                },
            ],
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    stacked: true,
                },
                y: {
                    grid: {
                        display:false
                    },
                    display: true,
                    title: {
                        display: true,
                        text: "Happiness Score",
                        font: {
                            family: "Calibri",
                            size: 15,
                            style: "normal",
                            lineHeight: 1,
                        },
                        padding: {top: 10, left: 0, right: 0, bottom: 0},
                    },
                    ticks: {
                        maxTicksLimit: 8,
                    },
                    stacked: true,
                },
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    backgroundColor: "#fff",
                    titleColor: "#000",
                    bodyColor: "#000",
                    callbacks: {
                        title: (context) => {
                            let title = countries[context[0].dataIndex];
                            return title;
                        },
                    },
                },
            },
        },
    });
}