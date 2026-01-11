# Lesson 13 — Bubble Map (World GeoJSON + Time Slider) in D3.js

## What you’re building

A **bubble map** is a thematic map where data points are shown as circles whose **size (and/or color)** encodes a value.

In this lesson you will build:

- a **world map** drawn from a **GeoJSON** file
- a set of **data-driven bubbles** (longitude/latitude points)
- a **time slider** to switch between years and update the bubbles

You will learn:

- loading files with `d3.json()`
- drawing GeoJSON with `d3.geoPath()` + a projection
- projecting `(lon, lat)` → `(x, y)` coordinates
- using `d3.scaleSqrt()` for bubble radius
- updating a chart with the **join pattern** (`selection.data().join(...)`)
- wiring UI controls (`<input type="range">`) to redraw

---

## Project structure

```
lesson13-bubble-map/
  index.html
  style.css
  script.js
  data/
    world.geojson        <-- you provide this
    points.json          <-- sample included
```

---

## 1) Get a World GeoJSON

You need a GeoJSON file of world countries. Two common options:

- **Natural Earth** “Admin 0 – Countries” (download and convert to GeoJSON if needed)
- Or any existing `world.geojson` dataset you already use in class

Save it as:

```
lesson13-bubble-map/data/world.geojson
```

> Why we don’t include it here: world GeoJSON can be large, and many repositories prefer to download it separately.

---

## 2) Run it with a local server

Because we are loading files with `d3.json()`, you must run a local server.

Example:

```bash
npx http-server
```

Then open the shown URL (e.g. `http://127.0.0.1:8080/lesson13-bubble-map/`).

---

## 3) How the data is structured

We use a simple JSON file `points.json` with this shape:

```json
{
  "years": [2018, 2019, 2020, 2021, 2022],
  "points": [
    { "id": "rome", "name": "Rome", "lon": 12.4964, "lat": 41.9028,
      "values": { "2018": 12, "2019": 22, "2020": 7, "2021": 18, "2022": 26 } }
  ]
}
```

- `lon` and `lat` are geographic coordinates
- `values[year]` is the numeric value for that year (bubble size)

---

## 4) Slider behavior

The slider updates:

- the label (current year)
- the bubble radii (and optional color)

The bubbles are updated via the join pattern:

```js
circles.data(points, d => d.id).join(
  enter => enter.append("circle") ...,
  update => update ...,
  exit => exit.remove()
);
```

---

## 5) Suggested extensions (optional)

- Add a **color scale** (e.g. `d3.scaleSequential()`)
- Add a **legend** for size/color
- Animate transitions between years
- Load real data (CSV) and convert it to the `points.json` format
