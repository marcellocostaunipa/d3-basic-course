# Lesson 16 — Pinned Scrollytelling with SVG as Data

This lesson introduces a **pinned scrollytelling component** where a narrative column drives the activation of layered SVG graphics.  
Unlike typical chart-based scrollytelling, here **the SVG itself is treated as a dataset**: every visual layer is an addressable data object that can be revealed, faded, and annotated through scroll.

The result is a lightweight, editorial-style component that feels closer to a magazine layout than to a dashboard — designed to make data *feel* intentional, not merely visible.

---

## What this lesson teaches

- How to build a pinned scrollytelling layout
- How to treat SVG layers as data entities
- How to drive SVG state using `IntersectionObserver`
- How to attach tooltips to SVG geometry using screen-space transforms
- How to structure JSON to control narrative + visuals together

---

## File structure

```
lesson-16/
│
├─ index.html
├─ css/
│   ├─ style.css
│   └─ pinned-component.css
│
├─ js/
│   └─ main.js
│
├─ data/
│   └─ egg-data.json
│
├─ svg/
│   └─ egg.svg
│
└─ img/
    └─ eggs.jpg
```

---

## Component architecture

| Left side (scroll) | Right side (visual) |
|-------------------|---------------------|
| JSON-driven narrative steps | Sticky SVG viewport |
| Scroll activates steps | SVG layers fade in/out |
| Text explains meaning | Tooltip reveals metrics |

---

## How the pinned component works (CSS anatomy)

The pinned scrollytelling effect is achieved mostly through **CSS layout mechanics**.

### Sticky visualization

```css
.pinned .viz-panel {
  position: sticky;
  top: 0;
  height: 100vh;
}
```

This keeps the visualization fixed in the viewport while the narrative scrolls.

### Viewport-sized steps

```css
.step {
  min-height: 100vh;
}
```

Each step becomes a full “chapter” in the scroll.

---

## Assignment — Mobile CSS pass

Design responsive rules for screens below `900px`.

- Stack narrative and visualization vertically
- Decide how sticky behavior should adapt on mobile
- Ensure tooltips stay visible and readable
- Reduce large font scales and excessive vertical spacing

Deliver a working mobile layout with no horizontal scrolling.

---

**Some eggs are bigger than others.**  
Not in size. In narrative weight.
