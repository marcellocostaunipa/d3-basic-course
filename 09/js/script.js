const svgWidth = 400;
const svgHeight = 200;

// ---------------------------
// SAMPLE DATA
// ---------------------------
const data = [
  { name: "A", value: 30 },
  { name: "B", value: 80 },
  { name: "C", value: 50 },
  { name: "D", value: 95 },
  { name: "E", value: 40 }
];

// ---------------------------
// SVG & SCALES
// ---------------------------
const svg = d3
    .select("#visualization .bars")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

const xScale = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([40, svgWidth - 20])
  .padding(0.3);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .range([svgHeight - 20, 20]);

// ---------------------------
// STAR SHAPE GENERATOR
// ---------------------------
function starPath(d, i) {
  const starWidth = xScale.bandwidth();
  const centerX = xScale(d.name) + starWidth / 2;
  const topY    = yScale(d.value);
  const bottomY = yScale(0);
  const centerY = topY + (bottomY - topY) / 2;

  // Spoke length responds to bar height
  const valueHeight = bottomY - topY;
  const spokeLength = valueHeight * 0.25;

  let path = "";
  for (let angle = 0; angle < 360; angle += 60) {
    const rad = angle * Math.PI / 180;
    const x2 = centerX + Math.cos(rad) * spokeLength;
    const y2 = centerY + Math.sin(rad) * spokeLength;
    path += `M${centerX},${centerY} L${x2},${y2} `;
  }
  return path;
}

// ---------------------------
// DRAW STAR “GROUPS”
// ---------------------------
const starsGroup = svg.append("g");

starsGroup.selectAll("path")
  .data(data)
  .enter()
  .append("path")
  .attr("d", (d, i) => starPath(d, i))
  .attr("stroke", "#2b00ff")
  .attr("stroke-width", 3)
  .attr("fill", "none");