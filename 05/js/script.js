//check if d3 is loaded
if(d3.version) {
  console.log("D3 version: " + d3.version);
} else {
  console.log("D3 is not loaded.");
}

const data = [
    {name: "Apples", value: 30},
    {name: "Dates", value: 60},
    {name: "Bananas", value: 80},
    {name: "Cherries", value: 45},
    {name: "Elderberries", value: 20}
];

const svgWidth = 400;
const svgHeight = 200;
const margin = { top: 20, right: 20, bottom: 20, left: 40 }; // left aumentato per le etichette y
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;
const maxValue = d3.max(data, d => d.value);

const xScale = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([0, width])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, maxValue])
  .nice()
  .range([0, height]);

const svg = d3.select("#visualization .bars")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const barGroup = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

barGroup.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => xScale(d.name))
  .attr("y", d => height - yScale(d.value))
  .attr("width", xScale.bandwidth())
  .attr("height", d => yScale(d.value))
  .attr("class", d => d.value === maxValue ? "bar max-bar" : "bar");

// X Axis
barGroup.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xScale));

// Y Axis
barGroup.append("g")
  .call(d3.axisLeft(yScale));

// Tooltips
const tooltip = d3.select("#visualization .bars")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

barGroup.selectAll("rect")
  .on("mouseover", function(event, d) {
    const rect = this.getBoundingClientRect();
    tooltip.transition()
      .duration(200)
      .attr("class", "tooltip")
      .style("opacity", 0.9);
    tooltip.html(createTooltip(d))
      .style("left", (rect.left + window.scrollX + rect.width/2) + "px") // accanto alla barra
      .style("top", (rect.top + window.scrollY - 30) + "px"); // sopra la barra
  })
  .on("mouseout", function() {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });

function createTooltip(d) {
  return '<div class="tooltip-header">' + d.name + '</div>' +
         '<div class="tooltip-body">' +
           '<div class="tooltip-row">' +
             '<span class="label">Sales:</span>' +
             '<span class="value">' + d.value + '</span>' +
           '</div>' +
         '</div>';
}