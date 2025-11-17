const svgWidth = 800;
const svgHeight = 400;

// ---------------------------
// SAMPLE DATA
// ---------------------------
const data = [
  { name: "A", value: 30, category: "a" },
  { name: "B", value: 80, category: "b" },
  { name: "C", value: 50, category: "c" },
  { name: "D", value: 95, category: "d" },
  { name: "E", value: 40, category: "e" }
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

const rScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .range([10, 60]); // size of shapes

// ---------------------------
// SHAPE GENERATORS (centered at 0,0)
// ---------------------------
function circlePath(size) {
  return `M0,0 m-${size},0 a${size},${size} 0 1,0 ${size*2},0 a${size},${size} 0 1,0 -${size*2},0`;
}

function diamondPath(size) {
  return `
    M0,-${size}
    L${size},0
    L0,${size}
    L-${size},0
    Z
  `;
}

function trianglePath(size) {
  return `
    M0,-${size}
    L${size},${size}
    L-${size},${size}
    Z
  `;
}

// ---------------------------
// CATEGORY → SHAPE MAPPING
// ---------------------------
function categoryToShape(category) {
  switch(category) {
    case "a":
    case "d": return circlePath;
    case "b": return trianglePath;
    case "c":
    case "e": return diamondPath;
    default: return circlePath;
  }
}

// ---------------------------
// DRAW SHAPES
// ---------------------------
svg.append("g")
  .selectAll("path")
  .data(data)
  .enter()
  .append("path")
  .attr("d", d => categoryToShape(d.category)(rScale(d.value))) // pick path by category
  .attr("transform", d => {
    const cx = xScale(d.name) + xScale.bandwidth()/2;
    const cy = svgHeight/2;
    return `translate(${cx},${cy})`;
  })
  .attr("fill", "none")
  .attr("stroke", "#0033cc")
  .attr("stroke-width", 3);

// ---------------------------
// X AXIS
// ---------------------------
svg.append("g")
  .attr("transform", `translate(0, ${svgHeight - 20})`)
  .call(d3.axisBottom(xScale));
