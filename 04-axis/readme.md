# Lesson 4 — Building a Bar Chart with Axes and Band Scales in D3.js

## Overview

In this lesson, you will learn how to create a **categorical bar chart** using D3.js.  
Unlike previous lessons that visualized simple numeric arrays, this example works with **named categories**, using a `scaleBand()` for the x-axis and a `scaleLinear()` for the y-axis.

You will also add two fully functional axes using:

- `d3.axisBottom()` for the x-axis  
- `d3.axisLeft()` for the y-axis  

This lesson introduces important concepts that are essential for real-world charts.

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

## 2. Dataset with Categories

The data is an array of objects, each containing a fruit name and a numeric value:

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

This format is very typical for real datasets.

---

## 3. SVG Setup and Margins

We define width, height, and margins:

```js
const svgWidth = 400;
const svgHeight = 200;
const margin = { top: 20, right: 20, bottom: 20, left: 40 };
```

Because we will draw a y-axis with labels, the **left margin is larger**.

Inner drawing area:

```js
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;
```

---

## 4. Finding the Maximum Value

```js
const maxValue = d3.max(data, d => d.value);
```

This is used to define the y-scale domain and highlight the largest bar.

---

## 5. Creating the Scales

### X Scale (Categorical)

```js
const xScale = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([0, width])
  .padding(0.2);
```

- `scaleBand()` is used for categorical axes.
- `.domain()` contains category names.
- `.padding(0.2)` adds space between bars.

### Y Scale (Linear)

```js
const yScale = d3.scaleLinear()
  .domain([0, maxValue])
  .nice()
  .range([height, 0]);
```

- `.nice()` rounds the domain to cleaner numbers.

---

## 6. Creating the SVG and Group Container

```js
const svg = d3.select("#visualization .bars")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
```

Group with margin applied:

```js
const barGroup = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
```

---

## 7. Drawing the Bars

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

### Details:

- `xScale(d.name)` computes horizontal placement.
- `yScale(d.value)` computes the top of each bar.
- `xScale.bandwidth()` gives the automatic bar width.
- Bars are colored based on whether they represent the max value.

---

## 8. Adding the X Axis

```js
barGroup.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class", "x-axis")
  .call(d3.axisBottom(xScale));
```

This places the axis at the bottom of the chart.

---

## 9. Adding the Y Axis

```js
barGroup.append("g")
  .call(d3.axisLeft(yScale));
```

This draws tick marks and numeric labels along the left side.

---

## Key Concepts Learned

- How to use `scaleBand()` for categorical x-axes  
- How to compute and draw axes using D3  
- How to position bars using band scales  
- How to structure a chart using margins and a `<g>` element  
- How to highlight the maximum data value via a conditional class  
- How to build charts that resemble real D3 examples and tutorials  

You now have all the skills needed to build full D3 bar charts with axes.

---

Send the next JS file when you're ready for **Lesson 5**!
