# D3.js Course — Introduction

## Overview

Welcome to this D3.js learning repository!  
This course is designed for students who already have basic knowledge of **HTML**, **CSS**, and **JavaScript**, and want to learn how to build **interactive, data-driven visualizations** using **D3.js**.

The course is structured as a sequence of lessons, each one contained in its own folder with its own `README.md` file.  
Every lesson corresponds to a single JavaScript file and introduces new D3 concepts through practical examples.

By the end of this course, you will be able to create charts, shapes, scales, tooltips, interactivity, and fully custom SVG geometry using D3.js.

---

## What You Will Learn

Across these lessons, you will progressively build strong skills in D3.js, including:

### ✔ Selections and Data Binding  
How to select DOM and SVG elements, attach data to them, and update their attributes dynamically.

### ✔ Enter–Update–Exit Pattern  
Understanding how D3 handles data-driven creation and removal of elements.

### ✔ Working with SVG  
Drawing text, shapes, circles, paths, custom geometry, and transforming elements.

### ✔ Scales  
Using `scaleLinear()`, `scaleBand()`, and other scale functions to map data values to screen coordinates, colors, radii, sizes, or angles.

### ✔ Axes  
Automatically generating and customizing axes using `d3.axisBottom()` and `d3.axisLeft()`.

### ✔ Loading External Data  
Using `d3.json()` to import data and render dynamic visualizations.

### ✔ Interactive Visualizations  
Adding tooltips, hover effects, buttons, sorting interactions, and re-rendering charts.

### ✔ Custom Shape Generation  
Building shapes with SVG path commands and generating geometry procedurally.

---

## Course Structure

The course is organized in lessons from simple to advanced topics:

| Lesson | Topic |
|--------|-------|
| **[Lesson 1](./01-introduction/README.md)** | Basic selections and SVG text placement |
| **[Lesson 2](./02-binding-1/README.md)** | Simple bar chart |
| **[Lesson 3](./03-binding-2/README.md)** | Scales: bar height and circle radius |
| **[Lesson 4](./04-axis/README.md)** | Bar chart with axes |
| **[Lesson 5](./05-tooltips/README.md)** | Tooltips and interactivity |
| **[Lesson 6](./06-json/README.md)** | Loading external JSON data |
| **[Lesson 7](./07-interactivity/README.md)** | Sorting data and re-rendering charts |
| **[Lesson 8](./08-svg-1/README.md)** | Sorting + circle charts |
| **[Lesson 9](./09-svg-2/README.md)** | Custom shapes with SVG paths (stars) |
| **[Lesson 10](./10-svg-3/README.md)** | Multiple shape generators by category |
| **[Lesson 11](./11-svg-4/README.md)** | TBD |
| *(More lessons will be added)* | |

Each lesson includes:

- A standalone JS example  
- A complete markdown explanation  
- Key concepts section  
- Downloadable `README.md` file  

---

## How to Use This Repository

1. **Open each lesson folder** to read the explanation and run the JS example.
2. To test examples locally, you should run a local server (because D3 can’t load external files without one). For example:

```bash
npx http-server
```

or using VS Code’s **Live Server** extension.

3. Open your browser console to inspect logs, warnings, and debug outputs.

---

## Requirements

To follow this course comfortably, you should already know:

- HTML tags and structure  
- CSS basics (classes, positioning)  
- JavaScript fundamentals (variables, arrays, functions, events)  

No previous experience with D3.js or data visualization is required.

---

## Goals of This Course

By the end of the course, you will be able to:

- Understand how D3 thinks about data and DOM manipulation  
- Build meaningful visual representations of structured data  
- Add interactivity, custom shapes, and multi-step animations  
- Combine procedural SVG generation with data-driven logic  
- Create clean, reusable, scalable visualization code  

---

## Contribution & Extensions

The material is intentionally modular, so you can:

- Add your own lessons  
- Extend visualizations  
- Build a portfolio of D3 examples  
- Export examples into more complex dashboards or apps  

---

## Ready to Begin?

Start with **Lesson 1** and follow the progression step by step.  
Each lesson builds on the previous one and introduces key D3 principles that will help you master the library in a practical and intuitive way.

Happy visualizing!
