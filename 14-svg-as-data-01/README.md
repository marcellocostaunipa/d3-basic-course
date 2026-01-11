# Lesson 14 — SVG as Data: Scroll-Driven “Feature Reveal” with D3.js

## Overview

This lesson shows a powerful idea: **an SVG can be treated as a dataset**.

Instead of drawing shapes from scratch with D3, you will:

1. **Load an external SVG file** (`svg/egg.svg`)
2. Treat its internal groups (`<g id="...">`) as “data layers”
3. Use a **JSON file** (`data/egg-data.json`) to generate a narrative (scroll steps)
4. Use **scroll** (IntersectionObserver) to **reveal one SVG feature at a time**

This is a common pattern in *scrollytelling* projects: a narrative column controls a visualization panel.

---

## What’s included in this lesson

### Files you have

- `index.html` — layout for scrollytelling (left) + visualization panel (right)
- `css/style.css` — styling for steps and sticky visualization
- `js/main.js` — loads JSON + SVG and connects scroll to SVG visibility
- `data/egg-data.json` — narrative steps + configuration (ids, labels, opacity, etc.)

### File you must provide

- `svg/egg.svg` — the actual SVG with grouped layers

> The key requirement: the SVG must contain groups with `id` attributes that match the JSON.

### Final Folder Structure

```
project/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── data/
│   └── egg-data.json
└── svg/
    └── egg.svg
```

---

## How it works (conceptually)

### 1) The JSON drives the narrative

The file `data/egg-data.json` contains a list of “properties”:

```json
{
  "properties": [
    { "id": "step-1", "label": "Shell Outline", "description": "...", "opacity": 1.0 },
    { "id": "step-2", "label": "Surface Texture", "description": "...", "opacity": 0.9 }
  ]
}
```

Each object becomes:

- one scroll “step” on the left
- one target SVG layer (by `id`) on the right

### 2) The SVG is treated like a layer stack

Your SVG should be organized like this:

```xml
<svg ...>
  <g id="step-1"> ...shell outline paths... </g>
  <g id="step-2"> ...texture dots... </g>
  <g id="step-3"> ...yolk zone... </g>
  <g id="step-4"> ...thickness band... </g>
</svg>
```

When you scroll, the JS sets all groups to low opacity, then highlights the current group.

---

## Key code walkthrough

### A) Build scroll steps from JSON

`buildSteps()` creates HTML cards based on the JSON:

- `prop.label` becomes the step title
- `prop.description` becomes the step text
- `data-index` stores the step index

This is “data-driven UI” (not just data-driven SVG).

### B) Load the SVG as an external document

```js
d3.xml("svg/egg.svg").then((xml) => {
  const imported = document.importNode(xml.documentElement, true);
  container.appendChild(imported);

  svgRoot = d3.select("#svg-viz svg");
  svgRoot.selectAll("g").style("opacity", 0.15);
});
```

Important details:

- `d3.xml()` loads the SVG as an XML document
- `document.importNode()` lets you insert it into the page
- `svgRoot.selectAll("g")` selects all the SVG groups as if they were data layers

### C) Activate steps on scroll

The lesson uses `IntersectionObserver`:

- each `.step` becomes “active” when it intersects the viewport
- the callback calls `setActiveStep(index)`

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const index = Number(entry.target.dataset.index);
      setActiveStep(index);
    }
  });
}, { threshold: 0.6 });
```

### D) Reveal the matching SVG group by ID

```js
const id = prop.id;

svgRoot.selectAll("g")
  .transition().duration(500)
  .style("opacity", 0.15);

svgRoot.select(`#${id}`)
  .transition().duration(500)
  .style("opacity", prop.opacity ?? 1);
```

This is the core of **SVG as Data**:

- the SVG’s structure (`<g id="...">`) is your “database”
- the JSON is your “controller”
- scrolling is your “interaction layer”

---

## Important note: your IDs must match

Your JSON uses:

- `step-1`
- `step-2`
- `step-3`
- `step-4`

So your SVG must include:

```xml
<g id="step-1">...</g>
<g id="step-2">...</g>
<g id="step-3">...</g>
<g id="step-4">...</g>
```

If the IDs don’t match, nothing will be highlighted (you’ll only see the faint baseline).

---

## How to run it locally

Because the lesson loads JSON and SVG via fetch, you **must use a local server**.

Example:

```bash
npx http-server
```

Then open the local URL (e.g. `http://127.0.0.1:8080/lesson-14-svg-as-data/`).

---

## Suggested upgrades (optional)

1. **Use JSON style properties**
   - Right now `stroke`, `strokeWidth`, etc. are in JSON but not applied.
   - You could apply them in `setActiveStep()`:

   ```js
   svgRoot.select(`#${id}`)
     .selectAll("*")
     .attr("stroke", prop.stroke)
     .attr("stroke-width", prop.strokeWidth);
   ```

2. **Progressive reveal**
   - Instead of highlighting only one group, you can keep previous ones visible.

3. **Add a “step indicator”**
   - Update a small UI label in the viz panel when the step changes.

---

## What you learned

- How to load an external SVG with `d3.xml()`
- How to treat SVG groups as “data layers”
- How to generate HTML from JSON
- How to connect scroll position to visualization state
- How to build a scrollytelling layout with a sticky visualization panel

---

Next: send the files for the **second SVG-as-Data lesson**, and we’ll create the next `readme.md`.

