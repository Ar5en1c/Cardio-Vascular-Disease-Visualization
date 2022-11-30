// set the dimensions and lipo_margins of the graph
const lipo_margin = { top: 50, right: 50, bottom: 40, left: 50 },
  lipo_width = 500 - lipo_margin.left - lipo_margin.right,
  lipo_height = 320 - lipo_margin.top - lipo_margin.bottom;

// append the lipo_svg object to the body of the page
const lipo_svg = d3
  .select("#lipo")
  .append("svg")
  .attr("width", lipo_width + lipo_margin.left + lipo_margin.right)
  .attr("height", lipo_height + lipo_margin.top + lipo_margin.bottom)
  .append("g")
  .attr("transform", `translate(${lipo_margin.left}, ${lipo_margin.top})`);

//Read the data
d3.csv(
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
).then(function (data) {
  // Add X axis
  const lipo_x = d3.scaleLinear().domain([4, 8]).range([0, lipo_width]);
  lipo_svg
    .append("g")
    .attr("transform", `translate(0, ${lipo_height})`)
    .call(d3.axisBottom(lipo_x));

  // Add Y axis
  const lipo_y = d3.scaleLinear().domain([0, 9]).range([lipo_height, 0]);
  lipo_svg.append("g").call(d3.axisLeft(lipo_y));

  // Color scale: give me a specie name, I return a color
  const color = d3
    .scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica"])
    .range(["#440154ff", "#21908dff", "#fde725ff"]);

  // highlight_lipo the specie that is hovered
  const highlight_lipo = function (event, d) {
    selected_specie = d.Species;

    d3.selectAll(".dot_lipo")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 3);

    d3.selectAll("." + selected_specie)
      .transition()
      .duration(200)
      .style("fill", color(selected_specie))
      .attr("r", 7);
  };

  // highlight_lipo the specie that is hovered
  const doNothighlight_lipo = function (event, d) {
    d3.selectAll(".dot_lipo")
      .transition()
      .duration(200)
      .style("fill", (d) => color(d.Species))
      .attr("r", 5);
  };

  // Add dot_lipos
  lipo_svg
    .append("g")
    .selectAll("dot_lipo")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", function (d) {
      return "dot_lipo " + d.Species;
    })
    .attr("cx", function (d) {
      return lipo_x(d.Sepal_Length);
    })
    .attr("cy", function (d) {
      return lipo_y(d.Petal_Length);
    })
    .attr("r", 5)
    .style("fill", function (d) {
      return color(d.Species);
    })
    .on("mouseover", highlight_lipo)
    .on("mouseleave", doNothighlight_lipo);
});
