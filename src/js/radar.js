var radar_margin = { top: 50, right: 50, bottom: 40, left: 50 },
          radar_width = 400,
          radar_height = 300;


function RadarChart(id, dataset) {
  const rdr_svg = d3.select("#radar_plot").append("svg").attr("width", 500)
.attr("height", 320)
.attr("class", "radar" + '#radar_plot');
  //console.log('data', d3.mean(dataset, d => d.systolic))
  var data = [
    [
      //Samsun
      { axis: "Albumin", value: d3.mean(dataset, d => d.microalbuminuria)},
      { axis: "creatinine", value: d3.mean(dataset, d => d.creatinine) },
      { axis: "Hemoglobin", value: d3.mean(dataset, d => d.glycated_hemoglobin) },
      { axis: "Cholestrol", value: d3.mean(dataset, d => d.cholesterol) },
      { axis: "BMI", value: d3.mean(dataset, d => d.BMI) },
      { axis: "Glycemia", value: d3.mean(dataset, d => d.glycemia) },
      { axis: "Triglycerides", value: d3.mean(dataset, d => d.triglycerides) },
      { axis: "HDL", value: d3.mean(dataset, d => d.HDL) },
    ],
    [
      //Nokia Smartphone
      { axis: "Albumin", value: 100 },
      { axis: "creatinine", value: 100 },
      { axis: "Hemoglobin", value: 100 },
      { axis: "Cholestrol", value: 100 },
      { axis: "BMI", value: 100 },
      { axis: "Glycemia", value: 100 },
      { axis: "Triglycerides", value: 100 },
      { axis: "HDL", value: 100 },
    ],
  ];

  var radar_color = d3
          .scaleOrdinal()
          .range(["#EDC951", "#CC333F", "#00A0B0"]);

        var options = {
          w: radar_width,
          h: radar_height,
          margin: radar_margin,
          maxValue: 0.5,
          levels: 5,
          roundStrokes: true,
          color: radar_color,
        };

  var cfg = {
    w: 500, //Width of the circle
    h: 320, //Height of the circle
    margin: { top: 50, right: 50, bottom: 40, left: 50 }, //The margins of the rdr_svg
    levels: 3, //How many levels or inner circles should there be drawn
    maxValue: 0, //What is the value that the biggest circle will represent
    labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, //The opacity of the area of the blob
    dotRadius: 4, //The size of the colored circles of each blog
    opacityCircles: 0.1, //The opacity of the circles of each blob
    strokeWidth: 2, //The width of the stroke around each blob
    roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scaleOrdinal(d3.schemeCategory10), //Color function
  };

  //Put all of the options into a variable called cfg
  if ("undefined" !== typeof options) {
    for (var i in options) {
      if ("undefined" !== typeof options[i]) {
        cfg[i] = options[i];
      }
    } //for i
  } //if

  //If the supplied maxValue is smaller than the actual one, replace by the max in the data
  var maxValue = Math.max(
    cfg.maxValue,
    d3.max(data, function (i) {
      return d3.max(
        i.map(function (o) {
          return o.value;
        })
      );
    })
  );

  var allAxis = data[0].map(function (i, j) {
      return i.axis;
    }), //Names of each axis
    total = allAxis.length, //The number of different axes
    radius = Math.min(cfg.w / 3, cfg.h / 2.8), //Radius of the outermost circle
    Format = d3.format(""), //Percentage formatting
    angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"
  console.log('max', maxValue)
  //Scale for the radius
  var rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

  //Remove whatever chart with the same id/class was present before
  // d3.select("#radar_plot").select("rdr_svg").remove();

  //Initiate the radar chart rdr_svg
  // rdr_svg.attr("width", 500)
  //   .attr("height", 320)
  //   .attr("class", "radar" + id);
  //Append a g element
  var g = rdr_svg
    .append("g")
    .attr(
      "transform",
      "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + cfg.h / 1.9 + ")"
    );

  //title code
  rdr_svg
    .append("text")
    .attr("x", 500 / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .attr("fill", "white")
    .style("text-decoration", "underline")
    .text("Normal Readings vs Selected Disease Readings");

  //Filter for the outside glow
  var filter = g.append("defs").append("filter").attr("id", "glow"),
    feGaussianBlur = filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "1.8")
      .attr("result", "coloredBlur"),
    feMerge = filter.append("feMerge"),
    feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
    feMergeNode_2 = feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  //Wrapper for the grid & axes
  var axisGrid = g.append("g").attr("class", "axisWrapper");

  //Draw the background circles
  axisGrid
    .selectAll(".levels")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function (d, i) {
      return (radius / cfg.levels) * d;
    })
    .style("fill", "white")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityCircles)
    .style("filter", "url(#glow)");

  //Text indicating at what % each level is
  axisGrid
    .selectAll(".axisLabel")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", function (d) {
      return (-d * radius) / cfg.levels;
    })
    .attr("dy", "0.4em")
    .style("font-size", "10px")
    .attr("fill", "white")
    .text(function (d, i) {
      return Format((maxValue * d) / cfg.levels);
    });
    console.log('ax',allAxis)
  //Create the straight lines radiating outward from the center
  var axis = axisGrid
    .selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");
  //Append the lines
    
  axis
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", function (d, i) {
      return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("y2", function (d, i) {
      return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");
 
  // axis
  //   .append("line")
  //   .attr("x1", 0)
  //   .attr("y1", 0)
  //   .attr("x2", rScale(d3.mean(dataset, d => d.microalbuminuria) * 1.1) * Math.cos(angleSlice * 0 - Math.PI / 2))
  //   .attr("y2", rScale(d3.mean(dataset, d => d.microalbuminuria) * 1.1) * Math.cos(angleSlice * 0 - Math.PI / 2))
  //   .attr("class", "line")
  //   .style("stroke", "white")
  //   .style("stroke-width", "2px");
  // axis
  //   .append("line")
  //   .attr("x1", 0)
  //   .attr("y1", 0)
  //   .attr("x2", rScale(d3.mean(dataset, d => d.creatinine) * 1.1) * Math.cos(angleSlice * 1 - Math.PI / 2))
  //   .attr("y2", rScale(d3.mean(dataset, d => d.creatinine) * 1.1) * Math.cos(angleSlice * 1 - Math.PI / 2))
  //   .attr("class", "line")
  //   .style("stroke", "white")
  //   .style("stroke-width", "2px");

  // axis
  //   .append("line")
  //   .attr("x1", 0)
  //   .attr("y1", 0)
  //   .attr("x2", rScale(d3.mean(dataset, d => d.glycated_hemoglobin) * 1.1) * Math.cos(angleSlice * 2 - Math.PI / 2))
  //   .attr("y2", rScale(d3.mean(dataset, d => d.glycated_hemoglobin) * 1.1) * Math.cos(angleSlice * 2 - Math.PI / 2))
  //   .attr("class", "line")
  //   .style("stroke", "white")
  //   .style("stroke-width", "2px");

  // axis
  //   .append("line")
  //   .attr("x1", 0)
  //   .attr("y1", 0)
  //   .attr("x2", rScale(d3.mean(dataset, d => d.cholesterol) * 1.1) * Math.cos(angleSlice * 3 - Math.PI / 2))
  //   .attr("y2", rScale(d3.mean(dataset, d => d.cholesterol) * 1.1) * Math.cos(angleSlice * 3 - Math.PI / 2))
  //   .attr("class", "line")
  //   .style("stroke", "white")
  //   .style("stroke-width", "2px");
  //   axis
  //   .append("line")
  //   .attr("x1", 0)
  //   .attr("y1", 0)
  //   .attr("x2", rScale(d3.mean(dataset, d => d.BMI) * 1.1) * Math.cos(angleSlice * 4 - Math.PI / 2))
  //   .attr("y2", rScale(d3.mean(dataset, d => d.BMI) * 1.1) * Math.cos(angleSlice * 4 - Math.PI / 2))
  //   .attr("class", "line")
  //   .style("stroke", "white")
  //   .style("stroke-width", "2px");
  //   axis
  //   .append("line")
  //   .attr("x1", 0)
  //   .attr("y1", 0)
  //   .attr("x2", rScale(d3.mean(dataset, d => d.glycemia) * 1.1) * Math.cos(angleSlice * 5 - Math.PI / 2))
  //   .attr("y2", rScale(d3.mean(dataset, d => d.glycemia) * 1.1) * Math.cos(angleSlice * 5 - Math.PI / 2))
  //   .attr("class", "line")
  //   .style("stroke", "white")
  //   .style("stroke-width", "2px");

  //   axis
  //   .append("line")
  //   .attr("x1", 0)
  //   .attr("y1", 0)
  //   .attr("x2", rScale(d3.mean(dataset, d => d.triglycerides) * 1.1) * Math.cos(angleSlice * 6 - Math.PI / 2))
  //   .attr("y2", rScale(d3.mean(dataset, d => d.triglycerides) * 1.1) * Math.cos(angleSlice * 6 - Math.PI / 2))
  //   .attr("class", "line")
  //   .style("stroke", "white")
  //   .style("stroke-width", "2px");
  //   axis
  //   .append("line")
  //   .attr("x1", 0)
  //   .attr("y1", 0)
  //   .attr("x2", rScale(d3.mean(dataset, d => d.HDL) * 1.1) * Math.cos(angleSlice * 7 - Math.PI / 2))
  //   .attr("y2", rScale(d3.mean(dataset, d => d.HDL) * 1.1) * Math.cos(angleSlice * 7 - Math.PI / 2))
  //   .attr("class", "line")
  //   .style("stroke", "white")
  //   .style("stroke-width", "2px");
  //Append the labels at each axis
  axis
    .append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("dy", "1px")
    .attr("x", function (d, i) {
      return (
        rScale(maxValue * cfg.labelFactor) *
        Math.cos(angleSlice * i - Math.PI / 2)
      );
    })
    .attr("y", function (d, i) {
      return (
        rScale(maxValue * cfg.labelFactor) *
        Math.sin(angleSlice * i - Math.PI / 2)
      );
    })
    .text(function (d) {
      return d;
    })
    .call(wrap, cfg.wrapWidth);
  
  //The radial line function
  var radarLine = d3
    .lineRadial()
    .curve(d3.curveLinearClosed)
    .radius(function (d) {
      return rScale(d.value);
    })
    .angle(function (d, i) {
      return i * angleSlice;
    });

  if (cfg.roundStrokes) {
    radarLine.curve(d3.curveLinearClosed);
  }

  //Create a wrapper for the blobs
  var blobWrapper = g
    .selectAll(".radarWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarWrapper");

  //Append the backgrounds
  blobWrapper
    .append("path")
    .attr("class", "radarArea")
    .attr("d", function (d, i) {
      return radarLine(d);
    })
    .style("fill", function (d, i) {
      return cfg.color(i);
    })
    .style("fill-opacity", cfg.opacityArea)
    .on("mouseover", function (d, i) {
      //Dim all blobs
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", 0.1);
      //Bring back the hovered over blob
      d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
    })
    .on("mouseout", function () {
      //Bring back all blobs
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", cfg.opacityArea);
    });

  //Create the outlines
  blobWrapper
    .append("path")
    .attr("class", "radarStroke")
    .attr("d", function (d, i) {
      return radarLine(d);
    })
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("stroke", function (d, i) {
      return cfg.color(i);
    })
    .style("fill", "none")
    .style("filter", "url(#glow)");

  //Append the circles
  blobWrapper
    .selectAll(".radarCircle")
    .data(function (d, i) {
      return d;
    })
    .enter()
    .append("circle")
    .attr("class", "radarCircle")
    .attr("r", cfg.dotRadius)
    .attr("cx", function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("cy", function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style("fill", function (d, i, j) {
      return cfg.color(j);
    })
    .style("fill-opacity", 0.8);

  //Wrapper for the invisible circles on top
  var blobCircleWrapper = g
    .selectAll(".radarCircleWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarCircleWrapper");

  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper
    .selectAll(".radarInvisibleCircle")
    .data(function (d, i) {
      return d;
    })
    .enter()
    .append("circle")
    .attr("class", "radarInvisibleCircle")
    .attr("r", cfg.dotRadius * 1.5)
    .attr("cx", function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("cy", function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function (d, i) {
      newX = parseFloat(d3.select(this).attr("cx")) - 10;
      newY = parseFloat(d3.select(this).attr("cy")) - 10;

      rdr_tooltip
        .attr("x", newX)
        .attr("y", newY)
        .text(Format(d.value))
        .transition()
        .duration(200)
        .style("opacity", 1);
    })
    .on("mouseout", function () {
      rdr_tooltip.transition().duration(200).style("opacity", 0);
    });

  //Set up the small rdr_tooltip for when you hover over a circle
  var rdr_tooltip = g
    .append("text")
    .attr("class", "tooltip")
    .style("opacity", 0);

  //Taken from http://bl.ocks.org/mbostock/7555321
  //Wraps rdr_svg text
  function wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  } //wrap
} //RadarChart
