var radar_margin = { top: 50, right: 50, bottom: 40, left: 50 },
          radar_width = 400,
          radar_height = 300;
function RadarChart(id, dataset) {

    d3.select(id).select("svg").remove();
    const rdr_svg = d3.select("#radar_plot").append("svg"); 
    rdr_svg.attr("width", 500)
            .attr("height", 320)
            .attr("class", "radar" + id);
    
  
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
  
  
      var scaleList = [
  
        [0, 100, 200, 300, 400],//"Length"
        [0, 50, 100, 150, 200],//"Width"
        [0, 50, 100, 150, 200],//"Wheel base":
        [0, 25000, 50000, 75000, 100000],//"Retail price"
        [0, 2, 4, 6, 8],//"Engine size":
        [0, 100, 200, 300, 400],//"HorsePower"
  
  
      ];
  
  
      var config = {
        // circle
        margin: { top: 40, right: 70, bottom: 40, left: 70 }, //The margins of the SVG
        levels: 3,                //How many levels or inner circles should there be drawn
        labelFactor: 1.25,    //How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60,        //The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35,    //The opacity of the area of the blob
        dotRadius: 4,             //The size of the colored circles of each blog
        opacityCircles: 0.1,  //The opacity of the circles of each blob
        strokeWidth: 2,       //The width of the strok a  e around each blob
      };
  
  
      var myColor = d3.scaleOrdinal()
        .domain(data)
        .range(d3.schemeSet2);
  
      //Put all of the options into a variable called cfg
      if ('undefined' !== typeof options) {
        for (var i in options) {
          if ('undefined' !== typeof options[i]) { config[i] = options[i]; }
        }//for i
      }//if
  
  
      var radius = (window.innerWidth + window.innerHeight) / 15;
  
      var allAxis = (data[0].map(function (i, j) { return i.axis })), //Names of each axis
        total = allAxis.length,                   //The number of different axes
  
        //Format = d3.format('%'),                //Percentage formatting
        Format = d3.format('.1f'),
        angleSlice = Math.PI * 2 / total;     //The width in radians of each "slice"
  
      //Scale for the radius
  
      //Remove whatever chart with the same id/class was present before
      d3.select(id).select("svg").remove();
  
      //Initiate the radar chart SVG
      var svg = d3.select(id).append("svg")
        .attr("width", radius * 2 + config.margin.left + config.margin.right)
        .attr("height", radius * 2 + config.margin.top + config.margin.bottom)
        .attr("class", "radar" + id);
      //Append a g element        
      var g = svg.append("g")
        .attr("transform", "translate(" + (radius + config.margin.left) + "," + (radius + config.margin.top) + ")");
  
      //Filter for the outside glow
      var filter = g.append('defs').append('filter').attr('id', 'glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  
      //Wrapper for the grid & axes
      var axisGrid = g.append("g").attr("class", "axisWrapper");
  
      //Draw the background circles
      axisGrid.selectAll(".levels")
        .data(d3.range(1, (config.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function (d, i) {
  
  
          return radius / config.levels * d;
        })
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", config.opacityCircles)
        .style("filter", "url(#glow)");
  
  
      var rScaleList = [
        d3.scaleLinear().range([0, radius - 50]).domain([0, (scaleList[0])[4]]),//"Length"
        d3.scaleLinear().range([0, radius - 50]).domain([0, (scaleList[1])[4]]),//"Width"
        d3.scaleLinear().range([0, radius - 50]).domain([0, (scaleList[2])[4]]),//"Wheel base":
        d3.scaleLinear().range([0, radius - 50]).domain([0, (scaleList[3])[4]]),//"Retail price"
        d3.scaleLinear().range([0, radius - 50]).domain([0, (scaleList[4])[4]]),//"Engine size":
        d3.scaleLinear().range([0, radius - 50]).domain([0, (scaleList[5])[4]]),//"HorsePower"
      ];
  
  
  
  
  
  
      //Create the straight lines radiating outward from the center
      var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
  
      //scale
      for (let echelleNumero = 0; echelleNumero < 6; echelleNumero++) {
  
  
  
        axis.append("text")
          .attr("class", "textscale")
          .style("font-size", "10px")
          .attr("fill", "#737373")
          .data(scaleList[echelleNumero])
          .attr("x", 4) // decale echelle  en abscisse
          .attr("dy", "-8")
          .attr("y", function (d, i) { return (-(radius) * i) / scaleList[echelleNumero].length; }) // gere espacement entre données en y 
          .attr("transform", function (d, i) {
            var angleI = angleSlice * (echelleNumero) * 180 / Math.PI;   // the angle to rotate the label
            var flip = (angleI < 90 || angleI > 270) ? false : true; // 180 if label needs to be flipped
            if (flip == true) {
  
              return "rotate(" + (angleI) + ")";
  
            } else {
  
              return "rotate(" + (angleI) + ")";
  
  
            }
  
          })
          .text(function (d) {
            if (echelleNumero == 0) {
              return Format(d);
            } else {
              if (d != 0) {
                return Format(d);
              } else { return; }
            }
  
          });
      }
  
  
  
      //Append the lines
      axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function (d, i) { return radius * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("y2", function (d, i) { return radius * Math.sin(angleSlice * i - Math.PI / 2); })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");
  
  
  
      //Append the labels at each axis
      axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        //.attr("dy", "0.35em")
        .attr("x", function (d, i) { return (radius * 1.3) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("y", function (d, i) { return (radius * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
        .text(function (d) { return d });
  
  
  
      var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");
  
  
      //The radial line function
      var radarLine = d3.lineRadial()
        .curve(d3.curveCardinalClosed)
        .radius(function (d, i) { return rScaleList[i](d.value); })
        .angle(function (d, i) { return i * angleSlice; });
  
  
  
      //Append the backgrounds    
      blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function (d, i) { return radarLine(d); })
  
        .style("fill", function (d, i) { return myColor(i) })
        .style("fill-opacity", config.opacityArea)
        .on('mouseover', function (d, i) {
          //Dim all blobs
          d3.selectAll(".radarArea")
            .transition().duration(200)
            .style("fill-opacity", 0.1);
          //Bring back the hovered over blob
          d3.select(this)
            .transition().duration(200)
            .style("fill-opacity", 0.7);
        })
        .on('mouseout', function () {
          //Bring back all blobs
          d3.selectAll(".radarArea")
            .transition().duration(200)
            .style("fill-opacity", config.opacityArea);
        });
  
      //Create the outlines   
      blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function (d, i) { return radarLine(d); })
        .style("stroke-width", config.strokeWidth + "px")
        .style("stroke", function (d, i) { return myColor(i) })
        .style("fill", "none")
        .style("filter", "url(#glow)");
  
      //Append the dot
      blobWrapper.selectAll(".radarCircle")
        .data(function (d, i) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", config.dotRadius)
        .attr("cx", function (d, i) { return rScaleList[i](d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("cy", function (d, i) { return rScaleList[i](d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
        .style("fill", myColor(0))
        .style("fill-opacity", 0.8);
  
      //Wrapper for the invisible circles on top
      var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");
  
      //Append a set of invisible circles on top for the mouseover pop-up
      blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function (d, i) { return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", config.dotRadius * 1.5)
        .attr("cx", function (d, i) { return rScaleList[i](d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("cy", function (d, i) { return rScaleList[i](d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function (d, i) {
          newX = parseFloat(d3.select(this).attr('cx')) - 10;
          newY = parseFloat(d3.select(this).attr('cy')) - 10;
  
          tooltip
            .attr('x', newX)
            .attr('y', newY)
            .text(Format(d.value))
            .transition().duration(200)
            .style('opacity', 1);
        })
        .on("mouseout", function () {
          tooltip.transition().duration(200)
            .style("opacity", 0);
        });
  
      //Set up the small tooltip for when you hover over a circle
      var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);
  
      //Taken from http://bl.ocks.org/mbostock/7555321
      //Wraps SVG text    
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
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
  
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
      }//wrap 

  }//RadarChart
  