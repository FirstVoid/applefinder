// ==========================================================================
// Apple Finder Uzbekistan — Core UI & Store Aggregator Platform
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initNavScroll();
  initSearch();
  initColorDots();
  initRealTashkentMap();
  initHero3DCard();
  initScrollReveal();

  // Check if navigating to spotlight from a category subsite
  try {
    const targetSpotlight = sessionStorage.getItem("spotlight_id");
    if (targetSpotlight) {
      sessionStorage.removeItem("spotlight_id");
      setTimeout(() => {
        showProductDetails(targetSpotlight);
      }, 300);
    }
  } catch (e) {}
});

// 1. Smooth Navigation Scrolling
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function initNavScroll() {
  const navItems = document.querySelectorAll(".nav-item");
  window.addEventListener("scroll", () => {
    let current = "";
    const sections = ["hero", "categories", "compare-section", "quiz-section", "sellers-section"];
    
    sections.forEach(secId => {
      const sec = document.getElementById(secId);
      if (sec) {
        const top = sec.offsetTop - 120;
        if (window.scrollY >= top) {
          current = secId;
        }
      }
    });

    navItems.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("data-target") === current) {
        item.classList.add("active");
      }
    });
  });
}

// 2. Filter Category Pills (Visual Animation)
function setProductFilter(cat, btn) {
  document.querySelectorAll(".pill-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const cards = document.querySelectorAll(".product-item-card");
  cards.forEach(card => {
    const cardCat = card.getAttribute("data-category");
    if (cat === "all" || cardCat === cat) {
      card.style.display = "flex";
      card.style.animation = "fadeIn 0.35s ease";
    } else {
      card.style.display = "none";
    }
  });
}

function filterCategory(cat) {
  scrollToSection("categories");
  const targetPill = Array.from(document.querySelectorAll(".pill-btn")).find(p => p.textContent.trim().startsWith(cat));
  setProductFilter(cat, targetPill);
}

// 3. Search Field Live Filter
function initSearch() {
  const searchInput = document.getElementById("globalSearch");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".product-item-card");

    cards.forEach(card => {
      const name = card.querySelector(".product-item-name").textContent.toLowerCase();
      const spec = card.querySelector(".product-item-spec").textContent.toLowerCase();
      if (name.includes(query) || spec.includes(query)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });
}

// 4. Color Dots Interactions on Cards
function initColorDots() {
  document.querySelectorAll(".product-item-colors").forEach(colorsRow => {
    colorsRow.addEventListener("click", (e) => {
      if (e.target.classList.contains("color-dot")) {
        colorsRow.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active"));
        e.target.classList.add("active");
      }
    });
  });
}

// ==========================================================================
// 5. Individual Detailed Product View Modal (Every Product has its Own Details)
// ==========================================================================
let modalProductState = {
  productId: null,
  selectedColor: null,
  selectedStorage: null,
  currentPrice: 0,
  currentPriceFormatted: ""
};

function openProductDetailModal(productId) {
  const p = (typeof PRODUCTS_DATA !== "undefined") 
    ? PRODUCTS_DATA.find(item => item.id === productId) 
    : null;
  if (!p) {
    triggerToast("Product not found");
    return;
  }

  const modalBackdrop = document.getElementById("productDetailModal");
  if (!modalBackdrop) return;

  const isSubpage = window.location.pathname.includes("/pages/") || window.location.href.includes("/pages/");
  const imgPrefix = isSubpage ? "../" : "";
  const mainImgSrc = imgPrefix + p.image;
  const secondaryImgSrc = imgPrefix + "assets/images/hero.jpg";

  // Initialize state
  const defaultColor = (p.colors && p.colors.length > 0) ? p.colors[0].name : "Standard";
  const defaultStorage = (p.storage && p.storage.length > 0) ? p.storage[0] : "";
  const initialPrice = (p.pricesByStorage && defaultStorage && p.pricesByStorage[defaultStorage]) 
    ? p.pricesByStorage[defaultStorage] 
    : p.price;

  modalProductState = {
    productId: p.id,
    selectedColor: defaultColor,
    selectedStorage: defaultStorage,
    currentPrice: initialPrice,
    currentPriceFormatted: formatPriceUZS(initialPrice)
  };

  // Color options
  const colorsHTML = (p.colors || []).map((c, idx) => `
    <button class="color-chip-btn ${idx === 0 ? 'active' : ''}" onclick="selectModalColor('${p.id}', '${c.name}', this)">
      <span class="chip-circle" style="background: ${c.hex};"></span>
      <span>${c.name}</span>
    </button>
  `).join('');

  // Storage options
  let storageHTML = "";
  if (p.storage && p.storage.length > 0) {
    storageHTML = `
      <div class="option-picker-group">
        <span class="option-label">Storage Capacity: <strong id="modalStorageLabel">${defaultStorage}</strong></span>
        <div class="storage-selector-row">
          ${p.storage.map((st, idx) => {
            const stPrice = (p.pricesByStorage && p.pricesByStorage[st]) ? p.pricesByStorage[st] : p.price;
            return `
              <button class="storage-btn ${idx === 0 ? 'active' : ''}" onclick="selectModalStorage('${p.id}', '${st}', ${stPrice}, this)">
                ${st}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Verified Tashkent Sellers with live pricing offsets
  const storesList = [
    { name: "MacBro (C-1)", district: "Amir Timur, Tashkent Center", offset: 0, tag: "Apple Premium Partner", rating: "4.9 ★" },
    { name: "iSpace APR (Tashkent City)", district: "Tashkent City Mall, 1st Fl", offset: 120000, tag: "Official Flagship", rating: "4.9 ★" },
    { name: "MediaPark (Qoratosh)", district: "Qoratosh St, 11A", offset: 40000, tag: "Electronics Hypermarket", rating: "4.8 ★" },
    { name: "Malika Market (A-24)", district: "Navoi Row A, Labzak", offset: -90000, tag: "Best Cash Deal", rating: "4.7 ★" }
  ];

  const storesRowsHTML = storesList.map(st => {
    const storePrice = Math.max(1000000, initialPrice + st.offset);
    const storePriceFmt = formatPriceUZS(storePrice);
    return `
      <tr>
        <td>
          <div class="store-cell-name">
            <span class="store-avatar">🏬</span>
            <div>
              <strong>${st.name}</strong>
              <span class="badge-verified-tiny">✓ Verified Reseller · ${st.rating}</span>
              <div style="font-size:0.75rem; color:#86868b; margin-top:2px;">📍 ${st.district}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="stock-pill in-stock">● In Stock</span>
          <div style="font-size:0.75rem; color:#166534; margin-top:3px;">1 Year Warranty</div>
        </td>
        <td class="price-cell">
          <span class="modal-store-price-val" data-offset="${st.offset}">${storePriceFmt}</span>
        </td>
        <td>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn-table-reserve" onclick="addModalItemToCart('${st.name}', ${st.offset})">
              + 🛍️ Cart
            </button>
            <button class="btn-table-reserve" style="background:#0071e3;" onclick="openReservationModal('${p.name}', '${st.name}')">
              Reserve
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  modalBackdrop.innerHTML = `
    <div class="modal-dialog-detailed" onclick="event.stopPropagation()">
      <button class="modal-detailed-close" onclick="closeProductDetailModal()" title="Close details">✕</button>
      
      <div class="modal-detailed-inner">
        <!-- Breadcrumbs & Category Tag -->
        <div class="detail-breadcrumbs">
          <span>Catalog</span> &gt; <span>${p.category}</span> &gt; <strong class="active-crumb">${p.name}</strong>
          ${p.badge ? `<span style="margin-left:12px; background:#f0f4ff; color:#0071e3; font-weight:700; font-size:0.75rem; padding:3px 10px; border-radius:12px; border:1px solid #d0e2ff;">${p.badge}</span>` : ''}
        </div>

        <!-- 2-Column Product Showcase -->
        <div class="detail-grid">
          <!-- Left: Gallery -->
          <div class="detail-gallery-column">
            <div class="gallery-viewport">
              <img src="${mainImgSrc}" alt="${p.name}" class="gallery-hero-image" id="modalHeroImg">
            </div>
            <div class="gallery-thumbnails-strip">
              <div class="thumb-box active" onclick="switchModalThumb('${mainImgSrc}', this)">
                <img src="${mainImgSrc}" alt="View 1">
              </div>
              <div class="thumb-box" onclick="switchModalThumb('${secondaryImgSrc}', this)">
                <img src="${secondaryImgSrc}" alt="View 2">
              </div>
              <div class="thumb-box" onclick="switchModalThumb('${mainImgSrc}', this)">
                <img src="${mainImgSrc}" alt="View 3">
              </div>
            </div>
          </div>

          <!-- Right: Info & Selectors -->
          <div class="detail-info-column">
            <div class="detail-header-row">
              <h2 class="detail-product-title">${p.name}</h2>
              <div class="detail-rating-tag">
                <span class="stars-gold">★★★★★</span>
                <span class="rating-text">${p.rating} (${p.reviewsCount} reviews)</span>
              </div>
            </div>

            <p style="color:#6e6e73; font-size:0.95rem; line-height:1.45; margin-bottom:16px;">${p.tagline}</p>

            <!-- Price Banner -->
            <div class="detail-price-banner">
              <div class="price-from-label">Verified Starting Price in Tashkent:</div>
              <div class="price-big-number" id="modalPriceNumber">${modalProductState.currentPriceFormatted}</div>
              <div class="price-seller-note">🏬 In stock at 4 verified Tashkent stores • 1 Year Official Warranty • 100% UzIMEI</div>
            </div>

            <!-- Color Picker -->
            <div class="option-picker-group">
              <span class="option-label">Color: <strong id="modalColorLabel">${defaultColor}</strong></span>
              <div class="color-chips-row">
                ${colorsHTML}
              </div>
            </div>

            <!-- Storage Picker -->
            ${storageHTML}

            <!-- Quick Action Buttons -->
            <div class="detail-actions-row">
              <button class="btn-primary" style="flex:1.4; padding:14px 20px; font-size:0.95rem; font-weight:700;" onclick="addModalItemToCart('${p.defaultStore || 'MacBro (C-1)'}', 0)">
                <span>+ 🛍️ Add to Cart</span>
              </button>
              <button class="btn-secondary" style="flex:1; padding:14px 18px; font-size:0.95rem; font-weight:600;" onclick="openReservationModal('${p.name}', '${p.defaultStore || 'MacBro (C-1)'}')">
                <span>Hold in Store</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Specs Ribbon -->
        <div style="margin-bottom:30px;">
          <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:12px; color:#1d1d1f;">Key Hardware Specifications</h3>
          <div class="specs-ribbon-grid">
            <div class="ribbon-card">
              <span class="ribbon-icon">⚡</span>
              <strong>Processor</strong>
              <span>${p.chip}</span>
            </div>
            <div class="ribbon-card">
              <span class="ribbon-icon">🖥️</span>
              <strong>Display</strong>
              <span>${p.screen || 'Retina OLED Display'}</span>
            </div>
            <div class="ribbon-card">
              <span class="ribbon-icon">🔋</span>
              <strong>Battery Life</strong>
              <span>${p.battery || 'All-Day Battery'}</span>
            </div>
            <div class="ribbon-card">
              <span class="ribbon-icon">📸</span>
              <strong>Camera / Optics</strong>
              <span>${p.camera || 'Advanced Sensors'}</span>
            </div>
          </div>
        </div>

        <!-- Advantages, Verification & Warranty Grid -->
        <div class="detail-analysis-grid">
          <div class="analysis-box">
            <h4 class="analysis-title green">✦ Premium Advantages</h4>
            <ul class="analysis-list">
              <li>Latest Apple Silicon architecture with unmatched efficiency.</li>
              <li>Aerospace-grade materials & precision manufacturing.</li>
              <li>Deep integration with iOS / macOS Sequoia & Apple Intelligence.</li>
            </ul>
          </div>
          <div class="analysis-box">
            <h4 class="analysis-title blue">✦ 100% Authentic Verification</h4>
            <ul class="analysis-list">
              <li>Factory sealed original retail packaging with intact security pull tabs.</li>
              <li>Official registration in the Uzbekistan UzIMEI customs database.</li>
              <li>Verifiable serial number on official Apple warranty verification portal.</li>
            </ul>
          </div>
          <div class="analysis-box">
            <h4 class="analysis-title" style="color:#d97706;">✦ Apple Care & Warranty</h4>
            <ul class="analysis-list">
              <li>1 Year full hardware warranty across authorized Tashkent partner centers.</li>
              <li>Free authorized diagnostics and express repair turnaround in Tashkent.</li>
              <li>14 days exchange policy against any verified factory defects.</li>
            </ul>
          </div>
        </div>

        <!-- Verified Tashkent Stores Table -->
        <div class="detail-stores-table-wrap">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
            <h3 class="stores-table-title" style="margin-bottom:0;">Verified Stores with In-Stock Inventory (${p.name})</h3>
            <span style="font-size:0.8rem; color:#166534; font-weight:700;">● 4 Stores Available Now</span>
          </div>
          <div style="overflow-x:auto;">
            <table class="stores-table">
              <thead>
                <tr>
                  <th>Store & Location</th>
                  <th>Status & Warranty</th>
                  <th>Estimated Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="modalStoresTbody">
                ${storesRowsHTML}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `;

  modalBackdrop.classList.add("active");
  document.body.style.overflow = "hidden";
  triggerToast(`Opened details: ${p.name}`);
}

function closeProductDetailModal(e) {
  if (e && e.target && e.target.id !== "productDetailModal") return;
  const modalBackdrop = document.getElementById("productDetailModal");
  if (modalBackdrop) {
    modalBackdrop.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function selectModalColor(productId, colorName, btn) {
  modalProductState.selectedColor = colorName;
  const label = document.getElementById("modalColorLabel");
  if (label) label.textContent = colorName;
  document.querySelectorAll(".modal-dialog-detailed .color-chip-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  triggerToast(`Color: ${colorName}`);
}

function selectModalStorage(productId, storageText, priceNum, btn) {
  modalProductState.selectedStorage = storageText;
  modalProductState.currentPrice = priceNum;
  modalProductState.currentPriceFormatted = formatPriceUZS(priceNum);

  const label = document.getElementById("modalStorageLabel");
  if (label) label.textContent = storageText;

  const priceNumEl = document.getElementById("modalPriceNumber");
  if (priceNumEl) priceNumEl.textContent = modalProductState.currentPriceFormatted;

  document.querySelectorAll(".modal-dialog-detailed .storage-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  // Update store rows prices according to their offset
  document.querySelectorAll(".modal-store-price-val").forEach(cell => {
    const offset = parseInt(cell.getAttribute("data-offset") || "0", 10);
    const updatedStorePrice = Math.max(1000000, priceNum + offset);
    cell.textContent = formatPriceUZS(updatedStorePrice);
  });

  triggerToast(`Storage: ${storageText} (${modalProductState.currentPriceFormatted})`);
}

function switchModalThumb(src, thumbBox) {
  const heroImg = document.getElementById("modalHeroImg");
  if (heroImg) {
    heroImg.style.opacity = "0.4";
    heroImg.style.transform = "scale(0.96)";
    setTimeout(() => {
      heroImg.src = src;
      heroImg.style.opacity = "1";
      heroImg.style.transform = "scale(1)";
    }, 150);
  }
  document.querySelectorAll(".modal-dialog-detailed .thumb-box").forEach(t => t.classList.remove("active"));
  if (thumbBox) thumbBox.classList.add("active");
}

function addModalItemToCart(storeName, offset) {
  const p = (typeof PRODUCTS_DATA !== "undefined") ? PRODUCTS_DATA.find(item => item.id === modalProductState.productId) : null;
  if (!p) return;

  const isSubpage = window.location.pathname.includes("/pages/") || window.location.href.includes("/pages/");
  const imgPath = (isSubpage ? "../" : "") + p.image;
  const itemPrice = Math.max(1000000, modalProductState.currentPrice + (offset || 0));

  addToCart(p.id, itemPrice, imgPath, storeName || p.defaultStore, modalProductState.selectedColor, modalProductState.selectedStorage);
}

function openReservationModal(productName, storeName) {
  const resModal = document.getElementById("reservationModal");
  if (!resModal) return;

  const pNameEl = document.getElementById("modalProductName");
  if (pNameEl) pNameEl.textContent = productName;

  const storeEl = document.getElementById("modalStoreName");
  if (storeEl) storeEl.textContent = `🏬 Store: ${storeName} (In-Stock hold for 24h)`;

  resModal.classList.add("active");
}

// Backward-compatibility alias
function showProductDetails(productId) {
  openProductDetailModal(productId);
}

// 7. Interactive Quiz Stepper (Help Me Choose)
let currentQuizStep = 1;
const totalQuizSteps = 5;

const quizStepsData = [
  {
    step: 1,
    title: "1. What will you mainly use the device for?",
    subtitle: "Select your primary activity to let our algorithm recommend optimal hardware specifications.",
    options: [
      { icon: "🎓", text: "Study / Education" },
      { icon: "💼", text: "Office Work" },
      { icon: "💻", text: "Programming" },
      { icon: "🎨", text: "Design & Art" },
      { icon: "🎬", text: "Video Editing" },
      { icon: "📷", text: "Photography" },
      { icon: "📱", text: "Social Media" },
      { icon: "🎮", text: "Gaming" },
      { icon: "☕", text: "Everyday Use" }
    ]
  },
  {
    step: 2,
    title: "2. Which device form factor do you prefer?",
    subtitle: "Choose the physical form factor you feel most comfortable carrying.",
    options: [
      { icon: "📱", text: "Smartphone (iPhone)" },
      { icon: "💻", text: "Laptop (MacBook)" },
      { icon: "📋", text: "Tablet (iPad)" },
      { icon: "⌚", text: "Smartwatch (Apple Watch)" },
      { icon: "🎧", text: "Wireless Audio (AirPods)" },
      { icon: "💡", text: "Let Advisor Decide" }
    ]
  },
  {
    step: 3,
    title: "3. What is your planned budget range?",
    subtitle: "We filter verified resellers in Uzbekistan offering best value for money in UZS.",
    options: [
      { icon: "💵", text: "Under 6,000,000 UZS" },
      { icon: "💳", text: "6,000,000 – 12,000,000 UZS" },
      { icon: "💎", text: "12,000,000 – 18,000,000 UZS" },
      { icon: "👑", text: "18,000,000+ UZS (Top Flagships)" }
    ]
  },
  {
    step: 4,
    title: "4. Portability vs Maximum Screen Size?",
    subtitle: "How often will you carry the machine outside your home or office?",
    options: [
      { icon: "🪶", text: "Ultra-Light & Compact" },
      { icon: "⚖️", text: "Balanced Daily Driver" },
      { icon: "🖥️", text: "Maximum Screen & Immersion" }
    ]
  },
  {
    step: 5,
    title: "5. Recommended Perfect Match!",
    subtitle: "Based on your criteria, here is the #1 recommended Apple configuration for Uzbekistan:",
    isResult: true
  }
];

function renderQuizStep(stepNum) {
  const container = document.getElementById("quizStepContainer");
  const progressFill = document.getElementById("quizProgressFill");
  const stepText = document.getElementById("stepCounterText");
  const backBtn = document.getElementById("quizBackBtn");
  const nextBtn = document.getElementById("quizNextBtn");

  const stepData = quizStepsData[stepNum - 1];

  progressFill.style.width = `${(stepNum / totalQuizSteps) * 100}%`;
  stepText.textContent = `Step ${stepNum} of ${totalQuizSteps}`;
  backBtn.disabled = (stepNum === 1);

  if (stepData.isResult) {
    nextBtn.textContent = "Start Again ↺";
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #1d1d1f 0%, #2c2c2e 100%); color: #fff; padding: 36px; border-radius: 20px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 280px;">
          <span style="background: #34c759; color: #fff; font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">98% Match Score</span>
          <h2 style="font-size: 2.2rem; font-weight: 800; margin: 12px 0 6px;">MacBook Air 13" (M4, Midnight)</h2>
          <p style="color: #9ca3af; font-size: 0.95rem; line-height: 1.5; margin-bottom: 20px;">
            Matches your study/education profile, 18-hour battery, silent fanless body, 16GB RAM base standard, and in stock across verified Tashkent stores.
          </p>
          <div style="font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 20px;">
            14,990,000 UZS <span style="font-size: 0.85rem; color: #9ca3af; font-weight: 400;">(Official Reseller Warranty)</span>
          </div>
          <button class="btn-primary" onclick="openProductDetailModal('macbook-air-13-m4')" style="background: #0071e3;">
            View Detailed Specifications & Stores →
          </button>
        </div>
        <div style="width: 220px; display: flex; align-items: center; justify-content: center;">
          <img src="assets/images/macbook.jpg" alt="Recommended Device" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        </div>
      </div>
    `;
    return;
  }

  nextBtn.textContent = "Next Step →";
  let optionsHtml = stepData.options.map((opt, idx) => `
    <div class="quiz-card-option ${idx === 0 ? 'selected' : ''}" onclick="selectQuizOption(this)">
      <span class="quiz-card-icon">${opt.icon}</span>
      <span class="quiz-card-text">${opt.text}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <h2 class="quiz-heading">${stepData.title}</h2>
    <p class="quiz-subheading">${stepData.subtitle}</p>
    <div class="quiz-options-cards-grid">${optionsHtml}</div>
  `;
}

function selectQuizOption(card) {
  const parent = card.parentElement;
  parent.querySelectorAll(".quiz-card-option").forEach(c => c.classList.remove("selected"));
  card.classList.add("selected");
}

function nextQuizStep() {
  if (currentQuizStep >= totalQuizSteps) {
    currentQuizStep = 1;
  } else {
    currentQuizStep++;
  }
  renderQuizStep(currentQuizStep);
}

function prevQuizStep() {
  if (currentQuizStep > 1) {
    currentQuizStep--;
    renderQuizStep(currentQuizStep);
  }
}

// 8. Real Interactive Leaflet Map for Tashkent
let tashkentMap = null;
let mapMarkers = {};

function initRealTashkentMap() {
  const mapContainer = document.getElementById("tashkentRealMap");
  if (!mapContainer) return;

  if (typeof L === "undefined") {
    // Retry in 150ms in case CDN is still downloading
    setTimeout(initRealTashkentMap, 150);
    return;
  }

  // Tashkent GPS Center and bounds
  const tashkentCenter = [41.3111, 69.2797];
  const southWest = L.latLng(41.1500, 69.0800);
  const northEast = L.latLng(41.4500, 69.4500);
  const tashkentBounds = L.latLngBounds(southWest, northEast);

  if (tashkentMap) {
    try { tashkentMap.remove(); } catch(e) {}
  }

  tashkentMap = L.map("tashkentRealMap", {
    center: tashkentCenter,
    zoom: 12,
    minZoom: 11,
    maxZoom: 17,
    maxBounds: tashkentBounds,
    maxBoundsViscosity: 0.8,
    scrollWheelZoom: true
  });

  // Official OpenStreetMap tiles (100% free, zero API keys required on host)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(tashkentMap);

  // Render Store Pins
  if (typeof STORES_DATA !== "undefined" && Array.isArray(STORES_DATA)) {
    STORES_DATA.forEach(store => {
      if (store.lat && store.lng) {
        const customIcon = L.divIcon({
          className: "leaflet-apple-pin",
          html: `
            <div class="custom-map-marker" id="marker-${store.id}">
              <div class="marker-dot"></div>
              <span class="marker-title">${store.name.split(' ')[0]}</span>
            </div>
          `,
          iconSize: [80, 32],
          iconAnchor: [12, 16]
        });

        const marker = L.marker([store.lat, store.lng], { icon: customIcon }).addTo(tashkentMap);
        
        marker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 2px;">
            <strong style="font-size: 14px; color: #1d1d1f; display: block; margin-bottom: 2px;">${store.name}</strong>
            <span style="font-size: 11px; color: #64748b; display: block; margin-bottom: 6px;">📍 ${store.address}</span>
            <div style="font-size: 11px; font-weight: 700; color: #16a34a; margin-bottom: 8px;">✓ Verified Apple Inventory</div>
            <button onclick="openModal('reservationModal', '${store.name}');" style="background: #1d1d1f; color: #fff; border: none; padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; width: 100%;">Reserve Device</button>
          </div>
        `);

        marker.on("click", () => {
          highlightStoreCard(store.id);
        });

        mapMarkers[store.id] = marker;
      }
    });
  }

  // Invalidate size after layout completes and on scroll
  setTimeout(() => { if (tashkentMap) tashkentMap.invalidateSize(); }, 250);
  setTimeout(() => { if (tashkentMap) tashkentMap.invalidateSize(); }, 700);
}

function highlightStoreCard(storeId) {
  const card = document.getElementById(`card-${storeId}`);
  document.querySelectorAll(".store-item-card").forEach(c => c.classList.remove("highlighted"));
  
  if (card) {
    card.classList.add("highlighted");
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Pan map smoothly to marker if exists
  if (mapMarkers[storeId] && tashkentMap) {
    const latLng = mapMarkers[storeId].getLatLng();
    tashkentMap.flyTo(latLng, 14, { duration: 0.8 });
    mapMarkers[storeId].openPopup();
  }

  triggerToast(`Selected: ${storeId.toUpperCase()}`);
}

function filterDistrict(district, btn) {
  document.querySelectorAll(".city-tab-chip").forEach(c => c.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const cards = document.querySelectorAll(".store-item-card");
  let visibleCount = 0;

  cards.forEach(card => {
    const cardDistrict = card.getAttribute("data-district");
    if (district === "all" || cardDistrict === district) {
      card.style.display = "flex";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  const legend = document.getElementById("mapStoreCountLegend");
  if (legend) legend.textContent = `${visibleCount} Verified Stores Active`;

  const mapIndicator = document.getElementById("mapCityIndicator");
  if (mapIndicator) {
    const label = btn ? btn.textContent : "Tashkent";
    mapIndicator.textContent = `📍 ${label} (Tashkent)`;
  }

  // Adjust map view depending on district
  if (tashkentMap) {
    if (district === "mirabad") {
      tashkentMap.flyTo([41.305, 69.260], 13.5, { duration: 0.7 });
    } else if (district === "malika") {
      tashkentMap.flyTo([41.336, 69.268], 14, { duration: 0.7 });
    } else if (district === "yunusabad") {
      tashkentMap.flyTo([41.316, 69.275], 13.5, { duration: 0.7 });
    } else if (district === "chilanzar") {
      tashkentMap.flyTo([41.316, 69.231], 13.5, { duration: 0.7 });
    } else {
      tashkentMap.flyTo([41.3111, 69.2797], 12, { duration: 0.7 });
    }
  }

  triggerToast(`Filtered: ${btn ? btn.textContent : district}`);
}

// 9. Modals (Reservation & Parent Shortlist)
function openModal(modalId, storeName, price) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
  }
  if (storeName && document.getElementById("modalStoreName")) {
    document.getElementById("modalStoreName").textContent = `🏬 Store: ${storeName} (${price || 'Best Price'})`;
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
  }
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("active"));
  }
});

function copyShortlistLink() {
  navigator.clipboard?.writeText(window.location.href);
  triggerToast("📋 Parent shortlist link copied to clipboard!");
  setTimeout(() => {
    closeModal("shortlistModal");
  }, 1000);
}

// 10. Toast Notification
function triggerToast(msg) {
  const toast = document.getElementById("appToast");
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add("show");

  clearTimeout(window._appToastTimeout);
  window._appToastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// Note: Cart system is centralized and powered by js/cart.js

// ==========================================================================
// 11. Apple Interactive 3D Card Engine (Hero Centerpiece)
// ==========================================================================
function initHero3DCard() {
  const heroCard = document.getElementById("mainHeroCard");
  const heroGlare = document.getElementById("heroGlare");
  const heroDeviceImg = document.getElementById("heroDeviceImg");
  const heroContent = heroCard ? heroCard.querySelector(".hero-content") : null;
  const floatingTags = heroCard ? heroCard.querySelectorAll(".floating-tag") : [];

  if (!heroCard) return;

  let isHovered = false;
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;
  let rafId = null;
  let bounds = null;

  function updateBounds() {
    bounds = heroCard.getBoundingClientRect();
  }

  window.addEventListener("resize", updateBounds, { passive: true });
  window.addEventListener("scroll", updateBounds, { passive: true });

  heroCard.addEventListener("mouseenter", () => {
    isHovered = true;
    updateBounds();
    if (heroGlare) heroGlare.style.opacity = "1";
    if (!rafId) {
      rafId = requestAnimationFrame(updateHeroPhysics);
    }
  });

  heroCard.addEventListener("mousemove", (e) => {
    if (!bounds) updateBounds();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    // Normalized from -1 to 1
    const normX = (x / bounds.width) * 2 - 1;
    const normY = (y / bounds.height) * 2 - 1;

    // Apple subtle luxury tilt: max ~9.5 degrees
    targetRotY = normX * 9.5;
    targetRotX = -normY * 9.5;

    // Dynamic specular glare spotlight following cursor
    if (heroGlare) {
      const glareX = (x / bounds.width) * 100;
      const glareY = (y / bounds.height) * 100;
      heroGlare.style.background = `radial-gradient(circle 460px at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255, 255, 255, 0.46) 0%, rgba(255, 255, 255, 0.12) 42%, transparent 75%)`;
    }

    if (!rafId) {
      rafId = requestAnimationFrame(updateHeroPhysics);
    }
  });

  heroCard.addEventListener("mouseleave", () => {
    isHovered = false;
    targetRotX = 0;
    targetRotY = 0;
    if (heroGlare) heroGlare.style.opacity = "0";
    if (!rafId) {
      rafId = requestAnimationFrame(updateHeroPhysics);
    }
  });

  function updateHeroPhysics() {
    // Smooth lerp (linear interpolation) for Apple buttery motion
    const ease = 0.12;
    currentRotX += (targetRotX - currentRotX) * ease;
    currentRotY += (targetRotY - currentRotY) * ease;

    const scale = isHovered ? 1.015 : 1.0;
    heroCard.style.transform = `perspective(1400px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;

    if (heroDeviceImg) {
      const imgShiftX = currentRotY * 1.5;
      const imgShiftY = -currentRotX * 1.5;
      heroDeviceImg.style.transform = isHovered 
        ? `scale(1.05) translateZ(45px) translate3d(${imgShiftX.toFixed(1)}px, ${imgShiftY.toFixed(1)}px, 0)`
        : "";
    }

    if (floatingTags && floatingTags.length > 0) {
      floatingTags.forEach((tag, idx) => {
        const factor = idx === 0 ? 2.0 : 1.6;
        tag.style.transform = isHovered
          ? `translateZ(65px) translate3d(${(currentRotY * factor).toFixed(1)}px, ${(-currentRotX * factor).toFixed(1)}px, 0)`
          : "";
      });
    }

    if (heroContent) {
      heroContent.style.transform = isHovered
        ? `translateZ(30px) translate3d(${(currentRotY * 0.7).toFixed(1)}px, ${(-currentRotX * 0.7).toFixed(1)}px, 0)`
        : "";
    }

    if (isHovered || Math.abs(targetRotX - currentRotX) > 0.04 || Math.abs(targetRotY - currentRotY) > 0.04) {
      rafId = requestAnimationFrame(updateHeroPhysics);
    } else {
      heroCard.style.transform = "";
      if (heroDeviceImg) heroDeviceImg.style.transform = "";
      if (heroContent) heroContent.style.transform = "";
      if (floatingTags) floatingTags.forEach(t => t.style.transform = "");
      rafId = null;
    }
  }

  // Device orientation (gyroscope) tilt for mobile devices
  if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission !== "function") {
    window.addEventListener("deviceorientation", (e) => {
      if (window.innerWidth > 992) return;
      if (e.gamma !== null && e.beta !== null) {
        const clampY = Math.max(-14, Math.min(14, e.gamma / 2.2));
        const clampX = Math.max(-14, Math.min(14, (e.beta - 45) / 3));
        heroCard.style.transform = `perspective(1000px) rotateX(${-clampX.toFixed(1)}deg) rotateY(${clampY.toFixed(1)}deg)`;
      }
    }, { passive: true });
  }
}

// ==========================================================================
// 12. Apple-Grade Scroll Reveal & Fluid Cascade Engine
// ==========================================================================
function initScrollReveal() {
  const selector = [
    ".section-title-wrap",
    ".categories-grid",
    ".category-card",
    ".quiz-box",
    ".city-chips-bar",
    ".sellers-split-container",
    ".map-interactive-box",
    ".store-item-card",
    ".hub-hero-card",
    ".hub-section-header",
    ".hub-features-grid",
    ".hub-feature-box",
    ".hub-cards-grid",
    ".hub-product-card",
    ".compare-card",
    ".spec-table-wrap",
    ".cart-item-card",
    ".cart-summary-card",
    ".cart-trust-badges",
    ".scroll-reveal"
  ].join(", ");

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: "0px 0px -90px 0px", // Waits until element is 90px inside viewport
    threshold: 0.12
  });

  elements.forEach(el => {
    if (!el.classList.contains("scroll-reveal")) {
      el.classList.add("scroll-reveal");
    }

    // Deliberate, relaxed cascade delay inside grids (0.14s step)
    const parentGrid = el.closest(".categories-grid, .hub-cards-grid, .hub-features-grid, .store-cards-stack");
    if (parentGrid) {
      const siblings = Array.from(parentGrid.children);
      const childIndex = siblings.indexOf(el);
      if (childIndex >= 0) {
        el.style.transitionDelay = `${(childIndex % 6) * 0.14}s`;
      }
    }

    observer.observe(el);
  });

  // On page entry/refresh, only reveal elements inside the top Hero area
  // All other sections below wait until the user actively scrolls down to them!
  requestAnimationFrame(() => {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight * 0.8 && el.closest("#hero")) {
        setTimeout(() => {
          el.classList.add("revealed");
          observer.unobserve(el);
        }, 120);
      }
    });
  });
}
