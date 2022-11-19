ranges = [
  // https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings
  {
    label: "Stage 2",
    systolic: 150,
    diastolic: 105,
    color: "red",
    x: 50,
    y: 145,
  },
  {
    label: "Stage 1",
    systolic: 140,
    diastolic: 90,
    color: "orange",
    x: 50,
    y: 135,
  },
  {
    label: "Elevated",
    systolic: 130,
    diastolic: 80,
    color: "yellow",
    x: 50,
    y: 125,
  },
  {
    label: "Normal",
    systolic: 120,
    diastolic: 80,
    color: "lightgreen",
    x: 50,
    y: 110,
  },
  {
    label: "Low",
    systolic: 90,
    diastolic: 60,
    color: "lightblue",
    x: 50,
    y: 80,
  },
];

async function draw() {
  const dataset = await d3.csv("/js/hypertension_sample.csv");
  const xAccessor = (d) => Number(d.SYSTOLIC_PRESSURE);
  const yAccessor = (d) => Number(d.DIASTOLIC_PRESSURE);

  let dimensions = {
    width: 400,
    height: 400,
    margin: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    },
  };

  dimensions.containerWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.containerHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const svg = d3
    .select("#blood_pressure")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const container = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margin.left}, ${dimensions.margin.top})`
    );

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .clamp(true)
    .range([0, dimensions.containerWidth]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .clamp(true)
    .range([dimensions.containerHeight, 0]);

  container
    .selectAll("circle")
    .data(dataset)
    .join("circle")
    .attr("r", 5)
    .attr("fill", "red")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)));

  // Axes
  const xAxis = d3.axisBottom(xScale);

  const xAxisGroup = container
    .append("g")
    .call(xAxis)
    .style("transform", `translateY(${dimensions.containerHeight}px)`)
    .classed("axis", true);

  // already positioned at bottom
  xAxisGroup
    .append("text")
    .attr("x", dimensions.containerWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .text("Systolic (mmHg)");

  const yAxis = d3.axisLeft(yScale);

  const yAxisGroup = container.append("g").call(yAxis).classed("axis", true);

  yAxisGroup
    .append("text")
    .attr("x", -dimensions.containerHeight / 2)
    .attr("y", -dimensions.margin.left + 15)
    .attr("fill", "black")
    .html("Diastolic (mmHg)")
    .style("transform", "rotate(270deg)")
    .style("text-anchor", "middle");
}

draw();
