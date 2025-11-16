// check if d3 is loaded
if (d3.version) {
  console.log("D3 version: " + d3.version);
} else {
  console.log("D3 is not loaded.");
}

d3.json("data/data.json").then(function (data) {
  console.log("Loaded data:", data);

  const fruits = data.fruits;
  const svgWidth = 800;
  const svgHeight = 400;
  const margin = { top: 20, right: 20, bottom: 20, left: 40 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  function createChart() {
    d3.select('#visualization .icons').selectAll('*').remove();

    const maxValue = d3.max(fruits, d => d.value);
    const minValue = d3.min(fruits, d => d.value);

    const xScale = d3.scaleBand()
      .domain(fruits.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    const rScale = d3.scaleLinear()
      .domain([0, maxValue])
      .nice()
      .range([5, svgHeight / 7]);

    const svg = d3.select("#visualization .icons")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const iconGroup = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Wrapper groups for each icon
    const iconWrappers = iconGroup.selectAll(".icon-wrapper")
      .data(fruits)
      .enter()
      .append("g")
      .attr("class", d => (d.value === maxValue ? "icon-wrapper max-icon" : "icon-wrapper"))
      .attr("transform", d => `translate(${xScale(d.name) + xScale.bandwidth() / 2}, ${svgHeight / 2})`); 
      // ^ centered horizontally

    // Load inline SVG for each icon
    iconWrappers.each(function (d) {
      const group = d3.select(this);
      const filePath = `svg/${d.name.toLowerCase()}.svg`;

      d3.xml(filePath).then(data => {
        const importedNode = document.importNode(data.documentElement, true);

        const bw = xScale.bandwidth();
        const h = rScale(d.value);

        // ✔ Center the icon and size it by value
        d3.select(importedNode)
          .attr("width", bw)
          .attr("height", h)
          .attr("x", -bw / 2)   // center horizontally
          .attr("y", -h / 2);   // center vertically

        // ✔ Dynamic color rules
        let color;
        if (d.value === maxValue) color = "#e63946";   // red
        else if (d.value === minValue) color = "#457b9d"; // blue
        else color = "#6c757d";                         // gray

        d3.select(importedNode).selectAll("*").attr("fill", color);

        // Append inline SVG into wrapper group
        group.node().appendChild(importedNode);
      });
    });

    // Tooltips
    const tooltip = d3.select("#visualization .icons")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    iconWrappers
      .on("mouseover", function (event, d) {
        const rect = this.getBoundingClientRect();
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(createTooltip(d))
          .style("left", rect.left + window.scrollX + rect.width / 2 + "px")
          .style("top", rect.top + window.scrollY - 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    function createTooltip(d) {
      return `
        <div class="tooltip-header">${d.name}</div>
        <div class="tooltip-body">
          <div class="tooltip-row">
            <span class="label">Sales:</span>
            <span class="value">${d.value}</span>
          </div>
        </div>
      `;
    }
  }

  // Buttons
  document.getElementById('btn-sort-by-name')
    .addEventListener('click', function () {
      console.log('Sort by name clicked');
      fruits.sort((a, b) => a.name.localeCompare(b.name));
      createChart();
    });

  document.getElementById('btn-sort-by-value')
    .addEventListener('click', function () {
      console.log('Sort by value clicked');
      fruits.sort((a, b) => a.value - b.value);
      createChart();
    });

  createChart();
});
