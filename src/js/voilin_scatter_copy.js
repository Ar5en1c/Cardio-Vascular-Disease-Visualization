// var margin = { top: 10, right: 50, bottom: 40, left: 50 },
//     width = 500 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

    const n = 200;
    const labels = ["A", "B", "C", "D"];
    let data_violin = new Array(n);
    for (let i = 0; i < n; i++) {
      data_violin[i] = {
        "value": d3.randomNormal(2, 5)(),
        "label": labels[Math.floor(Math.random() * labels.length)]
      };
    }
    
    const minVal = d3.min(data_violin, (d) => d["value"]);
    const maxVal = d3.max(data_violin, (d) => d["value"]);
    const meanVal = d3.mean(data_violin, (d) => d["value"]);
    const jitterWidth = 50;
  
    const svg = d3
      .select("#scatter_matrix")
      .select("svg")
      .attr("width", 500)
      .attr("height", 320)
      .attr("transform", "translate(" + margin.left + ", " + margin.bottom + ")")
      .attr("class", "violin");
  
    let yScale = d3.scaleLinear()
      .domain([ minVal, maxVal ])
      .range([ height, margin.bottom]);
  
    let xScale = d3.scaleBand()
      .range([ 0, width ])
      .domain(labels)
      .padding(0.05);
  
    svg.append("g")
      .attr("transform", "translate(0," + (height) + ")")
      .call(d3.axisBottom(xScale));
  
    svg.append("g")
      .attr("transform", "translate(25," + 0 + ")")
      .call(d3.axisLeft(yScale));
  
    let histogram = d3.histogram()
      .domain(yScale.domain())
      .thresholds(yScale.ticks(20))
      .value(d => d);
  
    let sumstat = d3.rollup(data_violin,
        v => {
          let input = v.map(g => g["value"]);
          return histogram(input);
        },
        d => d["label"]
      );
  
    const maxNum = Array.from(sumstat.values())
      .map((value, key) => d3.max(value.map(d => d.length)))
      .reduce((a, b) => a > b? a: b);
  
    let xNumScale = d3.scaleLinear()
      .range([xScale.bandwidth()/2, xScale.bandwidth()])
      .domain([0, maxNum]);
  
    svg.append("linearGradient")
      .attr("id", "violinGradient")
      .attr("x1", 0)
      .attr("y1", "0%")
      .attr("x2", 0)
      .attr("y1", "100%")
      .selectAll("stop")
      .data([
        {
          offset: "0%",
          color: "#dc143c"
        },
        {
          offset: 1 - (maxVal - meanVal) / (maxVal - minVal),
          color: "#faebd7"
        },
        {
          offset: "100%",
          color: "#1872cc"
        }
      ])
      .enter().append("stop")
      .attr("offset", function(d) {
        return d.offset;
      })
      .attr("stop-color", function(d) {
        return d.color;
      });
  
    svg
      .selectAll("violinBands")
      .data(sumstat)
      .enter()
      .append("g")
        .attr("transform", function(d){
          return("translate(" + (xScale(d[0]) ) + ", " + 0 + ")")
        })
      .append("path")
          .datum(function(d){
            return(d[1])
          })
          .style("stroke", "none")
          .attr("fill", "url(#violinGradient)")
      .attr("d", d3.area()
        .x0( xNumScale(0) )
        .x1(function(d){
          return(xNumScale(d.length));
        })
        .y(function(d){ return(yScale(d.x0)) } )
        .curve(d3.curveCatmullRom)
       );
  
    svg
      .selectAll("violinPoints")
      .data(data_violin)
      .enter()
      .append("circle")
        .attr("cx", function(d){
          return(
            xScale(d["label"])
              + xScale.bandwidth() / 2 - Math.random() * jitterWidth
          )})
        .attr("cy", function(d){
          return yScale(d["value"]);
        })
        .attr("r", 5)
        .style("fill", function(d){
          return (d3.interpolateRdBu( 1 -
            (maxVal - parseInt(d["value"],10)) / (maxVal - minVal)
          ))})
        .attr("stroke", "white");
