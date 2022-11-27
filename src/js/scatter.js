// Dimension of the whole chart. Only one size since it has to be square
const marginWhole = { top: 50, right: 50, bottom: 50, left: 50 },
  sizeWhole = 500 - marginWhole.left - marginWhole.right;

// Create the svg area
const scatter = d3
  .select("#scatter_matrix")
  .append("svg")
  .attr("width", sizeWhole + marginWhole.left + marginWhole.right)
  .attr("height", 300)
  .append("g")
  .attr("transform", `translate(${marginWhole.left},${marginWhole.top})`);

async function drawscmat() {
  const data = await d3.csv("./data/final_data.csv");
  // What are the numeric variables in this dataset? How many do I have
  const allVar = ["HDL", "LDL", "triglycerides", "glycemia"];
  const numVar = allVar.length;

  // Now I can compute the size of a single chart
  mar = 20;
  size = sizeWhole / numVar;

  // ----------------- //
  // Scales
  // ----------------- //

  // Create a scale: gives the position of each pair each variable
  const position = d3
    .scalePoint()
    .domain(allVar)
    .range([0, sizeWhole - size]);

  // Color scale: give me a specie name, I return a color
  const color = d3
    .scaleOrdinal()
    .domain(["I10X", "E105", "E121"])
    .range(["#1FE200", "#E24600", "#3279FF"]);

  // ------------------------------- //
  // Add charts
  // ------------------------------- //
  for (i in allVar) {
    for (j in allVar) {
      // Get current variable name
      const var1 = allVar[i];
      const var2 = allVar[j];

      // If var1 == var2 i'm on the diagonal, I skip that
      if (var1 === var2) {
        continue;
      }

      // Add X Scale of each graph
      xextent = d3.extent(data, function (d) {
        return +d[var1];
      });
      const x = d3
        .scaleLinear()
        .domain(xextent)
        .nice()
        .range([0, size - 2 * mar]);

      // Add Y Scale of each graph
      yextent = d3.extent(data, function (d) {
        return +d[var2];
      });
      const y = d3
        .scaleLinear()
        .domain(yextent)
        .nice()
        .range([size - 2 * mar, 0]);

      // Add a 'g' at the right position
      const tmp = scatter
        .append("g")
        .attr(
          "transform",
          `translate(${position(var1) + mar},${position(var2) + mar})`
        );

      // Add X and Y axis in tmp
      tmp
        .append("g")
        .attr("transform", `translate(0,${size - mar * 2})`)
        .call(d3.axisBottom(x).ticks(3));
      tmp.append("g").call(d3.axisLeft(y).ticks(3));

      // Add circle
      tmp
        .selectAll("myCircles")
        .data(data)
        .join("circle")
        .attr("cx", function (d) {
          return x(+d[var1]);
        })
        .attr("cy", function (d) {
          return y(+d[var2]);
        })
        .attr("r", 3)
        .attr("opacity", 0.6)
        .attr("fill", function (d) {
          return color(d.Diagnosis_Code);
        });
    }
  }

  // ------------------------------- //
  // Add variable names = diagonal
  // ------------------------------- //
  for (i in allVar) {
    for (j in allVar) {
      // If var1 == var2 i'm on the diagonal, otherwisee I skip
      if (i != j) {
        continue;
      }
      // Add text
      const var1 = allVar[i];
      const var2 = allVar[j];
      scatter
        .append("g")
        .attr("transform", `translate(${position(var1)},${position(var2)})`)
        .append("text")
        .attr("x", size / 2)
        .attr("y", size / 2)
        .text(var1)
        .attr("fill", "white")
        .attr("text-anchor", "middle");
    }
  }
}
drawscmat();
