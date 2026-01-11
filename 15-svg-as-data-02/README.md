# Lesson 15 — SVG as Data: Scroll-Driven “Feature Reveal + Tooltip” with D3.js

## Overview
This document builds directly on Version 1 of the scroll-driven SVG visualization.
Version 2 introduces a fully data-driven tooltip system tied to the active
SVG group. As users scroll, tooltips appear over specific features inside the
SVG, showing explanations and numeric data pulled from JSON.

The core of this upgrade is the function **updateTooltipForProp()**, which
calculates where the tooltip must appear on the screen and fills its content
from JSON metadata.

---

## Why This Update Exists
Version 1 showed only visual highlighting while scrolling. Version 2 goes
further: each highlighted feature now displays live information contextualized
as a tooltip. It becomes not just visual storytelling, but data storytelling.

---

## Tooltip Anchors Inside SVG
Each feature group (<g>) now contains a small invisible circle:

```
<circle class="tooltip-anchor" cx="200" cy="60" r="3" opacity="0"/>
```

These anchors represent “attachment points”—the locations where tooltips should appear.

---

## JSON Metadata Now Contains Data Fields

Example JSON entry:

```
{
  "id": "step-3",
  "label": "Yolk Zone",
  "description": "An inner region that suggests where the yolk would sit.",
  "value": 35,
  "unit": "%",
  "metric": "Yolk volume"
}
```

---

## The Core Function: updateTooltipForProp()

This function performs 4 essential tasks:

### 1. Finds the correct SVG geometry
By selecting the <g> group matching the current step id, and then selecting
the internal tooltip anchor circle:

```js
const groupSel = svgRoot.select(`#${prop.id}`);
const anchorSel = groupSel.select(".tooltip-anchor");
```

This ensures tooltip placement is not generic—it is tied to a specific location chosen in SVG design.

---

### 2. Reads SVG coordinates
Using getBBox(), we access the anchor’s position in SVG space:

```js
bbox = anchorNode.getBBox();
```

These values reflect internal SVG coordinates, not screen pixels.

---

### 3. Converts SVG space → screen space
SVG coordinate systems scale as their container scales.
To map SVG geometry to browser pixel locations, the function applies:

```js
const pt = svgEl.createSVGPoint();
const ctm = anchorNode.getScreenCTM();
const global = pt.matrixTransform(ctm);
```

This matrix transformation guarantees the tooltip follows the anchor even when the window is resized or zoomed.

---

### 4. Updates tooltip content and position

```js
tooltipEl.innerHTML = `
  <strong>${metricPart}</strong><br>
  ${valuePart}<br>
  <span>${prop.description}</span>
`;

tooltipEl.style.left = `${global.x + 10}px`;
tooltipEl.style.top = `${global.y - 10}px`;
```

The tooltip is placed near the anchor (+/- offsets for readability),
and populates text using data from JSON.

---

## Resulting Learning Outcome

Students see how:

- geometry becomes interactivity,
- JSON becomes meaning,
- SVG becomes an indexed data container,
- and scrolling becomes a narrative structure.

Version 2 transforms the project into a professional-standard visualization pattern used in:

- news graphics,
- data art,
- scientific reporting,
- and interactive museum installations.

---

## Suggested Classroom Tasks

- Move a tooltip anchor inside the SVG and observe position changes.  
- Add new numeric fields to JSON and bind them into the tooltip.  
- Experiment removing getScreenCTM() to explore why matrix mapping matters.  
- Design multiple anchors per group to attach multi-line annotation.

