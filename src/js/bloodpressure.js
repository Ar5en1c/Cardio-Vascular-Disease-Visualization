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
  bld_svg.selectAll("*").remove();
  data = data.map(function (d) {
    return {
      systolic: d.systolic,
      diastolic: d.diastolic,
      BP_Risk: d.BP_Risk,
    };
  });

  const x = d3.scaleLinear().domain([60, 230]).range([0, bld_width]);
  const xAxis = bld_svg
    .append("g")
    .attr("transform", `translate(0, ${bld_height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 220]).range([bld_height, 0]);
  bld_svg.append("g").call(d3.axisLeft(y));

  // Color scale: give me a specie name, I return a color
  const color = d3
    .scaleOrdinal()
    .domain([
      "Normal",
      "pre-hypertension",
      "hypertension grade 1",
      "hypertension grade 2",
      "hypertension grade 3",
    ])
    .range(["#39e75f", "#FFF200", "#FFA500", "#ee2400", "#900000"]);

  // Add a clipPath: everything out of this area won't be drawn.
  const clip = bld_svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", bld_width)
    .attr("height", bld_height)
    .attr("x", 0)
    .attr("y", 0);

  bld_svg
    .append("circle")
    .attr("cx", 350)
    .attr("cy", 0)
    .attr("r", 7)
    .style("fill", "#900000");
  bld_svg
    .append("text")
    .attr("x", 365)
    .attr("y", 0)
    .text("Hypertension 3")
    .attr("fill", "white")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

  bld_svg
    .append("circle")
    .attr("cx", 350)
    .attr("cy", 15)
    .attr("r", 7)
    .style("fill", "#ee2400");
  bld_svg
    .append("text")
    .attr("x", 365)
    .attr("y", 15)
    .text("Hypertension 2")
    .attr("fill", "white")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

  bld_svg
    .append("circle")
    .attr("cx", 350)
    .attr("cy", 30)
    .attr("r", 7)
    .style("fill", "#FFA500");
  bld_svg
    .append("text")
    .attr("x", 365)
    .attr("y", 30)
    .text("Hypertension 1")
    .attr("fill", "white")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

  bld_svg
    .append("circle")
    .attr("cx", 350)
    .attr("cy", 45)
    .attr("r", 7)
    .style("fill", "#FFF200");
  bld_svg
    .append("text")
    .attr("x", 365)
    .attr("y", 45)
    .text("Pre-hypertension")
    .attr("fill", "white")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

  bld_svg
    .append("circle")
    .attr("cx", 350)
    .attr("cy", 60)
    .attr("r", 7)
    .style("fill", "#39e75f");
  bld_svg
    .append("text")
    .attr("x", 365)
    .attr("y", 60)
    .text("Normal")
    .attr("fill", "white")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

  // Add brushing
  const brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [bld_width, bld_height],
    ])
    .on("end", updateChart);

  // Create the scatter variable: where both the circles and the brush take place
  const scatter = bld_svg.append("g").attr("clip-path", "url(#clip)");

  // Add circles
  scatter
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
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
    .style("opacity", 1);

  // Add the brushing
  scatter.append("g").attr("class", "brush").call(brush);

  // A function that set idleTimeOut to null
  var idleTimeout;
  function idled() {
    idleTimeout = null;
  }

  // A function that update the chart for given boundaries
  function updateChart(event) {
    extent = event.selection;

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
      x.domain([4, 8]);
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      scatter.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and circle position
    xAxis.transition().duration(1000).call(d3.axisBottom(x));
    scatter
      .selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return x(d.systolic);
      })
      .attr("cy", function (d) {
        return y(d.diastolic);
      });

    // If user double click, reinitialize the chart
    bld_svg.on("dblclick", function () {
      x.domain([60, 230]);
      xAxis.transition().call(d3.axisBottom(x));
      scatter
        .selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", function (d) {
          return x(d.systolic);
        })
        .attr("cy", function (d) {
          return y(d.diastolic);
        });
    });
  }
  bld_svg
    .append("text")
    .attr("x", bld_width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .attr("fill", "white")
    .style("text-decoration", "underline")
    .text("Bloodpressure Distrbution");

  bld_svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -45)
    .attr("x", -80)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Diastolic")
    .attr("fill", "white");

  bld_svg
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("y", 250)
    .attr("x", 180)
    .attr("dy", ".75em")
    .text("Systolic")
    .attr("fill", "white");
}
