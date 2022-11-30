// set the dimensions and bld_margins of the graph
const bld_margin = { top: 50, right: 50, bottom: 40, left: 50 },
  bld_width = 500 - bld_margin.left - bld_margin.right,
  bld_height = 320 - bld_margin.top - bld_margin.bottom;

// append the bld_svg object to the body of the page
const bld_svg = d3
  .select("#blood_pressure")
  .append("svg")
  .attr("width", bld_width + bld_margin.left + bld_margin.right)
  .attr("height", bld_height + bld_margin.top + bld_margin.bottom)
  .append("g")
  .attr("transform", `translate(${bld_margin.left}, ${bld_margin.top})`);

function draw_bp(data) {
  // Add X axis
  bld_svg.selectAll("*").remove()
  data = data.map(function (d) {
    return {
      systolic: d.systolic,
      diastolic: d.diastolic,
      BP_Risk: d.BP_Risk,
    };
  });

  const x = d3.scaleLinear().domain([60, 230]).range([0, bld_width]);
  bld_svg
    .append("g")
    .attr("transform", `translate(0, ${bld_height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 220]).range([bld_height, 0]);
  bld_svg.append("g").call(d3.axisLeft(y));

  // Color scale: give me a specie name, I return a color
  const color = d3
    .scaleOrdinal()
    .domain(["Normal", "pre-hypertension", "hypertension grade 1","hypertension grade 2","hypertension grade 3"])
    .range(["#39e75f", "#FFF200", "#FFA500", "#ee2400", "#900000"]);

  // highlit the specie that is hovered
  const highlit = function (event, d) {
    selected_group = d.BP_Risk;

    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 3);

    d3.selectAll("." + selected_group)
      .transition()
      .duration(200)
      .style("fill", color(selected_group))
      .attr("r", 7);
  };

  // highlit the specie that is hovered
  const doNothighlit = function (event, d) {
    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", (d) => color(d.BP_Risk))
      .attr("r", 5);
  };

  // Add dots
  bld_svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", function (d) {
      return "dot " + d.BP_Risk;
    })
    .attr("cx", function (d) {
      return x(d.systolic);
    })
    .attr("cy", function (d) {
      return y(d.diastolic);
    })
    .attr("r", 5)
    .style("fill", function (d) {
      return color(d.BP_Risk);
    })
    .on("mouseover", highlit)
    .on("mouseleave", doNothighlit);
};
