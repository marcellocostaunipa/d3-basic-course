# Lesson 7 — Sorting Data and Redrawing the Chart in D3.js

## Overview

In this lesson, you will learn how to **sort data dynamically** and **redraw a chart** in response to user interaction.

You will:

- Load data from a JSON file using `d3.json()`
- Wrap chart creation logic inside a reusable `createChart()` function
- Clear and redraw the chart whenever the sort order changes
- Attach click events to HTML buttons to sort by **name** or **value**
- Keep tooltips and axes working after each redraw

This pattern (load → transform → render → re-render) is very common in interactive data visualizations.

---

## 1. Checking if D3.js Is Loaded

```js
if(d3.version) {
  console.log("D3 version: " + d3.version);
} else {
  console.log("D3 is not loaded.");
}
```

---

## 2. Loading JSON Data

```js
d3.json("data/data.json").then(function(data) {
  console.log("Loaded data: ", data);

  const fruits = data.fruits;
  ...
});
```

- `d3.json()` loads `data.json` asynchronously.
- All chart-related code lives inside the `.then()` callback, where the data is available.
- `fruits` is the array used throughout the lesson.

---

## 3. Chart Dimensions and Scales

Inside the `.then()` callback, we define layout and scales:

```js
const svgWidth = 400;
const svgHeight = 200;
const margin = { top: 20, right: 20, bottom: 20, left: 40 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;
const maxValue = d3.max(data.fruits, d => d.value);
```

Scales:

```js
const xScale = d3.scaleBand()
  .domain(fruits.map(d => d.name))
  .range([0, width])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, maxValue])
  .nice()
  .range([height, 0]);
```

> Note: The x-scale domain is based on the **current order** of `fruits`. When we sort `fruits`, the domain will change accordingly (inside `createChart`).

---

## 4. The `createChart()` Function

All rendering logic is wrapped in a single function:

```js
function createChart() {

  d3.select('#visualization .bars').selectAll('*').remove();

  const xScale = d3.scaleBand()
    .domain(fruits.map(d => d.name))
    .range([0, width])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, maxValue])
    .nice()
    .range([height, 0]);

  const svg = d3.select("#visualization .bars")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  const barGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
```

### Clearing the previous chart

```js
d3.select('#visualization .bars').selectAll('*').remove();
```

This removes any existing SVG or tooltip before drawing a new chart.  
It ensures that each call to `createChart()` starts from a clean state.

### Drawing the bars

```js
barGroup.selectAll("rect")
  .data(fruits)
  .enter()
  .append("rect")
  .attr("x", d => xScale(d.name))
  .attr("y", d => yScale(d.value))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d.value))
  .attr("class", d => d.value === maxValue ? "bar max-bar" : "bar");
```

### Adding axes

```js
barGroup.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xScale));

barGroup.append("g")
  .call(d3.axisLeft(yScale));
```

---

## 5. Tooltips (Recreated Each Time)

Inside `createChart()`, we define the tooltip:

```js
const tooltip = d3.select("#visualization .bars")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
```

And attach events to the bars:

```js
barGroup.selectAll("rect")
  .on("mouseover", function(event, d) {
    const rect = this.getBoundingClientRect();
    tooltip.transition()
      .duration(200)
      .style("opacity", 0.9);
    tooltip.html(createTooltip(d))
      .style("left", (rect.left + window.scrollX + rect.width/2) + "px")
      .style("top", (rect.top + window.scrollY - 30) + "px");
  })
  .on("mouseout", function() {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });
```

Tooltip template:

```js
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
```

Because `createChart()` is called after sorting, tooltips always refer to the current bar order.

---

## 6. Sorting with Buttons

Outside of `createChart()`, we add event listeners to two buttons:

```js
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
```

- When **Sort by name** is clicked, data is sorted alphabetically using `localeCompare`.
- When **Sort by value** is clicked, data is sorted numerically.
- After each sort, `createChart()` is called to re-render the chart in the new order.

Finally, we render the initial chart:

```js
createChart();
```

---

## Key Concepts Learned

- How to structure chart code inside a reusable `createChart()` function  
- How to completely clear and redraw a chart when the underlying dataset changes  
- How to sort data arrays using `.sort()` with custom comparison functions  
- How to connect standard DOM buttons (`addEventListener`) with D3 chart updates  
- How to maintain tooltips and axes across re-renders  
- How to combine data loading, transformation, and interactivity in one flow  

This lesson shows how to turn a static visualization into an **interactive, user-driven chart**.

---

You’re ready for the next lesson!  
Send the next JS file when you’re ready for **Lesson 8**.
