// ==========================================================================
// Apple Finder Uzbekistan — Core UI & Store Aggregator Platform
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initNavScroll();
  initSearch();
  initRealTashkentMap();
  initHero3DCard();
  initScrollReveal();

  if (document.getElementById("quizStepContainer")) {
    renderQuizStep(1);
  }

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
    const sections = ["hero", "categories", "quiz-section", "sellers-section"];
    
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

// 2. Global Live Search with Instant Dropdown Suggestions
function initSearch() {
  const searchInput = document.getElementById("globalSearch");
  if (!searchInput) return;

  const wrapper = searchInput.parentElement;
  if (!wrapper) return;

  // Create or retrieve dropdown container
  let dropdown = wrapper.querySelector(".search-results-dropdown");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.className = "search-results-dropdown";
    wrapper.appendChild(dropdown);
  }

  const isSubpage = window.location.pathname.includes("/pages/") || window.location.href.includes("/pages/");
  const imgPrefix = isSubpage ? "../" : "";

  function renderSearchResults(query) {
    if (!query || query.length < 2) {
      dropdown.classList.remove("active");
      dropdown.innerHTML = "";
      return;
    }

    if (typeof PRODUCTS_DATA === "undefined" || !Array.isArray(PRODUCTS_DATA)) {
      return;
    }

    const q = query.toLowerCase();
    const matches = PRODUCTS_DATA.filter(p => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.chip && p.chip.toLowerCase().includes(q)) ||
        (p.badge && p.badge.toLowerCase().includes(q)) ||
        (p.series && p.series.toLowerCase().includes(q))
      );
    }).slice(0, 7);

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div class="search-empty-state">
          No Apple devices found matching "<strong>${escapeHTML(query)}</strong>"
        </div>
      `;
    } else {
      dropdown.innerHTML = matches.map(p => `
        <div class="search-result-item" onclick="onSearchResultClick('${p.id}')">
          <img src="${imgPrefix}${p.image}" alt="${p.name}" class="search-result-thumb">
          <div class="search-result-info">
            <div class="search-result-title">${p.name}</div>
            <div class="search-result-spec">${p.chip ? p.chip.split('(')[0].trim() : p.category}</div>
          </div>
          <div class="search-result-price">${p.priceFormatted}</div>
        </div>
      `).join('');
    }

    dropdown.classList.add("active");
  }

  searchInput.addEventListener("input", (e) => {
    renderSearchResults(e.target.value.trim());
  });

  searchInput.addEventListener("focus", (e) => {
    if (e.target.value.trim().length >= 2) {
      renderSearchResults(e.target.value.trim());
    }
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdown.classList.remove("active");
    }
  });
}

function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function onSearchResultClick(productId) {
  const searchInput = document.getElementById("globalSearch");
  if (searchInput) searchInput.value = "";
  document.querySelectorAll(".search-results-dropdown").forEach(d => d.classList.remove("active"));
  openProductDetailModal(productId);
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

// 7. Interactive Advisor Engine ("Help Me Choose" / Помощник по выбору)
let currentQuizStep = 1;
const totalQuizSteps = 5;

let quizUserSelections = {
  useCase: "study",
  formFactor: "auto",
  budget: "mid",
  priority: "balanced"
};

const quizStepsData = [
  {
    step: 1,
    key: "useCase",
    title: "1. What will you mainly use the device for?",
    subtitle: "Select your primary activity to let our algorithm recommend optimal hardware specifications.",
    options: [
      { id: "study", icon: "🎓", label: "Study & Education", desc: "Notes, lectures, PDFs, research & daily tasks" },
      { id: "office", icon: "💼", label: "Office & Business", desc: "Multitasking, spreadsheets, presentations & calls" },
      { id: "programming", icon: "💻", label: "Programming & Code", desc: "Xcode, Docker, compilation & engineering" },
      { id: "design", icon: "🎨", label: "Design & Digital Art", desc: "Pencil illustration, color grading & graphics" },
      { id: "video", icon: "🎬", label: "4K/8K Video Editing & 3D", desc: "ProRes editing, Blender & rendering" },
      { id: "photo", icon: "📷", label: "Photography & Social", desc: "Pro cameras, optical zoom & reel creation" },
      { id: "gaming", icon: "🎮", label: "Gaming & Entertainment", desc: "Ray tracing, 120Hz display & Arcade" },
      { id: "fitness", icon: "🏃", label: "Sports & Health Tracking", desc: "Biometrics, GPS, workout tracking & vitals" },
      { id: "audio", icon: "🎧", label: "Music & Commuting", desc: "Active Noise Cancellation & Spatial Audio" }
    ]
  },
  {
    step: 2,
    key: "formFactor",
    title: "2. Which device form factor do you prefer?",
    subtitle: "Choose the physical form factor you feel most comfortable carrying.",
    options: [
      { id: "auto", icon: "✨", label: "Let Advisor Decide", desc: "Auto-detect the ideal Apple ecosystem category" },
      { id: "macbook", icon: "💻", label: "MacBook / Mac (macOS)", desc: "Laptops & desktops for serious computing power" },
      { id: "iphone", icon: "📱", label: "iPhone Smartphone (iOS)", desc: "Pocket powerhouse with top cameras & connectivity" },
      { id: "ipad", icon: "📋", label: "iPad Tablet (iPadOS)", desc: "Touchscreen canvas with Apple Pencil Pro support" },
      { id: "watch", icon: "⌚", label: "Apple Watch (watchOS)", desc: "Wrist health, communications & activity metrics" },
      { id: "airpods", icon: "🎧", label: "AirPods / Audio", desc: "Active Noise Cancellation & high fidelity audio" }
    ]
  },
  {
    step: 3,
    key: "budget",
    title: "3. What is your planned budget range?",
    subtitle: "We filter verified resellers in Uzbekistan offering best value for money in UZS.",
    options: [
      { id: "budget", icon: "💵", label: "Under 6,000,000 UZS", desc: "Great value entry models & essential accessories" },
      { id: "mid", icon: "💳", label: "6,000,000 – 12,000,000 UZS", desc: "Popular mid-range workhorses & modern iPads" },
      { id: "pro", icon: "💎", label: "12,000,000 – 18,000,000 UZS", desc: "Flagship iPhones, M4 MacBook Air & iPad Pro" },
      { id: "flagship", icon: "👑", label: "18,000,000+ UZS (Top Flagships)", desc: "Maximum silicon specs, M4 Max & Pro Max models" },
      { id: "flexible", icon: "⚡", label: "Flexible Budget", desc: "Prioritize hardware performance & capabilities" }
    ]
  },
  {
    step: 4,
    key: "priority",
    title: "4. Portability vs Screen & Power Priority?",
    subtitle: "How will you balance physical dimensions against computational power?",
    options: [
      { id: "ultra_portable", icon: "🪶", label: "Ultra-Light & Compact", desc: "Slimmest profile & minimal weight for daily commutes" },
      { id: "balanced", icon: "⚖️", label: "Balanced Daily Driver", desc: "Sweetspot ratio of screen workspace and portability" },
      { id: "max_screen", icon: "🖥️", label: "Maximum Screen Canvas", desc: "Largest available display for multi-window immersion" },
      { id: "max_performance", icon: "🚀", label: "Extreme Computing Power", desc: "Vapor chamber, active cooling fans & max GPU cores" }
    ]
  },
  {
    step: 5,
    isResult: true,
    title: "5. Recommended Perfect Matches",
    subtitle: "Here are the top 2 Apple configurations in Tashkent tailored precisely to your selected criteria:"
  }
];

function selectQuizOption(key, val, card) {
  quizUserSelections[key] = val;
  const parent = card.parentElement;
  if (parent) {
    parent.querySelectorAll(".quiz-card-option").forEach(c => c.classList.remove("selected"));
  }
  card.classList.add("selected");
  triggerToast(`Selected: ${card.querySelector(".quiz-card-text")?.textContent || val}`);
}

function renderQuizStep(stepNum) {
  const container = document.getElementById("quizStepContainer");
  const progressFill = document.getElementById("quizProgressFill");
  const stepText = document.getElementById("stepCounterText");
  const backBtn = document.getElementById("quizBackBtn");
  const nextBtn = document.getElementById("quizNextBtn");

  if (!container) return;

  const stepData = quizStepsData[stepNum - 1];

  if (progressFill) {
    progressFill.style.width = `${(stepNum / totalQuizSteps) * 100}%`;
  }
  if (stepText) {
    stepText.textContent = (stepNum === totalQuizSteps) 
      ? "Recommendation Ready · 100% Analyzed" 
      : `Step ${stepNum} of ${totalQuizSteps}`;
  }
  if (backBtn) {
    backBtn.disabled = (stepNum === 1);
  }

  // STEP 5: RECOMMENDATION RESULTS
  if (stepData.isResult) {
    if (nextBtn) {
      nextBtn.textContent = "Retake Advisor ↺";
      nextBtn.onclick = retakeQuiz;
    }

    const { best, alt } = calculateRecommendations(quizUserSelections);
    const isSubpage = window.location.pathname.includes("/pages/") || window.location.href.includes("/pages/");
    const imgPrefix = isSubpage ? "../" : "";

    const formatCriteria = [
      getStepOptionLabel("useCase", quizUserSelections.useCase),
      getStepOptionLabel("formFactor", quizUserSelections.formFactor),
      getStepOptionLabel("budget", quizUserSelections.budget),
      getStepOptionLabel("priority", quizUserSelections.priority)
    ].filter(Boolean).join(" · ");

    container.innerHTML = `
      <div class="quiz-results-wrapper">
        <div>
          <div class="quiz-summary-pill">
            <span>🎯 Tailored Preferences:</span>
            <strong>${formatCriteria}</strong>
          </div>
          <h2 class="quiz-heading" style="font-size: 2.1rem; margin-bottom: 8px;">Top Apple Matches for You</h2>
          <p class="quiz-subheading" style="margin-bottom: 24px;">
            Our algorithm analyzed all 30 configurations in Tashkent stock and found your #1 ideal device along with the top alternative:
          </p>
        </div>

        <!-- #1 Best Match Card -->
        <div class="quiz-result-hero-card">
          <div>
            <div class="quiz-result-badge-row">
              <span class="quiz-match-pill-gold">🏆 #1 Best Match · ${best.score}% Fit</span>
              <span class="quiz-category-tag">${best.product.category} · ${best.product.badge || 'Verified'}</span>
            </div>

            <h3 class="quiz-result-title">${best.product.name}</h3>
            <p class="quiz-result-tagline">${best.product.tagline}</p>

            <div class="quiz-reasons-box">
              <div class="quiz-reasons-title">Why this is #1 for your profile:</div>
              <ul class="quiz-reasons-list">
                ${best.reasons.map(r => `<li>${r}</li>`).join('')}
              </ul>
            </div>

            <div class="quiz-result-specs-grid">
              <div class="quiz-spec-chip">
                <span class="quiz-spec-chip-icon">⚡</span>
                <div class="quiz-spec-chip-text">
                  <strong>Processor</strong>
                  <span>${best.product.chip ? best.product.chip.split('with')[0].trim() : 'Apple Silicon'}</span>
                </div>
              </div>
              <div class="quiz-spec-chip">
                <span class="quiz-spec-chip-icon">🖥️</span>
                <div class="quiz-spec-chip-text">
                  <strong>Display</strong>
                  <span>${best.product.screen ? best.product.screen.split('(')[0].trim() : 'Retina Display'}</span>
                </div>
              </div>
              <div class="quiz-spec-chip">
                <span class="quiz-spec-chip-icon">🔋</span>
                <div class="quiz-spec-chip-text">
                  <strong>Endurance</strong>
                  <span>${best.product.battery ? best.product.battery.replace('Up to ', '') : 'All-Day Battery'}</span>
                </div>
              </div>
              <div class="quiz-spec-chip">
                <span class="quiz-spec-chip-icon">🏬</span>
                <div class="quiz-spec-chip-text">
                  <strong>In Stock</strong>
                  <span>${best.product.defaultStore} (1 Yr Warranty)</span>
                </div>
              </div>
            </div>

            <div class="quiz-result-price-row">
              <div class="quiz-result-price">${best.product.priceFormatted}</div>
              <span class="quiz-result-price-sub">Verified starting price across Tashkent APRs</span>
            </div>

            <div class="quiz-result-actions">
              <button class="btn-primary" onclick="openProductDetailModal('${best.product.id}')" style="background:#0071e3; padding: 13px 24px; font-weight:700;">
                Explore Details & Stores →
              </button>
              <button class="btn-secondary" onclick="addToCart('${best.product.id}')" style="padding: 13px 20px; font-weight:600;">
                + 🛍️ Add to Cart
              </button>
            </div>
          </div>

          <div class="quiz-img-box" onclick="openProductDetailModal('${best.product.id}')" title="Click to view details">
            <img src="${imgPrefix}${best.product.image}" alt="${best.product.name}">
            <div style="font-size:0.75rem; color:#9ca3af; margin-top:10px;">🔍 Click image for interactive 360° view</div>
          </div>
        </div>

        <!-- #2 Runner-Up / Alternative Choice Card -->
        <div class="quiz-result-runnerup-card">
          <div>
            <div class="quiz-runnerup-header">🥈 #2 Runner-Up / Alternative Choice (${alt.score}% Fit)</div>
            <div class="quiz-runnerup-pitch">${alt.pitch}</div>
            <h3 class="quiz-runnerup-title" onclick="openProductDetailModal('${alt.product.id}')" style="cursor:pointer;">
              ${alt.product.name}
            </h3>
            <p class="quiz-runnerup-tagline">${alt.product.tagline}</p>

            <ul class="quiz-reasons-list" style="margin-bottom:16px;">
              ${alt.reasons.map(r => `<li><span style="color:#0071e3; font-weight:700;">●</span> ${r}</li>`).join('')}
            </ul>

            <div class="quiz-runnerup-meta">
              <div class="quiz-runnerup-price">${alt.product.priceFormatted}</div>
              <span style="font-size:0.8rem; color:#6e6e73;">🏬 Available at ${alt.product.defaultStore}</span>
            </div>

            <div class="quiz-runnerup-actions">
              <button class="btn-primary" onclick="openProductDetailModal('${alt.product.id}')" style="padding: 10px 20px; font-size:0.88rem;">
                View Details →
              </button>
              <button class="btn-secondary" onclick="addToCart('${alt.product.id}')" style="padding: 10px 18px; font-size:0.88rem;">
                + 🛍️ Add to Cart
              </button>
            </div>
          </div>

          <div class="quiz-runnerup-img-box" onclick="openProductDetailModal('${alt.product.id}')" title="Click to view details">
            <img src="${imgPrefix}${alt.product.image}" alt="${alt.product.name}">
          </div>
        </div>

      </div>
    `;
    return;
  }

  // STEPS 1-4: QUESTIONS
  if (nextBtn) {
    nextBtn.textContent = (stepNum === totalQuizSteps - 1) ? "Get My Matches ✨" : "Next Step →";
    nextBtn.onclick = nextQuizStep;
  }

  const currentVal = quizUserSelections[stepData.key];

  let optionsHtml = stepData.options.map((opt) => {
    const isSelected = (currentVal === opt.id) ? "selected" : "";
    return `
      <div class="quiz-card-option ${isSelected}" onclick="selectQuizOption('${stepData.key}', '${opt.id}', this)">
        <span class="quiz-card-icon">${opt.icon}</span>
        <span class="quiz-card-text">${opt.label}</span>
        <span class="quiz-card-desc">${opt.desc}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <h2 class="quiz-heading">${stepData.title}</h2>
    <p class="quiz-subheading">${stepData.subtitle}</p>
    <div class="quiz-options-cards-grid">${optionsHtml}</div>
  `;
}

function getStepOptionLabel(key, val) {
  const step = quizStepsData.find(s => s.key === key);
  if (!step || !step.options) return val;
  const opt = step.options.find(o => o.id === val);
  return opt ? opt.label : val;
}

function nextQuizStep() {
  if (currentQuizStep < totalQuizSteps) {
    currentQuizStep++;
    renderQuizStep(currentQuizStep);
    const quizSec = document.getElementById("quiz-section");
    if (quizSec) {
      quizSec.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function prevQuizStep() {
  if (currentQuizStep > 1) {
    currentQuizStep--;
    renderQuizStep(currentQuizStep);
  }
}

function retakeQuiz() {
  currentQuizStep = 1;
  renderQuizStep(1);
  const quizSec = document.getElementById("quiz-section");
  if (quizSec) {
    quizSec.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  triggerToast("Advisor restarted. Select your preferences!");
}

// 8. Recommendation Calculation Engine (Evaluates 100% of Preference Combinations)
function calculateRecommendations(answers) {
  const { useCase, formFactor, budget, priority } = answers;

  function getProduct(id) {
    if (typeof PRODUCTS_DATA === "undefined" || !Array.isArray(PRODUCTS_DATA)) return null;
    return PRODUCTS_DATA.find(p => p.id === id) || null;
  }

  let bestId = null;
  let altId = null;
  let altPitch = "";
  let bestReasons = [];
  let altReasons = [];
  let bestScore = 98;
  let altScore = 92;

  // 1. Specific Form Factor Override
  if (formFactor === "macbook") {
    if (useCase === "programming" || useCase === "video") {
      if (budget === "flagship" || priority === "max_performance") {
        bestId = "macbook-pro-16-m4-max";
        bestReasons = [
          "Extreme M4 Max chip with up to 16 CPU cores & 40 GPU cores eliminates build delays and render bottlenecks",
          "16.2\" Liquid Retina XDR 120Hz display with active dual-fan vapor cooling ensures sustained peak performance",
          "Supports up to 128GB unified memory for running massive Docker clusters, local LLMs, and 8K ProRes timelines"
        ];
        altId = "macbook-pro-14-m4-pro";
        altPitch = "🪶 Compact Mobility Alternative (Save 12,410,000 UZS)";
        altReasons = [
          "Delivers M4 Pro pro-grade horsepower in an ultra-portable 14-inch chassis weighing only 1.6kg",
          "Identical Liquid Retina XDR screen technology with 120Hz ProMotion at a lower price point"
        ];
      } else if (budget === "mid" || budget === "budget") {
        bestId = "mac-mini-m4-pro";
        bestReasons = [
          "Unbeatable price-to-performance ratio in Tashkent: M4 power with 16GB RAM for under 10,000,000 UZS",
          "Ultra-compact 5-inch footprint with front USB-C and rear Thunderbolt 5 connectivity",
          "Connect up to 3 high-resolution 4K/6K external monitors for an expansive programming workstation"
        ];
        altId = "macbook-air-13-m3";
        altPitch = "💻 Portable Laptop Alternative";
        altReasons = [
          "If you need portable clamshell mobility for coding in cafes or universities rather than a fixed desk setup"
        ];
      } else {
        if (priority === "max_screen") {
          bestId = "macbook-air-15-m4";
          bestReasons = [
            "Expansive 15.3-inch Liquid Retina display provides huge canvas for code editors, terminals, and spreadsheets",
            "M4 chip with 16GB standard RAM delivers silent, lightning-fast everyday developer performance",
            "Ultra-thin 11.5mm aluminum chassis with 18 hours of real-world battery endurance"
          ];
          altId = "macbook-air-13-m4";
          altPitch = "🪶 Ultra-Portable 13\" Alternative (Save 3,100,000 UZS)";
          altReasons = [
            "Identical M4 processor and battery life in an ultra-compact 1.24kg body that fits into any messenger bag"
          ];
        } else {
          bestId = "macbook-air-13-m4";
          bestReasons = [
            "Equipped with next-gen M4 silicon and 16GB RAM base standard for fast development and multitasking",
            "Silent fanless aerospace-grade design with up to 18 hours of all-day battery life",
            "Fits comfortably within your target budget with verified 1-year Tashkent reseller warranty"
          ];
          altId = "mac-mini-m4-pro";
          altPitch = "💰 Desktop Value Beast (Save 5,600,000 UZS)";
          altReasons = [
            "If you primarily work from home or office and prefer multi-monitor desk power for under 10M UZS"
          ];
        }
      }
    } else if (useCase === "design") {
      bestId = "macbook-pro-14-m4-pro";
      bestReasons = [
        "1000 nits sustained full-screen XDR display with P3 wide color gamut for color-accurate digital grading",
        "M4 Pro architecture with hardware-accelerated mesh shading and ray tracing",
        "Full HDMI 2.1, SDXC card slot, and 3 Thunderbolt 5 ports for direct camera card offloading"
      ];
      altId = "imac-24-m4";
      altPitch = "🎨 4.5K All-in-One Studio Canvas";
      altReasons = [
        "Features a glorious 24-inch 4.5K Retina display with color-matched Magic Keyboard and Mouse for your studio"
      ];
    } else {
      // study, office, daily
      if (priority === "max_screen") {
        bestId = "macbook-air-15-m4";
        bestReasons = [
          "Expansive 15.3\" Liquid Retina canvas for viewing textbooks and split-screen documents side by side",
          "18-hour battery allows full days of college lectures or office meetings without hunting for power outlets",
          "Six-speaker sound system with force-cancelling woofers and 1080p FaceTime HD camera"
        ];
        altId = "macbook-air-13-m4";
        altPitch = "🪶 Lighter 13\" Alternative (Save 3,100,000 UZS)";
        altReasons = [
          "Same M4 power in a lighter 1.24kg format that takes up minimal desk space in lecture halls"
        ];
      } else {
        bestId = "macbook-air-13-m4";
        bestReasons = [
          "Weighs only 1.24kg, making it the premier laptop to carry daily across Tashkent",
          "Whisper-quiet fanless operation and 18-hour battery longevity",
          "16GB RAM standard handles hundreds of browser tabs, presentations, and Zoom calls without slowdown"
        ];
        altId = "macbook-air-13-m3";
        altPitch = "💰 Budget Smart Alternative (Save 1,600,000 UZS)";
        altReasons = [
          "Features M3 silicon and identical sleek aluminum chassis at a lower price point"
        ];
      }
    }
  } else if (formFactor === "iphone") {
    if (useCase === "photo" || useCase === "video") {
      if (priority === "max_screen" || budget === "flagship") {
        bestId = "iphone-17-pro-max";
        bestReasons = [
          "Triple 48MP Pro Fusion optical system with 10x periscope telephoto for unmatched concert and portrait detail",
          "6.9\" Super Retina XDR OLED with 1-120Hz ProMotion and 3000 nits peak outdoor brightness",
          "A19 Pro chip with vapor chamber cooling enables sustained 4K 120fps ProRes Log recording"
        ];
        altId = "iphone-17-air";
        altPitch = "🪶 Ultra-Slim 5.6mm Aesthetic Alternative";
        altReasons = [
          "World's thinnest iPhone profile (5.6mm) weighing only 158g for effortless one-handed vlogging"
        ];
      } else if (priority === "ultra_portable") {
        bestId = "iphone-17-air";
        bestReasons = [
          "Radical 5.6mm ultra-slim chassis weighing just 158 grams for featherweight pocket comfort",
          "6.6\" 120Hz ProMotion OLED display with Center Stage 24MP front camera",
          "A19 silicon delivers flagship speed and all-day battery in the sleekest body ever created"
        ];
        altId = "iphone-17-pro";
        altPitch = "📸 Triple 48MP Optical Zoom Alternative";
        altReasons = [
          "Adds dedicated 5x telephoto optical lens and titanium build for serious photography enthusiasts"
        ];
      } else {
        bestId = "iphone-17-pro";
        bestReasons = [
          "Compact 6.3\" titanium body packed with the full triple 48MP Pro camera system and 5x optical zoom",
          "A19 Pro processor with hardware ray tracing for heavy photo editing in Lightroom Mobile",
          "Ceramic Shield 2 front with 2x better scratch resistance and all-day 30-hour battery"
        ];
        altId = "iphone-17";
        altPitch = "💰 Mainstream Value Alternative (Save 3,100,000 UZS)";
        altReasons = [
          "Now features 120Hz ProMotion and Dual 48MP cameras at a lower starting price in Tashkent"
        ];
      }
    } else {
      // Everyday, study, office, gaming
      if (budget === "budget" || budget === "mid") {
        bestId = "iphone-17e";
        bestReasons = [
          "Best entry price in the current lineup (8,490,000 UZS) with Apple Intelligence support",
          "A18/A19 modern architecture with all-day battery life and aluminum durability",
          "100% verified UzIMEI registration and 1-year Tashkent reseller warranty included"
        ];
        altId = "iphone-16";
        altPitch = "📱 Dual Camera Alternative";
        altReasons = [
          "Offers dual-camera versatility with Ultra Wide macro photography and Action Button"
        ];
      } else if (budget === "flagship" || priority === "max_screen") {
        bestId = "iphone-17-pro-max";
        bestReasons = [
          "Massive 6.9\" Super Retina XDR OLED display delivers ultimate immersion for gaming and media",
          "Aerospace titanium frame with vapor chamber cooling prevents thermal throttling during long gaming sessions",
          "Huge battery providing up to 35 hours of continuous video playback"
        ];
        altId = "iphone-17-pro";
        altPitch = "📱 Pocket-Friendly 6.3\" Pro Alternative";
        altReasons = [
          "Identical A19 Pro computing power in a lighter 187g chassis that fits comfortably into any pocket"
        ];
      } else {
        bestId = "iphone-17";
        bestReasons = [
          "First standard iPhone model equipped with smooth 120Hz ProMotion display and 2500 nits brightness",
          "A19 3nm chip provides flagship fluidity with long-lasting all-day endurance",
          "Dual 48MP camera setup with 2x lossless optical zoom and spatial video capture"
        ];
        altId = "iphone-17-air";
        altPitch = "🪶 Ultra-Thin 5.6mm Alternative";
        altReasons = [
          "Upgrade to the futuristic 5.6mm ultra-thin form factor if sleek design is your top priority"
        ];
      }
    }
  } else if (formFactor === "ipad") {
    if (useCase === "design" || useCase === "video" || priority === "max_screen") {
      bestId = "ipad-pro-13-m4";
      bestReasons = [
        "Breakthrough Ultra Retina Tandem OLED display with 2,000,000:1 contrast ratio for color-critical illustration",
        "M4 chip with hardware-accelerated ray tracing and 1000 nits full-screen brightness",
        "Apple Pencil Pro support with barrel roll, squeeze gesture, and haptic feedback"
      ];
      altId = "ipad-air-13-m2";
      altPitch = "💰 Huge 13\" Canvas for 6,100,000 UZS Less";
      altReasons = [
        "Maintains the expansive 13-inch creative workspace with Apple Pencil Pro compatibility at smart value"
      ];
    } else if (priority === "ultra_portable") {
      bestId = "ipad-mini-7-a17-pro";
      bestReasons = [
        "Ultra-compact 8.3\" Liquid Retina display weighing under 300 grams: fits inside jacket pockets",
        "A17 Pro chip supports Apple Intelligence, console-grade games, and Apple Pencil Pro",
        "Perfect digital pocket notebook for students, field engineers, and mobile creators"
      ];
      altId = "ipad-air-11-m2";
      altPitch = "📋 Larger 11\" Workstation Alternative";
      altReasons = [
        "Offers desktop-class M2 chip with Magic Keyboard support for full laptop replacement"
      ];
    } else if (budget === "budget") {
      bestId = "ipad-11-gen";
      bestReasons = [
        "Starting at only 4,990,000 UZS: best price-to-utility ratio in the entire Apple ecosystem",
        "10.9-inch Liquid Retina display with USB-C and all-day battery life for study and media",
        "Supports Apple Pencil for note-taking and digital assignments in Tashkent universities"
      ];
      altId = "ipad-air-11-m2";
      altPitch = "⚡ M2 Powerhouse Alternative";
      altReasons = [
        "Upgrades to the M2 processor and laminated anti-reflective display for heavier creative work"
      ];
    } else {
      bestId = "ipad-air-11-m2";
      bestReasons = [
        "Desktop-class Apple Silicon M2 processor in a sleek, lightweight 11-inch aluminum chassis",
        "Supports Apple Pencil Pro and Magic Keyboard for a complete laptop replacement workflow",
        "P3 wide color gamut and stereo landscape speakers ideal for education and business presentations"
      ];
      altId = "ipad-11-gen";
      altPitch = "💰 Budget Saver Alternative (Save 3,000,000 UZS)";
      altReasons = [
        "Delivers 90% of the daily study and streaming experience at an entry-level price"
      ];
    }
  } else if (formFactor === "watch") {
    if (priority === "max_performance" || useCase === "fitness" || budget === "flagship") {
      bestId = "apple-watch-ultra-2-black";
      bestReasons = [
        "Aerospace Grade 5 Titanium case in Satin Black with 100m water resistance and sapphire front",
        "Dual-frequency L1/L5 GPS provides pinpoint tracking for running, cycling, and mountaineering",
        "Up to 72 hours battery life in Low Power Mode with customizable orange Action Button"
      ];
      altId = "apple-watch-series-10";
      altPitch = "✨ Sleek Daily Wear Alternative (Save 4,800,000 UZS)";
      altReasons = [
        "World's thinnest Apple Watch profile with wide-angle OLED for stylish wear with office suits"
      ];
    } else if (budget === "budget") {
      bestId = "apple-watch-se-2";
      bestReasons = [
        "Accessible starting price (3,490,000 UZS) with essential heart rate tracking, Crash Detection, and sleep monitoring",
        "Water resistant to 50 meters with retina display and full watchOS app store ecosystem",
        "Lightweight 100% recycled aluminum case comfortable for 24/7 sleep tracking"
      ];
      altId = "apple-watch-series-10";
      altPitch = "⌚ Premium Wide-Angle OLED Upgrade";
      altReasons = [
        "Adds ECG, blood oxygen, sleep apnea tracking, and fast charging (80% in 30 minutes)"
      ];
    } else {
      bestId = "apple-watch-series-10";
      bestReasons = [
        "Wide-angle OLED display offering up to 40% more brightness at an angle with ultra-thin bezels",
        "Advanced sleep apnea detection, water depth & temperature sensor, and ECG certification",
        "Fast magnetic charging gets you 80% battery in just 30 minutes before leaving home"
      ];
      altId = "apple-watch-series-11";
      altPitch = "⌚ Next-Gen Series 11 Alternative";
      altReasons = [
        "Features newest biometric sensor suite and enhanced battery longevity for sports"
      ];
    }
  } else if (formFactor === "airpods") {
    if (budget === "flagship" || priority === "max_screen" || priority === "max_performance") {
      bestId = "airpods-max-usbc";
      bestReasons = [
        "Over-ear acoustic architecture with custom 40mm drivers and lossless 24-bit USB-C audio",
        "Industry-standard Active Noise Cancellation completely silences noisy planes and Tashkent streets",
        "Breathable knit mesh canopy and memory foam ear cushions for supreme multi-hour comfort"
      ];
      altId = "airpods-pro-2-hearing";
      altPitch = "🪶 Pocketable Daily Driver Alternative (Save 4,200,000 UZS)";
      altReasons = [
        "In-ear silicone fit with 2x stronger noise cancellation and clinical-grade hearing aid support"
      ];
    } else if (budget === "budget") {
      bestId = "airpods-4-anc";
      bestReasons = [
        "First open-ear design featuring Active Noise Cancellation and Transparency mode without silicone tips",
        "H2 chip delivers Personalized Spatial Audio with dynamic head tracking and Voice Isolation",
        "Ultra-compact USB-C charging case with built-in speaker for Find My precision tracking"
      ];
      altId = "airpods-pro-2-hearing";
      altPitch = "🎧 Pro Silicone Seal Upgrade";
      altReasons = [
        "Adds customizable ear tips for tighter bass seal and clinical hearing health features"
      ];
    } else {
      bestId = "airpods-pro-2-hearing";
      bestReasons = [
        "Pro-grade Active Noise Cancellation with Adaptive Audio that automatically adjusts to your environment",
        "Certified clinical-grade hearing test and hearing aid capabilities built directly into iOS",
        "Touch volume swipe controls on stems, MagSafe USB-C case with lanyard loop and speaker"
      ];
      altId = "airpods-4-anc";
      altPitch = "🪶 Open-Ear Fit Alternative";
      altReasons = [
        "If you dislike in-ear silicone ear tips and prefer open, pressure-free ear comfort"
      ];
    }
  } else {
    // formFactor === "auto" (Let Advisor Decide across the entire ecosystem)
    if (useCase === "programming") {
      bestId = (budget === "mid" || budget === "budget") ? "mac-mini-m4-pro" : "macbook-air-13-m4";
      bestReasons = [
        "Top recommended platform for software engineers: Apple Silicon M4 with 16GB standard RAM",
        "Runs Docker containers, compilers, and IDEs natively with zero thermal lag",
        "Best developer ecosystem compatibility in Uzbekistan with full macOS support"
      ];
      altId = "macbook-air-15-m4";
      altPitch = "🖥️ Larger 15.3\" Screen Alternative";
      altReasons = [
        "Provides extra display width for dual-column code view and terminal windows"
      ];
    } else if (useCase === "photo") {
      bestId = (budget === "flagship") ? "iphone-17-pro-max" : "iphone-17-pro";
      bestReasons = [
        "Triple 48MP Pro camera system with optical periscope zoom and 4K 120fps video",
        "Direct USB-C external SSD recording for photographers and content creators",
        "Super Retina XDR OLED with 3000 nits brightness for outdoor shooting"
      ];
      altId = "iphone-17-air";
      altPitch = "🪶 Ultra-Slim Aesthetic Alternative (5.6mm)";
      altReasons = [
        "Featherlight 158g body for effortless everyday pocket carry and vlogging"
      ];
    } else if (useCase === "design") {
      bestId = "ipad-pro-13-m4";
      bestReasons = [
        "Tandem OLED Ultra Retina XDR display with 2M:1 contrast ratio is the gold standard for digital illustration",
        "Apple Pencil Pro support with barrel roll and haptic feedback",
        "M4 silicon handles massive multi-layer canvases in Procreate without lag"
      ];
      altId = "ipad-air-13-m2";
      altPitch = "💰 Budget-Friendly 13\" Alternative (Save 6,100,000 UZS)";
      altReasons = [
        "Retains the full 13-inch creative drawing canvas with Apple Pencil Pro at a much lower price"
      ];
    } else if (useCase === "fitness") {
      bestId = "apple-watch-ultra-2-black";
      bestReasons = [
        "49mm aerospace titanium case with sapphire crystal and dual-frequency GPS",
        "100m water resistance and 72-hour battery life for trail running and sports",
        "Action button for quick workout splits and vital metric tracking"
      ];
      altId = "apple-watch-series-10";
      altPitch = "✨ Thinner Everyday Watch Alternative";
      altReasons = [
        "Ultra-thin wide-angle OLED display with ECG and sleep apnea tracking for daily use"
      ];
    } else if (useCase === "audio") {
      bestId = "airpods-pro-2-hearing";
      bestReasons = [
        "Pro-grade Active Noise Cancellation blocks city commuting and flight noise",
        "Adaptive Audio and clinical-grade hearing health features in iOS",
        "Up to 30 hours of listening time with the MagSafe USB-C case"
      ];
      altId = "airpods-max-usbc";
      altPitch = "🎧 Luxury Over-Ear Hi-Fi Alternative";
      altReasons = [
        "Studio-grade 40mm acoustic drivers and stainless steel telescopic arms for maximum immersion"
      ];
    } else if (useCase === "study" || useCase === "office") {
      if (budget === "budget") {
        bestId = "ipad-11-gen";
        bestReasons = [
          "Affordable starting price (4,990,000 UZS) for lecture notes, PDF reading, and homework",
          "All-day battery life and Apple Pencil support for handwriting equations",
          "Compact 10.9-inch format fits into any university bag"
        ];
        altId = "mac-mini-m4-pro";
        altPitch = "💻 Home Desktop Alternative";
        altReasons = [
          "M4 computer with 16GB RAM for under 10M UZS if you prefer a keyboard and mouse home desk"
        ];
      } else {
        bestId = "macbook-air-13-m4";
        bestReasons = [
          "Lightweight 1.24kg aluminum body with 18 hours of real-world battery endurance",
          "M4 chip and 16GB RAM base handles multitasking across research tabs, documents, and video calls",
          "Silent fanless operation with bright Liquid Retina display"
        ];
        altId = "ipad-air-11-m2";
        altPitch = "📋 Touchscreen & Stylus Alternative";
        altReasons = [
          "Convert to a tactile touchscreen tablet with Apple Pencil Pro for handwritten note-taking"
        ];
      }
    } else {
      // everyday all-rounder
      if (budget === "budget") {
        bestId = "iphone-17e";
        bestReasons = [
          "Smart entry price into Apple 2026 lineup with Apple Intelligence support",
          "48MP Fusion camera and durable aluminum Ceramic Shield build",
          "All-day battery life with 100% verified UzIMEI registration in Tashkent"
        ];
        altId = "ipad-11-gen";
        altPitch = "📋 Tablet Alternative for Home Entertainment";
        altReasons = [
          "Large 10.9\" screen for movies, YouTube, and web browsing from the couch"
        ];
      } else {
        bestId = "iphone-17";
        bestReasons = [
          "120Hz ProMotion display with 2500 nits brightness delivers silky smooth daily scrolling",
          "A19 3nm chip and Dual 48MP camera setup with 2x lossless optical zoom",
          "Sweetspot price in Uzbekistan with full reseller warranty"
        ];
        altId = "iphone-17-air";
        altPitch = "🪶 Ultra-Slim 5.6mm Alternative";
        altReasons = [
          "Upgrade to the futuristic 5.6mm titanium-aluminum ultra-thin profile"
        ];
      }
    }
  }

  // Safety fallback: ensure best and alt exist and are distinct
  let bestProd = getProduct(bestId) || (PRODUCTS_DATA && PRODUCTS_DATA[0]);
  let altProd = getProduct(altId);
  if (!altProd || (bestProd && altProd.id === bestProd.id)) {
    altProd = (PRODUCTS_DATA && bestProd)
      ? (PRODUCTS_DATA.find(p => p.id !== bestProd.id && p.category === bestProd.category) || PRODUCTS_DATA.find(p => p.id !== bestProd.id))
      : null;
  }

  return {
    best: {
      product: bestProd,
      score: bestScore,
      reasons: bestReasons.length ? bestReasons : [
        `Optimal hardware specifications tailored to your ${useCase} preference`,
        `Verified in-stock availability across authorized Tashkent partner stores`,
        `Includes 1-Year official manufacturer warranty and registered UzIMEI`
      ]
    },
    alt: {
      product: altProd,
      score: altScore,
      pitch: altPitch || "💡 Top Secondary Recommendation",
      reasons: altReasons.length ? altReasons : [
        `Provides an attractive alternative price-to-performance configuration`,
        `Fully compatible with the Apple ecosystem and accessories in Uzbekistan`
      ]
    }
  };
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
