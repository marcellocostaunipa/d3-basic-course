# Lesson 6 — Loading External JSON Data and Sorting in D3.js

## Overview

In this lesson, you will learn how to load **external JSON data** using `d3.json()` and use the loaded data to generate a dynamic bar chart.

You will also learn:

- How to sort data (alphabetically or numerically)
- How to use the loaded JSON object inside a D3 promise (`.then`)
- How to reuse previously learned concepts (scales, axes, tooltips)
- How to use ES6 template literals for tooltip HTML

This lesson is an essential step toward working with real datasets.

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

## 2. Loading External JSON Data

D3 provides an easy method for loading JSON files:

```js
d3.json("data/data.json").then(function(data) {
    console.log("Loaded data: ", data);
```

### Important:

- The file must be served from a local server (not opened directly in the browser).
- `data` refers to the entire JSON content.
- You can structure your JSON as needed — in this case, the file contains a `fruits` array.

Example JSON structure:

```json
{
  "fruits": [
    { "name": "Apples", "value": 30 },
    { "name": "Dates", "value": 60 }
  ]
}
```

Inside the `.then`, all chart code runs after the JSON has loaded.

---

## 3. Extracting and Sorting the Data

```js
const fruits = data.fruits;
```

We sort by numeric value:

```js
fruits.sort((a, b) => a.value - b.value);
```

Or alphabetically (commented out):

```js
// fruits.sort((a, b) => a.name.localeCompare(b.name))
```

Sorting affects the order of bars on the x‑axis.

---

## 4. Setting Up SVG and Dimensions

```js
const svgWidth = 400;
const svgHeight = 200;
const margin = { top: 20, right: 20, bottom: 20, left: 40 };
```

Inner drawing area:

```js
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;
```

Maximum value for scaling:

```js
const maxValue = d3.max(fruits, d => d.value);
```

---

## 5. Scales

### X Scale (Categorical / Band)

```js
const xScale = d3.scaleBand()
  .domain(fruits.map(d => d.name))
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

## 6. Creating the SVG and Group Element

```js
const svg = d3.select("#visualization .bars")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
```

Apply margins:

```js
const barGroup = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
```

---

## 7. Drawing the Bars

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

The class `"max-bar"` is applied to the tallest bar.

---

## 8. Adding the Axes

X-axis:

```js
barGroup.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xScale));
```

Y-axis:

```js
barGroup.append("g")
  .call(d3.axisLeft(yScale));
```

---

## 9. Creating the Tooltip Element

```js
const tooltip = d3.select("#visualization .bars")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
```

Tooltips are HTML elements, positioned via CSS.

---

## 10. Adding Tooltip Interactivity

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

Tooltips follow the cursor and fade in/out smoothly.

---

## 11. Tooltip HTML Template (Template Literal)

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

This makes tooltip content cleaner and easier to maintain.

---

## Key Concepts Learned

- How to load external JSON files using `d3.json()`  
- How to access nested arrays inside JSON  
- How to sort data before binding it  
- How to fully reuse previous lessons’ code with external data  
- How to create advanced tooltips with template literals  
- How to integrate data loading + chart drawing in a single pipeline  

This lesson prepares you for working with real‑world datasets.

---

Send me the next JS file when you're ready for **Lesson 7**!
