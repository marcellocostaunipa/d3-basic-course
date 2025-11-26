# Lesson 8 — Interactive Circle Chart with Scaling, Sorting, and Tooltips in D3.js

## Overview

In this lesson, you will learn how to create an **interactive circle-based visualization** using D3.js.  
This lesson extends the concepts from Lessons 6 and 7 and applies them to a different visual form — **circles instead of bars**.

You will learn how to:

- Load external JSON data using `d3.json()`
- Draw circles instead of rectangles
- Use `scaleLinear()` to compute circle radii
- Use `scaleBand()` to position circles horizontally
- Add interactive tooltips
- Sort data with UI buttons and redraw the chart
- Rebuild the visualization each time the data order changes

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
    console.log("Loaded data: " , data);
```

- The JSON file contains a `fruits` array.
- All visualization code is inside the `.then()` callback.

---

## 3. Extracting Data and Setting Dimensions

```js
const fruits = data.fruits;
const svgWidth = 400;
const svgHeight = 200;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;
const maxValue = d3.max(data.fruits, d => d.value);
```

This defines:

- The inner drawing area (`width`, `height`)
- The max value used for scaling circle radii

---

## 4. Chart Rendering Function

All drawing logic is encapsulated in:

```js
function createChart() { ... }
```

Before drawing, we wipe the previous visualization:

```js
d3.select('#visualization .circles').selectAll('*').remove();
```

This ensures that a fresh chart is rendered after sorting.

---

## 5. Scales

### Band Scale for Horizontal Position

```js
const xScale = d3.scaleBand()
  .domain(fruits.map(d => d.name))
  .range([0, width])
  .padding(0.1);
```

This positions each circle based on category names.

### Linear Scale for Circle Radius

```js
const rScale = d3.scaleLinear()
  .domain([0, maxValue])
  .nice()
  .range([5, height / 7]);
```

This ensures that:

- Small values → small circles
- Large values → proportionally larger circles

---

## 6. Creating the SVG and Group

```js
const svg = d3.select("#visualization .circles")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const circlesGroup = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
```

---

## 7. Drawing the Circles

```js
circlesGroup.selectAll("circles")
  .data(fruits)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.name))
  .attr("cy", height / 2)
  .attr("r", d => rScale(d.value))
  .attr("class", d => d.value === maxValue ? "circle max-circle" : "circle");
```

Notes:

- `cx` uses the band scale for horizontal spacing
- `cy` is centered vertically
- `r` uses the linear radius scale
- The largest value is highlighted with a special class

---

## 8. Adding Tooltips

Tooltips are created as HTML elements:

```js
const tooltip = d3.select("#visualization .circles")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
```

### Tooltip Interactivity

```js
circlesGroup.selectAll("circle")
  .on("mouseover", function(event, d) {
    const circle = this.getBoundingClientRect();
    tooltip.transition()
      .duration(200)
      .style("opacity", 0.9);
    tooltip.html(createTooltip(d))
      .style("left", (circle.left + window.scrollX + circle.width/2) + "px")
      .style("top", (circle.top + window.scrollY - 30) + "px");
  })
  .on("mouseout", function() {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });
```

Tooltip contents are generated via template literal:

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

---

## 9. Sorting with Buttons

Two buttons control chart sorting:

```js
document.getElementById('btn-sort-by-name')
  .addEventListener('click', function(){
    fruits.sort((a, b) => a.name.localeCompare(b.name));
    createChart();
  });

document.getElementById('btn-sort-by-value')
  .addEventListener('click', function(){
    fruits.sort((a, b) => a.value - b.value);
    createChart();
  });
```

After sorting, `createChart()` completely redraws the circles.

---

## 10. Initial Render

```js
createChart();
```

---

## Key Concepts Learned

- How to draw circles using SVG + D3
- Using `scaleBand()` for category spacing
- Using `scaleLinear()` for radius scaling
- Building interactive tooltips for circles
- Removing and redrawing visualizations dynamically
- Responding to user actions (sorting) with updated charts
- Encapsulating visualization logic for reuse

This lesson shows how to create fully interactive visualizations where **data order controls the visual layout**.

---

Send the next JS file when you’re ready for **Lesson 9**!
