// main.js
// D3-based SVG visualization with scroll-driven activation
// Modular system for managing multiple pinned scrollytelling instances

/**
 * Configuration for each pinned scrollytelling instance
 * Each instance has its own JSON data, SVG, and container elements
 */
const INSTANCES = [
  {
    id: 1,
    jsonPath: "data/egg-data.json",
    svgPath: "svg/egg.svg",
    stepsContainerId: "steps",
    svgContainerId: "svg-viz",
  },
   {
     id: 2,
     jsonPath: "data/other-data.json",
     svgPath: "svg/other.svg",
     stepsContainerId: "steps-2",
     svgContainerId: "svg-viz-2",
   },
];

// Store instance data: key is instanceId, value is the instance state object
const instanceStates = {};

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all instances in sequence
  let chain = Promise.resolve();

  INSTANCES.forEach((config) => {
    chain = chain.then(() => initializeInstance(config));
  });

  chain.catch((error) => {
    console.error("Initialization error:", error);
  });
});


/**
 * Initialize a single instance of pinned scrollytelling
 * @param {Object} config - Instance configuration with jsonPath, svgPath, etc.
 */
function initializeInstance(config) {
  const { id, jsonPath, svgPath, stepsContainerId, svgContainerId } = config;

  // Create instance state object
  instanceStates[id] = {
    config,
    properties: [],
    svgRoot: null,
    currentActiveIndex: -1,
    tooltipEl: null,
  };

  return d3
    .json(jsonPath)
    .then((data) => {
      instanceStates[id].properties = data.properties || [];
      buildSteps(id, instanceStates[id].properties, stepsContainerId);
      initTooltip(id, svgContainerId);

      // Wait for the SVG to load
      return initSvg(id, svgPath, svgContainerId);
    })
    .then(() => {
      setupScrollHandling(id, stepsContainerId);
      setActiveStep(id, 0); // start with first property
    });
}

/**
 * Build the narrative steps in the left column from JSON.
 */
function buildSteps(instanceId, props, containerId) {
  const stepsContainer = document.getElementById(containerId);

  props.forEach((prop, index) => {
    const step = document.createElement("article");
    step.className = "step";
    step.dataset.index = index;
    step.dataset.instanceId = instanceId;

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
 * Load the external SVG and append it inside the specified container.
 * Returns a promise so we can wait for it before using svgRoot.
 */
function initSvg(instanceId, svgPath, containerId) {
  return d3.xml(svgPath).then((xml) => {
    const container = document.getElementById(containerId);

    // Clear anything that was there before (just in case)
    container.innerHTML = "";

    // Import and append the loaded SVG element
    const imported = document.importNode(xml.documentElement, true);
    container.appendChild(imported);

    // Store reference for later selection
    const svgSelector = `#${containerId} svg`;
    instanceStates[instanceId].svgRoot = d3.select(svgSelector);

    // Faint baseline for everything
    instanceStates[instanceId].svgRoot.selectAll("g").style("opacity", 0.15);
  });
}

/**
 * Create a tooltip element in the DOM (positioned over the SVG).
 */
function initTooltip(instanceId, svgContainerId) {
  const tooltipEl = document.createElement("div");
  tooltipEl.className = "svg-tooltip";
  tooltipEl.style.opacity = 0;
  tooltipEl.dataset.instanceId = instanceId;
  document.body.appendChild(tooltipEl);

  instanceStates[instanceId].tooltipEl = tooltipEl;
}

/**
 * Set up scroll-based activation using IntersectionObserver.
 */
function setupScrollHandling(instanceId, stepsContainerId) {
  const stepsContainer = document.getElementById(stepsContainerId);
  const stepElements = Array.from(
    stepsContainer.querySelectorAll(".step[data-instance-id='" + instanceId + "']")
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.dataset.index);

        if (entry.isIntersecting) {
          setActiveStep(instanceId, index);
        } else if (instanceStates[instanceId].currentActiveIndex === index) {
          // This step just got unpinned → hide everything
          clearActiveStep(instanceId);
        }
      });
    },
    { threshold: 0.4 }
  );

  stepElements.forEach((el) => observer.observe(el));
}

function clearActiveStep(instanceId) {
  const state = instanceStates[instanceId];
  state.currentActiveIndex = -1;

  // Remove active card highlight
  const stepsContainer = document.getElementById(state.config.stepsContainerId);
  stepsContainer.querySelectorAll(".step").forEach((step) =>
    step.classList.remove("active")
  );

  // Fade all SVG layers back to baseline
  if (state.svgRoot) {
    state.svgRoot
      .selectAll("g")
      .transition()
      .duration(300)
      .style("opacity", 0.15);
  }

  hideTooltip(instanceId);
}



/**
 * Activate a specific step and update visible layers from the external SVG.
 */
function setActiveStep(instanceId, activeIndex) {
  const state = instanceStates[instanceId];
  if (!state.svgRoot) return;

  state.currentActiveIndex = activeIndex;

  // Highlight active step card
  const stepsContainer = document.getElementById(state.config.stepsContainerId);
  stepsContainer.querySelectorAll(".step").forEach((step, i) =>
    step.classList.toggle("active", i === activeIndex)
  );

  const prop = state.properties[activeIndex];
  if (!prop) {
    hideTooltip(instanceId);
    return;
  }

  const id = prop.id; // must match <g id="step-1"> etc.

  // Fade everything to low opacity
  state.svgRoot
    .selectAll("g")
    .transition()
    .duration(500)
    .style("opacity", 0.15);

  // Show current property group fully visible
  state.svgRoot
    .select(`#${id}`)
    .transition()
    .duration(500)
    .style("opacity", prop.opacity != null ? prop.opacity : 1)
    .on("end", () => {
      // Once the transition finishes, update tooltip position/content
      updateTooltipForProp(instanceId, prop);
    });
}

/**
 * Update tooltip content and position based on the current property.
 */
function updateTooltipForProp(instanceId, prop) {
  const state = instanceStates[instanceId];
  if (!state.svgRoot || !state.tooltipEl) return;

  const groupSel = state.svgRoot.select(`#${prop.id}`);
  if (groupSel.empty()) {
    hideTooltip(instanceId);
    return;
  }

  // Find anchor element inside group
  const anchorSel = groupSel.select(".tooltip-anchor");
  if (anchorSel.empty()) {
    hideTooltip(instanceId);
    return;
  }

  const anchorNode = anchorSel.node();

  // Get anchor box
  let bbox;
  try {
    bbox = anchorNode.getBBox();
  } catch (e) {
    hideTooltip(instanceId);
    return;
  }

  // Convert anchor coordinates to screen space
  const svgEl = state.svgRoot.node();
  const pt = svgEl.createSVGPoint();
  pt.x = bbox.x + bbox.width / 2;
  pt.y = bbox.y + bbox.height / 2;

  const ctm = anchorNode.getScreenCTM();
  if (!ctm) {
    hideTooltip(instanceId);
    return;
  }

  const global = pt.matrixTransform(ctm);

  // Tooltip content
  const valuePart =
    prop.value != null ? `${prop.value}${prop.unit ? prop.unit : ""}` : "";
  const metricPart = prop.metric ? prop.metric : prop.label;

  state.tooltipEl.innerHTML = `
    <strong>${metricPart}</strong><br>
    ${valuePart ? valuePart + "<br>" : ""}
    <!-- <span class="tooltip-desc">${prop.description}</span> -->
  `;

  // Tooltip positioning — only tiny offsets now
  state.tooltipEl.style.left = `${global.x + 10}px`;
  state.tooltipEl.style.top = `${global.y - 10}px`;
  state.tooltipEl.style.opacity = 1;
}

/**
 * Hide the tooltip (e.g., when no active property).
 */
function hideTooltip(instanceId) {
  const state = instanceStates[instanceId];
  if (state.tooltipEl) {
    state.tooltipEl.style.opacity = 0;
  }
}
