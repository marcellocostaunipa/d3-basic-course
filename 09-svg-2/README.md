# Lesson 9 — Drawing Custom SVG Shapes in D3.js (Stars)

## Overview

In this lesson, you will learn how to create **custom SVG shapes** using D3.js by manually generating SVG path strings.  
Instead of drawing bars or circles, we’ll draw **star-like radial shapes** whose size depends on the data values.

You will learn:

- How to manually construct SVG path commands  
- How to compute shape geometry based on scales  
- How to position shapes using `transform`  
- How to generate many shapes from a dataset  
- How to use `each()` for per-element logic  

This introduces you to a new level of D3: building **procedural geometry**.

---

## 1. Dataset

The example uses a simple array of objects:

```js
const data = [
  { name: "A", value: 30 },
  { name: "B", value: 80 },
  { name: "C", value: 50 },
  { name: "D", value: 95 },
  { name: "E", value: 40 }
];
```

Each data point will correspond to one custom star shape.

---

## 2. Creating the SVG and Scales

SVG setup:

```js
const svg = d3
    .select("#visualization .shapes")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
```

### Band scale (horizontal)

```js
const xScale = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([40, svgWidth - 20])
  .padding(0.3);
```

### Linear scale (vertical)

```js
const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .range([svgHeight - 20, 20]);
```

These scales define where each shape will appear.

---

## 3. Generating the Star Shape

The function `starPath(d)` produces both:

- the **path string** (`d` attribute)
- the **transform** string to position the star

```js
function starPath(d) {
  const barWidth = xScale.bandwidth();
  const centerX  = xScale(d.name) + barWidth / 2;
  const topY     = yScale(d.value);
  const bottomY  = yScale(0);

  // vertical center of the star
  const centerY  = topY + (bottomY - topY) / 2;

  // spoke length proportional to value
  const valueHeight = bottomY - topY;
  const spokeLength = valueHeight * 0.25;
```

### Building the star path

```js
let path = "";
for (let angle = 0; angle < 360; angle += 60) {
  const rad = angle * Math.PI / 180;
  const x2 = Math.cos(rad) * spokeLength;
  const y2 = Math.sin(rad) * spokeLength;
  path += `M0,0 L${x2},${y2} `;
}
```

- We loop through angles 0°, 60°, 120°, 180°, 240°, 300°  
- Each iteration draws a line from `(0,0)` to a point on a circle  
- Putting all these lines together creates a radial “star” shape

Finally, the function returns:

```js
return {
  d: path,
  transform: `translate(${centerX}, ${centerY})`
};
```

---

## 4. Drawing the Stars

We create a group to hold all paths:

```js
const starsGroup = svg.append("g");
```

Binding and drawing:

```js
starsGroup.selectAll("path")
  .data(data)
  .enter()
  .append("path")
  .each(function(d) {
    const star = starPath(d);
    d3.select(this)
      .attr("d", star.d)
      .attr("transform", star.transform);
  })
  .attr("fill", "none")
  .attr("stroke", "#0033cc")
  .attr("stroke-width", 3);
```

### Key details

- `.each()` allows us to compute a different path for each data point  
- Each path is centered using a translation  
- The star shape expands or contracts depending on the data value  
- The stroke color helps the geometry stand out  

---

## 5. What You Learned

In this lesson, you learned how to:

- Create fully custom SVG shapes using path strings  
- Generate geometry procedurally using trigonometry  
- Place shapes in scaled positions using transform  
- Use band scales for spacing categorical shapes  
- Use linear scales to size geometric features  
- Build reusable shape generator functions  

This is your first step toward advanced data-driven graphics such as:

- custom glyphs  
- node-link visualizations  
- radar/spider charts  
- generative art with D3  
