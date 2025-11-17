//check if d3 is loaded
if(d3.version) {
  console.log("D3 version: " + d3.version);
} else {
  console.log("D3 is not loaded.");
}

const data = [
    { name: "Apples", value: 30 },
    { name: "Bananas", value: 80 },
    { name: "Cherries", value: 45 },
    { name: "Dates", value: 60 },
    { name: "Elderberries", value: 20 }
];

const svgWidth = 400;
const svgHeight = 200;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const padding = 5;
const barWidth = (svgWidth - margin.left - margin.right) / data.length; // calcola la larghezza del rettangolo in base alla larghezza del SVG e al numero di elementi
const maxValue = d3.max(data, d => d.value); // trova il valore massimo nell'array

const yScale = d3.scaleLinear()
    .domain([0, maxValue])  // Input: 0 to max value
    .nice() // Round to nice numbers
    .range([svgHeight, 0]);  

console.log("Bar width: " + barWidth);
console.log("Max value: " + maxValue);

const svgBars = d3.select("#visualization .bars")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

const barsGroup = svgBars.append("g")
.attr("class", "bars");

barsGroup.selectAll("rect")
.data(data.map(d => d.value)) // Associa i dati ai rettangoli
.enter()
.append("rect")
.attr("x", (d, i) => i * barWidth) // d è il valore (es: 10, 20, 30, ...) i è la posizione nell’array (0, 1, 2, ...)
.attr("y", d => yScale(d)) // posizione verticale del rettangolo
.attr("width", barWidth - 2 * padding) // larghezza del rettangolo
.attr("height", d =>svgHeight - yScale(d)) // altezza del rettangolo
.style("fill", "#2b00ff");

const svgCircles = d3.select("#visualization .circles")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

const circlesGroup = svgCircles.append("g")
.attr("class", "circles");

const rScale = d3.scaleLinear()
    .domain([0, maxValue]) // Input: 0 to max value
    .range([5, 20]); // Output: radius from 5 to 20

circlesGroup.selectAll("circle")
.data(data.map(d => d.value))
.enter()
.append("circle")
.attr("cx", (d, i) => margin.left + i * barWidth + barWidth/8) // posizione orizzontale del cerchio
.attr("cy", svgHeight/2) // posizione verticale del cerchio
.attr("r", d => rScale(d)) // raggio del cerchio
.style("fill", "#ff0000");

data.forEach(d => {
  console.log(`Valore: ${d.value}, Nome: ${d.name},  rScale: ${rScale(d.value)}`);  
})