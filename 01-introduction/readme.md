# Lesson 1 — Creating a Basic Text Visualization with D3.js

## Overview

In this first lesson, you will learn how to create a very simple visualization using **D3.js**.  
We will display a sequence of numbers inside an SVG element by binding an array of data to SVG `<text>` elements.

This lesson introduces the fundamental concepts you will use throughout the entire course:

- Checking whether D3 is loaded  
- Selecting DOM elements  
- Creating an SVG container  
- Binding data  
- Using the *enter* selection to create new elements  

---

## 1. Checking if D3.js Is Loaded

Before writing any visualization code, it is helpful to verify that D3 is available:

```js
if (d3.version) {
  console.log("D3 version: " + d3.version);
} else {
  console.log("D3 is not loaded.");
}
```

- `d3.version` returns the installed D3 version.
- This check helps detect loading issues early.

---

## 2. Creating the Dataset

We’ll work with a simple array of numbers:

```js
const numbers = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
```

These values will become the text displayed inside the SVG.

---

## 3. Creating an SVG Container

Before we can draw anything, we need an SVG element:

```js
const svg = d3.select("#visualization .graph")
  .append("svg")
  .attr("width", 500)
  .attr("height", 200);
```

### What this code does:

- `d3.select()` finds the HTML element with the selector `#visualization .graph`.
- `.append("svg")` inserts an SVG element inside it.
- `.attr("width", 500)` and `.attr("height", 200)` set the size of the SVG.

This SVG is the “canvas” for our visualization.

---

## 4. Binding Data and Creating Text Elements

This is the core of the lesson:

```js
svg.selectAll("text")
  .data(numbers)
  .enter()
  .append("text")
  .text(d => d)
  .attr("x", (d, i) => i * 50)
  .attr("y", 50);
```

### Step-by-step explanation:

#### 1. `svg.selectAll("text")`
Selects all `<text>` elements inside the SVG.  
At the start, none exist—this is intentional.

#### 2. `.data(numbers)`
Associates each number in the array with a (non-existent) `<text>` element.

#### 3. `.enter()`
Represents all data items that do not yet have matching DOM elements.  
Since no `<text>` elements exist, all numbers enter here.

#### 4. `.append("text")`
Creates one SVG `<text>` element per number.

#### 5. `.text(d => d)`
Sets the text content of each element to the corresponding number.

#### 6. `.attr("x", (d, i) => i * 50)`
Positions each number horizontally, spaced 50px apart.

#### 7. `.attr("y", 50)`
Positions all numbers 50px from the top of the SVG.

---

## 5. Visual Result

This code generates a horizontal row of numbers:

```
10 20 30 40 50 60 70 80 90 100
```

Each number is an SVG text element placed according to the data.

---

## Key Concepts Learned

- **Selections** (`d3.select`, `d3.selectAll`)
- **SVG creation**
- **Data binding** with `.data()`
- **Enter selection** with `.enter()**
- **Appending new elements**
- **Positioning elements with attributes**

These concepts are foundational for all future D3 lessons.
