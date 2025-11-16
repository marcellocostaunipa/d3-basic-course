//check if d3 is loaded
if(d3.version) {
  console.log("D3 version: " + d3.version);
} else {
  console.log("D3 is not loaded.");
}

d3.json("data/data.json").then(function(data) {
    console.log("Loaded data: " , data);

    const fruits = data.fruits;
    const svgWidth = 400;
    const svgHeight = 200;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 }; // left aumentato per le etichette y
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
    const maxValue = d3.max(data.fruits, d => d.value);

    function createChart() {

      d3.select('#visualization .circles').selectAll('*').remove();

      const xScale = d3.scaleBand()
        .domain(fruits.map(d => d.name))
        .range([0, width])
        .padding(0.1);

      const rScale = d3.scaleLinear()
        .domain([0, maxValue])
        .nice()
        .range([5, svgHeight/7]);

      const svg = d3.select("#visualization .circles")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      const circlesGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      circlesGroup.selectAll("circles")
        .data(fruits)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.name))
        .attr("cy", svgHeight/2)
        .attr("r", d => rScale(d.value))
        .attr("class", d => d.value === maxValue ? "circle max-circle" : "circle");

      // Tooltips
      const tooltip = d3.select("#visualization .circles")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      circlesGroup.selectAll("circle")
        .on("mouseover", function(event, d) {
          console.log('Over!');
          const circle = this.getBoundingClientRect();
          console.log(circle);
          tooltip.transition()
            .duration(200)
            .attr("class", "tooltip")
            .style("opacity", 0.9);
          tooltip.html(createTooltip(d))
            .style("left", (circle.left + window.scrollX + circle.width/2) + "px") // accanto alla barra
            .style("top", (circle.top + window.scrollY - 30) + "px"); // sopra la barra
        })
        .on("mouseout", function() {
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
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

  const btnSortByName = document.getElementById('btn-sort-by-name')
    .addEventListener('click', function(){
    console.log('Sort by name clicked');
    fruits.sort((a, b) => a.name.localeCompare(b.name));
    createChart();
  });

  const btnSortByValue = document.getElementById('btn-sort-by-value')
    .addEventListener('click', function(){
    console.log('Sort by value clicked');
    fruits.sort((a, b) => a.value - b.value);
    createChart();
  });

  createChart();

});

