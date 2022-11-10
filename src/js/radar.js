dataset = [4, 2, 5, 7, 8, 9, 2, 6, 3, 3, 10];

getTheta = (dataset) => (Math.PI * 2) / dataset.length;

isWithin = (min, max) => (value) => value >= min && value <= max;

drawAxis = (dataset, scale) => (selection) => {
  selection
    .append("g")
    .attr("class", "axis")
    .selectAll(".tick")
    .data(d3.range(d3.max(dataset) + 1))
    .join("circle")
    .attr("class", "tick")
    .attr("r", (d, i) => scale(i))
    .attr("fill", "lightgrey")
    .attr("fill-opacity", 0.2)
    .attr("stroke", "lightgrey")
    .attr("stroke-width", 0.5);
};

drawGuideLines = (dataset, r) => (selection) => {
  selection
    .selectAll(".guideline")
    .data(dataset)
    .join("line")
    .attr("class", "guideline")
    .attr("x1", 0)
    .attr("x2", (d, i) => r * Math.sin(getTheta(dataset) * i))
    .attr("y1", 0)
    .attr("y2", (d, i) => r * -Math.cos(getTheta(dataset) * i))
    .attr("stroke", "white")
    .attr("stroke-width", 1);
};

drawLabels = (dataset, r) => (selection) => {
  const arc = d3
    .arc()
    .innerRadius(r + 10)
    .outerRadius(r + 10);
  selection
    .selectAll(".arc")
    .data(dataset)
    .join("path")
    .attr("class", "arc")
    .attr("id", (d, i) => `arc-${i}`)
    .attr("fill", "red")
    .attr("fill-opacity", 0.5)
    .attr("d", (d, i) =>
      arc({
        startAngle: i * getTheta(dataset),
        endAngle: (i + 1) * getTheta(dataset),
      })
    );
  selection
    .append("g")
    .attr("style", `transform: rotate(-${getTheta(dataset) / 2}rad)`)
    .selectAll("text")
    .data(dataset)
    .join("text")
    .attr("font-size", 8)
    .attr("text-anchor", "middle")
    .attr("dy", 3)
    .append("textPath")
    .attr("startOffset", (d, i) =>
      isWithin(
        (90 * Math.PI) / 180,
        (270 * Math.PI) / 180
      )(i * getTheta(dataset))
        ? "75%"
        : "25%"
    )
    .attr("xlink:href", (d, i) => `#arc-${i}`)
    .text((d, i) => `Value[${i}] ${d}`);
};

drawPolygon = (dataset, scale) => (selection) => {
  const polygon = d3
    .radialLine()
    .angle((_, i) => i * getTheta(dataset) + Math.PI)
    .curve(d3.curveCardinalClosed)
    .radius((d, i) => scale(d));
  selection
    .append("path")
    .attr("d", polygon(dataset))
    .attr("stroke", "lightgrey")
    .attr("stroke-width", 0.5)
    .attr("fill", "Teal")
    .attr("fill-opacity", 0.5)
    .attr("transform", `rotate(180)`);
};

drawMarks = (dataset, scale) => (selection) => {
  selection
    .selectAll(".mark")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "mark")
    .attr("cx", (d, i) => scale(d) * Math.sin(getTheta(dataset) * i))
    .attr("cy", (d, i) => scale(d) * -Math.cos(getTheta(dataset) * i))
    .attr("fill", "Teal")
    .attr("r", 2);
};

{
  const width = 300;
  const height = 300;
  //   const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  const viz = d3
    .select(".div2")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const r = 80;

  const scale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, r]);

  viz
    .call(drawAxis(dataset, scale))
    .call(drawGuideLines(dataset, r))
    .call(drawLabels(dataset, r))
    .call(drawPolygon(dataset, scale))
    .call(drawMarks(dataset, scale));

  //   return svg.node();
}
