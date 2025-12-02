# Lesson 12 — Using Colors Dynamically in a D3 Bar Chart

## Overview

In this lesson, you will learn how to apply **dynamic color classes** to a D3 bar chart.  
Instead of using a single CSS class for all bars, we create **multiple classes per bar** based on:

- the **value** of the bar (to highlight the maximum),
- the **name** of the data category (to apply custom colors through CSS).

This approach keeps your styles flexible, scalable, and entirely CSS-driven.

---

## 1. Checking If D3 Is Loaded

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
    {name: "Bananas", value: 30},
    {name: "Cherries", value: 145},
    {name: "Elderberries", value: 20},
    {name: "Figs", value: 75},
    {name: "Grapes", value: 90},
    {name: "Honeydew", value: 50},
    {name: "Kiwis", value: 110}
];
```

Each item has:
- a **name** used for labeling and for generating CSS classes,
- a **value** used to determine bar height.

---

## 3. Dimensions and Scales

```js
const svgWidth = 400;
const svgHeight = 200;
const margin = { top: 20, right: 20, bottom: 20, left: 40 };

const width  = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const maxValue = d3.max(data, d => d.value);
```

### X Scale (band)

```js
const xScale = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([0, width])
  .padding(0.2);
```

### Y Scale (linear)

```js
const yScale = d3.scaleLinear()
  .domain([0, maxValue])
  .nice()
  .range([height, 0]);
```

---

## 4. Creating the SVG

```js
const svg = d3.select("#visualization .bars")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const barGroup = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
```

---

## 5. Drawing Bars with Dynamic Classes

This is the core concept of the lesson:

```js
.attr("class", d => 
    d.value === maxValue
      ? "bar max-bar " + d.name.toLowerCase()
      : "bar " + d.name.toLowerCase()
);
```

### ✔ What is happening?

Each bar receives:

1. A base class (`bar`)
2. Optionally a class for the maximum (`max-bar`)
3. A class generated from the item’s name (`apples`, `bananas`, etc.)

This allows full styling in CSS:

```css
.apples { fill: #e63946; }
.bananas { fill: #ffd60a; }
.cherries { fill: #d00000; }
.max-bar { stroke: black; stroke-width: 2px; }
```

### ✔ Why this is powerful?

- You avoid hard-coding colors inside JS.
- You can style or restyle categories at any time in CSS.
- You can build full color themes per category.
- You can highlight bars based on logic (e.g., max value).

---

## 6. Adding Axes

X Axis:

```js
barGroup.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class", "x-axis")
  .call(d3.axisBottom(xScale));
```

Y Axis:

```js
barGroup.append("g")
  .call(d3.axisLeft(yScale));
```

---

## Key Concepts Learned

- How to build **multiple CSS classes** dynamically with D3  
- How to highlight specific items using conditional logic  
- How to generate **category-based classes** from data  
- Why CSS-driven coloring is preferable over JS inline styling  
- How to keep visualization code clean and modular  

This lesson is a crucial step toward using:

- **color scales** (d3.scaleOrdinal, d3.scaleSequential),
- **data-driven palettes**,
- **theming for dashboard visualizations**.

---

Send the next JS file whenever you're ready for **Lesson 13**!
