//check if d3 is loaded
if(d3.version) {
  console.log("D3 version: " + d3.version);
} else {
  console.log("D3 is not loaded.");
}

const numbers = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const svg = d3.select("#visualization .graph")
.append("svg")
.attr("width", 500)
.attr("height", 200)

svg.selectAll("text")
.data(numbers)
.enter()
.append("text")
.text(d => d)
.attr("x", (d, i) => i * 50)
.attr("y", 50)