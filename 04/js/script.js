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
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Y Axis
barGroup.append("g")
  .call(d3.axisLeft(yScale));