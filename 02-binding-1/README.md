# Lesson 2 — Building a Simple Bar Chart in D3.js

## Overview

In this second lesson, you will learn how to create a **basic bar chart** using D3.js.  
This example introduces several important concepts:

- Using SVG dimensions, margins, and padding  
- Dynamically computing bar width  
- Creating a `<g>` group and applying transformations  
- Binding data to `<rect>` elements  
- Drawing bars with position and height based on data  

This lesson builds directly on the first one: instead of SVG text, we now visualize values as vertical bars.

---

## 1. Checking if D3.js Is Loaded

Same as in Lesson 1, we begin with a simple check:

```js
if(d3.version) {
  console.log("D3 version: " + d3.version);
} else {
  console.log("D3 is not loaded.");
}
```

---

## 2. Creating the Dataset

We use a slightly larger dataset than in Lesson 1:

```js
const numbers = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
```

Each value will determine the height of a bar.

---

## 3. Setting Up SVG and Layout Parameters

We define the SVG size:

```js
const svgWidth = 400;
const svgHeight = 200;
```

### Margins

Margins allow space around the chart:

```js
const margin = { 
  top: 20, 
  right: 20, 
  bottom: 20, 
  left: 20 
};
```

### Padding Between Bars

```js
const padding = 12;
```

This is the horizontal space between each bar.

---

## 4. Computing Bar Width Dynamically

Instead of using a fixed width, we compute it based on:

- Total SVG width  
- Left/right margins  
- Padding between bars  
- Number of data points  

```js
const barWidth = (
  svgWidth 
  - margin.left 
  - margin.right 
  - padding * (numbers.length - 1)
) / numbers.length;
```

This ensures all bars fit inside the available space.

---

## 5. Creating the SVG Element

```js
const svg = d3.select("#visualization .graph")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
```

---

## 6. Creating a Group (`<g>`) for Bars

Grouping bars together allows us to apply margins cleanly:

```js
const barsGroup = svg.append("g")
  .attr("class", "bars")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
```

The `transform` shifts the whole group inside the SVG.

---

## 7. Binding Data and Creating Bars

We bind our data to rectangles:

```js
barsGroup
  .selectAll("rect")
  .data(numbers)
  .enter()
  .append("rect")
```

### Setting bar attributes

```js
.attr("x", (d, i) => i * (barWidth + padding))
```

Each bar is placed by multiplying the index by the bar width + padding.

```js
.attr("y", d => svgHeight - margin.bottom - margin.top - d)
```

Bars grow upward, so their `y` value moves up as `d` increases.

```js
.attr("width", barWidth)
.attr("height", d => d)
```

The height reflects the numeric value.

```js
.style("fill", "#2b00ff");
```

Bars are colored with a solid blue.

---

## 8. Visual Result

You now have a basic **vertical bar chart**, with:

- Evenly spaced bars  
- Heights based on data  
- Margins applied through a `<g>` transform  

This is the foundation of most D3 charts.

---

## Key Concepts Learned

- How to compute bar width dynamically  
- Understanding SVG coordinate system (0,0 = top-left)  
- Using margin conventions  
- Using `<g>` groups and transformations  
- Binding data to `<rect>` elements  
- Creating a simple bar chart  

---

You are ready for the next lesson’s challenge!  
Send me the third JS file when you're ready.
