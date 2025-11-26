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
    .select("#visualization .shapes")
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
function starPath(d) {
  const barWidth = xScale.bandwidth();
  const centerX  = xScale(d.name) + barWidth / 2;
  const topY     = yScale(d.value);
  const bottomY  = yScale(0);

  // centro verticale della stella
  const centerY  = topY + (bottomY - topY) / 2;

  // spoke length proportional to bar height
  const valueHeight = bottomY - topY;
  const spokeLength = valueHeight * 0.25;

  // ----
  // Disegno una stella centrata in (0,0)
  // ----
  let path = "";
  for (let angle = 0; angle < 360; angle += 60) {
    const rad = angle * Math.PI / 180;
    const x2 = Math.cos(rad) * spokeLength;
    const y2 = Math.sin(rad) * spokeLength;
    path += `M0,0 L${x2},${y2} `;
  }

  // Ritorno sia path sia transform
  return {
    d: path,
    transform: `translate(${centerX}, ${centerY})`
  };
}


// ---------------------------
// DRAW STAR “GROUPS”
// ---------------------------
const starsGroup = svg.append("g");

starsGroup.selectAll("path")
  .data(data)
  .enter()
  .append("path")
  .each(function(d) {
    const star = starPath(d);
    d3.select(this)
      .attr("d", star.d)
      .attr("transform", star.transform);
  })
  .attr("fill", "none")
  .attr("stroke", "#0033cc")
  .attr("stroke-width", 3);