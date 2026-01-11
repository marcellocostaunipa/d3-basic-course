// main.js
// D3-based SVG visualization with scroll-driven activation
// Data is loaded from data/egg-data.json
// SVG is loaded from svg/egg.svg and controlled via IDs

let properties = [];
let svgRoot = null;

document.addEventListener("DOMContentLoaded", () => {
  d3.json("data/egg-data.json")
    .then((data) => {
      properties = data.properties || [];
      buildSteps(properties);

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
 * Set up scroll-based activation using IntersectionObserver.
 */
function setupScrollHandling() {
  const stepElements = Array.from(document.querySelectorAll(".step"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.dataset.index);
          setActiveStep(index);
        }
      });
    },
    {
      threshold: 0.6
    }
  );

  stepElements.forEach((el) => observer.observe(el));
}

/**
 * Activate a specific step and update visible layers from the external SVG.
 */
function setActiveStep(activeIndex) {
  if (!svgRoot) return;

  // Highlight active step card
  document.querySelectorAll(".step").forEach((step, i) =>
    step.classList.toggle("active", i === activeIndex)
  );

  const prop = properties[activeIndex];
  if (!prop) return;

  const id = prop.id; // must match <g id="shell">, etc.

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
    .style("opacity", prop.opacity != null ? prop.opacity : 1);
}
