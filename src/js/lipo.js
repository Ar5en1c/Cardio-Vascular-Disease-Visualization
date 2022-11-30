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
function draw_lipo(data) {
  // Add X axis
  lipo_svg.selectAll("*").remove();

  data = data.map(function (d) {
    return {
      TC_HDL: d.TC_HDL,
      LDL_HDL: d.LDL_HDL,
      Lipoprotein_Risk: d.Lipoprotein_Risk,
    };
  });

  const lipo_x = d3.scaleLinear().domain([0, 10]).range([0, lipo_width]);
  lipo_svg
    .append("g")
    .attr("transform", `translate(0, ${lipo_height})`)
    .call(d3.axisBottom(lipo_x));

  // Add Y axis
  const lipo_y = d3.scaleLinear().domain([0, 10]).range([lipo_height, 0]);
  lipo_svg.append("g").call(d3.axisLeft(lipo_y));

  // Color scale: give me a specie name, I return a color
  const color = d3
    .scaleOrdinal()
    .domain(["LOW", "MODERATE", "HIGH", "VERY HIGH", "SEVERE"])
    .range(["#ea698b", "#c05299", "#973aa8", "#6d23b6", "#571089"]);

  // highlight_lipo the specie that is hovered
  const highlight_lipo = function (event, d) {
    s_group = d.Lipoprotein_Risk;

    d3.selectAll(".dot_lipo")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 3);

    d3.selectAll("." + s_group)
      .transition()
      .duration(200)
      .style("fill", color(s_group))
      .attr("r", 7);
  };

  // highlight_lipo the specie that is hovered
  const doNothighlight_lipo = function (event, d) {
    d3.selectAll(".dot_lipo")
      .transition()
      .duration(200)
      .style("fill", (d) => color(d.Lipoprotein_Risk))
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
      return "dot_lipo " + d.Lipoprotein_Risk;
    })
    .attr("cx", function (d) {
      return lipo_x(d.TC_HDL);
    })
    .attr("cy", function (d) {
      return lipo_y(d.LDL_HDL);
    })
    .attr("r", 5)
    .style("fill", function (d) {
      return color(d.Lipoprotein_Risk);
    })
    .on("mouseover", highlight_lipo)
    .on("mouseleave", doNothighlight_lipo);

  lipo_svg
    .append("circle")
    .attr("cx", 350)
    .attr("cy", 15)
    .attr("r", 7)
    .style("fill", "#900000");
  lipo_svg
    .append("text")
    .attr("x", 365)
    .attr("y", 15)
    .text("SEVERE")
    .attr("fill", "white")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

  lipo_svg
    .append("circle")
    .attr("cx", 350)
    .attr("cy", 30)
    .attr("r", 7)
    .style("fill", "#ee2400");
  lipo_svg
    .append("text")
    .attr("x", 365)
    .attr("y", 30)
    .text("VERY HIGH")
    .attr("fill", "white")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

  lipo_svg
    .append("circle")
    .attr("cx", 350)
    .attr("cy", 45)
    .attr("r", 7)
    .style("fill", "#FFA500");
  lipo_svg
    .append("text")
    .attr("x", 365)
    .attr("y", 45)
    .text("HIGH")
    .attr("fill", "white")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

  lipo_svg
    .append("circle")
    .attr("cx", 350)
    .attr("cy", 60)
    .attr("r", 7)
    .style("fill", "#FFF200");
  lipo_svg
    .append("text")
    .attr("x", 365)
    .attr("y", 60)
    .text("MODERATE")
    .attr("fill", "white")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

  lipo_svg
    .append("circle")
    .attr("cx", 350)
    .attr("cy", 75)
    .attr("r", 7)
    .style("fill", "#39e75f");
  lipo_svg
    .append("text")
    .attr("x", 365)
    .attr("y", 75)
    .text("LOW")
    .attr("fill", "white")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");
}
