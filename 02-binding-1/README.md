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

For for example, assuming:

- svgWidth = 400
- margin.left = margin.right = 20
- padding = 12
- numbers.length = 12
- barWidth = (400 - 20 - 20 - 12*(12-1)) / 12 = 19
- barWidth + padding = 19 + 12 = 31

Here is a complete table with each substitution:

| i (index) | d (value) | x = i * (barWidth + padding) | x (px) |
|-----------|-----------:|--------------------------------------:|-------:|
| 0         | 10        | 0 * 31                               | 0      |
| 1         | 20        | 1 * 31                               | 31     |
| 2         | 30        | 2 * 31                               | 62     |
| 3         | 40        | 3 * 31                               | 93     |
| 4         | 50        | 4 * 31                               | 124    |
| 5         | 60        | 5 * 31                               | 155    |
| 6         | 70        | 6 * 31                               | 186    |
| 7         | 80        | 7 * 31                               | 217    |
| 8         | 90        | 8 * 31                               | 248    |
| 9         | 100       | 9 * 31                               | 279    |
| 10        | 110       | 10 * 31                              | 310    |
| 11        | 120       | 11 * 31                              | 341    |


```js
.attr("y", d => svgHeight - margin.bottom - margin.top - d)
```

Assuming: 
- svgHeight = 200, 
- margin.top = 20, 
- margin.bottom = 20
- Free height: svgHeight - margin.top - margin.bottom = 160
- Equation: y = 160 - d

Here is a complete table with each substitution:

| i (index) | d (value) | y = 160 - d | y (px) |
|-----------|----------:|--------------------:|-------:|
| 0         | 10        | 160 - 10            | 150    |
| 1         | 20        | 160 - 20            | 140    |
| 2         | 30        | 160 - 30            | 130    |
| 3         | 40        | 160 - 40            | 120    |
| 4         | 50        | 160 - 50            | 110    |
| 5         | 60        | 160 - 60            | 100    |
| 6         | 70        | 160 - 70            |  90    |
| 7         | 80        | 160 - 80            |  80    |
| 8         | 90        | 160 - 90            |  70    |
| 9         | 100       | 160 - 100           |  60    |
| 10        | 110       | 160 - 110           |  50    |
| 11        | 120       | 160 - 120           |  40    |

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

