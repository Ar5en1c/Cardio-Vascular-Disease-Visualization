// set the dimensions and bbl_margins of the graph
const bbl_margin = { top: 50, right: 50, bottom: 50, left: 50 },
  bbl_width = 500 - bbl_margin.left - bbl_margin.right,
  bbl_height = 320 - bbl_margin.top - bbl_margin.bottom;

// append the bbl_svg object to the body of the page
const bbl_svg = d3
  .select("#bubble")
  .append("svg")
  .attr("width", bbl_width + bbl_margin.left + bbl_margin.right)
  .attr("height", bbl_height + bbl_margin.top + bbl_margin.bottom)
  .append("g")
  .attr("transform", `translate(100, 60)`);

//read data
d3.csv("./data/dis_data.csv").then(function (data) {
  // Get the different categories and count them
  const categories = [
    "HYPERTENSION",
    "DIABETES",
    "HIGH CHOLESTEROL",
    "OBESITY",
    "RENAL",
  ];
  const n = categories.length;

  // Compute the mean of each group
  allMeans = [];
  for (i in categories) {
    currentGroup = categories[i];
    mean = d3.mean(data, function (d) {
      return +d[currentGroup];
    });
    allMeans.push(mean);
  }

  // Create a color scale using these means.
  const myColor = d3
    .scaleSequential()
    .domain([0, 4])
    .interpolator(d3.interpolateViridis);

  // Add X axis
  const x = d3.scaleLinear().domain([-10, 120]).range([0, bbl_width]);
  bbl_svg
    .append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + bbl_height + ")")
    .call(
      d3.axisBottom(x).tickValues([0, 25, 50, 75, 100]).tickSize(-bbl_height)
    )
    .select(".domain")
    .remove();

  // Add X axis label:
  bbl_svg
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", bbl_width - 200)
    .attr("y", bbl_height + 30)
    .text("Age")
    .attr("fill", "white");

  // Create a Y scale for densities
  const y = d3.scaleLinear().domain([0, 0.25]).range([bbl_height, 0]);

  // Create the Y axis for names
  const yName = d3
    .scaleBand()
    .domain(categories)
    .range([0, bbl_height])
    .paddingInner(1);
  bbl_svg
    .append("g")
    .call(d3.axisLeft(yName).tickSize(0))
    .style("font-size", "9px")
    .select(".domain")
    .remove();

  // Compute kernel density estimation for each column:
  const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)); // increase this 40 for more accurate density.
  const allDensity = [];
  for (i = 0; i < n; i++) {
    key = categories[i];
    density = kde(
      data.map(function (d) {
        return d[key];
      })
    );
    allDensity.push({ key: key, density: density });
  }

  // Add areas
  bbl_svg
    .selectAll("areas")
    .data(allDensity)
    .join("path")
    .attr("transform", function (d) {
      return `translate(0, ${yName(d.key) - bbl_height})`;
    })
    .attr("fill", function (d) {
      grp = d.key;
      index = categories.indexOf(grp);
      value = allMeans[index];
      return myColor(index);
    })
    .datum(function (d) {
      return d.density;
    })
    .attr("opacity", 0.7)
    .attr("stroke", "#000")
    .attr("stroke-width", 0.1)
    .attr(
      "d",
      d3
        .line()
        .curve(d3.curveBasis)
        .x(function (d) {
          return x(d[0]);
        })
        .y(function (d) {
          return y(d[1]);
        })
    );

  bbl_svg
    .append("text")
    .attr("x", (bbl_width - bbl_margin.right) / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .attr("fill", "white")
    .style("text-decoration", "underline")
    .text("CVD Diseases Distribution vs Age");
});

// This is what I need to compute kernel density estimation
function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map(function (x) {
      return [
        x,
        d3.mean(V, function (v) {
          return kernel(x - v);
        }),
      ];
    });
  };
}
function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}
