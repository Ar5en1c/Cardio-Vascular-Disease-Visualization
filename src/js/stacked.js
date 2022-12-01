// set the dimensions and margins of the graph
const margin_sb = { top: 50, right: 50, bottom: 60, left: 50 },
  width_sb = 500 - margin_sb.left - margin_sb.right,
  height_sb = 320 - margin_sb.top - margin_sb.bottom;

// append the svg object to the body of the page
const svgStacked = d3
  .select("#stack_plot")
  .append("svg")
  .attr("width", width_sb + margin_sb.left + margin_sb.right)
  .attr("height", height_sb + margin_sb.top + margin_sb.bottom)
  .append("g")
  .attr("transform", `translate(70,70)`);

svgStacked
  .append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", width_sb - 180)
  .attr("y", height_sb + 35)
  .text("Centers")
  .attr("fill", "white");

svgStacked
  .append("text")
  .attr("class", "y label")
  .attr("text-anchor", "end")
  .attr("y", -60)
  .attr("x", -70)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("Count")
  .attr("fill", "white");

// Parse the Data
async function draw_stacked() {
  // List of subgroups = header of the csv files = soil condition here
  dataset_stack = await d3.csv("./data/stacked_data.csv");
  var subgroups = ["Juvenile", "Adult", "Elderly"];

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = dataset_stack.map((d) => d.CENTER_ID);

  // Add X axis
  const x = d3.scaleBand().domain(groups).range([0, width_sb]).padding([0.1]);
  svgStacked
    .append("g")
    .attr("transform", `translate(0, ${height_sb})`)
    .call(d3.axisBottom(x).tickSizeOuter(-1));

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 1000]).range([height_sb, 15]);
  svgStacked.append("g").call(d3.axisLeft(y));

  // color palette = one color per subgroup
  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["#e8486d", "#43c1cc", "#ff6536"]);

  //stack the data? --> stack per subgroup
  const stackedData = d3.stack().keys(subgroups)(dataset_stack);

  // ----------------
  // Create a stkd_tooltip
  // ----------------
  const stkd_tooltip = d3
    .select("#stack_plot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .attr("style", "position: absolute; opacity: 0;")
    .style("background-color", "#333333")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  // Three function that change the stkd_tooltip when user hover / move / leave a cell
  const mouseover_stkd = function (event, d) {
    const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d.data[subgroupName];

    stkd_tooltip
      .style("opacity", 1)
      .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
      .style("left", event.x / 2 + "px")
      .style("top", event.y / 1.8 + "px");
  };
  const mousemove_stkd = function (event, d) {
    stkd_tooltip
      .style("left", event.x + "px")
      .style("top", event.y + 10 + "px");
  };
  const mouseleave_stkd = function (event, d) {
    stkd_tooltip.style("opacity", 0);
  };

  // Show the bars
  svgStacked
    .append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data((d) => d)
    .join("rect")
    .attr("x", (d) => x(d.data.CENTER_ID))
    .attr("y", (d) => y(d[1]))
    .attr("height", (d) => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .attr("stroke", "grey")
    .on("mouseover", mouseover_stkd)
    .on("mousemove", mousemove_stkd)
    .on("mouseleave", mouseleave_stkd);

  svgStacked
    .append("text")
    .attr("x", width_sb / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .attr("fill", "white")
    .style("text-decoration", "underline")
    .text("CVD Diseases Distribution vs centers");

  // Handmade legend
  svgStacked
    .append("rect")
    .attr("x", 350)
    .attr("y", 10)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "#ff6536");
  svgStacked
    .append("rect")
    .attr("x", 350)
    .attr("y", 30)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "#43c1cc");
  svgStacked
    .append("text")
    .attr("x", 370)
    .attr("y", 15)
    .attr("fill", "white")
    .text("Elderly")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  svgStacked
    .append("text")
    .attr("x", 370)
    .attr("y", 35)
    .text("Adult")
    .attr("fill", "white")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");

  svgStacked
    .append("rect")
    .attr("x", 350)
    .attr("y", 50)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "#e8486d");
  svgStacked
    .append("text")
    .attr("x", 370)
    .attr("y", 55)
    .text("Juvenile")
    .attr("fill", "white")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
}

draw_stacked();
