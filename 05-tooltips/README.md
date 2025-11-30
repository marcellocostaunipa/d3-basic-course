# Lesson 5 — Adding Tooltips and Interactivity to a Bar Chart in D3.js

## Overview

In this lesson, you will enhance a D3 bar chart by adding **tooltips** — interactive information boxes that appear when the user hovers over a bar.

You will learn:

- How to create an HTML tooltip element  
- How to show and hide tooltips with smooth transitions  
- How to position tooltips near SVG elements  
- How to attach interactivity using the D3 event system  

This lesson builds directly on Lesson 4 by keeping the bar chart structure but adding richer user interaction.

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

## 2. Dataset

```js
const data = [
    {name: "Apples", value: 30},
    {name: "Dates", value: 60},
    {name: "Bananas", value: 80},
    {name: "Cherries", value: 45},
    {name: "Elderberries", value: 20}
];
```

Each object contains a category (`name`) and a numeric value (`value`).

---

## 3. SVG Layout and Dimensions

```js
const svgWidth = 400;
const svgHeight = 200;
const margin = { top: 20, right: 20, bottom: 20, left: 40 };
```

We compute the inner drawing area:

```js
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;
```

---

## 4. Scales

### X Scale (Categorical)

```js
const xScale = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([0, width])
  .padding(0.1);
```

### Y Scale (Linear)

```js
const yScale = d3.scaleLinear()
  .domain([0, maxValue])
  .nice()
  .range([height, 0]);
```

---

## 5. SVG Creation

```js
const svg = d3.select("#visualization .bars")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
```

Group with margins applied:

```js
const barGroup = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
```

---

## 6. Drawing the Bars

```js
barGroup.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => xScale(d.name))
  .attr("y", d => yScale(d.value))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d.value))
  .attr("class", d => d.value === maxValue ? "bar max-bar" : "bar");
```

---

## 7. Adding Axes

X-axis:

```js
barGroup.append("g")
  .attr("transform", `translate(0,${height})`)
  .attr("class", "x-axis")
  .call(d3.axisBottom(xScale));
```

Y-axis:

```js
barGroup.append("g")
  .call(d3.axisLeft(yScale));
```

---

## 8. Creating the Tooltip Element

Tooltips are created using HTML rather than SVG:

```js
const tooltip = d3.select("#visualization .bars")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
```

The tooltip is hidden by default (`opacity: 0`).

---

## 9. Adding Interactivity to the Bars

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

### How it works

- **mouseover** event triggers tooltip appearance  
- Tooltip is positioned using the rectangle’s screen coordinates  
- **mouseout** event fades it out smoothly  

---

## 10. Tooltip HTML Template

```js
function createTooltip(d) {
  return '<div class="tooltip-header">' + d.name + '</div>' +
         '<div class="tooltip-body">' +
           '<div class="tooltip-row">' +
             '<span class="label">Sales:</span>' +
             '<span class="value">' + d.value + '</span>' +
           '</div>' +
         '</div>';
}
```

This keeps tooltip structure separate and reusable.

---

## Key Concepts Learned

- Using `scaleBand()` and `scaleLinear()` together  
- Adding interactive event listeners in D3  
- Creating an HTML-based tooltip for an SVG chart  
- Positioning tooltips using bounding boxes and scroll offsets  
- Using transitions for smooth fade-in and fade-out animations  
- Separating tooltip structure into a reusable function  

This lesson is an important milestone: your charts now respond to user interaction.
