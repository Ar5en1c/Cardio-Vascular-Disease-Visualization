var line_margin = { top: 50, right: 50, bottom: 40, left: 50 },
          line_width = 400,
          line_height = 300;
const line_svg = d3.select("#linegraph").append("svg");
function draw_cood(data) {
  line_svg.selectAll("*").remove();
  data = data.map(function (d) {
    return {
      albumin: d.microalbuminuria,
      creatinine: d.creatinine,
      hemoglobin: d.glycated_hemoglobin,
      triglycerides: d.triglycerides,
      age_group: d.age_group,
    };
  });
  line_svg
    .attr("width", 500)
    .attr("height", 320)
    .append("g")
    .attr("transform", `translate(60,60)`);

  // line_color scale: give me a specie name, I return a line_color
  const line_color = d3
    .scaleOrdinal()
    .domain(["Juvenile", "Adult", "Elderly"])
    .range(["#e8486d", "#43c1cc", "#ff6536"]);

  // Here I set the list of dimension manually to control the order of axis:
  dimensions = ["albumin", "creatinine", "hemoglobin", "triglycerides"];

  // For each dimension, I build a linear scale. I store all in a y object
  const y = {};

  y["albumin"] = d3.scaleLinear().domain([0, 850]).range([300, 50]);

  y["creatinine"] = d3.scaleLinear().domain([0, 5]).range([300, 50]);

  y["hemoglobin"] = d3.scaleLinear().domain([0, 700]).range([300, 50]);

  y["triglycerides"] = d3.scaleLinear().domain([0, 1300]).range([300, 50]);

  // Build the X scale -> it find the best position for each Y axis
  const x = d3
    .scalePoint()
    .range([50, line_width + 50])
    .domain(dimensions);

  // Highlight the specie that is hovered

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
    return d3.line()(
      dimensions.map(function (p) {
        return [x(p), y[p](d[p])];
      })
    );
  }

  // Draw the lines
  line_svg
    .selectAll("myPath")
    .data(data)
    .join("path")
    .attr("class", function (d) {
      return "line " + d.age_group;
    }) // 2 class for each line: 'line' and the group name
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", function (d) {
      return line_color(d.age_group);
    })
    .style("opacity", 0.7);
  // .on("mouseover", highlight)
  // .on("mouseleave", doNotHighlight);

  // Draw the axis:
  line_svg
    .selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "axis")
    // I translate this element to its right position on the x axis
    .attr("transform", function (d) {
      return `translate(${x(d)})`;
    })
    // And I build the axis with the call function
    .each(function (d) {
      d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d]));
    })
    // Add axis title
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", 40)
    .text(function (d) {
      return d;
    })
    .style("fill", "white");

  line_svg
    .append("text")
    .attr("x", 500 / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .attr("fill", "white")
    .text("Protien Levels vs Age Group");
}
