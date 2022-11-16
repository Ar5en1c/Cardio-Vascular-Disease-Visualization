const margin_bc = { top: 10, right: 20, bottom: 30, left: 50 },
    width_bc = 450 - margin_bc.left - margin_bc.right,
    height_bc = 420 - margin_bc.top - margin_bc.bottom;

// append the svg object to the body of the page
const svg_bc = d3.select("#bubble")
    .append("svg")
    .attr("width", width_bc + margin_bc.left + margin_bc.right)
    .attr("height", height_bc + margin_bc.top + margin_bc.bottom)
    .append("g")
    .attr("transform", `translate(${margin_bc.left},${margin_bc.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv").then(function (data) {

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 12000])
        .range([0, width_bc]);
    svg_bc.append("g")
        .attr("transform", `translate(0, ${height_bc})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([35, 90])
        .range([height_bc, 0]);
    svg_bc.append("g")
        .call(d3.axisLeft(y));

    // Add a scale for bubble size
    const z = d3.scaleLinear()
        .domain([200000, 1310000000])
        .range([4, 40]);

    // Add a scale for bubble color
    const myColor = d3.scaleOrdinal()
        .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
        .range(d3.schemeSet2);

    // -1- Create a tooltip div that is hidden by default:
    const tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    const showTooltip = function (event, d) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .style("opacity", 1)
            .html("Country: " + d.country)
            .style("left", (event.x) / 2 + "px")
            .style("top", (event.y) / 2 + 30 + "px")
    }
    const moveTooltip = function (event, d) {
        tooltip
            .style("left", (event.x) / 2 + "px")
            .style("top", (event.y) / 2 + 30 + "px")
    }
    const hideTooltip = function (event, d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    // Add dots
    svg_bc.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("class", "bubbles")
        .attr("cx", d => x(d.gdpPercap))
        .attr("cy", d => y(d.lifeExp))
        .attr("r", d => z(d.pop))
        .style("fill", d => myColor(d.continent))
        // -3- Trigger the functions
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)

})