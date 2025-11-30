# Lesson 10 — Using Multiple Custom Shape Generators in D3.js

## Overview

In this lesson, you will learn how to create **different custom shapes** based on a data category.  
Instead of using the same shape (like stars from Lesson 9), you will map each data category to:

- a **circle**
- a **diamond**
- a **triangle**

You will learn:

- How to write multiple SVG path generator functions  
- How to map data categories to different generators  
- How to scale shape size using a linear scale  
- How to position shapes using transforms  
- How to combine categorical shapes in one visualization  

This lesson expands your understanding of **data-driven geometric generation**.

---

## 1. Sample Data

```js
const data = [
  { name: "A", value: 30, category: "a" },
  { name: "B", value: 80, category: "b" },
  { name: "C", value: 50, category: "c" },
  { name: "D", value: 95, category: "d" },
  { name: "E", value: 40, category: "e" }
];
```

Each item contains:

- `name` → used for horizontal placement  
- `value` → used to scale the shape  
- `category` → determines which shape is drawn  

---

## 2. SVG and Scales

SVG setup:

```js
const svg = d3
  .select("#visualization .bars")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
```

### Band scale for shape placement:

```js
const xScale = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([40, svgWidth - 20])
  .padding(0.3);
```

### Linear scale for shape size:

```js
const rScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .range([10, 60]);
```

Larger values → larger shapes.

---

## 3. Shape Generators

Each shape generator returns an SVG path centered at `(0,0)`.

### Circle Path

```js
function circlePath(size) {
  return `M0,0 m-${size},0 a${size},${size} 0 1,0 ${size*2},0 a${size},${size} 0 1,0 -${size*2},0`;
}
```

This draws a circle using two arcs.

### Diamond Path

```js
function diamondPath(size) {
  return `
    M0,-${size}
    L${size},0
    L0,${size}
    L-${size},0
    Z
  `;
}
```

### Triangle Path

```js
function trianglePath(size) {
  return `
    M0,-${size}
    L${size},${size}
    L-${size},${size}
    Z
  `;
}
```

---

## 4. Mapping Categories to Shapes

```js
function categoryToShape(category) {
  switch(category) {
    case "a":
    case "d": return circlePath;
    case "b": return trianglePath;
    case "c":
    case "e": return diamondPath;
    default: return circlePath;
  }
}
```

This allows full flexibility—any category can map to any shape.

---

## 5. Drawing the Shapes

```js
svg.append("g")
  .selectAll("path")
  .data(data)
  .enter()
  .append("path")
  .attr("d", d => categoryToShape(d.category)(rScale(d.value)))
  .attr("transform", d => {
    const cx = xScale(d.name) + xScale.bandwidth()/2;
    const cy = svgHeight/2;
    return `translate(${cx},${cy})`;
  })
  .attr("fill", "none")
  .attr("stroke", "#0033cc")
  .attr("stroke-width", 3);
```

### Key ideas:

- Each shape is centered using a `translate()` transform.  
- The correct path generator is selected by category.  
- Shape size comes from the radius scale (`rScale`).  
- All shapes share the same style (blue stroke).

---

## 6. Adding an X Axis

```js
svg.append("g")
  .attr("transform", `translate(0, ${svgHeight - 20})`)
  .call(d3.axisBottom(xScale));
```

This provides labels for each category.

---

## Key Concepts Learned

- How to write multiple shape generator functions  
- Using a function to map categories → shape generators  
- How to scale shapes dynamically with `scaleLinear()`  
- How to center shapes using SVG transforms  
- How to render mixed geometry on one chart  
- How D3’s data binding works with custom paths  

This lesson gives you the skills to create **data-driven custom icons**, glyphs, and visual encodings—useful for advanced dashboards and creative visualizations.
