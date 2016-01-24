var runApp = function () {
    d3.select("#app")
        .append("svg")
        .attr("width", 50)
        .attr("height", 50)
        .append("circle")
        .attr("cx", 25)
        .attr("cy", 25)
        .attr("r", 25)
        .style("fill", "purple");
};


