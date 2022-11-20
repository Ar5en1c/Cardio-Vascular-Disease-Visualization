var dataset = [5, 10, 4, 7, 8, 12, 15, 3, 16, 18, 7, 19, 14, 7];
// var totalHeight = 100;

var margin = {
    top: 10,
    bottom: 30,
    left: 50,
    right: 20,
  },
  width = parseInt(d3.select("#animated_barplot").style("width")),
  mapRatio = 0.8,
  totalHeight = 300;

var yScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset)])
  .range([0, totalHeight / 1.2]);

var colorScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset) / 2, d3.max(dataset)])
  .range(["#e89f84", "#BF4E24", "#6c2c14"]);

var svg = d3
  .select("#animated_barplot")
  .append("svg")
  .attr("width", width)
  .attr("height", totalHeight);

var bars = svg
  .selectAll(".bars")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "bars")
  .attr("width", 15)
  .attr("height", 0)
  .attr("x", function (d, i) {
    return i * 30;
  })
  .attr("y", totalHeight)
  .style("fill", function (d) {
    return colorScale(d);
  });

bars
  .on("mouseover", function (d) {
    d3.select(this).style("fill", "#D3D3D3");
  })
  .on("mouseout", function (d) {
    d3.select(this)
      .transition()
      .duration(600)
      .style("fill", function (d) {
        return colorScale(d);
      });
  });

bars
  .transition()
  .duration(500)
  .delay(function (d, i) {
    return i * 200;
  })
  .attr("y", function (d) {
    return totalHeight - yScale(d);
  })
  .attr("height", function (d) {
    return yScale(d);
  });
