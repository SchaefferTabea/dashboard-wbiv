import {mixOfColors} from "./colors.js";

// set the dimensions and margins of the graph
const margin = {top: 20, right: 10, bottom: 130, left: 25};
let width = 460 - margin.left - margin.right;
let height = 495 - margin.top - margin.bottom;

const colorSet = mixOfColors;
const continents = ["Africa", "Asia", "Australia", "Europe", "North-America", "South-America"];

// append the svg object to the body of the page
const svg = d3
    .select("#bubbleChart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



export function makeBubbleChart(dataSet) {
    svg.selectAll("*").remove();
    d3.csv(dataSet).then(function (data) {
        
        // ---------------------------//
        //       AXIS  AND SCALE      //
        // ---------------------------//

        // Add X axis
        const x = d3.scaleLinear().domain([0, 0.6]).range([0, width]);
        let xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(3));

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 30)
            .style("fill", "black")
            .text("Trust in the Goverment");

        // Add Y axis
        const y = d3.scaleLinear().domain([2.5, 8]).range([height, 0]);
        let yAxis = svg.append("g").call(d3.axisLeft(y));

        // Add Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", - 25)
            .attr("y", -10)
            .style("fill", "black")
            .text("Happiness Score")
            .attr("text-anchor", "start");

        // Add a scale for bubble size
        const z = d3.scaleLinear().domain([0, 0.8]).range([1, 15]);

        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg.append("defs").append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

          // Create the scatter variable: where both the circles and the brush take place
        var scatter = svg.append('g')
        .attr("clip-path", "url(#clip)")

        // Add a scale for bubble color
        const myColor = d3.scaleOrdinal().domain(continents).range(colorSet);

        // ---------------------------//
        //      TOOLTIP               //
        // ---------------------------//

        // -1- Create a tooltip div that is hidden by default:
        const tooltip = d3
            .select("body")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip");

        // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
        const showTooltip = function (event, d) {
            tooltip.transition().duration(200);
            tooltip
                .html("<b>Country: " + d.Country + "</b>" +
                "<br> Happiness Score: " + d.happiness_score +
                "<br> Trust in the Goverment: " + d.government_trust +
                "<br> Freedom: " + d.freedom)
                .style("left", event.pageX + 15 + "px")
                .style("top", event.pageY - 28 + "px")
                .transition()
                .duration(400)
                .style("opacity", 0.8);
        };
        const moveTooltip = function (event, d) {
            tooltip.style("left", event.x + 5 + "px").style("top", event.y + 5 + "px");
        };
        const hideTooltip = function (event, d) {
            tooltip.transition().duration(200).style("opacity", 0);
        };

        // ---------------------------//
        //       HIGHLIGHT GROUP      //
        // ---------------------------//

        let countClick = 0;
        let countryClicked = "";
        const highlight = function (event, d) {
            console.log(d);
            if (countClick == 0) {
                d3.selectAll(".bubbles").style("opacity", 0.05);
                countClick = 1;
                countryClicked = d
                d3.selectAll(".label").style("opacity", 0.5).style("font-weight", "normal");
                d3.selectAll("." + d).style("opacity", 1).style("font-weight", "bold");
                
            } else {
                if (countryClicked == d) {
                    d3.selectAll(".bubbles").style("opacity", 0.5);
                    d3.selectAll(".label").style("opacity", 1).style("font-weight", "normal");
                    countClick = 0;
                } else {
                    d3.selectAll(".bubbles").style("opacity", 0.05).style("font-weight", "normal");
                    countClick = 1;
                    countryClicked = d
                    d3.selectAll(".label").style("opacity", 0.5).style("font-weight", "normal");
                    d3.selectAll("." + d).style("opacity", 1).style("font-weight", "bold");
                }
            }
        };

        let countNumberClick = 0;
        let numberClicked = "";

        const highlightFreedome = function (event, d) {

            let newD = d.toString().slice(2)
            newD = "n" + newD;
            console.log(newD);
            if (countNumberClick == 0) {
                countNumberClick = 1;
                numberClicked = newD
                d3.selectAll(".bubbles").style("opacity", 0.05);
                d3.selectAll("." + newD).style("opacity", 1);
                
            } else {
                if (numberClicked == newD) {
                    d3.selectAll(".bubbles").style("opacity",  0.5);
                    countNumberClick = 0;
                } else {
                    countNumberClick = 1;
                    numberClicked = newD
                    d3.selectAll(".bubbles").style("opacity", 0.05);
                    d3.selectAll("." + newD).style("opacity", 1);
                }
            }
        };

        // ---------------------------//
        //       CIRCLES              //
        // ---------------------------//

        // Add dots
        scatter.append("g")
            .selectAll("dot")
            .data(data)
            .join("circle")
            .attr("cx", (d) => x(d.government_trust))
            .attr("cy", (d) => y(d.happiness_score))
            .attr("r", (d) => z(d.freedom))
            .attr("class", (d) => {
                if (d.freedom <= 0.1) {
                    return ("bubbles " + d.continent + " n1")
                } else if ( d.freedom <= 0.4) {
                    return ("bubbles " + d.continent + " n4")
                } else {
                    return ("bubbles " + d.continent + " n8")
                }
            })
            .style("fill", (d) => myColor(d.continent))
            .style("stroke", "#333")
            // Trigger the functions for hover
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip);

        // ---------------------------//
        //       ZOOM              //
        // ---------------------------//

        // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
        var zoom = d3.zoom()
            .scaleExtent([0.8, 5]) 
            .extent([[0, 0], [width, height]])
            .on("zoom", updateChart);
        
        d3.select("#bubbleChart")
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoom);

        // A function that updates the chart when the user zoom and thus new boundaries are available
        function updateChart(event) {

            // recover the new scale
            var newX = event.transform.rescaleX(x);
            var newY = event.transform.rescaleY(y);

            // update axes with these new boundaries
            xAxis.call(d3.axisBottom(newX))
            yAxis.call(d3.axisLeft(newY))

            // update circle position
            scatter
            .selectAll("circle")
            .attr("cx", (d) => {
                return newX(d.government_trust)})
            .attr("cy", (d) => newY(d.happiness_score));
        }


        // ---------------------------//
        //       LEGEND              //
        // ---------------------------//

        // Legend for Freedome
        // Add legend: circles
        const valuesToShow = [0.1, 0.4, 0.8];
        const xCircle = width - width + 340;
        const xLabel = xCircle + 15;
        const yCircle = height + 100;
        svg.selectAll("legend")
            .data(valuesToShow)
            .join("circle")
            .attr("cx", xCircle)
            .attr("cy", (d) => yCircle - z(d))
            .attr("r", (d) => z(d))
            .style("fill", "none")
            .attr("stroke", "black")
            .on("click", highlightFreedome);

        // Add legend: segments
        svg.selectAll("legend")
            .data(valuesToShow)
            .join("line")
            .attr("x1", (d) => xCircle + z(d))
            .attr("x2", (d, i) => xLabel + z(i) + z(d))
            .attr("y1", (d, i) => yCircle - z(d) - i * 5)
            .attr("y2", (d, i) => yCircle - z(d) - i *5)
            .attr("stroke", "black")
            .style("stroke-dasharray", "2.2")
            .on("click", highlightFreedome);

        // Legend title
        svg.append("text")
            .attr("x", xCircle)
            .attr("y", yCircle - 40)
            .text("Freedom")
            .style("fill", "black")
            .attr("text-anchor", "middle")
            .on("click", highlightFreedome);

        // Add legend: labels
        svg.selectAll("legend")
            .data(valuesToShow)
            .join("text")
            .attr("x", (d, i) => xLabel + z(i) + z(d) + 5)
            .attr("y", (d, i) => yCircle - z(d) - i *5)
            .text((d) => d)
            .style("fill", "black")
            .style("font-size", 15)
            .attr("alignment-baseline", "middle")
            .on("click", highlightFreedome);
        
            

        // Legend for continents
        // Add one dot in the legend for each name.
        const size = 20;
        svg.selectAll("myrect")
            .data(continents)
            .join("circle")
            .attr("cx", (d, i) => {
                if (i <= 2) {
                    return (width - width)
                } else {
                    return (width - width + 150)
                }
            })
            .attr("cy", (d, i) => {
                if (i <= 2) {
                    return (height + 60 + i * (size + 5))
                } else {
                    i = i-3
                    return (height + 60 + i * (size + 5))
                }
            })
            .attr("r", 7)
            .attr("class", function (d) {
                return "label " + d;})
            .style("fill", (d) => myColor(d))
            .on("click", highlight);

        // Add labels beside legend dots
        svg.selectAll("mylabels")
            .data(continents)
            .enter()
            .append("text")
            .attr("x", (d, i) => {
                if (i <= 2) {
                    return (width - width + size)
                } else {
                    return (width - width + 150 + size)
                }
            })
            .attr("y", (d, i) => {
                if (i <= 2) {
                    return (height + 60 + i * (size + 5))
                } else {
                    i = i-3
                    return (height + 60 + i * (size + 5))
                }
            })
            .style("fill", (d) => myColor(d))
            .text((d) => d)
            .attr("text-anchor", "left")
            .attr("class", function (d) {
                return "label " + d;})
            .style("alignment-baseline", "middle")
            .on("click", highlight);
    });
}
