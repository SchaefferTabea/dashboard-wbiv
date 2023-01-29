import {orangeRange} from "./colors.js";

// The svgMap
const svgMap = d3.select("#worldMap");
let widthMap = +svgMap.attr("width");
let heightMap = +svgMap.attr("height");

const path = d3.geoPath();

// Map and projection
const projection = d3
    .geoMercator()
    .scale(100)
    .center([0, 25])
    .translate([widthMap / 2, heightMap / 2]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold().domain([1, 4, 5, 6, 7]).range(orangeRange);
let world;

const tooltipMap = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

export function makeWorldMap(dataSet) {
    svgMap.selectAll("*").remove();

    Promise.all([
        d3.json(
            "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
        ),
        d3.csv(dataSet, function (d) {
            data.set(d.Country, +d.happiness_score);
        }),
    ]).then(function (loadData) {
        let topo = loadData[0];

        let mouseOver = function (event, d) {
            d3.selectAll(".Country")
                .transition()
                .duration(100)
                .style("opacity", 0.5)
                .style("stroke", "#B87100");
            d3.select(this).transition().duration(100).style("opacity", 1).style("stroke", "black");
            tooltipMap
                .html("<b>Country: "  + d.properties.name + "</b>" +
                "<br> Happiness Score: " + d.total)
                .style("left", event.pageX + 15 + "px")
                .style("top", event.pageY - 28 + "px")
                .transition()
                .duration(400)
                .style("opacity", 0.8);
        };

        let mouseLeave = function (d) {
            d3.selectAll(".Country").transition().duration(100).style("opacity", 1);
            d3.select(this).transition().duration(100).style("stroke", "#B87100");
            tooltipMap.transition().duration(200).style("opacity", 0);
        };

        // Draw the map
        world = svgMap.append("g").attr("class", "world");
        world
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            // draw each country
            .attr("d", d3.geoPath().projection(projection))
            // set the color of each country
            .attr("fill", function (d) {
                d.total = data.get(d.properties.name) || 0;
                return colorScale(d.total);
            })
            .style("stroke", "#B87100")
            .attr("class", function (d) {
                return "Country";
            })
            .style("opacity", 1)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave);


        // Legend
        const x = d3.scaleLinear().domain([0, 8]).rangeRound([600, 860]);

        const legend = svgMap.append("g").attr("id", "legend");

        const legend_entry = legend
            .selectAll("g.legend")
            .data(
                colorScale.range().map(function (d) {
                    d = colorScale.invertExtent(d);
                    if (d[0] == null) d[0] = x.domain()[0];
                    if (d[1] == null) d[1] = x.domain()[1];
                    return d;
                })
            )
            .enter()
            .append("g")
            .attr("class", "legend_entry");

        const ls_w = 20,
            ls_h = 20;

        legend_entry
            .append("rect")
            .attr("x", 20)
            .attr("y", function (d, i) {
                return heightMap - i * ls_h - 2 * ls_h - 20;
            })
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", function (d) {
                return colorScale(d[0]);
            })
            .style("opacity", 1);

        legend_entry
            .append("text")
            .attr("x", 50)
            .attr("y", function (d, i) {
                return heightMap - i * ls_h - ls_h - 6 - 20;
            })
            .text(function (d, i) {
                if (i === 0) return "< " + d[1];
                if (d[1] < d[0]) return d[0];
                return d[0] + " - " + d[1];
            });

        // Title Legend
        legend
            .append("text")
            .attr("x", 15)
            .attr("y", heightMap - 175)
            .text("Happiness Score");
    });
}
