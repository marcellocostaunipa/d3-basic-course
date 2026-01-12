// main.js
// D3-based SVG visualization with scroll-driven activation
// Data is loaded from data/egg-data.json
// SVG is loaded from svg/egg.svg and controlled via IDs

let properties = [];
let svgRoot = null;
let currentActiveIndex = 0;
let tooltipEl = null;

document.addEventListener("DOMContentLoaded", () => {
  d3.json("data/egg-data.json")
    .then((data) => {
      properties = data.properties || [];
      buildSteps(properties);
      initTooltip();

      // Wait for the SVG to load
      return initSvg();
    })
    .then(() => {
      setupScrollHandling();
      setActiveStep(0); // start with first property
    })
    .catch((error) => {
      console.error("Initialization error:", error);
    });
});

/**
 * Build the narrative steps in the left column from JSON.
 */
function buildSteps(props) {
  const stepsContainer = document.getElementById("steps");

  props.forEach((prop, index) => {
    const step = document.createElement("article");
    step.className = "step";
    step.dataset.index = index;

    const indexEl = document.createElement("div");
    indexEl.className = "step-index";
    indexEl.textContent = `Step ${index + 1}`;

    const title = document.createElement("h2");
    title.textContent = prop.label;

    const body = document.createElement("p");
    body.textContent = prop.description;

    step.appendChild(indexEl);
    step.appendChild(title);
    step.appendChild(body);

    stepsContainer.appendChild(step);
  });
}

/**
 * Load the external SVG and append it inside #svg-viz.
 * Returns a promise so we can wait for it before using svgRoot.
 */
function initSvg() {
  return d3.xml("svg/egg.svg").then((xml) => {
    const container = document.getElementById("svg-viz");

    // Clear anything that was there before (just in case)
    container.innerHTML = "";

    // Import and append the loaded SVG element
    const imported = document.importNode(xml.documentElement, true);
    container.appendChild(imported);

    // Store reference for later selection
    svgRoot = d3.select("#svg-viz svg");

    // Faint baseline for everything
    svgRoot.selectAll("g").style("opacity", 0.15);
  });
}

/**
 * Create a tooltip element in the DOM (positioned over the SVG).
 */
function initTooltip() {
  tooltipEl = document.createElement("div");
  tooltipEl.className = "svg-tooltip";
  tooltipEl.style.opacity = 0;
  document.body.appendChild(tooltipEl);
}

/**
 * Set up scroll-based activation using IntersectionObserver.
 */
function setupScrollHandling() {
  const stepElements = Array.from(document.querySelectorAll(".step"));

  const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const index = Number(entry.target.dataset.index);

      if (entry.isIntersecting) {
        setActiveStep(index);
      } else if (currentActiveIndex === index) {
        // This step just got unpinned → hide everything
        clearActiveStep();
      }
    });
  },
  { threshold: 0.4 }
);

  stepElements.forEach((el) => observer.observe(el));
}

function clearActiveStep() {
  currentActiveIndex = -1;

  // Remove active card highlight
  document.querySelectorAll(".step").forEach(step =>
    step.classList.remove("active")
  );

  // Fade all SVG layers back to baseline
  if (svgRoot) {
    svgRoot
      .selectAll("g")
      .transition()
      .duration(300)
      .style("opacity", 0.15);
  }

  hideTooltip();
}


/**
 * Activate a specific step and update visible layers from the external SVG.
 */
function setActiveStep(activeIndex) {
  if (!svgRoot) return;

  currentActiveIndex = activeIndex;

  // Highlight active step card
  document.querySelectorAll(".step").forEach((step, i) =>
    step.classList.toggle("active", i === activeIndex)
  );

  const prop = properties[activeIndex];
  if (!prop) {
    hideTooltip();
    return;
  }

  const id = prop.id; // must match <g id="step-1"> etc.

  // Fade everything to low opacity
  svgRoot
    .selectAll("g")
    .transition()
    .duration(500)
    .style("opacity", 0.15);

  // Show current property group fully visible
  svgRoot
    .select(`#${id}`)
    .transition()
    .duration(500)
    .style("opacity", prop.opacity != null ? prop.opacity : 1)
    .on("end", () => {
      // Once the transition finishes, update tooltip position/content
      updateTooltipForProp(prop);
    });
}

/**
 * Update tooltip content and position based on the current property.
 */
function updateTooltipForProp(prop) {
  if (!svgRoot || !tooltipEl) return;

  const groupSel = svgRoot.select(`#${prop.id}`);
  if (groupSel.empty()) {
    hideTooltip();
    return;
  }

  // Find anchor element inside group
  const anchorSel = groupSel.select(".tooltip-anchor");
  if (anchorSel.empty()) {
    hideTooltip();
    return;
  }

  const anchorNode = anchorSel.node();

  // Get anchor box
  let bbox;
  try {
    bbox = anchorNode.getBBox();
  } catch (e) {
    hideTooltip();
    return;
  }

  // Convert anchor coordinates to screen space
  const svgEl = svgRoot.node();
  const pt = svgEl.createSVGPoint();
  pt.x = bbox.x + bbox.width / 2;
  pt.y = bbox.y + bbox.height / 2;

  const ctm = anchorNode.getScreenCTM();
  if (!ctm) {
    hideTooltip();
    return;
  }

  const global = pt.matrixTransform(ctm);

  // Tooltip content
  const valuePart =
    prop.value != null ? `${prop.value}${prop.unit ? prop.unit : ""}` : "";
  const metricPart = prop.metric ? prop.metric : prop.label;

  tooltipEl.innerHTML = `
    <strong>${metricPart}</strong><br>
    ${valuePart ? valuePart + "<br>" : ""}
    <!-- <span class="tooltip-desc">${prop.description}</span> -->
  `;

  // Tooltip positioning — only tiny offsets now
  tooltipEl.style.left = `${global.x + 10}px`;
  tooltipEl.style.top  = `${global.y - 10}px`;
  tooltipEl.style.opacity = 1;
}


/**
 * Hide the tooltip (e.g., when no active property).
 */
function hideTooltip() {
  if (tooltipEl) {
    tooltipEl.style.opacity = 0;
  }
}
