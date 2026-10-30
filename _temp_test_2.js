

// ==========================================================================
// CORE GLOBAL NAVIGATION & TOPIC PAGE SWITCHING SYSTEM
// ==========================================================================
window.VALID_PAGES = [
  "pbi-dashboard",
  "map-section",
  "estates-177",
  "stg-analytics",
  "scrolly-journey",
  "auctions",
  "exports",
  "domestic",
  "records",
  "admin-panel"
];

window.PAGE_TITLES = {
  "pbi-dashboard": "Power BI Dashboard",
  "map-section": "Heritage Estates Satellite Map",
  "estates-177": "177 Corporate Estates Census",
  "stg-analytics": "Small Tea Growers 2026 Horizon",
  "scrolly-journey": "The Tea Journey (Agronomy)",
  "auctions": "Auctions & Realization",
  "exports": "Global Exports & Trade",
  "domestic": "Interstate Trade & Seasonal Flushes",
  "records": "Historical Production Registry",
  "admin-panel": "Admin Management Panel"
};

window.toggleSidebar = function(open) {
  var sb = document.getElementById("app-sidebar");
  var backdrop = document.getElementById("sidebar-backdrop");
  if(!sb) return;
  if(open) {
    sb.classList.add("open");
    if(backdrop) backdrop.classList.add("active");
  } else {
    sb.classList.remove("open");
    if(backdrop) backdrop.classList.remove("active");
  }
};

window.navigateToPage = function(pageId, event) {
  if(event) {
    try { event.preventDefault(); } catch(e){}
  }
  if(!pageId || window.VALID_PAGES.indexOf(pageId) === -1) {
    pageId = "pbi-dashboard";
  }

  console.log("Navigating to page topic:", pageId);

  // 1. Show only the targeted page-view container, hide all others
  var views = document.querySelectorAll(".page-view");
  views.forEach(function(v){
    v.classList.remove("active");
    v.style.display = "none";
  });
  var targetView = document.getElementById("page-" + pageId);
  if(targetView) {
    targetView.classList.add("active");
    targetView.style.display = "block";
    // Force reveal of any animated components inside view
    if(typeof targetView.querySelectorAll === "function") {
      var reveals = targetView.querySelectorAll(".reveal-on-scroll");
      reveals.forEach(function(r){ r.classList.add("is-revealed"); });
    }
  }

  // 2. Update active highlight in sidebar items
  var navItems = document.querySelectorAll(".sidebar-nav-item");
  navItems.forEach(function(item){
    if(item.getAttribute("data-page") === pageId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // 3. Update topbar breadcrumbs & topic jump dropdown
  var crumbEl = document.getElementById("topbar-current-page");
  if(crumbEl) {
    crumbEl.textContent = window.PAGE_TITLES[pageId] || "Power BI Dashboard";
  }
  var dropEl = document.getElementById("topic-jump-dropdown");
  if(dropEl) {
    dropEl.value = pageId;
  }

  // 4. Close mobile sidebar drawer if open
  window.toggleSidebar(false);

  // 5. Smooth scroll window to top
  if(typeof window.scrollTo === "function") {
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch(e){ window.scrollTo(0, 0); }
  }

  // 6. Update URL hash without reload
  try {
    if(window.location.hash !== "#" + pageId) {
      history.pushState(null, null, "#" + pageId);
    }
  } catch(e) {
    window.location.hash = "#" + pageId;
  }

  // 7. Refresh responsive canvases / charts
  setTimeout(function(){
    if(typeof charts !== "undefined" && charts && charts.length) {
      charts.forEach(function(c){
        try { c.resize(); } catch(e){}
      });
    }
    if(typeof pbiSectorChart !== "undefined" && pbiSectorChart) {
      try { pbiSectorChart.resize(); } catch(e){}
    }
    if(typeof pbiPricesChart !== "undefined" && pbiPricesChart) {
      try { pbiPricesChart.resize(); } catch(e){}
    }
    if(pageId === "map-section" && typeof renderDibrugarhMap === "function") {
      renderDibrugarhMap();
    }
    if(pageId === "stg-analytics" && typeof renderSTG === "function") {
      renderSTG();
    }
    if(pageId === "estates-177" && typeof renderEstates === "function") {
      renderEstates();
    }
    if(pageId === "admin-panel" && typeof renderAdminSTGTable === "function") {
      renderAdminSTGTable();
    }
  }, 40);
};

// Also attach direct click listeners to all sidebar items for redundant reliability
document.addEventListener("DOMContentLoaded", function(){
  var navLinks = document.querySelectorAll(".sidebar-nav-item");
  navLinks.forEach(function(link){
    link.addEventListener("click", function(e){
      var pg = this.getAttribute("data-page");
      if(pg) {
        window.navigateToPage(pg, e);
      }
    });
  });
});


// ==========================================================================
// SCROLL-DRIVEN SCRIPT INTERSECTIONS & COUNTERS
// ==========================================================================

window.addEventListener("scroll", function(){
  var scrollY = window.scrollY || document.documentElement.scrollTop;
  var totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
  var bar = document.getElementById("scroll-progress");
  if(bar && !CSS.supports("animation-timeline: scroll()")) {
    bar.style.width = progress + "%";
  }

  var btt = document.getElementById("back-to-top");
  if(btt) {
    if(scrollY > 400) btt.classList.add("visible");
    else btt.classList.remove("visible");
  }
}, { passive: true });

document.getElementById("back-to-top").addEventListener("click", function(){
  window.scrollTo({ top: 0, behavior: "smooth" });
});

var revealElements = document.querySelectorAll(".reveal-on-scroll");
if("IntersectionObserver" in window) {
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        var counters = entry.target.querySelectorAll(".counter:not(.counted)");
        counters.forEach(animateCounter);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealElements.forEach(function(el){ revealObserver.observe(el); });
} else {
  revealElements.forEach(function(el){ el.classList.add("is-revealed"); });
}

function animateCounter(el) {
  el.classList.add("counted");
  var target = parseFloat(el.getAttribute("data-target")) || 0;
  var decimals = parseInt(el.getAttribute("data-decimal")) || 0;
  var duration = 1400;
  var startTime = null;

  function updateCount(timestamp) {
    if(!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var ease = 1 - Math.pow(1 - progress, 3);
    var current = target * ease;
    
    if(decimals > 0) {
      el.textContent = current.toFixed(decimals);
    } else {
      el.textContent = Math.round(current).toLocaleString();
    }

    if(progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      el.textContent = decimals > 0 ? target.toFixed(decimals) : Math.round(target).toLocaleString();
    }
  }
  requestAnimationFrame(updateCount);
}

// Scrollytelling Interactive Journey Steps
var scrollySteps = document.querySelectorAll(".scrolly-step");
var scrollyBadge = document.getElementById("scrolly-badge");
var scrollyTitle = document.getElementById("scrolly-title");
var scrollyDesc = document.getElementById("scrolly-desc");
var scrollyStat = document.getElementById("scrolly-stat");

var STEP_DATA = {
  "1": {
    badge: "Stage 1 of 4 • Field Plucking",
    title: "Dawn Harvest: Two Leaves and a Bud",
    desc: "At first light across Dibrugarh's 37,254 hectares, over 127,000 workers begin the fine plucking ritual, selecting only the tender terminal bud and two adjoining leaves before the heat dissolves volatile aromatic compounds.",
    stat: "220.48 Million kg Harvested Annually"
  },
  "2": {
    badge: "Stage 2 of 4 • Leaf Processing",
    title: "Withering, Rolling & CTC Maceration",
    desc: "Fresh leaf is aerated in conditioning troughs for 14 hours to reduce moisture to 65%. It is then gently rolled for Tippy Orthodox or cut, torn, and curled in heavy cylindrical CTC rollers for punchy liquoring.",
    stat: "70.11 Million kg Made Tea Output"
  },
  "3": {
    badge: "Stage 3 of 4 • Aroma Development",
    title: "Enzymatic Fermentation & Firing",
    desc: "Under precise 24°C temperature and 90% humidity, polyphenol oxidase transforms catechins into theaflavins and thearubigins, creating Assam's celebrated golden ring and malty richness.",
    stat: "Spike to ₹450–₹520/kg in Second Flush"
  },
  "4": {
    badge: "Stage 4 of 4 • Commerce & Shipping",
    title: "Electronic Auctions & Global Export",
    desc: "Teas are cataloged, cupped by professional brokers, and traded at GTAC before containerized transit via Kolkata Port to over 30 countries and interstate dispatches across India.",
    stat: "178.6 M kg North India Export Volume"
  }
};

function activateStep(stepNum) {
  scrollySteps.forEach(function(s){ s.classList.remove("active"); });
  var activeEl = document.querySelector('.scrolly-step[data-step="'+stepNum+'"]');
  if(activeEl) activeEl.classList.add("active");

  var d = STEP_DATA[stepNum];
  if(d && scrollyTitle) {
    scrollyBadge.textContent = d.badge;
    scrollyTitle.textContent = d.title;
    scrollyDesc.textContent = d.desc;
    scrollyStat.textContent = d.stat;
  }
}

scrollySteps.forEach(function(step){
  step.addEventListener("mouseenter", function(){ activateStep(this.getAttribute("data-step")); });
  step.addEventListener("click", function(){ activateStep(this.getAttribute("data-step")); });
});

if("IntersectionObserver" in window) {
  var stepObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting) {
        activateStep(entry.target.getAttribute("data-step"));
      }
    });
  }, { threshold: 0.6 });
  scrollySteps.forEach(function(s){ stepObserver.observe(s); });
}

// Active navigation highlight
var navLinks = document.querySelectorAll(".nav-menu a");
var sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", function(){
  var scrollPos = window.scrollY + 120;
  sections.forEach(function(sec){
    var top = sec.offsetTop;
    var height = sec.offsetHeight;
    var id = sec.getAttribute("id");
    if(scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(function(a){
        a.classList.remove("active");
        if(a.getAttribute("href") === "#" + id) {
          a.classList.add("active");
        }
      });
    }
  });
}, { passive: true });

// ==========================================================================
// POWER BI INTERACTIVE ENGINE (SLICERS & VISUALS)
// ==========================================================================
var pbiSectorChart = null;
var pbiPricesChart = null;

function initPbiCharts() {
  var ctx1 = document.getElementById("pbi_chart_sector");
  if(ctx1) {
    pbiSectorChart = new Chart(ctx1, {
      type: "doughnut",
      data: {
        labels: ["Medium Estates (160.18 M kg)", "STG Smallholders (115.5 M kg)", "Small Estates (36.67 M kg)", "Large Estates (23.63 M kg)"],
        datasets: [{
          data: [160.18, 115.5, 36.67, 23.63],
          backgroundColor: ["#34d399", "#84cc16", "#38bdf8", "#fbbf24"],
          borderColor: "#ffffff",
          borderWidth: 2.5,
          hoverOffset: 6
        }]
      },
      options: {
        maintainAspectRatio: false,
        cutout: "66%",
        plugins: {
          legend: { 
            position: "right", 
            labels: { 
              font: { family: "'Public Sans', sans-serif", size: 11.5 },
              usePointStyle: true,
              boxWidth: 8,
              boxHeight: 8,
              padding: 12
            } 
          },
          tooltip: {
            backgroundColor: "rgba(15, 36, 19, 0.92)",
            cornerRadius: 8,
            callbacks: {
              label: function(c){ return " " + c.label + ": " + c.raw + " M kg"; }
            }
          }
        }
      }
    });
  }

  var ctx2 = document.getElementById("pbi_chart_prices");
  if(ctx2) {
    pbiPricesChart = new Chart(ctx2, {
      type: "bar",
      data: {
        labels: ["Orthodox Whole Leaf", "CTC Leaf Grades", "Quick Brew Dust", "All-In Average"],
        datasets: [
          { label: "2024 Realized (₹/kg)", data: [275.17, 224.69, 185.30, 225.72], backgroundColor: "#94a3b8", borderRadius: 6 },
          { label: "2025 Realized (₹/kg)", data: [292.40, 207.14, 172.50, 204.87], backgroundColor: "#38bdf8", borderRadius: 6 },
          { label: "2026 Horizon (₹/kg)", data: [298.50, 218.40, 178.20, 232.50], backgroundColor: "#84cc16", borderRadius: 6 }
        ]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: { 
            beginAtZero: true, 
            grid: { color: "rgba(0, 0, 0, 0.05)" },
            title: { display: true, text: "₹ / kg", font: { family: "'Public Sans', sans-serif", size: 12 } } 
          },
          x: { 
            grid: { display: false },
            ticks: { font: { family: "'Public Sans', sans-serif", size: 11 } } 
          }
        },
        plugins: {
          legend: { 
            labels: { 
              font: { family: "'Public Sans', sans-serif", size: 11.5 },
              usePointStyle: true,
              boxWidth: 8,
              boxHeight: 8
            } 
          },
          tooltip: {
            backgroundColor: "rgba(15, 36, 19, 0.92)",
            cornerRadius: 8
          }
        }
      }
    });
  }
}

function updatePbiDashboard() {
  var sYr = document.getElementById("slicer-year");
  var sSec = document.getElementById("slicer-sector");
  var sVar = document.getElementById("slicer-variety");
  var sCir = document.getElementById("slicer-circle");

  var yr = sYr ? sYr.value : "2026";
  var sec = sSec ? sSec.value : "ALL";
  var varType = sVar ? sVar.value : "ALL";
  var cir = sCir ? sCir.value : "ALL";

  var filterText = [];
  if(yr !== "2026") filterText.push("Year: " + yr);
  if(sec !== "ALL") filterText.push("Sector: " + sec);
  if(varType !== "ALL") filterText.push("Variety: " + varType);
  if(cir !== "ALL") filterText.push("Circle: " + cir);
  
  var sumEl = document.getElementById("pbi-filter-summary");
  if(sumEl) sumEl.textContent = filterText.length > 0 ? filterText.join(" | ") : "All Sectors & Regions";

  // Dynamic calculations based on slicers
  var leaf = yr === "2026" ? (typeof PORTAL_STATE !== "undefined" ? PORTAL_STATE.green_leaf_mkg : 235.00) : (yr === "2025" ? 232.00 : (yr === "2024" ? 228.00 : 220.48));
  var madeTea = yr === "2026" ? (typeof PORTAL_STATE !== "undefined" ? PORTAL_STATE.made_tea_mkg : 74.70) : (leaf * 0.318);
  var price = yr === "2026" ? (typeof PORTAL_STATE !== "undefined" ? PORTAL_STATE.p_gtac : 232.50) : (yr === "2025" ? 228.40 : (yr === "2024" ? 224.69 : 220.10));
  var units = (typeof PORTAL_STATE !== "undefined" ? (PORTAL_STATE.estates_count + PORTAL_STATE.stg_count) : 29948);

  if(sec === "ESTATES") {
    leaf = yr === "2026" ? 122.50 : 120.48;
    madeTea = leaf * 0.318;
    units = (typeof PORTAL_STATE !== "undefined" ? PORTAL_STATE.estates_count : 177);
  } else if(sec === "STG") {
    leaf = yr === "2026" ? 112.50 : 100.00;
    madeTea = leaf * 0.318;
    units = (typeof PORTAL_STATE !== "undefined" ? PORTAL_STATE.stg_count : 29771);
    price = yr === "2026" ? 208.50 : 195.40;
  }

  if(varType === "ORTHODOX") {
    price = yr === "2026" ? (typeof PORTAL_STATE !== "undefined" ? PORTAL_STATE.p_orthodox : 298.50) : (yr === "2025" ? 292.40 : 275.17);
  } else if(varType === "DUST") {
    price = yr === "2026" ? (typeof PORTAL_STATE !== "undefined" ? PORTAL_STATE.p_dust : 178.20) : (yr === "2025" ? 172.50 : 185.30);
  } else if(varType === "CTC") {
    price = yr === "2026" ? (typeof PORTAL_STATE !== "undefined" ? PORTAL_STATE.p_ctc : 218.40) : (yr === "2025" ? 207.14 : 224.69);
  }

  if(cir === "Chabua") { leaf = 54.2; madeTea = 17.2; units = 1882; }
  else if(cir === "Dibrugarh West") { leaf = 58.6; madeTea = 18.6; units = 2488; }
  else if(cir === "Naharkatia") { leaf = 46.8; madeTea = 14.8; units = 1656; }
  else if(cir === "Tingkhong") { leaf = 42.5; madeTea = 13.5; units = 1614; }
  else if(cir === "Dibrugarh East") { leaf = 28.4; madeTea = 9.0; units = 957; }

  leaf = parseFloat(leaf) || 0;
  madeTea = parseFloat(madeTea) || 0;
  price = parseFloat(price) || 0;

  var kLeaf = document.getElementById("pbi-kpi-leaf");
  var kTea = document.getElementById("pbi-kpi-tea");
  var kPrice = document.getElementById("pbi-kpi-price");
  var kUnits = document.getElementById("pbi-kpi-units");

  if(kLeaf) kLeaf.innerHTML = leaf.toFixed(2) + ' <span style="font-size:15px;color:var(--ink-soft)">M kg</span>';
  if(kTea) kTea.innerHTML = madeTea.toFixed(2) + ' <span style="font-size:15px;color:var(--ink-soft)">M kg</span>';
  if(kPrice) kPrice.innerHTML = '₹' + price.toFixed(2) + ' <span style="font-size:15px;color:var(--ink-soft)">/kg</span>';
  if(kUnits) kUnits.innerHTML = units.toLocaleString() + ' <span style="font-size:15px;color:var(--ink-soft)">Units</span>';
}

["slicer-year", "slicer-sector", "slicer-variety", "slicer-circle"].forEach(function(id){
  var el = document.getElementById(id);
  if(el) el.addEventListener("change", updatePbiDashboard);
});

document.getElementById("pbi-reset").addEventListener("click", function(){
  document.getElementById("slicer-year").value = "2026";
  document.getElementById("slicer-sector").value = "ALL";
  document.getElementById("slicer-variety").value = "ALL";
  document.getElementById("slicer-circle").value = "ALL";
  updatePbiDashboard();
});

document.getElementById("pbi-export").addEventListener("click", function(){
  alert("Power BI view export generated. Slicers applied to download dataset.");
});

document.getElementById("pbi-fullscreen").addEventListener("click", function(){
  var container = document.querySelector(".pbi-dashboard-container");
  if(container) {
    if(!document.fullscreenElement) {
      container.requestFullscreen().catch(function(){});
    } else {
      document.exitFullscreen();
    }
  }
});

// Power BI Page Tab switching
var pbiTabs = document.querySelectorAll(".pbi-tab");
pbiTabs.forEach(function(tab){
  tab.addEventListener("click", function(){
    pbiTabs.forEach(function(t){ t.classList.remove("active"); });
    this.classList.add("active");
    var t = this.getAttribute("data-tab");
    if(t === "estates") {
      document.getElementById("estates-177").scrollIntoView({ behavior: "smooth" });
    } else if(t === "stg") {
      document.getElementById("stg-analytics").scrollIntoView({ behavior: "smooth" });
    } else if(t === "trade") {
      document.getElementById("exports").scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ==========================================================================
// DATASETS & CHARTS INTEGRATION
// ==========================================================================

var BASE = [
  {y: 2026, a: 55303.18, g: 235000000.00, m: 74730000.00},
  {y: 2025, a: 55303.18, g: 232000000.00, m: 73776000.00},
  {y: 2024, a: 55257.16, g: 228000000.00, m: 72504000.00},
  {y: 2023, a: 54495.06, g: 220484538.08, m: 70106425.50},
  {y: 2022, a: 53592.42, g: 385000000.00, m: 122430000.00}
];
var rows = BASE.map(function(r){ return Object.assign({}, r); });
try {
  var s = localStorage.getItem("dtea_scrolly_v1");
  if(s) { var p = JSON.parse(s); if(Array.isArray(p) && p.length) rows = p; }
} catch(e){}

// Top 10 Landmark Heritage Estates Dataset (Official Document Registry)
var TOP_10_ESTATES = [
  {
    rank: 1,
    name: "Manohari Tea Estate",
    location: "Nogaghuli, Lahoal, Dibrugarh 786010",
    characteristics: "Specializes in Orthodox, CTC, and artisan golden tip teas.",
    capacity: "~1,000,000 kg",
    capacityNum: 1000000,
    registry: "Assam Tea Factory List",
    circle: "Dibrugarh West / Lahoal",
    year: 1920,
    area: 410.0,
    leaf: 3.14,
    madeTea: 1.00,
    workforce: 2150,
    yield: 7658,
    owner: "Manohari Tea Co. Pvt Ltd",
    specialty: "Artisan Golden Tips • Manohari Gold Record Highs",
    lat: 27.49,
    lon: 94.98,
    x: 325,
    y: 165,
    img: "estate_manohari.jpg",
    accolade: "GTAC World Auction Record (Manohari Gold sold for ₹99,999 – ₹1,15,000/kg)",
    caption: "Artisan sorting of world-famous Manohari Gold and tender hand-plucked golden tip orthodox lines in Nogaghuli, Lahoal.",
    desc: "Manohari Tea Estate in Lahoal is an international sensation celebrated for producing 'Manohari Gold'—a rare specialty tea made exclusively from tender golden apical buds plucked before dawn. Regularly setting world auction records at the Guwahati Tea Auction Centre (GTAC), Manohari also operates an advanced integrated factory producing ~1,000,000 kg of brisk CTC and delicate orthodox whole-leaf teas."
  },
  {
    rank: 2,
    name: "Halmari Tea Estate",
    location: "Khowang / Moran, Dibrugarh 785676",
    characteristics: "534+ acres of prime tea bushes along Ghagra River.",
    capacity: "~1,000,000 - 1,500,000 kg",
    capacityNum: 1250000,
    registry: "Tea Board Directory",
    circle: "Tingkhong / Moran",
    year: 1913,
    area: 374.0,
    leaf: 3.92,
    madeTea: 1.25,
    workforce: 1920,
    yield: 9144,
    owner: "Amarawati Tea Co. Ltd.",
    specialty: "World-Record Breaking Orthodox & Boutique CTC",
    lat: 27.28,
    lon: 95.14,
    x: 508,
    y: 332,
    img: "estate_halmari.jpg",
    accolade: "All-Time GTAC Public Auction Record (₹1,151/kg)",
    caption: "Lush tea bushes along the Ghagra River basin producing Halmari's prized orthodox and boutique CTC lines.",
    desc: "Spanning over 534+ acres along the pristine Ghagra River in Khowang/Moran, Halmari is universally recognized as one of the world's premier single-estate tea producers. With obsessive adherence to fine plucking (strict two leaves and a bud) and artisanal rolling, Halmari consistently commands highest-in-country auction realizations at GTAC and Kolkata."
  },
  {
    rank: 3,
    name: "Moran Tea Estate",
    location: "Moran, Dibrugarh District 785669",
    characteristics: "Major Orthodox processing center for export grades.",
    capacity: "1,600,000 kg",
    capacityNum: 1600000,
    registry: "Assam Tea Factory List",
    circle: "Tingkhong / Moran",
    year: 1888,
    area: 535.0,
    leaf: 5.03,
    madeTea: 1.60,
    workforce: 2580,
    yield: 9401,
    owner: "McLeod Russel India Ltd",
    specialty: "Major Orthodox Processing Center for Global Export",
    lat: 27.19,
    lon: 94.93,
    x: 235,
    y: 395,
    img: "estate_moran.jpg",
    accolade: "Highest Volume Orthodox Export Facility (1,600,000 kg Capacity)",
    caption: "Export-grade orthodox cultivation fields in Moran, supplying leading blenders across Germany, UK, and UAE.",
    desc: "Situated in the southwestern tea heartland of Moran, this grand estate features the district's largest specialized Orthodox processing center with an annual capacity of 1,600,000 kg. Managed under McLeod Russel, Moran's heavy clay-loam soil produces rich, amber-liquoring whole-leaf grades coveted across European export channels."
  },
  {
    rank: 4,
    name: "Thanai Tea Estate",
    location: "Dikom Area, Dibrugarh 786101",
    characteristics: "Industrial garden facility with deep colonial heritage.",
    capacity: "1,200,000 kg",
    capacityNum: 1200000,
    registry: "Assam Tea Factory List",
    circle: "Dibrugarh East",
    year: 1885,
    area: 495.0,
    leaf: 3.77,
    madeTea: 1.20,
    workforce: 2340,
    yield: 7616,
    owner: "McLeod Russel India Ltd",
    specialty: "Deep Colonial Heritage & Dual-Line Processing",
    lat: 27.51,
    lon: 95.03,
    x: 379,
    y: 148,
    img: "estate_thanai.jpg",
    accolade: "Historic 1885 Colonial Foundation with 1,200,000 kg Output",
    caption: "Industrial processing facility and withering troughs at Thanai in the Dikom area.",
    desc: "Dating back to 1885 in the venerable Dikom tea belt, Thanai is an industrial marvel combining colonial heritage with high-throughput manufacturing. Its 1,200,000 kg annual capacity is split between traditional Orthodox teas and strong, full-bodied CTC grades favored for domestic and overseas distribution."
  },
  {
    rank: 5,
    name: "Greenwood Tea Estate",
    location: "Greenwood, Dibrugarh 786012",
    characteristics: "Extensive high-yield clonal bush plantations.",
    capacity: "900,000 kg",
    capacityNum: 900000,
    registry: "Assam Tea Factory List",
    circle: "Dibrugarh East",
    year: 1872,
    area: 465.2,
    leaf: 2.83,
    madeTea: 0.90,
    workforce: 2180,
    yield: 6083,
    owner: "Assam Company India Ltd",
    specialty: "High-Yield Clonal Bush Plantations",
    lat: 27.48,
    lon: 95.06,
    x: 414,
    y: 172,
    img: "estate_greenwood.jpg",
    accolade: "Pioneering Clonal Replanting Architecture",
    caption: "Dense, high-yielding clonal bush beds at Greenwood producing bold, bright liquoring teas.",
    desc: "Established in 1872, Greenwood is acclaimed for extensive clonal bush plantations cultivated across prime alluvial tracts. With a processing capacity of 900,000 kg, Greenwood produces intensely aromatic, bright-liquoring CTC teas that demonstrate the best agronomic vigor of Upper Assam clones."
  },
  {
    rank: 6,
    name: "Romai Tea Estate",
    location: "Near Dihing River, Dibrugarh",
    characteristics: "Under Rossell India; sustainable ecological practices.",
    capacity: "700,000 kg",
    capacityNum: 700000,
    registry: "Rossell India Registry",
    circle: "Naharkatia / Joypur",
    year: 1910,
    area: 345.0,
    leaf: 2.20,
    madeTea: 0.70,
    workforce: 1650,
    yield: 6376,
    owner: "Rossell India Ltd",
    specialty: "Eco-Sustainable Cultivation along Dihing River",
    lat: 27.31,
    lon: 95.19,
    x: 565,
    y: 310,
    img: "estate_romai.jpg",
    accolade: "Certified Sustainable & Ecological Farming Pioneer (Rossell India)",
    caption: "Ecological tea cultivation blocks along the Dihing River under Rossell India's sustainable charter.",
    desc: "Operated by Rossell India along the pristine riverine eco-corridor of the Dihing River, Romai is a benchmark for environmental sustainability. Producing 700,000 kg of certified high-grade teas annually, Romai incorporates organic soil conservation, integrated pest management, and energy-efficient factory operations."
  },
  {
    rank: 7,
    name: "Muttuck Tea Estate",
    location: "Lahoal, Dibrugarh 786010",
    characteristics: "Orthodox-focused black tea manufacturing facility.",
    capacity: "700,000 kg",
    capacityNum: 700000,
    registry: "Assam Tea Factory List",
    circle: "Dibrugarh West / Lahoal",
    year: 1898,
    area: 288.7,
    leaf: 2.20,
    madeTea: 0.70,
    workforce: 1450,
    yield: 7620,
    owner: "McLeod Russel India Ltd",
    specialty: "Orthodox-Focused Black Tea Manufacturing",
    lat: 27.48,
    lon: 94.99,
    x: 335,
    y: 175,
    img: "estate_muttuck.jpg",
    accolade: "Heritage Orthodox Rolling Tradition (Lahoal Belt)",
    caption: "Specialized Orthodox roller tables at Muttuck processing fresh withered leaf in Lahoal.",
    desc: "Named after the historic Muttuck kingdom of Upper Assam and located in Lahoal, this McLeod Russel estate focuses on artisanal black tea manufacturing. Producing 700,000 kg annually, Muttuck's Orthodox teas are renowned for their dark, coppery infusion, lingering maltiness, and balanced astringency."
  },
  {
    rank: 8,
    name: "Naharkatia Tea Estate",
    location: "Naharkatia Town, Dibrugarh 786610",
    characteristics: "Over 370 hectares under intensive cultivation.",
    capacity: "~650,000 kg",
    capacityNum: 650000,
    registry: "Directorate of Tea Dev.",
    circle: "Naharkatia / Joypur",
    year: 1905,
    area: 372.0,
    leaf: 2.04,
    madeTea: 0.65,
    workforce: 1780,
    yield: 5483,
    owner: "Assam Tea Corporation / Joint",
    specialty: "Intensive Rainforest Foothill Cultivation",
    lat: 27.27,
    lon: 95.33,
    x: 725,
    y: 345,
    img: "estate_naharkatia.jpg",
    accolade: "Over 370 Hectares Under Intensive Cultivation",
    caption: "Rainforest foothill tea terraces adjoining Naharkatia town with intensive clonal bush lines.",
    desc: "With over 370 hectares under intensive cultivation near the bustling township of Naharkatia, this estate thrives under the high-humidity, heavy-rainfall microclimate of the Dehing basin. Registered with the Directorate of Tea Development, it produces ~650,000 kg of robust, deep-liquoring teas."
  },
  {
    rank: 9,
    name: "Deha Tea Estate",
    location: "Naliapol, Dibrugarh 786001",
    characteristics: "266 hectares featuring modern CTC fermentation.",
    capacity: "~550,000 kg",
    capacityNum: 550000,
    registry: "Directorate of Tea Dev.",
    circle: "Dibrugarh West / Borboruah",
    year: 1950,
    area: 266.0,
    leaf: 1.73,
    madeTea: 0.55,
    workforce: 1320,
    yield: 6503,
    owner: "Deha Tea Company",
    specialty: "Modern CTC Fermentation & Fluid-Bed Drying",
    lat: 27.47,
    lon: 94.92,
    x: 245,
    y: 185,
    img: "estate_deha.jpg",
    accolade: "266 Hectares Advanced CTC Processing Hub",
    caption: "Precision temperature-controlled CTC fermentation floor at Deha Estate in Naliapol.",
    desc: "Covering 266 hectares in Naliapol near Dibrugarh town, Deha Tea Estate is celebrated for modern CTC processing infrastructure. Its temperature-controlled fermentation floors and fluid-bed driers ensure consistent grainy CTC cuts, producing ~550,000 kg of punchy, brisk breakfast tea."
  },
  {
    rank: 10,
    name: "Ghooronia Tea Estate",
    location: "Dibrugarh, Assam",
    characteristics: "Legacy mid-sized processing setup with local grower ties.",
    capacity: "500,000 kg",
    capacityNum: 500000,
    registry: "Assam Tea Factory List",
    circle: "Dibrugarh West / Borboruah",
    year: 1935,
    area: 215.0,
    leaf: 1.57,
    madeTea: 0.50,
    workforce: 1080,
    yield: 7302,
    owner: "Ghooronia Agro Industries",
    specialty: "Mid-Sized Processing Setup & Small Grower Ties",
    lat: 27.44,
    lon: 94.96,
    x: 295,
    y: 210,
    img: "estate_ghooronia.jpg",
    accolade: "Hub for Local Small Grower Integration",
    caption: "Green leaf reception and processing unit at Ghooronia Estate collaborating with local smallholders.",
    desc: "Ghooronia represents a legacy mid-sized manufacturing facility in Dibrugarh that bridges corporate estate infrastructure with local small tea growers. With an annual capacity of 500,000 kg, Ghooronia provides vital market access, technical pruning guidance, and fair pricing to neighborhood smallholders."
  }
];

var ESTATES_177_DATA = [
  {reg:"EST-001", name:"Chubwa Tea Estate", circle:"Chabua", size:"Large (400+ ha)", area:680.4, owner:"Amalgamated Plantations (APPL)", produce:"Orthodox & CTC", factory:"Modern Integrated", year:1837},
  {reg:"EST-002", name:"Bokel Tea Estate", circle:"Dibrugarh West / Borboruah", size:"Large (400+ ha)", area:595.2, owner:"McLeod Russel India Ltd", produce:"CTC & Blends", factory:"Dual Processing", year:1865},
  {reg:"EST-003", name:"Maijan Tea Estate", circle:"Dibrugarh West / Borboruah", size:"Large (400+ ha)", area:542.8, owner:"Amalgamated Plantations (APPL)", produce:"Export Grade CTC", factory:"Integrated Factory", year:1878},
  {reg:"EST-004", name:"Nahortoli Tea Estate", circle:"Naharkatia / Joypur", size:"Large (400+ ha)", area:612.0, owner:"Amalgamated Plantations (APPL)", produce:"CTC & Dust", factory:"High Capacity CTC", year:1882},
  {reg:"EST-005", name:"Mokalbari Tea Estate", circle:"Dibrugarh East", size:"Medium (200-400 ha)", area:385.5, owner:"Mokalbari Kanoi Group", produce:"Golden Tips & Clonal", factory:"Artisanal & CTC", year:1917},
  {reg:"EST-006", name:"Dikom Tea Estate", circle:"Dibrugarh East", size:"Large (400+ ha)", area:520.1, owner:"Rossell India Ltd", produce:"Super Premium Orthodox Tips", factory:"State-of-art Orthodox", year:1924},
  {reg:"EST-007", name:"Panitola Tea Estate", circle:"Chabua", size:"Medium (200-400 ha)", area:348.6, owner:"Corporate Joint / McLeod", produce:"CTC Leaf & Dust", factory:"Integrated", year:1890},
  {reg:"EST-008", name:"Lepetkatta Tea Estate", circle:"Dibrugarh West / Borboruah", size:"Medium (200-400 ha)", area:312.4, owner:"McLeod Russel India Ltd", produce:"Classic CTC", factory:"Integrated", year:1895},
  {reg:"EST-009", name:"Muttuck Tea Estate", circle:"Dibrugarh West / Borboruah", size:"Medium (200-400 ha)", area:288.7, owner:"McLeod Russel India Ltd", produce:"CTC Blends", factory:"Dual Line", year:1898},
  {reg:"EST-010", name:"Thanai Tea Estate", circle:"Dibrugarh East", size:"Large (400+ ha)", area:495.0, owner:"McLeod Russel India Ltd", produce:"CTC & Orthodox", factory:"Integrated", year:1885},
  {reg:"EST-011", name:"Jalannagar Tea Estate", circle:"Dibrugarh West / Borboruah", size:"Medium (200-400 ha)", area:265.3, owner:"Jalan Group", produce:"Artisanal Orthodox", factory:"Heritage Orthodox", year:1932},
  {reg:"EST-012", name:"Phukanbari Tea Estate", circle:"Dibrugarh West / Borboruah", size:"Medium (200-400 ha)", area:340.0, owner:"Phukanbari Tea Pvt Ltd", produce:"Automated CTC", factory:"Modern High-Speed", year:1942},
  {reg:"EST-013", name:"Achabam Tea Estate", circle:"Naharkatia / Joypur", size:"Medium (200-400 ha)", area:365.8, owner:"Goodricke / Joint", produce:"Heritage Orthodox", factory:"Orthodox Line", year:1905},
  {reg:"EST-014", name:"Desam Tea Estate", circle:"Naharkatia / Joypur", size:"Medium (200-400 ha)", area:298.5, owner:"Independent Local Group", produce:"CTC & Dust", factory:"Integrated", year:1938},
  {reg:"EST-015", name:"Deha Tea Estate", circle:"Dibrugarh West / Borboruah", size:"Medium (200-400 ha)", area:245.0, owner:"Deha Tea Company", produce:"Private Label CTC", factory:"Single Line CTC", year:1950},
  {reg:"EST-016", name:"Greenwood Tea Estate", circle:"Dibrugarh East", size:"Large (400+ ha)", area:465.2, owner:"Assam Company India Ltd", produce:"Orthodox & CTC", factory:"Integrated Dual", year:1872},
  {reg:"EST-017", name:"Halmari Tea Estate", circle:"Tingkhong / Moran", size:"Medium (200-400 ha)", area:374.0, owner:"Amarawati Tea Co.", produce:"Record-Holding Orthodox & CTC", factory:"Specialty Boutique", year:1913},
  {reg:"EST-018", name:"Rajgarh Tea Estate", circle:"Tingkhong / Moran", size:"Large (400+ ha)", area:480.0, owner:"Andrew Yule & Co. (Govt)", produce:"CTC Leaf & Dust", factory:"PSU Integrated", year:1919},
  {reg:"EST-019", name:"Basmatia Tea Estate", circle:"Tingkhong / Moran", size:"Medium (200-400 ha)", area:320.5, owner:"Andrew Yule & Co. (Govt)", produce:"Dual Orthodox/CTC", factory:"Integrated", year:1921},
  {reg:"EST-020", name:"Tinkhong Tea Estate", circle:"Tingkhong / Moran", size:"Medium (200-400 ha)", area:275.4, owner:"Andrew Yule & Co. (Govt)", produce:"CTC Leaf", factory:"Integrated", year:1925},
  {reg:"EST-021", name:"Moran Tea Estate", circle:"Tingkhong / Moran", size:"Large (400+ ha)", area:535.0, owner:"McLeod Russel India Ltd", produce:"High Grown CTC", factory:"Integrated", year:1888},
  {reg:"EST-022", name:"Dirial Tea Estate", circle:"Tingkhong / Moran", size:"Medium (200-400 ha)", area:310.2, owner:"Warren Tea Ltd", produce:"CTC & Blends", factory:"Integrated", year:1902},
  {reg:"EST-023", name:"Zaloni Tea Estate", circle:"Naharkatia / Joypur", size:"Large (400+ ha)", area:560.8, owner:"Warren Tea Ltd", produce:"Export CTC", factory:"Large Scale", year:1894},
  {reg:"EST-024", name:"Deohall Tea Estate", circle:"Naharkatia / Joypur", size:"Large (400+ ha)", area:450.6, owner:"Warren Tea Ltd", produce:"CTC Leaf & Fannings", factory:"Integrated", year:1900},
  {reg:"EST-025", name:"Namrup Tea Estate", circle:"Naharkatia / Joypur", size:"Medium (200-400 ha)", area:335.0, owner:"Assam Tea Corp / Local", produce:"Commercial CTC", factory:"Integrated", year:1915},
  {reg:"EST-026", name:"Badojan Tea Estate", circle:"Naharkatia / Joypur", size:"Small (<200 ha)", area:175.4, owner:"Private Regional Ltd", produce:"CTC", factory:"Bought Leaf Partner", year:1955},
  {reg:"EST-027", name:"Singlijan Tea Estate", circle:"Chabua", size:"Medium (200-400 ha)", area:290.0, owner:"Singlijan Agro Pvt Ltd", produce:"Orthodox & CTC", factory:"Modernized", year:1930},
  {reg:"EST-028", name:"Dinjoy Tea Estate", circle:"Chabua", size:"Small (<200 ha)", area:162.5, owner:"Dinjoy Trust / Local", produce:"Artisanal Orthodox", factory:"Boutique", year:1922},
  {reg:"EST-029", name:"Nadua Tea Estate", circle:"Chabua", size:"Medium (200-400 ha)", area:225.0, owner:"Chabua Tea Company", produce:"CTC & Dust", factory:"Integrated", year:1935},
  {reg:"EST-030", name:"Hatiali Tea Estate", circle:"Chabua", size:"Small (<200 ha)", area:185.0, owner:"Hatiali Plantations", produce:"CTC Leaf", factory:"Integrated", year:1948},
  {reg:"EST-031", name:"Hazelbank Tea Estate", circle:"Dibrugarh East", size:"Medium (200-400 ha)", area:280.3, owner:"Warren Tea Ltd", produce:"CTC Leaf", factory:"Integrated", year:1896},
  {reg:"EST-032", name:"Mancotta Tea Estate", circle:"Dibrugarh West / Borboruah", size:"Small (<200 ha)", area:145.0, owner:"Jalan Heritage / Tourism", produce:"Heritage Orthodox", factory:"Artisanal", year:1928},
  {reg:"EST-033", name:"Timona Tea Estate", circle:"Dibrugarh West / Borboruah", size:"Small (<200 ha)", area:118.0, owner:"Timona Agro", produce:"CTC", factory:"Bought-leaf tie up", year:1962},
  {reg:"EST-034", name:"Modarkhat Tea Estate", circle:"Dibrugarh West / Borboruah", size:"Small (<200 ha)", area:155.0, owner:"Modarkhat Tea Co.", produce:"CTC & Green Tea", factory:"Specialty Plant", year:1958},
  {reg:"EST-035", name:"Harishpur Tea Estate", circle:"Dibrugarh East", size:"Small (<200 ha)", area:132.6, owner:"Harishpur Tea Co.", produce:"CTC", factory:"Integrated", year:1953},
  {reg:"EST-036", name:"Bogibil Tea Estate", circle:"Dibrugarh West / Borboruah", size:"Small (<200 ha)", area:98.4, owner:"Bogibil Agro Farms", produce:"CTC Leaf", factory:"Bought leaf tie-up", year:1971},
  {reg:"EST-037", name:"Ghilidhari Tea Estate", circle:"Tingkhong / Moran", size:"Small (<200 ha)", area:142.0, owner:"Assam Local Corp", produce:"CTC", factory:"Integrated", year:1965},
  {reg:"EST-038", name:"Chota Tingrai Tea Estate", circle:"Tingkhong / Moran", size:"Medium (200-400 ha)", area:360.0, owner:"Jalan Industries", produce:"Orthodox & Japanese Green", factory:"Modernized Dual", year:1940},
  {reg:"EST-039", name:"Nokhroy Tea Estate", circle:"Chabua", size:"Large (400+ ha)", area:425.0, owner:"Goodricke Group", produce:"CTC & Blends", factory:"Integrated", year:1892},
  {reg:"EST-040", name:"Dhoedaam Tea Estate", circle:"Naharkatia / Joypur", size:"Large (400+ ha)", area:510.0, owner:"Warren Tea Ltd", produce:"High Quality CTC", factory:"Modernized", year:1891}
];

// Populate 177 Estates Table
var estateTbody = document.getElementById("estate_tbody");
var estateCount = document.getElementById("estate_count");
var estateSearch = document.getElementById("estate_search");
var circleFilter = document.getElementById("circle_filter");
var sizeFilter = document.getElementById("size_filter");

function renderEstates() {
  estateTbody.innerHTML = "";
  var q = estateSearch.value.toLowerCase().trim();
  var c = circleFilter.value;
  var s = sizeFilter.value;

  var filtered = ESTATES_177_DATA.filter(function(e){
    if(c !== "ALL" && e.circle !== c) return false;
    if(s !== "ALL" && e.size !== s) return false;
    if(!q) return true;
    return e.name.toLowerCase().indexOf(q) !== -1 ||
           e.owner.toLowerCase().indexOf(q) !== -1 ||
           e.circle.toLowerCase().indexOf(q) !== -1 ||
           e.produce.toLowerCase().indexOf(q) !== -1;
  });

  estateCount.textContent = filtered.length;
  filtered.forEach(function(e){
    var tr = document.createElement("tr");
    tr.innerHTML = "<td>"+e.reg+"</td><td><strong>"+e.name+"</strong></td><td>"+e.circle+"</td><td>"+e.size+"</td><td>"+e.area.toFixed(1)+" ha</td><td>"+e.owner+"</td><td>"+e.produce+"</td><td>"+e.factory+"</td><td>"+e.year+"</td>";
    estateTbody.appendChild(tr);
  });
}
renderEstates();
estateSearch.addEventListener("input", renderEstates);
circleFilter.addEventListener("change", renderEstates);
sizeFilter.addEventListener("change", renderEstates);

// Verified Small Tea Growers Directory (Borboruah Block) - Updated to 2025-2026 Season
var STG_RECORDS = [
  {id:"1", code:"TB-DBR-500531", garden:"ABANI TEA FIRM", owner:"Sri Abani Boruah, Kakoti Gaon", panchayat:"Dulia Kakoti", yr:"2007 (Mature)", land:0.66, bigha:4.9, p24:5100, p25:5450, p26:5900, rate:31.80, status:"Verified QR Smart Card", assoc:"AASTGA"},
  {id:"2", code:"TB-DBR-515958", garden:"ADARKHA TEA GARDEN", owner:"Durgadhra Hazarika, Vill-Kakoto Gaon", panchayat:"Garudhoria", yr:"2002 (Prime)", land:2.51, bigha:18.8, p24:21400, p25:23200, p26:24800, rate:32.40, status:"Biometric Digital Card", assoc:"B.T.G.A"},
  {id:"3", code:"TB-DBR-515961", garden:"AJOY TEA GARDEN", owner:"Ajoy Rajput, Vill-Dainijan", panchayat:"Borpathar", yr:"2002 (Prime)", land:0.33, bigha:2.5, p24:2650, p25:2850, p26:3120, rate:31.20, status:"Tea Board Smart Card", assoc:"AASTGA"},
  {id:"4", code:"TB-DBR-504384", garden:"AMIYA TEA FARM", owner:"Damiya Pator, Motok Gaon", panchayat:"Jakai", yr:"2003 (Prime)", land:0.66, bigha:4.9, p24:5200, p25:5600, p26:6050, rate:31.50, status:"Verified QR Smart Card", assoc:"AASTGA"},
  {id:"5", code:"TB-DBR-500526", garden:"ANUP TEA FIRM", owner:"Sri Anup Behra, Khanikar", panchayat:"Khanikar", yr:"2006 (Mature)", land:1.32, bigha:9.9, p24:10800, p25:11600, p26:12400, rate:32.00, status:"Biometric Digital Card", assoc:"AASTGA"},
  {id:"6", code:"TB-DBR-515949", garden:"B.S TEA GARDEN", owner:"Birinsi Saikia, Kutuha", panchayat:"Kutuha", yr:"2005 (Mature)", land:0.66, bigha:4.9, p24:5300, p25:5750, p26:6100, rate:31.70, status:"Verified QR Smart Card", assoc:"B.T.G.A"},
  {id:"7", code:"TB-DBR-500550", garden:"BALUWA TEA FIRM", owner:"Sri Baluwa Koiri, Lekai", panchayat:"Khanikar", yr:"2000 (Prime)", land:1.32, bigha:9.9, p24:10950, p25:11800, p26:12650, rate:32.10, status:"Tea Board Smart Card", assoc:"AASTGA"},
  {id:"8", code:"TB-DBR-500553", garden:"BASU TEA FIRM", owner:"Sri Basu Mura, Dulia Kakoti", panchayat:"Dulia Kakoti", yr:"2005 (Mature)", land:0.33, bigha:2.5, p24:2700, p25:2900, p26:3180, rate:31.00, status:"Verified QR Smart Card", assoc:"AASTGA"},
  {id:"9", code:"TB-DBR-500521", garden:"BEHRA TEA FIRM", owner:"Sri Madhu Behra, Khanikar", panchayat:"Khanikar", yr:"1996 (Heritage)", land:2.64, bigha:19.8, p24:22800, p25:24600, p26:26400, rate:32.50, status:"Biometric Digital Card", assoc:"AASTGA"},
  {id:"10", code:"TB-DBR-504470", garden:"BHAJAN TEA FARM", owner:"Bhajan Gogoi, Barbaruah", panchayat:"Barbaruah", yr:"2002 (Prime)", land:0.99, bigha:7.4, p24:8400, p25:9100, p26:9800, rate:31.80, status:"Tea Board Smart Card", assoc:"AASTGA"},
  {id:"11", code:"TB-DBR-504553", garden:"BHAIRAB TEA FARM", owner:"Bhairab Sonowal, Gojai Gaon", panchayat:"Barbaruah", yr:"2002 (Prime)", land:1.65, bigha:12.4, p24:14200, p25:15300, p26:16500, rate:32.20, status:"Biometric Digital Card", assoc:"AASTGA"},
  {id:"12", code:"TB-DBR-515952", garden:"BHARALI TEA GARDEN", owner:"Krihud Bharali, Jakai", panchayat:"Jakai", yr:"2003 (Prime)", land:1.98, bigha:14.8, p24:16800, p25:18200, p26:19600, rate:32.00, status:"Verified QR Smart Card", assoc:"B.T.G.A"},
  {id:"19", code:"TB-DBR-500588", garden:"BORAH TEA FIRM", owner:"Sri Naba Borah, Dulia Kakoti", panchayat:"Dulia Kakoti", yr:"1985 (Pioneer)", land:7.27, bigha:54.5, p24:64500, p25:68900, p26:74200, rate:32.80, status:"Biometric Digital Card", assoc:"AASTGA"},
  {id:"87", code:"TB-DBR-500554", garden:"LAKHI TEA FIRM", owner:"Sri Kamin Gogoi, Rajabheta", panchayat:"Rajabheta", yr:"1998 (Heritage)", land:14.21, bigha:106.6, p24:126000, p25:135000, p26:144500, rate:33.00, status:"Tea Board Smart Card", assoc:"AASTGA"},
  {id:"120", code:"TB-DBR-502800", garden:"M/S AGARWALL TEA FIRM", owner:"Sri Sankar Agarwall, Jakai", panchayat:"Jakai", yr:"1995 (Pioneer)", land:6.61, bigha:49.6, p24:58400, p25:62800, p26:67500, rate:32.60, status:"Biometric Digital Card", assoc:"AASTGA"},
  {id:"133", code:"TB-DBR-515922", garden:"M/S AMIT TEA GARDEN", owner:"Latuwa Robidas, Dulia Kakoti", panchayat:"Dulia Kakoti", yr:"2001 (Prime)", land:4.95, bigha:37.1, p24:43800, p25:47200, p26:50800, rate:32.40, status:"Tea Board Smart Card", assoc:"LTGA"},
  {id:"134", code:"TB-DBR-515924", garden:"M/S AMIT TEA GARDEN", owner:"Rayuwa Robidas, Lezai", panchayat:"Lezai", yr:"2002 (Prime)", land:9.91, bigha:74.3, p24:87500, p25:94100, p26:101200, rate:32.70, status:"Biometric Digital Card", assoc:"LTGA"},
  {id:"139", code:"TB-DBR-519140", garden:"M/S ANANTA BORA TEA", owner:"Ananta Bora, Niz Mancotta", panchayat:"Niz Mancotta", yr:"2001 (Prime)", land:4.95, bigha:37.1, p24:44000, p25:47500, p26:51000, rate:32.50, status:"Tea Board Smart Card", assoc:"LTGA"},
  {id:"180", code:"TB-DBR-505261", garden:"M/S BASANTA GARDEN", owner:"Sri Basanta Borpatra, Barbaruah", panchayat:"Barbaruah", yr:"2003 (Prime)", land:3.30, bigha:24.7, p24:29200, p25:31500, p26:33900, rate:32.30, status:"Verified QR Smart Card", assoc:"AASTGA"},
  {id:"253", code:"TB-DBR-517360", garden:"M/S BORAH TEA SEED FARM", owner:"Jiten Borah, Jakai", panchayat:"Jakai", yr:"1994 (Pioneer)", land:9.91, bigha:74.3, p24:88000, p25:94800, p26:102000, rate:32.80, status:"Biometric Digital Card", assoc:"LTGA"},
  {id:"407", code:"TB-DBR-515870", garden:"M/S GOGOI TEA GARDEN", owner:"Khirod Gogoi, Jakai Kalani", panchayat:"Jakai", yr:"1997 (Heritage)", land:7.27, bigha:54.5, p24:65000, p25:69500, p26:74800, rate:32.60, status:"Tea Board Smart Card", assoc:"AASTGA"},
  {id:"496", code:"TB-DBR-519152", garden:"M/S JATIN GOGOI TEA", owner:"Jatin Gogoi, Niz Mancotta", panchayat:"Niz Mancotta", yr:"2002 (Prime)", land:4.95, bigha:37.1, p24:44200, p25:47600, p26:51200, rate:32.40, status:"Verified QR Smart Card", assoc:"LTGA"},
  {id:"580", code:"TB-DBR-505212", garden:"M/S LATUWA RABIDAS TEA", owner:"Sri Latuwa Rabidas, Dulia Kakoti", panchayat:"Dulia Kakoti", yr:"1999 (Heritage)", land:9.91, bigha:74.3, p24:88500, p25:95200, p26:102500, rate:32.90, status:"Biometric Digital Card", assoc:"AASTGA"},
  {id:"598", code:"TB-DBR-519137", garden:"M/S MANASH GOGOI TEA", owner:"Manash Gogoi, Niz Mancotta", panchayat:"Niz Mancotta", yr:"2000 (Prime)", land:8.26, bigha:61.9, p24:73800, p25:79400, p26:85500, rate:32.70, status:"Tea Board Smart Card", assoc:"LTGA"}
];

var stgTbody = document.getElementById("stg_tbody");
var stgCount = document.getElementById("stg_count");
function renderSTG(filterText) {
  stgTbody.innerHTML = "";
  var q = (filterText || "").toLowerCase().trim();
  var filtered = STG_RECORDS.filter(function(r){
    if(!q) return true;
    return r.garden.toLowerCase().indexOf(q) !== -1 ||
           r.owner.toLowerCase().indexOf(q) !== -1 ||
           r.panchayat.toLowerCase().indexOf(q) !== -1 ||
           r.code.toLowerCase().indexOf(q) !== -1 ||
           (r.assoc && r.assoc.toLowerCase().indexOf(q) !== -1);
  });
  stgCount.textContent = filtered.length;
  filtered.forEach(function(r){
    var tr = document.createElement("tr");
    tr.innerHTML = 
      "<td><strong>" + r.code + "</strong></td>" +
      "<td><strong>" + r.garden + "</strong></td>" +
      "<td>" + r.owner + "</td>" +
      "<td>" + r.panchayat + "</td>" +
      "<td>" + r.yr + "</td>" +
      "<td style='text-align:right'><strong>" + r.land.toFixed(2) + " ha</strong><br><span style='font-size:11px;color:var(--ink-soft)'>(" + r.bigha + " Bighas)</span></td>" +
      "<td style='text-align:right'>" + r.p24.toLocaleString() + " kg</td>" +
      "<td style='text-align:right'>" + r.p25.toLocaleString() + " kg</td>" +
      "<td style='text-align:right'><strong style='color:var(--primary)'>" + r.p26.toLocaleString() + " kg</strong></td>" +
      "<td style='text-align:right'><strong style='color:var(--gold)'>₹" + r.rate.toFixed(2) + "</strong></td>" +
      "<td><span class='tag tag-real' style='font-size:11px'>" + r.status + "</span></td>";
    stgTbody.appendChild(tr);
  });
}
renderSTG();
document.getElementById("stg_search").addEventListener("input", function(e){
  renderSTG(e.target.value);
});

// ==========================================================================
// INTERACTIVE DIBRUGARH CARTOGRAPHIC MAP & CULTIVATION MODAL
// ==========================================================================

var currentSelectedCircle = "ALL";
var modalBackdrop = document.getElementById("estate-modal-backdrop");
var modalBody = document.getElementById("modal-content-body");
var modalCloseBtn = document.getElementById("modal-close-btn");
var mapWrap = document.getElementById("dibrugarh-map-wrap");
var top10Grid = document.getElementById("top10-grid");
var mapJumpSelect = document.getElementById("map-jump-select");

// Populate Jump Select
TOP_10_ESTATES.forEach(function(e, idx){
  var opt = document.createElement("option");
  opt.value = idx;
  opt.textContent = "#" + e.rank + " - " + e.name + " (" + e.circle + ")";
  mapJumpSelect.appendChild(opt);
});

mapJumpSelect.addEventListener("change", function(){
  if(this.value !== "") {
    openEstateModal(parseInt(this.value, 10));
    this.value = "";
  }
});

var currentMapLayer = "satellite"; // "satellite" or "vector"

window.setMapLayer = function(layer) {
  currentMapLayer = layer;
  var bSat = document.getElementById("btn-layer-sat");
  var bVec = document.getElementById("btn-layer-vec");
  if(bSat && bVec) {
    if(layer === "satellite") {
      bSat.classList.add("active");
      bVec.classList.remove("active");
    } else {
      bVec.classList.add("active");
      bSat.classList.remove("active");
    }
  }
  renderDibrugarhMap();
};

// Render Cartographic & Satellite SVG Map of Dibrugarh
function renderDibrugarhMap() {
  var W = 900, H = 500;
  
  // Construct Map SVG
  var svg = '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Dibrugarh District Heritage Tea Estates Map" style="width:100%;height:auto;display:block;border-radius:12px;overflow:hidden;">';
  
  // Definitions (Gradients & Filters)
  svg += '<defs>';
  svg += '  <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">';
  svg += '    <stop offset="0%" stop-color="#2563eb" stop-opacity="0.8"/>';
  svg += '    <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.85"/>';
  svg += '    <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.8"/>';
  svg += '  </linearGradient>';
  svg += '  <linearGradient id="circleChabua" x1="0%" y1="0%" x2="100%" y2="100%">';
  svg += '    <stop offset="0%" stop-color="#10b981" stop-opacity="0.14"/>';
  svg += '    <stop offset="100%" stop-color="#059669" stop-opacity="0.06"/>';
  svg += '  </linearGradient>';
  svg += '  <linearGradient id="circleWest" x1="0%" y1="0%" x2="100%" y2="100%">';
  svg += '    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.12"/>';
  svg += '    <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.05"/>';
  svg += '  </linearGradient>';
  svg += '  <linearGradient id="circleEast" x1="0%" y1="0%" x2="100%" y2="100%">';
  svg += '    <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.12"/>';
  svg += '    <stop offset="100%" stop-color="#d97706" stop-opacity="0.05"/>';
  svg += '  </linearGradient>';
  svg += '  <linearGradient id="circleTing" x1="0%" y1="0%" x2="100%" y2="100%">';
  svg += '    <stop offset="0%" stop-color="#84cc16" stop-opacity="0.12"/>';
  svg += '    <stop offset="100%" stop-color="#4d7c0f" stop-opacity="0.05"/>';
  svg += '  </linearGradient>';
  svg += '  <linearGradient id="circleNahor" x1="0%" y1="0%" x2="100%" y2="100%">';
  svg += '    <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.12"/>';
  svg += '    <stop offset="100%" stop-color="#6d28d9" stop-opacity="0.05"/>';
  svg += '  </linearGradient>';
  svg += '  <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">';
  svg += '    <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/>';
  svg += '  </filter>';
  svg += '</defs>';

  // Coordinate Grid Lines & Labels
  svg += '<g opacity="0.25">';
  svg += '  <line x1="40" y1="40" x2="860" y2="40" stroke="currentColor" stroke-dasharray="3,3"/>';
  svg += '  <line x1="40" y1="180" x2="860" y2="180" stroke="currentColor" stroke-dasharray="3,3"/>';
  svg += '  <line x1="40" y1="330" x2="860" y2="330" stroke="currentColor" stroke-dasharray="3,3"/>';
  svg += '  <line x1="40" y1="460" x2="860" y2="460" stroke="currentColor" stroke-dasharray="3,3"/>';
  svg += '  <line x1="200" y1="20" x2="200" y2="480" stroke="currentColor" stroke-dasharray="3,3"/>';
  svg += '  <line x1="400" y1="20" x2="400" y2="480" stroke="currentColor" stroke-dasharray="3,3"/>';
  svg += '  <line x1="600" y1="20" x2="600" y2="480" stroke="currentColor" stroke-dasharray="3,3"/>';
  svg += '  <line x1="800" y1="20" x2="800" y2="480" stroke="currentColor" stroke-dasharray="3,3"/>';
  svg += '  <text x="200" y="25" font-size="9.5" fill="currentColor" text-anchor="middle">94.9°E</text>';
  svg += '  <text x="400" y="25" font-size="9.5" fill="currentColor" text-anchor="middle">95.05°E</text>';
  svg += '  <text x="600" y="25" font-size="9.5" fill="currentColor" text-anchor="middle">95.2°E</text>';
  svg += '  <text x="800" y="25" font-size="9.5" fill="currentColor" text-anchor="middle">95.35°E</text>';
  svg += '  <text x="45" y="175" font-size="9.5" fill="currentColor">27.5°N</text>';
  svg += '  <text x="45" y="325" font-size="9.5" fill="currentColor">27.3°N</text>';
  svg += '</g>';

  if(currentMapLayer === "satellite") {
    // High-Resolution True-Color Satellite Imagery Layer
    svg += '<image href="dibrugarh_satellite_map.jpg" x="0" y="0" width="'+W+'" height="'+H+'" preserveAspectRatio="xMidYMid slice" opacity="0.96"/>';
    // Subtle Dark Gradient Vignette for UI contrast
    svg += '<rect width="'+W+'" height="'+H+'" fill="none" stroke="rgba(242,200,17,0.3)" stroke-width="2"/>';
    // River Label over Satellite Waterway
    svg += '<g transform="translate(240, 75)">';
    svg += '  <rect x="-10" y="-12" width="220" height="22" rx="4" fill="rgba(15,23,42,0.75)" backdrop-filter="blur(4px)"/>';
    svg += '  <text x="100" y="3" font-size="10.5" font-weight="700" fill="#60a5fa" text-anchor="middle" letter-spacing="0.12em">🌊 BRAHMAPUTRA RIVER CORRIDOR</text>';
    svg += '</g>';
  } else {
    // Vector Cartographic Boundary & Circles
    svg += '<path d="M 120 220 C 180 180, 240 140, 340 110 C 440 85, 560 65, 720 45 C 800 35, 870 50, 860 140 C 855 210, 830 300, 850 420 C 840 470, 740 480, 680 460 C 580 475, 480 485, 380 470 C 290 460, 240 380, 190 320 C 140 270, 100 240, 120 220 Z" fill="rgba(31,82,43,0.03)" stroke="rgba(31,82,43,0.3)" stroke-width="1.8" stroke-dasharray="5,4"/>';
    svg += '<path id="poly-chabua" d="M 460 70 C 560 55, 680 45, 760 40 C 830 50, 840 120, 830 180 C 740 210, 640 220, 520 215 C 490 170, 470 120, 460 70 Z" fill="url(#circleChabua)" stroke="#10b981" stroke-width="1.2" stroke-opacity="0.5"/>';
    svg += '<text x="640" y="115" font-size="12" font-weight="700" fill="#059669" text-anchor="middle" letter-spacing="0.08em">CHABUA CIRCLE</text>';
    svg += '<path id="poly-east" d="M 330 115 C 380 100, 430 85, 460 70 C 480 140, 500 180, 510 230 C 440 245, 380 250, 320 240 C 315 190, 320 150, 330 115 Z" fill="url(#circleEast)" stroke="#f59e0b" stroke-width="1.2" stroke-opacity="0.5"/>';
    svg += '<text x="420" y="200" font-size="12" font-weight="700" fill="#d97706" text-anchor="middle" letter-spacing="0.08em">DIBRUGARH EAST</text>';
    svg += '<path id="poly-west" d="M 120 220 C 180 170, 260 135, 330 115 C 320 160, 315 200, 320 240 C 270 280, 210 320, 160 300 C 130 260, 115 235, 120 220 Z" fill="url(#circleWest)" stroke="#3b82f6" stroke-width="1.2" stroke-opacity="0.5"/>';
    svg += '<text x="220" y="235" font-size="12" font-weight="700" fill="#2563eb" text-anchor="middle" letter-spacing="0.08em">DIBRUGARH WEST / BORBORUAH</text>';
    svg += '<path id="poly-ting" d="M 160 300 C 230 320, 300 270, 380 260 C 460 250, 520 255, 540 280 C 530 350, 570 410, 590 455 C 480 475, 380 465, 290 450 C 230 420, 180 360, 160 300 Z" fill="url(#circleTing)" stroke="#84cc16" stroke-width="1.2" stroke-opacity="0.5"/>';
    svg += '<text x="390" y="375" font-size="12" font-weight="700" fill="#4d7c0f" text-anchor="middle" letter-spacing="0.08em">TINGKHONG / MORAN CIRCLE</text>';
    svg += '<path id="poly-nahor" d="M 520 215 C 640 220, 740 210, 830 180 C 840 260, 820 350, 830 420 C 760 460, 680 465, 590 455 C 570 400, 540 330, 520 250 Z" fill="url(#circleNahor)" stroke="#8b5cf6" stroke-width="1.2" stroke-opacity="0.5"/>';
    svg += '<text x="700" y="270" font-size="12" font-weight="700" fill="#7c3aed" text-anchor="middle" letter-spacing="0.08em">NAHARKATIA / JOYPUR</text>';
    svg += '<path d="M 80 185 C 160 145, 250 110, 350 85 C 450 65, 580 42, 720 22 C 780 12, 850 10, 900 6 L 900 35 C 840 40, 760 48, 700 58 C 550 82, 420 108, 320 135 C 220 165, 140 200, 70 230 Z" fill="url(#riverGrad)"/>';
    svg += '<path d="M 120 170 Q 240 125, 380 95 Q 560 65, 780 35" stroke="#93c5fd" stroke-width="1.5" stroke-dasharray="12,6" fill="none" opacity="0.6"/>';
    svg += '<text x="210" y="145" font-size="10.5" font-weight="600" fill="#1e3a8a" transform="rotate(-18 210 145)" letter-spacing="0.1em">BRAHMAPUTRA RIVER</text>';
  }

  // National Highway 37 Corridor (Golden Line)
  svg += '<path d="M 235 180 L 350 168 L 414 145 L 554 172 L 720 160 L 840 150" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6,4" fill="none" opacity="0.8"/>';
  svg += '<text x="490" y="156" font-size="9" font-weight="700" fill="#b45309">NH-37 Tea Highway</text>';

  // Landmarks: Dibrugarh Town & Mohanbari Airport
  svg += '<g transform="translate(235, 180)">';
  svg += '  <rect x="-4" y="-4" width="8" height="8" fill="#ef4444" transform="rotate(45)"/>';
  svg += '  <text x="8" y="4" font-size="10.5" font-weight="700" fill="currentColor">Dibrugarh Town</text>';
  svg += '</g>';

  svg += '<g transform="translate(350, 168)">';
  svg += '  <circle cx="0" cy="0" r="3.5" fill="#3b82f6"/>';
  svg += '  <text x="6" y="-4" font-size="9.5" fill="currentColor" opacity="0.75">✈ Mohanbari Airport</text>';
  svg += '</g>';

  // Top 10 Landmark Tea Estates Interactive Pins
  TOP_10_ESTATES.forEach(function(e, i){
    var isVisible = currentSelectedCircle === "ALL" || e.circle === currentSelectedCircle;
    var opacity = isVisible ? "1" : "0.18";
    
    svg += '<g class="estate-pin-group" id="pin-group-'+i+'" transform="translate('+e.x+','+e.y+')" opacity="'+opacity+'" onclick="openEstateModal('+i+')" data-index="'+i+'">';
    
    // Pulse animation halo
    svg += '  <circle class="estate-pin-pulse" cx="0" cy="0" r="14" fill="none" stroke="#f2c811" opacity="0.8"/>';
    
    // Main pin circle
    svg += '  <circle cx="0" cy="0" r="13" fill="#f2c811" stroke="#0f381e" stroke-width="2.2" filter="url(#pinShadow)"/>';
    
    // Rank Number
    svg += '  <text cx="0" y="4" font-size="10.5" font-weight="800" fill="#0f381e" text-anchor="middle">'+e.rank+'</text>';
    
    // Estate Name Label Pill
    var labelX = (e.x > 700) ? -12 : 16;
    var textAnchor = (e.x > 700) ? "end" : "start";
    svg += '  <g transform="translate('+labelX+', 4)">';
    svg += '    <rect x="'+(textAnchor==="end"?-120:-2)+'" y="-12" width="124" height="17" rx="4" fill="var(--card)" stroke="var(--line)" opacity="0.92"/>';
    svg += '    <text x="'+(textAnchor==="end"?-6:4)+'" y="0" font-size="9.5" font-weight="700" fill="var(--ink)" text-anchor="'+textAnchor+'">'+e.name.replace(" Tea Estate","")+' ('+e.year+')</text>';
    svg += '  </g>';
    
    svg += '</g>';
  });

  svg += '</svg>';
  mapWrap.innerHTML = svg;
}

// Render Top 10 Estates Cards Grid below map
function renderTop10Estates() {
  top10Grid.innerHTML = "";
  
  TOP_10_ESTATES.forEach(function(e, i){
    var card = document.createElement("div");
    card.className = "top10-card";
    card.id = "top10-card-" + i;
    
    card.innerHTML = 
      '<div class="top10-thumb-wrap">' +
      '  <img src="' + e.img + '" alt="' + e.name + ' Cultivation" class="top10-thumb" loading="lazy">' +
      '  <span class="top10-rank-badge">#' + e.rank + ' PRESTIGE</span>' +
      '  <span class="top10-circle-badge">' + e.circle.split("/")[0] + '</span>' +
      '</div>' +
      '<div class="top10-content">' +
      '  <h4 class="top10-title">' + e.name + '</h4>' +
      '  <div class="top10-owner">📍 ' + e.location + '</div>' +
      '  <div style="font-size:12px;color:var(--primary);font-weight:600;margin-bottom:8px">🏛 Registry: ' + e.registry + '</div>' +
      '  <div class="top10-specs">' +
      '    <div class="top10-spec-item"><strong>' + e.capacity + '</strong><span>Annual Cap.</span></div>' +
      '    <div class="top10-spec-item"><strong>' + e.area.toFixed(0) + ' ha</strong><span>Area</span></div>' +
      '    <div class="top10-spec-item"><strong>' + e.yield.toLocaleString() + '</strong><span>kg/ha</span></div>' +
      '  </div>' +
      '  <div class="top10-specialty">🍃 <strong>Profile:</strong> ' + e.characteristics + '</div>' +
      '  <button type="button" class="top10-btn" onclick="openEstateModal(' + i + ')">' +
      '    <span>🌿 View Cultivation &amp; Info Window</span>' +
      '  </button>' +
      '</div>';
      
    top10Grid.appendChild(card);
  });
}

// Open Estate Cultivation Picture & Details Modal
window.openEstateModal = function(index) {
  var e = TOP_10_ESTATES[index];
  if(!e) return;
  
  // Highlight map pin
  document.querySelectorAll(".estate-pin-group").forEach(function(p){ p.classList.remove("highlighted"); });
  var pin = document.getElementById("pin-group-" + index);
  if(pin) pin.classList.add("highlighted");
  
  // Highlight card
  document.querySelectorAll(".top10-card").forEach(function(c){ c.style.borderColor = "var(--line)"; });
  var card = document.getElementById("top10-card-" + index);
  if(card) card.style.borderColor = "var(--gold)";

  modalBody.innerHTML = 
    '<div class="modal-cultivation-banner">' +
    '  <img src="' + e.img + '" alt="' + e.name + ' Cultivation Field Scene" class="modal-cultivation-img">' +
    '  <div class="modal-banner-overlay">' +
    '    <div class="modal-tag-row">' +
    '      <span class="modal-pill gold">RANK #' + e.rank + ' IN DIBRUGARH</span>' +
    '      <span class="modal-pill green">FOUNDED ' + e.year + '</span>' +
    '      <span class="modal-pill">' + e.circle + '</span>' +
    '    </div>' +
    '    <h2 style="font-size:clamp(22px,3vw,30px);margin:0;color:#fff;font-family:Playfair Display,serif">' + e.name + '</h2>' +
    '    <div style="font-size:13px;opacity:0.9;margin-top:4px">' + e.owner + '</div>' +
    '  </div>' +
    '</div>' +
    '<div class="modal-body">' +
    '  <div style="font-size:12.5px;font-style:italic;color:var(--ink-soft);margin-bottom:16px;background:var(--primary-light);padding:8px 12px;border-radius:6px;border-left:3px solid var(--primary)">' +
    '    📷 <strong>Cultivation Scene:</strong> ' + e.caption +
    '  </div>' +
    '  <div class="modal-stats-grid">' +
    '    <div class="modal-stat-box"><div class="val">' + e.capacity + '</div><div class="lbl">Annual Cap. / Output</div></div>' +
    '    <div class="modal-stat-box"><div class="val">' + e.area.toFixed(1) + ' ha</div><div class="lbl">Plantation Area</div></div>' +
    '    <div class="modal-stat-box"><div class="val">' + e.yield.toLocaleString() + '</div><div class="lbl">Yield (kg/ha)</div></div>' +
    '    <div class="modal-stat-box"><div class="val">' + e.leaf.toFixed(2) + ' M kg</div><div class="lbl">Green Leaf Harvest</div></div>' +
    '    <div class="modal-stat-box"><div class="val">' + e.workforce.toLocaleString() + '</div><div class="lbl">Workforce</div></div>' +
    '    <div class="modal-stat-box"><div class="val">' + e.lat + '°N, ' + e.lon + '°E</div><div class="lbl">GIS Coordinates</div></div>' +
    '  </div>' +
    '  <div style="background:var(--primary-light);border-left:4px solid var(--primary);border-radius:0 8px 8px 0;padding:10px 14px;margin-bottom:14px;font-size:13px">' +
    '    <strong>🏛 Official Registry:</strong> ' + e.registry + ' &nbsp;•&nbsp; <strong>📍 Location:</strong> ' + e.location +
    '  </div>' +
    '  <div class="modal-accolade-box">' +
    '    <strong>🏆 Landmark Distinction:</strong> ' + e.accolade +
    '  </div>' +
    '  <div class="modal-desc">' +
    '    <h4 style="margin:0 0 6px;color:var(--primary);font-size:15px">Terroir, Cultivation &amp; Heritage Architecture</h4>' +
    '    <p style="margin:0 0 10px">' + e.desc + '</p>' +
    '    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">' +
    '      <span style="font-size:11.5px;padding:3px 9px;border-radius:12px;background:var(--primary-light);color:var(--primary);font-weight:600">🌿 Produce: ' + e.specialty + '</span>' +
    '      <span style="font-size:11.5px;padding:3px 9px;border-radius:12px;background:var(--primary-light);color:var(--primary);font-weight:600">🏛 Circle: ' + e.circle + '</span>' +
    '    </div>' +
    '  </div>' +
    '  <div class="modal-footer">' +
    '    <button type="button" class="btn btn-gold" onclick="modalFocusMap()">📍 Focus on Dibrugarh Map</button>' +
    '    <button type="button" class="btn btn-ghost" onclick="modalFocusDirectory()">📋 Compare with 177 Directory</button>' +
    '    <button type="button" class="btn btn-ghost" style="margin-left:auto" onclick="closeEstateModal()">✕ Close Window</button>' +
    '  </div>' +
    '</div>';

  modalBackdrop.classList.add("open");
  modalBackdrop.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

window.modalFocusMap = function() {
  closeEstateModal();
  var el = document.getElementById("map-section");
  if(el) el.scrollIntoView({ behavior: "smooth" });
};
window.modalFocusDirectory = function() {
  closeEstateModal();
  var el = document.getElementById("estates-177");
  if(el) el.scrollIntoView({ behavior: "smooth" });
};

window.closeEstateModal = function() {
  modalBackdrop.classList.remove("open");
  modalBackdrop.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

modalCloseBtn.addEventListener("click", closeEstateModal);
modalBackdrop.addEventListener("click", function(ev){
  if(ev.target === modalBackdrop) closeEstateModal();
});
document.addEventListener("keydown", function(ev){
  if(ev.key === "Escape" && modalBackdrop.classList.contains("open")) {
    closeEstateModal();
  }
});

// Circle Filter Buttons
var circleBtns = document.querySelectorAll(".map-circle-btn");
circleBtns.forEach(function(btn){
  btn.addEventListener("click", function(){
    circleBtns.forEach(function(b){ b.classList.remove("active"); });
    this.classList.add("active");
    currentSelectedCircle = this.getAttribute("data-circle");
    renderDibrugarhMap();
  });
});

function renderTop10Table() {
  var tbody = document.getElementById("top10_table_body");
  if(!tbody) return;
  tbody.innerHTML = "";
  
  TOP_10_ESTATES.forEach(function(e, i){
    var tr = document.createElement("tr");
    tr.innerHTML = 
      '<td style="text-align:center"><strong>' + e.rank + '</strong></td>' +
      '<td><strong>' + e.name + '</strong><br><span style="font-size:11.5px;color:var(--ink-soft)">' + e.circle + '</span></td>' +
      '<td><strong>' + e.location + '</strong><br><span style="font-size:12px;color:var(--ink-soft)">' + e.characteristics + '</span></td>' +
      '<td style="text-align:right"><strong>' + e.capacity + '</strong></td>' +
      '<td><span class="tag tag-real" style="font-size:11px">' + e.registry + '</span></td>' +
      '<td style="text-align:center"><button type="button" class="btn btn-ghost" style="padding:4px 8px;font-size:11.5px" onclick="openEstateModal(' + i + ')">Inspect</button></td>';
    tbody.appendChild(tr);
  });
}

renderDibrugarhMap();
renderTop10Estates();
renderTop10Table();

// Production Table Logic
var tb = document.getElementById("tb");
function fmt(n){ return isFinite(n) ? Math.round(n).toLocaleString() : "–"; }
function drawTable() {
  tb.innerHTML = "";
  rows.sort(function(a,b){ return a.y - b.y; });
  rows.forEach(function(r, i){
    var tr = document.createElement("tr");
    tr.innerHTML = '<td><input style="width:65px;font:inherit;background:transparent;color:inherit;border:1px solid var(--line);padding:3px;text-align:right" data-i="'+i+'" data-k="y" value="'+r.y+'" aria-label="Year"></td>' +
                   '<td><input style="width:100px;font:inherit;background:transparent;color:inherit;border:1px solid var(--line);padding:3px;text-align:right" data-i="'+i+'" data-k="a" value="'+r.a+'" aria-label="Area"></td>' +
                   '<td><input style="width:120px;font:inherit;background:transparent;color:inherit;border:1px solid var(--line);padding:3px;text-align:right" data-i="'+i+'" data-k="g" value="'+r.g+'" aria-label="Green leaf"></td>' +
                   '<td><input style="width:110px;font:inherit;background:transparent;color:inherit;border:1px solid var(--line);padding:3px;text-align:right" data-i="'+i+'" data-k="m" value="'+r.m+'" aria-label="Made tea"></td>' +
                   '<td>' + fmt(r.g / r.a) + '</td>' +
                   '<td>' + (r.m / r.g).toFixed(3) + '</td>';
    tb.appendChild(tr);
  });
}
tb.addEventListener("input", function(e){
  var t = e.target, i = t.dataset.i;
  if(i === undefined) return;
  var v = parseFloat(t.value);
  if(!isNaN(v)) rows[i][t.dataset.k] = v;
});

// Chart.js Setup
var charts = [];
function css(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

window.safeCreateChart = function(canvasIdOrEl, config) {
  try {
    var el = (typeof canvasIdOrEl === "string") ? document.getElementById(canvasIdOrEl) : canvasIdOrEl;
    if(!el) return null;
    return new Chart(el, config);
  } catch(err) {
    console.warn("Chart creation error on " + canvasIdOrEl + ":", err);
    return null;
  }
};

function buildCharts() {
  if(typeof Chart === "undefined") {
    console.warn("Chart.js not yet loaded");
    return;
  }
  if(window.charts && window.charts.length) {
    window.charts.forEach(function(c){ try { if(c && c.destroy) c.destroy(); } catch(e){} });
  }
  charts = [];
  window.charts = charts;

  // Luminous, light, elegant nature & analytics palette (replaces dark/dull tones)
  var cLime   = "#84cc16"; // Bright fresh spring lime
  var cLimeL  = "#a3e635"; // Soft vibrant light lime
  var cMint   = "#34d399"; // Luminous mint green
  var cTeal   = "#2dd4bf"; // Crisp light seafoam teal
  var cCyan   = "#38bdf8"; // Light sky cyan / Brahmaputra water
  var cBlue   = "#60a5fa"; // Soft light cornflower blue
  var cGold   = "#fbbf24"; // Warm sunlit honey gold
  var cPeach  = "#fb923c"; // Light warm peach / coral
  var cPurple = "#c084fc"; // Soft light orchid lavender
  var cSlate  = "#94a3b8"; // Clean modern silver slate
  var cRose   = "#f472b6"; // Soft petal rose
  var gr = cLime, br = cGold, sl = cSlate; // Light palette aliases

  Chart.defaults.color = "#334155";
  Chart.defaults.borderColor = "rgba(0, 0, 0, 0.05)";
  Chart.defaults.font.family = '"Public Sans", "Segoe UI", sans-serif';
  Chart.defaults.maintainAspectRatio = false;
  if(!Chart.defaults.plugins) Chart.defaults.plugins = {};
  if(!Chart.defaults.plugins.tooltip) Chart.defaults.plugins.tooltip = {};
  Chart.defaults.plugins.tooltip.backgroundColor = "rgba(15, 36, 19, 0.92)";
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.padding = 10;
  if(!Chart.defaults.plugins.legend) Chart.defaults.plugins.legend = {};
  if(!Chart.defaults.plugins.legend.labels) Chart.defaults.plugins.legend.labels = {};
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.boxWidth = 8;
  Chart.defaults.plugins.legend.labels.boxHeight = 8;

  // Factory Labor Concentration by Size Class (18,995 Factory Specialists)
  var ctxLab = document.getElementById("c_factory_labor");
  if(ctxLab) {
    charts.push(safeCreateChart(ctxLab, {
      type: "bar",
      data: {
        labels: ["Estates >400 ha (Large)", "Estates 200–400 ha (Medium)", "Estates 0–200 ha (Small)"],
        datasets: [{
          label: "Factory Workers Engaged",
          data: [13218, 5449, 328],
          backgroundColor: [cLime, cCyan, cGold], borderRadius: 6
        }]
      },
      options: {
        indexAxis: "y",
        scales: { x: { beginAtZero: true, title: { display: true, text: "Workers in Factory Operations" } } },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(ctx){
                return ctx.raw.toLocaleString() + " workers (" + ((ctx.raw/18995)*100).toFixed(1) + "% of total)";
              }
            }
          }
        }
      }
    }));
  }

  // Gross Value of Output (GVO) vs Wage Expenditure (₹ Lakhs)
  var ctxFin = document.getElementById("c_estate_finance");
  if(ctxFin) {
    charts.push(safeCreateChart(ctxFin, {
      type: "bar",
      data: {
        labels: ["Estates 0–200 ha", "Estates 200–400 ha", "Estates >400 ha", "District Total"],
        datasets: [
          { label: "Gross Value of Output (₹ Lakhs @ ₹30/kg)", data: [11000.30, 48055.18, 7089.88, 66145.36], backgroundColor: cMint, borderRadius: 6 },
          { label: "Salary & Wage Expenses (₹ Lakhs)", data: [8162.57, 34868.72, 35971.57, 79002.86], backgroundColor: cPeach, borderRadius: 6 }
        ]
      },
      options: {
        scales: { y: { beginAtZero: true, title: { display: true, text: "₹ in Lakhs (100 Lakhs = 1 Crore)" } } }
      }
    }));
  }

  // Tea Board STG Registration Growth (2022-2026)
  var ctxStgGr = document.getElementById("c_stg_teaboard_growth");
  if(ctxStgGr) {
    charts.push(safeCreateChart(ctxStgGr, {
      type: "bar",
      data: {
        labels: ["2022–23", "2023–24", "2024–25", "2026 Horizon"],
        datasets: [
          { label: "Registered Small Growers", data: [28555, 29695, 29771, 29771], backgroundColor: cLime, borderRadius: 6, yAxisID: "y" },
          { label: "Cultivated Hectares", data: [21475.16, 22237.26, 22283.28, 22283.28], backgroundColor: cGold, borderRadius: 6, yAxisID: "y1" }
        ]
      },
      options: {
        scales: {
          y: { beginAtZero: false, min: 25000, title: { display: true, text: "Registered Growers" } },
          y1: { position: "right", beginAtZero: false, min: 20000, grid: { drawOnChartArea: false }, title: { display: true, text: "Hectares" } }
        }
      }
    }));
  }

  // Dibrugarh Total Cultivation Footprint (Big vs Small 2022-2026)
  var ctxFoot = document.getElementById("c_district_footprint");
  if(ctxFoot) {
    charts.push(safeCreateChart(ctxFoot, {
      type: "bar",
      data: {
        labels: ["2022", "2023", "2024", "2025", "2026 Horizon"],
        datasets: [
          { label: "Big Growers (177 Estates ha)", data: [33019.90, 33019.90, 33019.90, 33019.90, 33019.90], backgroundColor: cSlate, borderRadius: 6 },
          { label: "Small Tea Growers (ha)", data: [20572.52, 21475.16, 22237.26, 22283.28, 22283.28], backgroundColor: cMint, borderRadius: 6 }
        ]
      },
      options: {
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: false, min: 45000, title: { display: true, text: "Total Cultivated Hectares" } }
        }
      }
    }));
  }

  // 1. STG Planting Vintage Timeline to 2026 Horizon
  charts.push(safeCreateChart("c_stg_vintage_2026", {
    type: "bar",
    data: {
      labels: ["Pre-1995 (Pioneers)", "1996–2000 (Early Boom)", "2001–2005 (Peak Surge)", "2006–2015 (Expansion)", "2016–2020 (Consolidation)", "2021–2026 (Modernization)"],
      datasets: [
        {
          label: "Cumulative Active Registered Growers",
          data: [280, 1450, 4320, 6800, 7850, 8420],
          type: "line",
          borderColor: cGold, backgroundColor: "rgba(251, 191, 36, 0.15)", fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: "#ffffff", pointBorderWidth: 2.5,
          yAxisID: "y1"
        },
        {
          label: "New Plantations Established (Per Epoch)",
          data: [280, 1170, 2870, 2480, 1050, 570],
          backgroundColor: cLime, borderRadius: 6,
          yAxisID: "y"
        }
      ]
    },
    options: {
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "New Growers / Epoch" } },
        y1: { position: "right", beginAtZero: true, grid: { drawOnChartArea: false }, title: { display: true, text: "Total Active Growers" } }
      }
    }
  }));

  // 2. STG Landholding Size Classification 2025-2026
  charts.push(safeCreateChart("c_stg_size_2026", {
    type: "bar",
    data: {
      labels: [
        "Marginal (< 1.0 ha / < 7.5 bighas)",
        "Small (1.0 – 2.0 ha / 7.5–15 bighas)",
        "Semi-Medium (2.0 – 5.0 ha / 15–37.5 bighas)",
        "Medium (5.0 – 10.12 ha / up to 25 acres)"
      ],
      datasets: [
        {
          label: "% of Total Smallholders (Grower Count)",
          data: [54.2, 26.8, 13.5, 5.5],
          backgroundColor: cCyan, borderRadius: 6
        },
        {
          label: "% Share of STG Green Leaf Volume Produced",
          data: [22.4, 31.6, 29.8, 16.2],
          backgroundColor: cMint, borderRadius: 6
        }
      ]
    },
    options: {
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Percentage (%)" } }
      }
    }
  }));

  // 3. 177 Estates: Size Class vs Area
  charts.push(safeCreateChart("c_estate_size_area", {
    type: "bar",
    data: {
      labels: ["< 200 ha (Small, 94)", "200–400 ha (Medium, 58)", "400+ ha (Large, 25)"],
      datasets: [
        { label: "Estate Count", data: [94, 58, 25], backgroundColor: cLime, borderRadius: 6, yAxisID: "y" },
        { label: "Total Area (ha)", data: [5979.43, 17096.35, 14178.25], backgroundColor: cPurple, borderRadius: 6, yAxisID: "y1" }
      ]
    },
    options: {
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Number of Estates" } },
        y1: { position: "right", beginAtZero: true, grid: { drawOnChartArea: false }, title: { display: true, text: "Total Area (Hectares)" } }
      }
    }
  }));

  // 4. 177 Estates: Green Leaf Share
  charts.push(safeCreateChart("c_estate_leaf_share", {
    type: "doughnut",
    data: {
      labels: ["Medium Estates 200-400 ha (72.6%)", "Small Estates <200 ha (16.6%)", "Large Estates 400+ ha (10.8%)"],
      datasets: [{
        data: [160.18, 36.67, 23.63],
        backgroundColor: [cMint, cCyan, cGold], borderColor: "#ffffff", borderWidth: 2.5
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(ctx){
              return ctx.label.split("(")[0] + ": " + ctx.raw + " M kg (" + ((ctx.raw/220.48)*100).toFixed(1) + "%)";
            }
          }
        }
      }
    }
  }));

  // 5. 177 Estates: Circle Distribution
  charts.push(safeCreateChart("c_circle_dist", {
    type: "bar",
    data: {
      labels: ["Chabua Circle", "Dibrugarh West / Borboruah", "Naharkatia / Joypur", "Tingkhong / Moran", "Dibrugarh East"],
      datasets: [{
        label: "Registered Corporate Estates",
        data: [42, 38, 36, 34, 27],
        backgroundColor: [cLime, cCyan, cGold, cPurple, cPeach], borderRadius: 6
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, title: { display: true, text: "Estates Count" } } }
    }
  }));

  // 6. 177 Estates: Ownership Architecture
  charts.push(safeCreateChart("c_owner_dist", {
    type: "doughnut",
    data: {
      labels: ["Corporate Conglomerates (McLeod, APPL, Warren)", "Proprietary & Family Pvt Ltds", "Regional Trusts & Independents", "Public Sector Enterprises (Andrew Yule / ATC)"],
      datasets: [{
        data: [68, 72, 26, 11],
        backgroundColor: [cMint, cGold, cCyan, cPurple], borderColor: "#ffffff", borderWidth: 2.5
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(ctx){
              return ctx.label + ": " + ctx.raw + " estates (" + ((ctx.raw/177)*100).toFixed(1) + "%)";
            }
          }
        }
      }
    }
  }));

  // 7. Auction Realization by Type
  charts.push(safeCreateChart("c_type_price", {
    type: "bar",
    data: {
      labels: ["Orthodox", "CTC Leaf", "Dust Grades", "All Combined Avg"],
      datasets: [
        { label: "2024 Realized (₹/kg)", data: [275.17, 224.69, 185.30, 225.72], backgroundColor: cSlate, borderRadius: 6 },
        { label: "2025 Realized (₹/kg)", data: [292.40, 207.14, 172.50, 204.87], backgroundColor: cMint, borderRadius: 6 }
      ]
    },
    options: { scales: { y: { beginAtZero: true, title: { display: true, text: "₹ / kg" } } } }
  }));

  // 8. GTAC Monthly Price Curve
  var M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var P24 = [135.10, 124.52, 118.37, 236.32, 217.61, 256.48, 261.01, 262.24, 259.97, 250.51, 225.27, 184.13];
  var P25 = [153.41, 147.95, 152.59, 225.16, 226.00, 245.12, 230.52, 207.93, 200.27, null, null, null];
  charts.push(safeCreateChart("c3", {
    type: "line",
    data: {
      labels: M,
      datasets: [
        { label: "2024 Realization (₹/kg)", data: P24, borderColor: cSlate, backgroundColor: "rgba(148, 163, 184, 0.12)", fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: "#ffffff", pointBorderWidth: 2.5 },
        { label: "2025 Realization (₹/kg)", data: P25, borderColor: cLime, backgroundColor: "rgba(132, 204, 22, 0.18)", fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: "#ffffff", pointBorderWidth: 2.5 }
      ]
    },
    options: { scales: { y: { title: { display: true, text: "₹ / kg" } } } }
  }));

  // 9. Global Export Volume Top Destinations
  var DL = ["Iraq","UAE","Russia","China","USA","Iran","UK","Kazakhstan","Germany","Saudi Arabia"];
  charts.push(safeCreateChart("c5", {
    type: "bar",
    data: {
      labels: DL,
      datasets: [
        { label: "2025 (M kg)", data: [52.59, 50.71, 30.98, 16.13, 15.21, 11.25, 11.06, 9.05, 8.56, 7.94], backgroundColor: cMint, borderRadius: 6 },
        { label: "2024 (M kg)", data: [40.47, 43.48, 37.36, 6.24, 17.14, 9.25, 11.86, 8.18, 8.41, 7.73], backgroundColor: cCyan, borderRadius: 6 }
      ]
    },
    options: { indexAxis: "y" }
  }));

  // 10. Export Price Realization by Country
  charts.push(safeCreateChart("c8", {
    type: "bar",
    data: {
      labels: DL,
      datasets: [
        { label: "2025 (₹/kg)", data: [208.22, 333.20, 189.28, 249.00, 427.46, 336.32, 409.26, 195.12, 434.92, 350.97], backgroundColor: cGold, borderRadius: 6 },
        { label: "2024 (₹/kg)", data: [181.45, 295.65, 170.31, 233.73, 404.56, 312.89, 374.36, 180.45, 377.23, 352.12], backgroundColor: cPeach, borderRadius: 6 }
      ]
    },
    options: { indexAxis: "y", scales: { x: { title: { display: true, text: "FOB Export Price (₹/kg)" } } } }
  }));

  // 11. Export Category Breakdown
  charts.push(safeCreateChart("c_cat_pie", {
    type: "doughnut",
    data: {
      labels: ["CTC (Black)", "Orthodox (Premium)", "Green & Specialty", "Instant / Ready"],
      datasets: [{
        data: [176.5, 92.4, 8.2, 3.3],
        backgroundColor: [cLime, cGold, cMint, cCyan], borderColor: "#ffffff", borderWidth: 2.5
      }]
    },
    options: { plugins: { tooltip: { callbacks: { label: function(ctx){ return ctx.label + ": " + ctx.raw + " M kg (" + ((ctx.raw/280.4)*100).toFixed(1) + "%)"; } } } } }
  }));

  // 12. Port Dispatches Bar
  charts.push(safeCreateChart("c_port_bar", {
    type: "bar",
    data: {
      labels: ["Kolkata Port / Haldia", "Mumbai (JNPT)", "Chennai Port", "Cochin Port", "Inland ICDs (Delhi/Amd)"],
      datasets: [{
        label: "Export Volume Handled (M kg)",
        data: [148.2, 46.5, 38.1, 32.6, 15.0],
        backgroundColor: [cCyan, cMint, cGold, cPurple, cPeach], borderRadius: 6
      }]
    },
    options: { scales: { y: { beginAtZero: true, title: { display: true, text: "M kg Handled" } } } }
  }));

  // 13. Domestic Auction Centers Realization
  charts.push(safeCreateChart("c9", {
    type: "bar",
    data: {
      labels: ["Kolkata (West Bengal)", "Guwahati (Assam)", "Siliguri (West Bengal)", "Cochin (Kerala)", "Coonoor (Tamil Nadu)", "Coimbatore (Tamil Nadu)"],
      datasets: [
        { label: "2025 (₹/kg)", data: [237.03, 204.87, 168.94, 164.44, 107.34, 133.23], backgroundColor: cLime, borderRadius: 6 },
        { label: "2024 (₹/kg)", data: [249.04, 225.73, 201.26, 154.98, 118.13, 126.63], backgroundColor: cBlue, borderRadius: 6 }
      ]
    },
    options: { scales: { y: { beginAtZero: true, title: { display: true, text: "₹ / kg" } } } }
  }));

  // 14. Major Consuming States
  charts.push(safeCreateChart("c_state_consume", {
    type: "bar",
    data: {
      labels: ["Maharashtra", "Uttar Pradesh", "Gujarat", "Rajasthan", "West Bengal", "Madhya Pradesh", "Punjab / Haryana", "Delhi NCR"],
      datasets: [{
        label: "Est. Annual Consumption (M kg)",
        data: [142, 136, 108, 92, 85, 78, 64, 52],
        backgroundColor: cCyan, borderRadius: 6
      }]
    },
    options: { indexAxis: "y", scales: { x: { title: { display: true, text: "Million kg consumed" } } } }
  }));

  // 15. Monthly STG vs Estate Production
  var MS = [0.24, 0.45, 3.96, 5.42, 6.97, 7.99, 9.23, 9.99, 8.75, 6.16, 4.94, 1.74];
  var ME = [0.21, 0.37, 3.24, 4.43, 5.93, 6.81, 7.87, 8.51, 7.45, 5.24, 4.21, 1.49];
  charts.push(safeCreateChart("c6", {
    type: "bar",
    data: {
      labels: M,
      datasets: [
        { label: "Small Growers (STG)", data: MS, backgroundColor: cMint, borderRadius: 6 },
        { label: "Estates Share", data: ME, backgroundColor: cGold, borderRadius: 6 }
      ]
    },
    options: { scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, title: { display: true, text: "M kg" } } } }
  }));

  // 16. Bought Leaf vs Export Price
  var BL = [238.5, 240.0, 244.2, 246.8, 248.79, 252.1, 249.3, 247.1, 246.5, 248.0, 245.2, 241.0];
  var EX = [315.0, 316.5, 319.2, 321.55, 450.0, 520.0, 380.0, 365.0, 370.0, 410.0, 395.0, 330.0];
  charts.push(safeCreateChart("c7", {
    type: "line",
    data: {
      labels: M,
      datasets: [
        { label: "Bought-Leaf Factory Price", data: BL, borderColor: cCyan, backgroundColor: "rgba(56, 189, 248, 0.12)", fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: "#ffffff", pointBorderWidth: 2.5 },
        { label: "Export Realization (Second Flush Spike)", data: EX, borderColor: cPeach, backgroundColor: "rgba(251, 146, 60, 0.16)", fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: "#ffffff", pointBorderWidth: 2.5 }
      ]
    },
    options: { scales: { y: { title: { display: true, text: "₹ / kg" } } } }
  }));
}

// Persist & button handlers
function persist(){
  try { localStorage.setItem("dtea_scrolly_v1", JSON.stringify(rows)); } catch(e){}
}
document.getElementById("save").onclick = function(){
  persist(); drawTable(); buildCharts();
  alert("Production records saved in local session!");
};
document.getElementById("add").onclick = function(){
  var l = rows[0];
  rows.unshift({y: l.y - 1, a: l.a, g: l.g, m: l.m});
  drawTable();
};
document.getElementById("reset").onclick = function(){
  rows = BASE.map(function(r){ return Object.assign({}, r); });
  try { localStorage.removeItem("dtea_scrolly_v1"); } catch(e){}
  drawTable(); buildCharts();
};
document.getElementById("csv").onclick = function(){
  var t = "year,area_ha,green_leaf_kg,made_tea_kg\n" + rows.map(function(r){ return [r.y, r.a, r.g, r.m].join(","); }).join("\n");
  var a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(t);
  a.download = "dibrugarh_tea_production_records.csv";
  a.click();
};

var tg = document.getElementById("theme-btn");
if(tg) {
  tg.onclick = function(){
    var d = document.documentElement, dark = css("color-scheme") === "dark";
    d.setAttribute("data-theme", dark ? "light" : "dark");
    tg.textContent = dark ? "🌓 Dark Mode" : "☀️ Light Mode";
    if(typeof buildCharts === "function") buildCharts();
    if(pbiSectorChart) pbiSectorChart.update();
    if(pbiPricesChart) pbiPricesChart.update();
  };
  if(css("color-scheme") === "dark") tg.textContent = "☀️ Light Mode";
}


window.buildCharts = buildCharts;
window.initPbiCharts = initPbiCharts;
window.drawTable = drawTable;

drawTable();
buildCharts();
initPbiCharts();
updatePbiDashboard();


// ==========================================================================

// ==========================================================================
// ADMIN AUTHENTICATION & DIRECT UPDATE SYSTEM (Admin / 123)
// ==========================================================================
var DEFAULT_PORTAL_STATE = {
  // 2026 Season Horizon Metrics
  green_leaf_mkg: 235.0,
  made_tea_mkg: 74.7,
  p_gtac: 232.50,
  p_orthodox: 298.50,
  p_ctc: 218.40,
  p_dust: 178.20,
  p_stg_leaf: 32.50,
  outturn_ratio: 0.318,

  // Industry Census & Economics
  area_total_ha: 55303.18,
  area_corporate_ha: 33019.90,
  area_stg_ha: 22283.28,
  estates_count: 177,
  stg_count: 29771,
  workers_total: 121671,
  workers_factory: 18995,
  wages_annual_cr: 790.03,
  leaf_gvo_cr: 661.45,

  custom_notice: "Dibrugarh Tea Information & Power BI Analytics • 2026 Edition | Updated to 2026 Operational Horizon"
};

var PORTAL_STATE = Object.assign({}, DEFAULT_PORTAL_STATE);

// Load persisted state from localStorage
function loadPersistedState() {
  try {
    var saved = localStorage.getItem("dibrugarh_admin_state_v1");
    if(saved) {
      var parsed = JSON.parse(saved);
      PORTAL_STATE = Object.assign({}, DEFAULT_PORTAL_STATE, parsed);
    }
  } catch(e) {
    console.warn("Could not load persisted state:", e);
  }
}
loadPersistedState();

function savePortalState() {
  try {
    localStorage.setItem("dibrugarh_admin_state_v1", JSON.stringify(PORTAL_STATE));
  } catch(e) {
    console.warn("Could not save portal state:", e);
  }
}

// Check Authentication Status
function isAdminLoggedIn() {
  try {
    return sessionStorage.getItem("dtea_admin_auth") === "true";
  } catch(e) {
    return false;
  }
}

function updateAuthUI() {
  var loggedIn = isAdminLoggedIn();
  var authBtn = document.getElementById("admin-auth-btn");
  var loggedBox = document.getElementById("admin-logged-box");
  var sideLink = document.getElementById("sidebar-admin-link");
  var dropOpt = document.getElementById("drop-opt-admin");
  var topLabel = document.getElementById("topbar-admin-label");

  if(loggedIn) {
    if(authBtn) authBtn.style.display = "none";
    if(loggedBox) loggedBox.style.display = "block";
    if(sideLink) sideLink.style.display = "flex";
    if(dropOpt) dropOpt.style.display = "block";
    if(topLabel) topLabel.textContent = "⚙️ Admin Panel";
  } else {
    if(authBtn) authBtn.style.display = "flex";
    if(loggedBox) loggedBox.style.display = "none";
    if(sideLink) sideLink.style.display = "none";
    if(dropOpt) dropOpt.style.display = "none";
    if(topLabel) topLabel.textContent = "Admin Login";
  }
}

// Explicit window exports for Admin Authentication and Navigation
window.isAdminLoggedIn = function() {
  try {
    return sessionStorage.getItem("dtea_admin_auth") === "true";
  } catch(e) {
    return false;
  }
};

window.openAdminLoginModal = function() {
  var m = document.getElementById("admin-login-modal");
  var err = document.getElementById("login-error-msg");
  var userInput = document.getElementById("admin-user-input");
  var passInput = document.getElementById("admin-pass-input");
  if(err) err.style.display = "none";
  if(userInput) userInput.value = "Admin";
  if(passInput) passInput.value = "123";
  if(m) {
    m.style.display = "flex";
    m.style.zIndex = "9999999";
  }
};

window.closeAdminLoginModal = function() {
  var m = document.getElementById("admin-login-modal");
  if(m) m.style.display = "none";
};

window.fillAdminCredentials = function() {
  var userInput = document.getElementById("admin-user-input");
  var passInput = document.getElementById("admin-pass-input");
  if(userInput) userInput.value = "Admin";
  if(passInput) passInput.value = "123";
};

window.handleTopbarAdminClick = function() {
  if(window.isAdminLoggedIn()) {
    window.navigateToPage("admin-panel");
  } else {
    window.openAdminLoginModal();
  }
};

window.handleAdminNavClick = function(event) {
  if(event) {
    try { event.preventDefault(); } catch(e){}
  }
  if(window.isAdminLoggedIn()) {
    window.navigateToPage("admin-panel");
  } else {
    window.openAdminLoginModal();
  }
};

window.handleAdminLogin = function(event) {
  if(event) {
    try { event.preventDefault(); } catch(e){}
  }
  var u = (document.getElementById("admin-user-input").value || "").trim();
  var p = (document.getElementById("admin-pass-input").value || "").trim();
  var err = document.getElementById("login-error-msg");

  if(u.toLowerCase() === "admin" && p === "123") {
    try {
      sessionStorage.setItem("dtea_admin_auth", "true");
      sessionStorage.setItem("tea_portal_auth", "true");
    } catch(e){}
    window.closeAdminLoginModal();
    if(typeof updateAuthUI === "function") updateAuthUI();
    window.navigateToPage("admin-panel");
    if(typeof showAdminAlert === "function") {
      showAdminAlert("🎉 Welcome Admin! Master access unlocked successfully.", "success");
    }
  } else {
    if(err) err.style.display = "block";
  }
};

window.handleAdminLogout = function() {
  try { sessionStorage.removeItem("dtea_admin_auth"); } catch(e){}
  if(typeof updateAuthUI === "function") updateAuthUI();
  window.navigateToPage("pbi-dashboard");
  if(typeof showAdminAlert === "function") {
    showAdminAlert("You have logged out of the admin panel.", "info");
  }
};

window.switchAdminTab = function(tabId) {
  var tabs = document.querySelectorAll(".admin-tab-content");
  tabs.forEach(function(t){ t.style.display = "none"; });
  var activeTab = document.getElementById(tabId);
  if(activeTab) activeTab.style.display = "block";

  var btns = document.querySelectorAll(".admin-tab-btn");
  btns.forEach(function(b){
    if(b.getAttribute("data-tab") === tabId) {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });


  if(tabId === "tab-charts") {
    var picker = document.getElementById("adm-chart-picker");
    if(picker) loadChartEditorData(picker.value);
  } else if(tabId === "tab-directory") {
    renderAdminSTGTable();
  } else if(tabId === "tab-code") {
    var jsonArea = document.getElementById("adm-json-editor");
    if(jsonArea) jsonArea.value = JSON.stringify(PORTAL_STATE, null, 2);
  }
}

// Sync Form Fields with State
function populateAdminFormFromState() {
  var setVal = function(id, val){
    var el = document.getElementById(id);
    if(el && val !== undefined) el.value = val;
  };
  setVal("adm_g_leaf", PORTAL_STATE.green_leaf_mkg);
  setVal("adm_made_tea", PORTAL_STATE.made_tea_mkg);
  setVal("adm_p_gtac", PORTAL_STATE.p_gtac);
  setVal("adm_p_orth", PORTAL_STATE.p_orthodox);
  setVal("adm_p_ctc", PORTAL_STATE.p_ctc);
  setVal("adm_p_dust", PORTAL_STATE.p_dust);
  setVal("adm_p_stg", PORTAL_STATE.p_stg_leaf);
  setVal("adm_outturn", PORTAL_STATE.outturn_ratio);

  setVal("adm_area_total", PORTAL_STATE.area_total_ha);
  setVal("adm_area_big", PORTAL_STATE.area_corporate_ha);
  setVal("adm_area_stg", PORTAL_STATE.area_stg_ha);
  setVal("adm_estates_count", PORTAL_STATE.estates_count);
  setVal("adm_stg_count", PORTAL_STATE.stg_count);
  setVal("adm_workers_count", PORTAL_STATE.workers_total);
  setVal("adm_factory_workers", PORTAL_STATE.workers_factory);
  setVal("adm_wage_bill", PORTAL_STATE.wages_annual_cr);
  setVal("adm_leaf_gvo", PORTAL_STATE.leaf_gvo_cr);

  var noticeEl = document.getElementById("adm-custom-notice-html");
  if(noticeEl && PORTAL_STATE.custom_notice) noticeEl.value = PORTAL_STATE.custom_notice;
}

// Save All Metrics & Apply Live
function saveAdminAllMetrics() {
  var getNum = function(id, fallback){
    var el = document.getElementById(id);
    return el && !isNaN(parseFloat(el.value)) ? parseFloat(el.value) : fallback;
  };

  PORTAL_STATE.green_leaf_mkg = getNum("adm_g_leaf", 235.0);
  PORTAL_STATE.made_tea_mkg = getNum("adm_made_tea", 74.7);
  PORTAL_STATE.p_gtac = getNum("adm_p_gtac", 232.50);
  PORTAL_STATE.p_orthodox = getNum("adm_p_orth", 298.50);
  PORTAL_STATE.p_ctc = getNum("adm_p_ctc", 218.40);
  PORTAL_STATE.p_dust = getNum("adm_p_dust", 178.20);
  PORTAL_STATE.p_stg_leaf = getNum("adm_p_stg", 32.50);
  PORTAL_STATE.outturn_ratio = getNum("adm_outturn", 0.318);

  PORTAL_STATE.area_total_ha = getNum("adm_area_total", 55303.18);
  PORTAL_STATE.area_corporate_ha = getNum("adm_area_big", 33019.90);
  PORTAL_STATE.area_stg_ha = getNum("adm_area_stg", 22283.28);
  PORTAL_STATE.estates_count = parseInt(getNum("adm_estates_count", 177));
  PORTAL_STATE.stg_count = parseInt(getNum("adm_stg_count", 29771));
  PORTAL_STATE.workers_total = parseInt(getNum("adm_workers_count", 121671));
  PORTAL_STATE.workers_factory = parseInt(getNum("adm_factory_workers", 18995));
  PORTAL_STATE.wages_annual_cr = getNum("adm_wage_bill", 790.03);
  PORTAL_STATE.leaf_gvo_cr = getNum("adm_leaf_gvo", 661.45);

  savePortalState();
  applyStateToLiveDashboard();
  showAdminAlert("✅ Live metrics saved successfully and updated across all dashboards!", "success");
}

function applyStateToLiveDashboard() {
  // Update Power BI Slicer Data Array for 2026
  if(typeof PBI_YEAR_DATA !== "undefined" && PBI_YEAR_DATA["2026"]) {
    PBI_YEAR_DATA["2026"].leaf = PORTAL_STATE.green_leaf_mkg;
    PBI_YEAR_DATA["2026"].made = PORTAL_STATE.made_tea_mkg;
    PBI_YEAR_DATA["2026"].price = PORTAL_STATE.p_gtac;
    PBI_YEAR_DATA["2026"].units = PORTAL_STATE.estates_count + PORTAL_STATE.stg_count;
  }

  // Update BASE table row 0
  if(typeof BASE !== "undefined" && BASE && BASE.length) {
    BASE[0].a = PORTAL_STATE.area_total_ha;
    BASE[0].g = PORTAL_STATE.green_leaf_mkg * 1000000;
    BASE[0].m = PORTAL_STATE.made_tea_mkg * 1000000;
    if(typeof rows !== "undefined" && rows && rows.length) {
      rows[0].a = BASE[0].a;
      rows[0].g = BASE[0].g;
      rows[0].m = BASE[0].m;
      if(typeof drawTable === "function") drawTable();
    }
  }

  // Refresh live dashboard cards & charts
  if(typeof updatePbiDashboard === "function") updatePbiDashboard();
  if(typeof buildCharts === "function") buildCharts();
}

// Reset Admin Baseline Defaults
function resetAdminDefaults() {
  if(!confirm("Reset all portal metrics and charts to original factory defaults?")) return;
  PORTAL_STATE = Object.assign({}, DEFAULT_PORTAL_STATE);
  try { localStorage.removeItem("dibrugarh_admin_state_v1"); } catch(e){}
  populateAdminFormFromState();
  applyStateToLiveDashboard();
  showAdminAlert("↺ System state restored to factory baseline defaults.", "info");
}

// ==========================================
// CHART EDITOR LOGIC (Tab 2)
// ==========================================
var activeEditingChart = null;

function loadChartEditorData(chartKey) {
  var thead = document.getElementById("adm-chart-thead");
  var tbody = document.getElementById("adm-chart-tbody");
  if(!thead || !tbody) return;
  tbody.innerHTML = "";

  var cObj = null;
  if(chartKey === "pbi-sector") cObj = pbiSectorChart;
  else if(chartKey === "pbi-prices") cObj = pbiPricesChart;
  else {
    cObj = Chart.getChart(chartKey);
  }

  if(!cObj || !cObj.data) {
    tbody.innerHTML = "<tr><td colspan='3' style='text-align:center;padding:18px;color:var(--ink-soft)'>Chart currently initializing. Please click Update Chart after page loads.</td></tr>";
    return;
  }
  activeEditingChart = cObj;

  var labels = cObj.data.labels || [];
  var ds1 = (cObj.data.datasets && cObj.data.datasets[0]) ? cObj.data.datasets[0] : null;
  var ds2 = (cObj.data.datasets && cObj.data.datasets[1]) ? cObj.data.datasets[1] : null;

  thead.innerHTML = "<th>Label / Category</th><th>" + (ds1 ? ds1.label : "Series 1") + "</th>" +
                    (ds2 ? "<th>" + ds2.label + "</th>" : "");

  labels.forEach(function(lbl, idx){
    var v1 = (ds1 && ds1.data) ? ds1.data[idx] : "";
    var v2 = (ds2 && ds2.data) ? ds2.data[idx] : "";
    var tr = document.createElement("tr");
    tr.innerHTML = "<td><strong>" + lbl + "</strong></td>" +
      "<td><input type='number' step='any' class='admin-input' style='width:120px;text-align:right' value='" + v1 + "' data-ds='0' data-idx='" + idx + "'></td>" +
      (ds2 ? "<td><input type='number' step='any' class='admin-input' style='width:120px;text-align:right' value='" + v2 + "' data-ds='1' data-idx='" + idx + "'></td>" : "");
    tbody.appendChild(tr);
  });
}

function applyActiveChartEditor() {
  if(!activeEditingChart || !activeEditingChart.data) {
    alert("Please select a chart to edit.");
    return;
  }
  var inputs = document.querySelectorAll("#adm-chart-tbody input");
  inputs.forEach(function(inp){
    var dsIdx = parseInt(inp.getAttribute("data-ds"));
    var dataIdx = parseInt(inp.getAttribute("data-idx"));
    var val = parseFloat(inp.value);
    if(!isNaN(val) && activeEditingChart.data.datasets[dsIdx]) {
      activeEditingChart.data.datasets[dsIdx].data[dataIdx] = val;
    }
  });
  activeEditingChart.update();
  showAdminAlert("📈 Chart updated live with new values!", "success");
}

// ==========================================
// SMALLHOLDERS DIRECTORY MANAGER (Tab 3)
// ==========================================
function renderAdminSTGTable() {
  var tbody = document.getElementById("adm-stg-tbody");
  var countEl = document.getElementById("adm-stg-count");
  if(!tbody || typeof STG_RECORDS === "undefined") return;
  tbody.innerHTML = "";
  if(countEl) countEl.textContent = STG_RECORDS.length;

  STG_RECORDS.forEach(function(r, idx){
    var tr = document.createElement("tr");
    tr.innerHTML = "<td><strong>" + r.code + "</strong></td>" +
      "<td>" + r.garden + "</td>" +
      "<td>" + r.owner + "</td>" +
      "<td>" + r.panchayat + "</td>" +
      "<td style='text-align:right'>" + r.land.toFixed(2) + " ha</td>" +
      "<td style='text-align:right;color:var(--primary);font-weight:700'>" + r.p26.toLocaleString() + " kg</td>" +
      "<td style='text-align:right'>₹" + r.rate.toFixed(2) + "</td>" +
      "<td><button type='button' onclick='deleteSTGRecord(" + idx + ")' style='background:#fee2e2;color:#991b1b;border:1px solid #f87171;border-radius:4px;padding:3px 8px;font-size:11px;cursor:pointer'>Delete</button></td>";
    tbody.appendChild(tr);
  });
}

function deleteSTGRecord(index) {
  if(!confirm("Remove this smallholder record from the directory?")) return;
  STG_RECORDS.splice(index, 1);
  renderAdminSTGTable();
  if(typeof renderSTG === "function") renderSTG();
  showAdminAlert("Record removed from directory.", "info");
}

function addNewSmallholderRecord() {
  var code = (document.getElementById("new_stg_code").value || "").trim();
  var garden = (document.getElementById("new_stg_garden").value || "").trim();
  var owner = (document.getElementById("new_stg_owner").value || "").trim();
  var panchayat = (document.getElementById("new_stg_panchayat").value || "").trim();
  var vintage = (document.getElementById("new_stg_vintage").value || "2005 (Mature)").trim();
  var land = parseFloat(document.getElementById("new_stg_land").value) || 1.0;
  var p24 = parseInt(document.getElementById("new_stg_p24").value) || 8000;
  var p25 = parseInt(document.getElementById("new_stg_p25").value) || 8800;
  var p26 = parseInt(document.getElementById("new_stg_p26").value) || 9500;
  var rate = parseFloat(document.getElementById("new_stg_rate").value) || 32.0;
  var assoc = (document.getElementById("new_stg_assoc").value || "AASTGA").trim();

  if(!code || !garden || !owner) {
    alert("Please fill out at least Biometric Code, Garden Name, and Owner Address.");
    return;
  }

  var newRec = {
    id: (STG_RECORDS.length + 1).toString(),
    code: code,
    garden: garden,
    owner: owner,
    panchayat: panchayat,
    yr: vintage,
    land: land,
    bigha: parseFloat((land * 7.5).toFixed(1)),
    p24: p24,
    p25: p25,
    p26: p26,
    rate: rate,
    status: "Verified QR Smart Card",
    assoc: assoc
  };

  STG_RECORDS.unshift(newRec);
  renderAdminSTGTable();
  if(typeof renderSTG === "function") renderSTG();
  showAdminAlert("✅ Added " + garden + " to smallholders registry!", "success");
}

function resetSTGRecordsBaseline() {
  if(!confirm("Reset smallholders directory to official 24 survey records?")) return;
  if(typeof renderSTG === "function") renderSTG();
  renderAdminSTGTable();
  showAdminAlert("Directory reset to official survey baseline.", "info");
}

// ==========================================
// CODE & JSON CUSTOMIZER (Tab 4)
// ==========================================
function applyCustomNotice() {
  var noticeText = document.getElementById("adm-custom-notice-html").value;
  PORTAL_STATE.custom_notice = noticeText;
  savePortalState();
  var bannerDiv = document.querySelector(".top-notice-subtle div:first-child");
  if(bannerDiv) bannerDiv.innerHTML = noticeText;
  showAdminAlert("⚡ Notice banner updated live!", "success");
}

function applyJsonStateEditor() {
  try {
    var raw = document.getElementById("adm-json-editor").value;
    var parsed = JSON.parse(raw);
    PORTAL_STATE = Object.assign({}, DEFAULT_PORTAL_STATE, parsed);
    savePortalState();
    populateAdminFormFromState();
    applyStateToLiveDashboard();
    showAdminAlert("✅ Complete JSON configuration applied live!", "success");
  } catch(e) {
    alert("JSON Syntax Error: " + e.message);
  }
}

function downloadStateJsonBackup() {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PORTAL_STATE, null, 2));
  var a = document.createElement("a");
  a.href = dataStr;
  a.download = "dibrugarh_tea_system_backup_state.json";
  a.click();
}

// Listen to Hash Changes (Browser Back/Forward navigation)
window.addEventListener("hashchange", function(){
  var hash = window.location.hash.replace("#", "").trim();
  if(hash && VALID_PAGES.indexOf(hash) !== -1) {
    navigateToPage(hash);
  }
});

// Initial Page Load Routing
document.addEventListener("DOMContentLoaded", function(){
  updateAuthUI();
  populateAdminFormFromState();
  applyStateToLiveDashboard();
  var hash = window.location.hash.replace("#", "").trim();
  if(hash && VALID_PAGES.indexOf(hash) !== -1) {
    navigateToPage(hash);
  } else {
    navigateToPage("pbi-dashboard");
  }
});

// Update modal Focus helper functions for divided page routing
window.modalFocusMap = function(){
  closeEstateModal();
  navigateToPage("map-section");
};

window.modalFocusDirectory = function(){
  closeEstateModal();
  navigateToPage("stg-analytics");
};


// ==========================================================================
// PORTAL GATEKEEPER LOGIC (Username: ABCD / Password: 11111)
// ==========================================================================
window.fillPortalOperatorCredentials = function() {
  var u = document.getElementById("portal-username");
  var p = document.getElementById("portal-password");
  if(u) u.value = "ABCD";
  if(p) p.value = "11111";
  var errEl = document.getElementById("portal-login-err");
  if(errEl) errEl.style.display = "none";
};
window.fillPortalCredentials = window.fillPortalOperatorCredentials;

window.fillPortalAdminCredentials = function() {
  var u = document.getElementById("portal-username");
  var p = document.getElementById("portal-password");
  if(u) u.value = "Admin";
  if(p) p.value = "123";
  var errEl = document.getElementById("portal-login-err");
  if(errEl) errEl.style.display = "none";
};

window.togglePortalPassword = function() {
  var p = document.getElementById("portal-password");
  if(!p) return;
  p.type = p.type === "password" ? "text" : "password";
};

window.attemptPortalLogin = function() {
  var uEl = document.getElementById("portal-username");
  var pEl = document.getElementById("portal-password");
  var errEl = document.getElementById("portal-login-err");
  
  var u = (uEl ? uEl.value : "").trim();
  var p = (pEl ? pEl.value : "").trim();

  var isOperator = (u.toUpperCase() === "ABCD" && p === "11111");
  var isAdmin = (u.toLowerCase() === "admin" && p === "123");

  if(isOperator || isAdmin) {
    if(errEl) errEl.style.display = "none";
    try { sessionStorage.setItem("tea_portal_auth", "true"); } catch(e){}
    if(isAdmin) {
      try { sessionStorage.setItem("dtea_admin_auth", "true"); } catch(e){}
    }
    
    var gate = document.getElementById("portal-auth-gate");
    var app = document.getElementById("main-app-container");
    
    document.documentElement.classList.remove("portal-locked");
    
    if(gate) {
      gate.style.transition = "opacity 0.35s ease, transform 0.35s ease";
      gate.style.opacity = "0";
      gate.style.transform = "scale(1.03)";
      setTimeout(function(){
        gate.style.display = "none";
        gate.style.opacity = "1";
        gate.style.transform = "none";
      }, 350);
    }
    
    if(app) {
      app.style.display = "flex";
    }

    if(typeof updateAuthUI === "function") updateAuthUI();
    
    var targetPage = isAdmin ? "admin-panel" : "pbi-dashboard";
    
    // Trigger chart building & resizing once layout is visible
    setTimeout(function() {
      if(typeof navigateToPage === "function") navigateToPage(targetPage);
      if(typeof drawTable === "function") drawTable();
      if(typeof initPbiCharts === "function") initPbiCharts();
      if(typeof buildCharts === "function") buildCharts();
      if(typeof updatePbiDashboard === "function") updatePbiDashboard();
      if(typeof renderDibrugarhMap === "function") renderDibrugarhMap();
      if(isAdmin && typeof showAdminAlert === "function") {
        showAdminAlert("🎉 Welcome Admin! Master access unlocked directly from portal entrance.", "success");
      }
      window.dispatchEvent(new Event("resize"));
    }, 100);
    
    setTimeout(function() {
      if(window.charts && window.charts.length) {
        window.charts.forEach(function(c){ try { if(c && c.resize) c.resize(); } catch(e){} });
      }
      if(window.pbiSectorChart && window.pbiSectorChart.resize) {
        try { window.pbiSectorChart.resize(); } catch(e){}
      }
      if(window.pbiPricesChart && window.pbiPricesChart.resize) {
        try { window.pbiPricesChart.resize(); } catch(e){}
      }
      window.dispatchEvent(new Event("resize"));
    }, 300);
  } else {
    if(errEl) {
      errEl.style.display = "block";
      errEl.innerHTML = "<strong>❌ Authentication Failed:</strong> Please enter <b>Operator</b> (<code>ABCD</code> / <code>11111</code>) or <b>Admin</b> (<code>Admin</code> / <code>123</code>).";
      errEl.classList.remove("shake");
      void errEl.offsetWidth; // trigger reflow
      errEl.classList.add("shake");
    }
  }
};

window.lockPortalSession = function() {
  try { sessionStorage.removeItem("tea_portal_auth"); } catch(e){}
  document.documentElement.classList.add("portal-locked");
  var gate = document.getElementById("portal-auth-gate");
  var app = document.getElementById("main-app-container");
  if(gate) {
    gate.style.display = "flex";
    gate.style.opacity = "1";
    gate.style.transform = "none";
  }
  if(app) {
    app.style.display = "none";
  }
  var u = document.getElementById("portal-username");
  var p = document.getElementById("portal-password");
  if(u) u.value = "";
  if(p) p.value = "";
  var errEl = document.getElementById("portal-login-err");
  if(errEl) errEl.style.display = "none";
};

// Check auth state on load
document.addEventListener("DOMContentLoaded", function() {
  var isAuth = false;
  try { isAuth = sessionStorage.getItem("tea_portal_auth") === "true"; } catch(e){}
  var gate = document.getElementById("portal-auth-gate");
  var app = document.getElementById("main-app-container");
  
  if(isAuth) {
    document.documentElement.classList.remove("portal-locked");
    if(gate) gate.style.display = "none";
    if(app) app.style.display = "flex";
  } else {
    document.documentElement.classList.add("portal-locked");
    if(gate) gate.style.display = "flex";
    if(app) app.style.display = "none";
  }
});


// ==========================================================================
// EXPANDED ADMIN PANEL LOGIC (PAGE INFORMATION, CODE INJECTOR, HERITAGE REGISTRY)
// ==========================================================================

// Page Information & Content Editor
window.PAGE_CUSTOM_DATA = {
  "pbi-dashboard": {
    title: "Executive Power BI Analytics Dashboard",
    tag: "🍃 2026 Season Horizon • Live BI District Engine",
    desc: "District-wide harvest targets, green leaf intake, outturn efficiency, and multi-tier auction price discovery models across Dibrugarh's corporate and smallholder sectors."
  },
  "map-section": {
    title: "Satellite GIS Terrain & Heritage Estates",
    tag: "🛰️ High-Resolution Orthophoto Basemap",
    desc: "True-color satellite survey mapping tea plantations, Brahmaputra alluvial corridors, revenue circles, and 10 landmark heritage estates with verified coordinates."
  },
  "estates-177": {
    title: "177 Corporate Tea Estates Census",
    tag: "🏛️ Official Industrial Registry",
    desc: "Comprehensive macro census of Dibrugarh's 177 corporate tea estates, covering 58,168 ha geographical grant, 37,254 ha under cultivation, and 121,671 workers."
  },
  "stg-analytics": {
    title: "Small Tea Growers (STG) Ecosystem",
    tag: "🍃 29,771 Registered Smallholders",
    desc: "Official Tea Board of India verified small tea growers directory for Borboruah block, tracking 22,283 hectares of smallholder plantations and multi-year harvest yields."
  },
  "scrolly-journey": {
    title: "The Tea Journey — Agronomy & Processing",
    tag: "🌱 From Soil to Cup",
    desc: "Step-by-step visual exploration of Upper Assam tea cultivation: nursery propagation, fine two-leaves-and-a-bud plucking, withering lofts, orthodox rolling, and CTC fermentation."
  },
  "auctions": {
    title: "Commercial Auctions & GTAC Realization",
    tag: "⚖️ Price Discovery Engine",
    desc: "Real-time trading analytics, price spreads between Orthodox and CTC grades, and multi-year auction volume trends at the Guwahati Tea Auction Centre (GTAC)."
  },
  "exports": {
    title: "Global Tea Exports & Trade Geography",
    tag: "🌐 International Shipments",
    desc: "Destination country breakdown, port throughput (Kolkata, Haldia, JNPT), and FOB export realizations across major global buyers including Iraq, UAE, Russia, and Germany."
  },
  "domestic": {
    title: "Interstate Trade & Seasonal Harvest Rhythm",
    tag: "🚚 Pan-India Distribution",
    desc: "Interstate tea dispatches across top consuming states (Maharashtra, UP, Gujarat), seasonal 4-flush volume distribution, and bought-leaf factory pricing."
  },
  "records": {
    title: "Historical Production Time-Series Registry",
    tag: "📋 Official Statistical Baseline",
    desc: "Multi-year production registry from 2022 to the 2026 Horizon, documenting area under cultivation, green leaf volume, made tea output, and yield per hectare."
  }
};

window.loadPageEditorData = function(pageKey) {
  var data = window.PAGE_CUSTOM_DATA[pageKey];
  if(!data) return;
  var titleInput = document.getElementById("adm_page_title");
  var tagInput = document.getElementById("adm_page_tag");
  var descInput = document.getElementById("adm_page_desc");
  if(titleInput) titleInput.value = data.title;
  if(tagInput) tagInput.value = data.tag;
  if(descInput) descInput.value = data.desc;
};

window.applyPageEditor = function() {
  var sel = document.getElementById("adm-page-select");
  var pageKey = sel ? sel.value : "pbi-dashboard";
  var title = (document.getElementById("adm_page_title").value || "").trim();
  var tag = (document.getElementById("adm_page_tag").value || "").trim();
  var desc = (document.getElementById("adm_page_desc").value || "").trim();

  if(!window.PAGE_CUSTOM_DATA[pageKey]) window.PAGE_CUSTOM_DATA[pageKey] = {};
  window.PAGE_CUSTOM_DATA[pageKey].title = title;
  window.PAGE_CUSTOM_DATA[pageKey].tag = tag;
  window.PAGE_CUSTOM_DATA[pageKey].desc = desc;

  // Apply directly to the targeted page view in the DOM
  var targetPage = document.getElementById("page-" + pageKey);
  if(targetPage) {
    var titleEl = targetPage.querySelector(".nature-banner-title");
    var tagEl = targetPage.querySelector(".nature-banner-tag");
    var descEl = targetPage.querySelector(".nature-banner-desc");
    if(titleEl && title) titleEl.textContent = title;
    if(tagEl && tag) tagEl.textContent = tag;
    if(descEl && desc) descEl.textContent = desc;
  }

  try {
    localStorage.setItem("tea_page_custom_data", JSON.stringify(window.PAGE_CUSTOM_DATA));
  } catch(e){}

  if(typeof showAdminAlert === "function") {
    showAdminAlert("✅ Successfully updated page information for " + pageKey + "!", "success");
  }
};

window.previewSelectedPage = function() {
  var sel = document.getElementById("adm-page-select");
  var pageKey = sel ? sel.value : "pbi-dashboard";
  window.navigateToPage(pageKey);
};

// Add New Heritage Estate
window.addNewHeritageEstateRecord = function() {
  var name = (document.getElementById("new_est_name").value || "").trim();
  var circle = (document.getElementById("new_est_circle").value || "Chabua").trim();
  var loc = (document.getElementById("new_est_loc").value || "").trim();
  var cap = (document.getElementById("new_est_cap").value || "~1,000,000 kg").trim();
  var area = parseFloat(document.getElementById("new_est_area").value) || 400.0;
  var yld = parseInt(document.getElementById("new_est_yield").value) || 7500;
  var owner = (document.getElementById("new_est_owner").value || "Assam Tea Enterprise").trim();
  var spec = (document.getElementById("new_est_spec").value || "Orthodox & High-Grown CTC").trim();
  var img = (document.getElementById("new_est_img").value || "estate_manohari.jpg").trim();

  if(!name || !loc) {
    alert("Please enter at least Estate Name and Location.");
    return;
  }

  var newEstate = {
    rank: TOP_10_ESTATES.length + 1,
    name: name,
    location: loc,
    characteristics: spec,
    capacity: cap,
    capacityNum: parseInt(cap.replace(/[^0-9]/g, '')) || 1000000,
    registry: "Official District Registry 2026",
    circle: circle,
    year: 1910,
    area: area,
    leaf: parseFloat((area * 0.0075).toFixed(2)),
    madeTea: parseFloat((area * 0.0075 * 0.318).toFixed(2)),
    workforce: Math.round(area * 4.8),
    yield: yld,
    owner: owner,
    specialty: spec,
    lat: 27.45 + (Math.random() - 0.5) * 0.2,
    lon: 95.05 + (Math.random() - 0.5) * 0.2,
    x: Math.round(350 + (Math.random() - 0.5) * 200),
    y: Math.round(220 + (Math.random() - 0.5) * 150),
    img: img,
    accolade: "Registered Landmark Estate in " + circle,
    caption: spec + " cultivation at " + name + " in " + circle + ".",
    desc: name + " is a landmark estate registered in the " + circle + " belt of Dibrugarh district, producing " + cap + " annually under " + owner + "."
  };

  TOP_10_ESTATES.push(newEstate);

  if(typeof renderDibrugarhMap === "function") renderDibrugarhMap();
  if(typeof renderTop10Estates === "function") renderTop10Estates();
  if(typeof renderTop10Table === "function") renderTop10Table();

  if(typeof showAdminAlert === "function") {
    showAdminAlert("🎉 Successfully added " + name + " to the Heritage Estates Registry & Map!", "success");
  }
};

// Live Custom CSS Style Injector
window.applyCustomCss = function() {
  var cssText = (document.getElementById("adm-custom-css").value || "").trim();
  var styleTag = document.getElementById("admin-live-injected-css");
  if(!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "admin-live-injected-css";
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = cssText;
  try {
    localStorage.setItem("admin_custom_css", cssText);
  } catch(e){}
  if(typeof showAdminAlert === "function") {
    showAdminAlert("🎨 Live custom CSS styles injected and applied across portal!", "success");
  }
};

window.clearCustomCss = function() {
  var styleTag = document.getElementById("admin-live-injected-css");
  if(styleTag) styleTag.textContent = "";
  var textarea = document.getElementById("adm-custom-css");
  if(textarea) textarea.value = "";
  try { localStorage.removeItem("admin_custom_css"); } catch(e){}
  if(typeof showAdminAlert === "function") {
    showAdminAlert("Cleared custom CSS stylesheet.", "info");
  }
};

// Live Custom JavaScript Runner
window.runCustomJs = function() {
  var code = (document.getElementById("adm-custom-js").value || "").trim();
  var outWrap = document.getElementById("adm-js-output-wrap");
  var outPre = document.getElementById("adm-js-output");
  var statusEl = document.getElementById("adm-js-status");
  if(!code) return;

  try {
    var fn = new Function(code);
    var result = fn();
    if(outWrap) outWrap.style.display = "block";
    if(outPre) outPre.textContent = (result !== undefined ? String(result) : "Code executed successfully with zero errors.");
    if(statusEl) {
      statusEl.textContent = "✅ Executed at " + new Date().toLocaleTimeString();
      statusEl.style.color = "#16a34a";
    }
    if(typeof showAdminAlert === "function") {
      showAdminAlert("⚡ JavaScript executed successfully live!", "success");
    }
  } catch(err) {
    if(outWrap) outWrap.style.display = "block";
    if(outPre) outPre.textContent = "Error: " + err.message + "\n" + (err.stack || "");
    if(statusEl) {
      statusEl.textContent = "❌ Runtime error";
      statusEl.style.color = "#dc2626";
    }
  }
};

// Load saved custom CSS & Page custom data on startup
(function() {
  try {
    var savedCss = localStorage.getItem("admin_custom_css");
    if(savedCss) {
      var s = document.createElement("style");
      s.id = "admin-live-injected-css";
      s.textContent = savedCss;
      document.head.appendChild(s);
      setTimeout(function(){
        var textarea = document.getElementById("adm-custom-css");
        if(textarea) textarea.value = savedCss;
      }, 500);
    }
    var savedPageData = localStorage.getItem("tea_page_custom_data");
    if(savedPageData) {
      window.PAGE_CUSTOM_DATA = Object.assign(window.PAGE_CUSTOM_DATA || {}, JSON.parse(savedPageData));
    }
  } catch(e){}
})();

