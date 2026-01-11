//check if d3 is loaded
if(d3.version) {
  console.log("D3 version: " + d3.version);
} else {
  console.log("D3 is not loaded.");
}

(function () {
  const svgWidth = 900;
  const svgHeight = 480;

  const container = d3.select("#viz");
  const tooltip = d3.select("#tooltip");
  const yearLabel = d3.select("#year-label");
  const yearSlider = d3.select("#year-slider");

  const svg = container.append("svg")
    .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
    .attr("width", "100%")
    .attr("height", "100%");

  const gMap = svg.append("g").attr("class", "map");
  const gBubbles = svg.append("g").attr("class", "bubbles");

  const projection = d3.geoNaturalEarth1()
    .translate([svgWidth / 2, svgHeight / 2])
    .scale(svgWidth / 6.1);

  const path = d3.geoPath(projection);

  Promise.all([
    d3.json("data/world.geojson"),
    d3.json("data/points.json")
  ]).then(([world, dataset]) => {
    // Draw world
    gMap.selectAll("path")
      .data(world.features)
      .join("path")
      .attr("d", path)
      .attr("fill", "rgba(0,0,0,.06)")
      .attr("stroke", "rgba(0,0,0,.20)")
      .attr("stroke-width", 0.6);

    const years = dataset.years;
    const points = dataset.points;

    yearSlider
      .attr("min", 0)
      .attr("max", years.length - 1)
      .attr("value", 0);

    const getYear = () => years[+yearSlider.node().value];

    const maxValue = d3.max(points, p => d3.max(years, y => +p.values[y]));
    const rScale = d3.scaleSqrt()
      .domain([0, maxValue || 1])
      .range([2, 38]);

    const color = d3.scaleSequential()
      .domain([0, maxValue || 1])
      .interpolator(d3.interpolateBlues);

    function showTooltip(event, d, year) {
      const value = +d.values[year] || 0;
      tooltip
        .style("opacity", 1)
        .html(`
          <div class="title">${d.name}</div>
          <div class="row"><span>Year</span><span>${year}</span></div>
          <div class="row"><span>Value</span><span>${value}</span></div>
        `)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY) + "px");
    }

    const hideTooltip = () => tooltip.style("opacity", 0);

    function render() {
      const year = getYear();
      yearLabel.text(year);

      const current = points.map(p => ({
        ...p,
        currentValue: +p.values[year] || 0
      }));

      gBubbles.selectAll("circle")
        .data(current, d => d.id)
        .join(
          enter => enter.append("circle")
            .attr("cx", d => projection([d.lon, d.lat])?.[0] ?? -9999)
            .attr("cy", d => projection([d.lon, d.lat])?.[1] ?? -9999)
            .attr("r", 0)
            .attr("fill", d => color(d.currentValue))
            .attr("fill-opacity", 0.75)
            .attr("stroke", "rgba(0,0,0,.35)")
            .attr("stroke-width", 0.8)
            .on("mousemove", (event, d) => showTooltip(event, d, year))
            .on("mouseleave", hideTooltip)
            .call(enter => enter.transition().duration(450)
              .attr("r", d => rScale(d.currentValue))
            ),
          update => update
            .on("mousemove", (event, d) => showTooltip(event, d, year))
            .call(update => update.transition().duration(300)
              .attr("fill", d => color(d.currentValue))
              .attr("r", d => rScale(d.currentValue))
            ),
          exit => exit.call(exit => exit.transition().duration(250)
            .attr("r", 0)
            .remove()
          )
        );
    }

    yearSlider.on("input", render);
    render();
  }).catch(err => {
    console.error(err);
    container.append("p")
      .style("color", "crimson")
      .text("Failed to load data. Run a local server and ensure data/world.geojson exists.");
  });
})();
