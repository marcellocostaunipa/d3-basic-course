# Lesson 3 — Using Scales, Bars, and Circles in D3.js

## Overview

In this third lesson, you will learn how to use **D3 scales** to map data values into visual dimensions.  
You will build two types of visualizations:

- A bar chart whose heights are determined by a **linear scale**
- A circle chart whose radii are also determined by a **scale**

This lesson introduces several essential D3 concepts:

- Working with objects instead of simple arrays  
- Using `d3.max()` to compute data bounds  
- Creating `scaleLinear()` mappings  
- Understanding SVG coordinate systems  
- Creating both `<rect>` and `<circle>` elements  
- Using multiple SVGs in the same page  

---

## 1. Checking if D3.js Is Loaded

As usual, we confirm that D3 is accessible:

```js
if(d3.version) {
  console.log("D3 version: " + d3.version);
} else {
  console.log("D3 is not loaded.");
}
```

---

## 2. Dataset with Name–Value Objects

Unlike previous lessons, our data consists of objects:

```js
const data = [
    { name: "Apples", value: 100 },
    { name: "Bananas", value: 10 },
    { name: "Cherries", value: 645 },
    { name: "Dates", value: 60 },
    { name: "Elderberries", value: 10 }
];
```

Each object has:

- `name` → label of the fruit  
- `value` → numeric value used for bars and circles  

---

## 3. SVG and Layout Parameters

```js
const svgWidth = 400;
const svgHeight = 200;

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const padding = 5;
```

Bar width is computed dynamically:

```js
const barWidth = (svgWidth - margin.left - margin.right) / data.length;
```

We also compute the largest value in the dataset:

```js
const maxValue = d3.max(data, d => d.value);
```

---

## 4. Creating a Linear Y Scale

A scale maps **input values** (data) to **output values** (pixel positions):

```js
const yScale = d3.scaleLinear()
    .domain([0, maxValue])
    .nice()
    .range([svgHeight, 0]);
```

### Important:
- The **domain** is the input range (data values).
- The **range** is the output range (pixel values).
- A larger data value maps to a smaller pixel position because SVG y=0 is at the top.

---

## 5. Bar Chart (Rectangles)

We create the first SVG:

```js
const svgBars = d3.select("#visualization .bars")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
```

We append a `<g>` container:

```js
const barsGroup = svgBars.append("g")
  .attr("class", "bars");
```

### Creating the bars

```js
barsGroup.selectAll("rect")
  .data(data.map(d => d.value))
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * barWidth)
  .attr("y", d => yScale(d))
  .attr("width", barWidth - 2 * padding)
  .attr("height", d => svgHeight - yScale(d))
  .style("fill", "#2b00ff");
```

#### What each attribute does:

- **x** → horizontal position based on index  
- **y** → scaled vertical position  
- **width** → bar width minus padding  
- **height** → computed using the scale  
- **fill** → bar color  

---

## 6. Circle Chart

We create a second SVG:

```js
const svgCircles = d3.select("#visualization .circles")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
```

Group for circles:

```js
const circlesGroup = svgCircles.append("g")
  .attr("class", "circles");
```

### Radius scale

```js
const rScale = d3.scaleLinear()
  .domain([0, maxValue])
  .range([5, 20]);
```

### Creating the circles

```js
circlesGroup.selectAll("circle")
  .data(data.map(d => d.value))
  .enter()
  .append("circle")
  .attr("cx", (d, i) => margin.left + i * barWidth)
  .attr("cy", svgHeight / 2)
  .attr("r", d => rScale(d))
  .style("fill", "#ff0000");
```

#### What each attribute does:

- **cx** → horizontal position  
- **cy** → vertical position (centered)  
- **r** → radius based on the scaled value  
- **fill** → circle color  

---

## 7. Debug Logging

The code prints useful information in the console:

```js
data.forEach(d => {
  console.log(`Valore: ${d.value}, Nome: ${d.name}, rScale: ${rScale(d.value)}`);
});
```

This helps you verify that the scale works properly.

---

## Key Concepts Learned

- Using arrays of objects as data  
- Extracting maximum values with `d3.max()`  
- Creating multiple SVGs  
- Mapping data values with `scaleLinear()`  
- Using scales for both bar heights and circle radii  
- Understanding how SVG coordinates work  
- Building two visualizations from the same data  

This lesson introduces **scaling**, one of the most important concepts in D3.

---

You’re ready for Lesson 4!  
Send the next JS file when you’re ready.
