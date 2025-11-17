//check if d3 is loaded
if(d3.version) {
  console.log("D3 version: " + d3.version);
} else {
  console.log("D3 is not loaded.");
}

const numbers = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

const svgWidth = 400;
const svgHeight = 200;

const margin = { 
  top: 20, 
  right: 20, 
  bottom: 20, 
  left: 20 
};

const padding = 12; // spazio tra le barre

// larghezza del rettangolo fissa
//const barWidth = 25; 

// larghezza del rettangolo in base alla larghezza del SVG e al numero di elementi
const barWidth = (svgWidth - margin.left - margin.right - padding * (numbers.length - 1)) / numbers.length; 

console.log("Bar width: " + barWidth);

const svg = d3.select("#visualization .graph")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

const barsGroup = svg.append("g")
  .attr("class", "bars")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")") // applica i margini

  .selectAll("rect")
  .data(numbers)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * (barWidth + padding))
  .attr("y", d => svgHeight - margin.bottom - margin.top - d)
  .attr("width", barWidth)
  .attr("height", d => d)
  .style("fill", "#2b00ff");

