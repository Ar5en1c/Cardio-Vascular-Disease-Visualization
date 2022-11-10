let radarData = [];
let features = [
  "Albumin",
  "Creatine",
  "Hemoglboin",
  "Weight",
  "Systolic",
  "Diastolic",
];
//generate the data
for (var i = 0; i < 3; i++) {
  var point = {};
  //each feature will be a random number from 1-9
  features.forEach((f) => (point[f] = 1 + Math.random() * 8));
  radarData.push(point);
}

var margin = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  width = parseInt(d3.select("#radar_plot").style("width")),
  mapRatio = 0.75,
  height = width * mapRatio;

let radarSvg = d3
  .select("#radar_plot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

let radialScale = d3.scaleLinear().domain([0, 10]).range([0, 160]);
let ticks = [2, 4, 6, 8, 10];

ticks.forEach((t) =>
  radarSvg
    .append("circle")
    .attr("cx", 250)
    .attr("cy", 200)
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("r", radialScale(t))
);

ticks.forEach((t) =>
  radarSvg
    .append("text")
    .attr("x", 255)
    .attr("y", 200 - radialScale(t))
    .text(t.toString())
);

function angleToCoordinate(angle, value) {
  let x = Math.cos(angle) * radialScale(value);
  let y = Math.sin(angle) * radialScale(value);
  return { x: 250 + x, y: 200 - y };
}

for (var i = 0; i < features.length; i++) {
  let ft_name = features[i];
  let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
  let line_coordinate = angleToCoordinate(angle, 10);
  let label_coordinate = angleToCoordinate(angle, 10.5);

  //draw axis line
  radarSvg
    .append("line")
    .attr("x1", 250)
    .attr("y1", 200)
    .attr("x2", line_coordinate.x)
    .attr("y2", line_coordinate.y)
    .attr("stroke", "black");

  //draw axis label
  radarSvg
    .append("text")
    .attr("x", label_coordinate.x)
    .attr("y", label_coordinate.y)
    .text(ft_name);
}

let line = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y);
let colors = ["darkorange", "gray", "navy"];

function getPathCoordinates(data_point) {
  let coordinates = [];
  for (var i = 0; i < features.length; i++) {
    let ft_name = features[i];
    let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
    coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
  }
  return coordinates;
}

for (var i = 0; i < radarData.length; i++) {
  let d = radarData[i];
  let color = colors[i];
  let coordinates = getPathCoordinates(d);

  //draw the path element
  radarSvg
    .append("path")
    .datum(coordinates)
    .attr("d", line)
    .attr("stroke-width", 3)
    .attr("stroke", color)
    .attr("fill", color)
    .attr("stroke-opacity", 1)
    .attr("opacity", 0.5);
}
