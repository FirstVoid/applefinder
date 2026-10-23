// ==========================================================================
// Apple Finder Uzbekistan — Pure Frontend UI Interactions & Micro-Animations
// Prototype Logic (No backend required)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initNavScroll();
  initSearch();
  initColorDots();
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
    const sections = ["hero", "categories", "popular-section", "compare-section", "quiz-section", "sellers-section"];
    
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
  scrollToSection("popular-section");
  const targetPill = Array.from(document.querySelectorAll(".pill-btn")).find(p => p.textContent.trim() === cat);
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

// 5. Spotlight View Details Selection
function showProductDetails(productId) {
  scrollToSection("detail-spotlight");
  triggerToast(`Loaded spotlight: ${productId.replace(/-/g, ' ').toUpperCase()}`);
}

function selectSpotlightColor(name, hex, btn) {
  document.querySelectorAll(".color-chip-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const label = document.getElementById("selectedColorName");
  if (label) label.textContent = name;
  triggerToast(`Color selected: ${name}`);
}

function selectSpotlightStorage(storage, price, btn) {
  document.querySelectorAll(".storage-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const priceDisplay = document.getElementById("spotlightPriceDisplay");
  if (priceDisplay) priceDisplay.textContent = price;
  triggerToast(`Storage: ${storage} • Price updated to ${price}`);
}

// Gallery thumbnail switch
function switchThumbnail(src, thumbBox) {
  const main = document.getElementById("spotlightMainImg");
  if (main) {
    main.style.opacity = "0.4";
    main.style.transform = "scale(0.96)";
    setTimeout(() => {
      main.src = src;
      main.style.opacity = "1";
      main.style.transform = "scale(1)";
    }, 150);
  }
  document.querySelectorAll(".thumb-box").forEach(t => t.classList.remove("active"));
  thumbBox.classList.add("active");
}

let galleryIndex = 0;
const galleryImages = [
  "assets/images/iphone.jpg",
  "assets/images/hero.jpg",
  "assets/images/macbook.jpg"
];

function slideGallery(dir) {
  galleryIndex = (galleryIndex + dir + galleryImages.length) % galleryImages.length;
  const main = document.getElementById("spotlightMainImg");
  if (main) {
    main.src = galleryImages[galleryIndex];
  }
}

// 6. Compare Matrix Controls
let compareCount = 3;

function toggleCompare(productName, checkbox) {
  if (checkbox.checked) {
    compareCount++;
    triggerToast(`Added ${productName} to comparison`);
  } else {
    compareCount = Math.max(0, compareCount - 1);
    triggerToast(`Removed ${productName} from comparison`);
  }
  updateCompareCounter();
}

function updateCompareCounter() {
  const pill = document.getElementById("compareCount");
  if (pill) pill.textContent = compareCount;
}

function removeCompareCol(colIndex) {
  const table = document.querySelector(".compare-table");
  if (!table) return;

  const th = table.querySelectorAll("thead th")[colIndex];
  if (th) th.style.opacity = "0.3";
  
  table.querySelectorAll("tbody tr").forEach(row => {
    const td = row.querySelectorAll("td")[colIndex];
    if (td) td.style.opacity = "0.3";
  });

  compareCount = Math.max(0, compareCount - 1);
  updateCompareCounter();
  triggerToast("Removed column from comparison");
}

function resetCompare() {
  const table = document.querySelector(".compare-table");
  if (table) {
    table.querySelectorAll("th, td").forEach(cell => cell.style.opacity = "1");
  }
  compareCount = 3;
  updateCompareCounter();
  triggerToast("Comparison table reset");
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
          <h2 style="font-size: 2.2rem; font-weight: 800; margin: 12px 0 6px;">MacBook Air 13" M3 (Midnight)</h2>
          <p style="color: #9ca3af; font-size: 0.95rem; line-height: 1.5; margin-bottom: 20px;">
            Matches your study/education profile, 18-hour battery, silent fanless body, and fits within your planned budget from verified Tashkent stores.
          </p>
          <div style="font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 20px;">
            13,990,000 UZS <span style="font-size: 0.85rem; color: #9ca3af; font-weight: 400;">(Official Warranty)</span>
          </div>
          <button class="btn-primary" onclick="openModal('reservationModal', 'TechZone', '13,990,000 UZS')" style="background: #0071e3;">
            Reserve at TechZone →
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

// 8. Interactive Map & Store Cards
function highlightStoreCard(storeId) {
  const card = document.getElementById(`card-${storeId}`);
  const pin = document.getElementById(`pin-${storeId}`);

  document.querySelectorAll(".store-item-card").forEach(c => c.classList.remove("highlighted"));
  
  if (card) {
    card.classList.add("highlighted");
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  triggerToast(`Selected store on map: ${storeId.toUpperCase()}`);
}

function filterCity(cityName, chipBtn) {
  document.querySelectorAll(".city-tab-chip").forEach(c => c.classList.remove("active"));
  if (chipBtn) chipBtn.classList.add("active");

  const cityIndicator = document.getElementById("mapCityIndicator");
  if (cityIndicator) {
    cityIndicator.textContent = `📍 ${cityName}, Uzbekistan`;
  }
  triggerToast(`Filtered region: ${cityName}`);
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
let toastTimeout;
function triggerToast(msg) {
  const toast = document.getElementById("appToast");
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}
