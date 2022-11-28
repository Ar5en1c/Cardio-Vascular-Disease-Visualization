// set the dimensions and margins of the graph
// const margin = { top: 10, right: 30, bottom: 30, left: 60 },
//   width = 460 - margin.left - margin.right,
//   height = 400 - margin.top - margin.bottom;

// append the bubble_svg object to the body of the page
const bubble_svg = d3
  .select("#bubble")
  .append("svg")
  .attr("width", 500)
  .attr("height", 300)
  .append("g")
  .attr("transform", `translate(50,50)`);

//Read the data
d3.csv("./data/trend.csv").then(function (data) {
  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, (d) => d.SEX); // nest function allows to group the calculation per level of a factor

  // Add X axis --> it is a date format
  const x = d3
    .scaleLinear()
    .domain(
      d3.extent(data, function (d) {
        return String(d.year);
      })
    )
    .range([0, width]);
  bubble_svg
    .append("g")
    .attr("transform", `translate(0,200)`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d.count;
      }),
    ])
    .range([200, 0]);
  bubble_svg.append("g").call(d3.axisLeft(y));

  // color palette
  const color = d3.scaleOrdinal().range(["#FF50EC", "#3361FF"]);

  // Create a bbl_tooltip
  // ----------------
  const bbl_tooltip = d3
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

  // Three function that change the bbl_tooltip when user hover / move / leave a cell
  const mouseover_bbl = function (event, d) {
    // const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d[0];
    // console.log("testing", subgroupValue);
    bbl_tooltip.transition().duration(100);
    bbl_tooltip
      .style("opacity", 1)
      .html("Gender: " + subgroupValue)
      .style("left", event.x / 2 + "px")
      .style("top", event.y / 2 + 30 + "px");
  };
  const mousemove_bbl = function (event, d) {
    bbl_tooltip.style("left", event.x + "px").style("top", event.y + 10 + "px");
  };
  const mouseleave_bbl = function (event, d) {
    bbl_tooltip.transition().duration(800).style("opacity", 0);
  };

  bubble_svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .attr("fill", "white")
    .style("text-decoration", "underline")
    .text("Number of Cases vs year");

  // Draw the line
  bubble_svg
    .selectAll(".line")
    .data(sumstat)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", function (d) {
      return color(d[0]);
    })
    .attr("stroke-width", 1.5)
    .attr("d", function (d) {
      return d3
        .line()
        .x(function (d) {
          return x(d.year);
        })
        .y(function (d) {
          return y(+d.count);
        })(d[1]);
    })
    .on("mouseover", mouseover_bbl)
    .on("mousemove", mousemove_bbl)
    .on("mouseleave", mouseleave_bbl);
});
