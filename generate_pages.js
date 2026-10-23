// Generator for Apple Finder Category Subsites into pages/ directory
const fs = require('fs');
const path = require('path');
const { PRODUCTS_DATA, STORES_DATA, CATEGORY_HUBS } = require('./js/data.js');

function formatPriceUZS(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " UZS";
}

const CATEGORY_META = {
  "Apple Watch": {
    slug: "watch",
    filename: "watch.html",
    appleUrlRef: "https://www.apple.com/uz/watch/",
    navTitle: "Watch",
    pageTitle: "Apple Watch (2025–2026) — Apple Finder Tashkent",
    heroBadge: "Series 10 & Ultra 2 • Thinscredible",
    heroHeadline: "To wear it is to love it.",
    heroSub: "The ultimate device for a healthy life in Tashkent. Series 10 wide-angle OLED (9.7mm thin), sleep apnea notifications, and Ultra 2 in Satin Black Titanium with 3000 nits display.",
    heroImage: "assets/images/watch.jpg",
    accentColor: "#ff3b30",
    features: [
      {
        icon: "💓",
        title: "Heart & Sleep Apnea Insights",
        desc: "Take an ECG anytime, monitor heart rate zones, receive high/low notifications, and track sleep apnea breathing disturbances."
      },
      {
        icon: "🏃",
        title: "Workout & Dual GPS",
        desc: "Track workouts with precision dual-frequency GPS, custom intervals, power metrics, and up to 100m water resistance."
      },
      {
        icon: "🚨",
        title: "Emergency Safety",
        desc: "Advanced sensors detect severe car crashes or hard falls and automatically connect you to emergency contacts with exact location."
      },
      {
        icon: "⚡",
        title: "Fast Magnetic Charging",
        desc: "Charge from 0% to 80% in approximately 30 minutes. Always-on Retina display with up to 3000 nits outdoor brightness."
      }
    ]
  },
  "MacBook": {
    slug: "mac",
    filename: "mac.html",
    appleUrlRef: "https://www.apple.com/uz/mac/",
    navTitle: "Mac",
    pageTitle: "Mac & MacBook (2025–2026 M4 Generation) — Apple Finder Tashkent",
    heroBadge: "Apple Silicon M4, M4 Pro & M4 Max",
    heroHeadline: "If you can dream it, Mac can do it.",
    heroSub: "Supercharged by M4, M4 Pro, and M4 Max. Radical compact 5x5 inch Mac mini, Liquid Retina XDR displays, 16GB RAM standard base, and up to 24 hours of endurance in Tashkent.",
    heroImage: "assets/images/macbook.jpg",
    accentColor: "#2997ff",
    features: [
      {
        icon: "⚡",
        title: "M4 Generation Silicon",
        desc: "Industry-leading single-thread performance, 16GB unified RAM standard base, and hardware-accelerated ray tracing."
      },
      {
        icon: "🔋",
        title: "Up to 24 Hours Battery",
        desc: "The longest battery life in Mac history. Conquer demanding workdays across Tashkent without needing a power adapter."
      },
      {
        icon: "🖥️",
        title: "Liquid Retina XDR & Nano-Texture",
        desc: "Up to 1,600 nits peak brightness, 1,000,000:1 contrast ratio, ProMotion 120Hz, and optional glare-free Nano-texture glass."
      },
      {
        icon: "🔒",
        title: "macOS Sequoia & Apple Intelligence",
        desc: "iPhone Mirroring, seamless Continuity copy-paste, writing tools, and military-grade hardware security."
      }
    ]
  },
  "iPad": {
    slug: "ipad",
    filename: "ipad.html",
    appleUrlRef: "https://www.apple.com/uz/ipad/",
    navTitle: "iPad",
    pageTitle: "iPad (2025–2026 M4 & A17 Pro) — Apple Finder Tashkent",
    heroBadge: "Ultra Retina XDR • Tandem OLED",
    heroHeadline: "Touch, draw, and type on one magical device.",
    heroSub: "From the world's thinnest OLED iPad Pro M4 (5.1mm) to the versatile 13-inch iPad Air canvas and iPad mini A17 Pro. Full support for Apple Pencil Pro and Magic Keyboard.",
    heroImage: "assets/images/ipad.jpg",
    accentColor: "#af52de",
    features: [
      {
        icon: "✨",
        title: "Tandem OLED Display",
        desc: "Dual-panel OLED technology delivering 1000 nits full-screen brightness, 1600 nits HDR peak, and infinite contrast."
      },
      {
        icon: "✏️",
        title: "Apple Pencil Pro Precision",
        desc: "Barrel roll, tactile haptic feedback, squeeze gestures, and hover cursor for world-class digital sketching and notation."
      },
      {
        icon: "🧠",
        title: "M4 Silicon Muscle",
        desc: "Process 8K ProRes video timelines, render complex 3D scenes in Blender, and run local neural models effortlessly."
      },
      {
        icon: "⌨️",
        title: "Magic Keyboard with Function Row",
        desc: "Floating cantilever design, aluminum palm rest, 14 function keys, and large responsive glass trackpad."
      }
    ]
  },
  "iPhone": {
    slug: "iphone",
    filename: "iphone.html",
    appleUrlRef: "https://www.apple.com/uz/iphone/",
    navTitle: "iPhone",
    pageTitle: "iPhone (2025–2026 17 Series & 16 Pro) — Apple Finder Tashkent",
    heroBadge: "iPhone 17 Pro Max • iPhone 17 Air • Titanium",
    heroHeadline: "Designed to be loved.",
    heroSub: "Meet the newest 2025–2026 iPhone lineup in Tashkent: iPhone 17 Pro Max with internal vapor chamber cooling and A19 Pro, the revolutionary 5.6mm iPhone 17 Air, and iPhone 16 Pro.",
    heroImage: "assets/images/iphone.jpg",
    accentColor: "#0071e3",
    features: [
      {
        icon: "📸",
        title: "Triple 48MP Pro Fusion",
        desc: "48MP Main, 48MP Ultra Wide, and 48MP 10x Periscope Telephoto with tactile Camera Control sensor."
      },
      {
        icon: "🚀",
        title: "A19 Pro & Vapor Chamber",
        desc: "Next-gen 3nm silicon with dedicated thermal vapor chamber cooling for sustained desktop-class gaming and 4K 120fps."
      },
      {
        icon: "🛡️",
        title: "Aerospace Titanium & Ceramic 2",
        desc: "Lighter, stronger grade 5 titanium frame paired with second-generation Ceramic Shield with advanced anti-scratch coating."
      },
      {
        icon: "🔋",
        title: "Up to 35 Hours Playback",
        desc: "Massive battery improvements deliver unstoppable endurance for creators, travelers, and power users."
      }
    ]
  },
  "AirPods": {
    slug: "airpods",
    filename: "airpods.html",
    appleUrlRef: "https://www.apple.com/uz/airpods/",
    navTitle: "AirPods",
    pageTitle: "AirPods & Audio (2025–2026 Lineup) — Apple Finder Tashkent",
    heroBadge: "AirPods 4 ANC • AirPods Pro 2 • H2 Chip",
    heroHeadline: "Magic like you’ve never heard.",
    heroSub: "AirPods 4 with open-ear Active Noise Cancellation, AirPods Pro 2 with clinical-grade Hearing Aid capabilities, and lossless audio over USB-C on AirPods Max.",
    heroImage: "assets/images/airpods.jpg",
    accentColor: "#34c759",
    features: [
      {
        icon: "🎧",
        title: "Active Noise Cancellation",
        desc: "H2 computational acoustic processing eliminates up to 2x more ambient rumble and environmental noise."
      },
      {
        icon: "🎵",
        title: "Adaptive Audio & Transparency",
        desc: "Intelligently balances active noise cancellation and transparency tailored to your real-time surroundings."
      },
      {
        icon: "🩺",
        title: "Clinical-Grade Hearing Health",
        desc: "Scientifically validated Hearing Test and over-the-counter Hearing Aid feature built right into AirPods Pro 2."
      },
      {
        icon: "⚡",
        title: "Universal USB-C & Wireless Case",
        desc: "Fast charging with built-in speaker for Find My precision tracking, MagSafe, and Apple Watch puck support."
      }
    ]
  }
};

function generateSubsiteHTML(categoryName) {
  const meta = CATEGORY_META[categoryName];
  const products = PRODUCTS_DATA.filter(p => p.category === categoryName);

  // Model subnav items
  const subnavItems = products.map(p => `
    <a href="#model-${p.id}" class="cat-subnav-link">
      <span class="cat-subnav-name">${p.name.replace('MacBook ', '').replace('Apple Watch ', '')}</span>
      ${p.badge ? `<span class="cat-subnav-tag">${p.badge}</span>` : ''}
    </a>
  `).join('');

  // Product cards
  const cardsHTML = products.map(p => {
    const colorDots = p.colors.map((c, idx) => `
      <span class="color-dot ${idx === 0 ? 'active' : ''}" style="background: ${c.hex};" title="${c.name}"></span>
    `).join('');

    const storageBadges = (p.storage && p.storage.length > 0) ? p.storage.map(s => `
      <span class="hub-storage-chip">${s}</span>
    `).join('') : '';

    return `
      <div class="hub-product-card" id="model-${p.id}">
        <div class="hub-card-top-badge">${p.badge || 'Verified Stock'}</div>
        <div class="hub-card-image-box" onclick="openProductDetailModal('${p.id}')" style="cursor: pointer;" title="Click to view full specifications & Tashkent stores">
          <img src="../${p.image}" alt="${p.name}" class="hub-card-img">
        </div>
        
        <div class="hub-card-colors">
          ${colorDots}
        </div>

        <h3 class="hub-card-title" onclick="openProductDetailModal('${p.id}')" style="cursor: pointer;" title="Click to view details">${p.name}</h3>
        <p class="hub-card-tagline">${p.tagline}</p>
        
        <div class="hub-specs-summary" onclick="openProductDetailModal('${p.id}')" style="cursor: pointer;">
          <div class="hub-spec-row">
            <span class="hub-spec-label">Chip</span>
            <span class="hub-spec-val">${p.chip.split('with')[0]}</span>
          </div>
          <div class="hub-spec-row">
            <span class="hub-spec-label">Display</span>
            <span class="hub-spec-val">${p.screen || 'Retina OLED Display'}</span>
          </div>
          <div class="hub-spec-row">
            <span class="hub-spec-label">Battery</span>
            <span class="hub-spec-val">${p.battery}</span>
          </div>
        </div>

        ${storageBadges ? `<div class="hub-storage-row">${storageBadges}</div>` : ''}

        <div class="hub-price-box">
          <span class="hub-price-from">Starting from</span>
          <span class="hub-price-val">${p.priceFormatted}</span>
          <span class="hub-price-store">🏬 Default: ${p.defaultStore}</span>
        </div>

        <div class="hub-actions-row">
          <button class="btn-primary hub-btn-cart" data-cart-product-id="${p.id}" onclick="addToCart('${p.id}')">
            <span>+ 🛍️ Add to Cart</span>
          </button>
          <button class="btn-secondary hub-btn-details" onclick="openProductDetailModal('${p.id}')">
            Details
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Feature cards
  const featuresHTML = meta.features.map(f => `
    <div class="hub-feature-box">
      <div class="hub-feature-icon">${f.icon}</div>
      <h4 class="hub-feature-title">${f.title}</h4>
      <p class="hub-feature-desc">${f.desc}</p>
    </div>
  `).join('');

  // Category switch links
  const categorySwitchLinks = Object.keys(CATEGORY_META).map(catKey => {
    const cMeta = CATEGORY_META[catKey];
    const isCurrent = (catKey === categoryName);
    return `
      <a href="${cMeta.filename}" class="cat-pill-switch ${isCurrent ? 'active' : ''}">
        ${cMeta.navTitle}
      </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.pageTitle}</title>
  <meta name="description" content="${meta.heroSub}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="stylesheet" href="../css/hub_styles.css">
</head>
<body class="hub-page-body">

  <!-- ==================== TOP GLOBAL NAVIGATION ==================== -->
  <header class="site-header hub-global-header">
    <div class="container header-inner">
      <a href="../index.html" class="brand-group" title="Back to Apple Finder">
        <div class="brand-logo-icon">
          <svg class="apple-svg-logo" viewBox="0 0 170 170" width="22" height="22" fill="currentColor">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.19-9.56-11.16-20.78-14.92-33.65-3.76-12.87-5.64-24.81-5.64-35.83 0-14.56 3.69-26.69 11.07-36.4 7.38-9.71 16.73-14.65 28.05-14.82 4.35 0 9.29 1.1 14.82 3.31 5.53 2.21 9.4 3.37 11.61 3.48 2.65-.22 6.77-1.44 12.36-3.65 5.59-2.21 10.33-3.21 14.23-3 10.97.43 19.82 4.33 26.54 11.71 6.72 7.38 10.8 16.48 12.24 27.29-9.78 5.86-14.6 14.12-14.46 24.76.14 8.7 3.49 16.03 10.05 21.99 6.56 5.96 14.23 9.44 23.01 10.45-2.02 6.52-4.58 13.08-7.68 19.68zM119.22 31.86c0-6.95 2.53-13.48 7.59-19.58 5.06-6.1 11.39-10.22 18.99-12.35.22 1.52.33 2.83.33 3.91 0 7.17-2.67 13.91-8 20.21-5.33 6.3-11.77 10.37-19.32 12.21-.59-1.52-.89-2.99-.89-4.4z"/>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-name">Apple Finder</span>
          <span class="brand-country">Tashkent</span>
        </div>
      </a>

      <!-- Category Pill Navigation -->
      <nav class="hub-categories-ribbon">
        ${categorySwitchLinks}
        <a href="compare.html" class="cat-pill-switch">Compare</a>
      </nav>

      <div class="header-actions">
        <a href="../index.html" class="btn-subtle-nav">← Main Page</a>
        <a href="cart.html" class="cart-btn" title="Shopping Cart">
          <span class="cart-icon">🛍️</span>
          <span class="cart-label">Cart</span>
          <span class="cart-count-pill" id="cartCount">0</span>
        </a>
      </div>
    </div>
  </header>

  <!-- ==================== CATEGORY SUB-NAV BAR (Apple.com style) ==================== -->
  <div class="hub-subnav-strip">
    <div class="container hub-subnav-inner">
      <div class="hub-subnav-title-group">
        <span class="hub-subnav-eyebrow">Category Subsite</span>
        <h2 class="hub-subnav-headline">${meta.navTitle}</h2>
      </div>

      <div class="hub-subnav-models">
        ${subnavItems}
      </div>

      <div class="hub-subnav-right">
        <a href="#lineup-section" class="btn-primary hub-subnav-cta">View Lineup (${products.length})</a>
      </div>
    </div>
  </div>

  <main class="hub-main-content">
    
    <!-- ==================== HERO SHOWCASE BANNER ==================== -->
    <section class="hub-hero-section">
      <div class="container">
        <div class="hub-hero-card" style="--accent-hub: ${meta.accentColor};">
          <div class="hub-hero-info">
            <div class="hub-hero-badge">${meta.heroBadge}</div>
            <h1 class="hub-hero-title">${meta.heroHeadline}</h1>
            <p class="hub-hero-desc">${meta.heroSub}</p>
            
            <div class="hub-hero-meta-row">
              <div class="hub-meta-pill">
                <strong>${products.length} Models</strong> in stock
              </div>
              <div class="hub-meta-pill">
                <strong>100% Official</strong> UzIMEI Registered
              </div>
              <div class="hub-meta-pill">
                <strong>1 Year</strong> Reseller Warranty
              </div>
            </div>

            <div class="hub-hero-actions">
              <a href="#lineup-section" class="btn-primary">
                <span>Explore Tashkent Lineup</span>
                <span>↓</span>
              </a>
              <button class="btn-secondary" onclick="openProductDetailModal('${products[0].id}')">
                <span>Spotlight Details</span>
              </button>
            </div>
          </div>

          <div class="hub-hero-media">
            <div class="hub-hero-img-wrap">
              <img src="../${meta.heroImage}" alt="${meta.navTitle}" class="hub-hero-img">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== WHY APPLE [CATEGORY] ==================== -->
    <section class="hub-features-section">
      <div class="container">
        <div class="hub-section-header">
          <span class="hub-section-eyebrow">Innovation Highlights</span>
          <h2 class="hub-section-title">Why ${meta.navTitle} is in a class of its own.</h2>
          <p class="hub-section-sub">Engineered to integrate seamlessly with the Apple ecosystem in Uzbekistan.</p>
        </div>

        <div class="hub-features-grid">
          ${featuresHTML}
        </div>
      </div>
    </section>

    <!-- ==================== COMPLETE CATEGORY LINEUP ==================== -->
    <section class="hub-lineup-section" id="lineup-section">
      <div class="container">
        <div class="hub-section-header">
          <span class="hub-section-eyebrow">Explore the Tashkent Range</span>
          <h2 class="hub-section-title">${meta.navTitle} Models Available Now</h2>
          <p class="hub-section-sub">Click any model to inspect specifications or add directly to your temporary shopping session.</p>
        </div>

        <div class="hub-cards-grid">
          ${cardsHTML}
        </div>
      </div>
    </section>

    <!-- ==================== COMPARISON STRIP ==================== -->
    <section class="hub-compare-cta-section">
      <div class="container">
        <div class="hub-compare-banner">
          <div>
            <h3>Need help choosing between ${meta.navTitle} models?</h3>
            <p>Compare specifications side by side in our interactive matrix or take our 2-minute Tashkent student quiz.</p>
          </div>
          <div class="hub-compare-buttons">
            <a href="compare.html" class="btn-primary">Open Interactive Compare →</a>
            <a href="../index.html#quiz-section" class="btn-secondary">Help Me Choose Quiz</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== TASHKENT AUTHORIZED STORES ==================== -->
    <section class="hub-stores-section">
      <div class="container">
        <div class="hub-section-header">
          <span class="hub-section-eyebrow">Local Availability</span>
          <h2 class="hub-section-title">Verified ${meta.navTitle} Sellers in Tashkent</h2>
          <p class="hub-section-sub">Genuine warranty, test stands, and immediate pickup across the city.</p>
        </div>

        <div class="hub-stores-grid">
          <div class="hub-store-card">
            <h4>MacBro (C-1)</h4>
            <p>📍 Amir Timur Ave, 47, Tashkent Center</p>
            <span class="hub-store-tag">Apple Premium Stock</span>
          </div>
          <div class="hub-store-card">
            <h4>iSpace APR</h4>
            <p>📍 Tashkent City Mall, 1st Floor</p>
            <span class="hub-store-tag">Official Flagship Store</span>
          </div>
          <div class="hub-store-card">
            <h4>MediaPark Qoratosh</h4>
            <p>📍 Qoratosh St, 11A, Shaykhontohur</p>
            <span class="hub-store-tag">Hypermarket Warranty</span>
          </div>
          <div class="hub-store-card">
            <h4>Malika Market (A-24)</h4>
            <p>📍 Navoi Electronic Fair, Row A</p>
            <span class="hub-store-tag">Best Cash & Trade-in Deals</span>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- ==================== CART DRAWER ==================== -->
  <div class="cart-drawer-backdrop" id="cartDrawerBackdrop" onclick="closeCartDrawer(event)">
    <div class="cart-drawer-panel" onclick="event.stopPropagation()">
      <div class="cart-drawer-header">
        <div class="cart-header-title-wrap">
          <h3 class="cart-title">🛍️ Your Cart</h3>
          <span class="cart-subtitle" id="cartItemCountLabel">0 items</span>
        </div>
        <button class="cart-close-btn" onclick="toggleCartDrawer()" title="Close">✕</button>
      </div>

      <div class="cart-items-container" id="cartItemsList">
        <!-- Injected via script.js -->
      </div>

      <div class="cart-footer" id="cartFooter">
        <div class="cart-total-row">
          <span class="cart-total-label">Total Estimated Price:</span>
          <span class="cart-total-amount" id="cartTotalPrice">0 UZS</span>
        </div>
        <div class="cart-actions-row">
          <button class="btn-primary btn-cart-checkout" onclick="proceedCartCheckout()">
            <span>Proceed to Reservation →</span>
          </button>
          <button class="btn-clear-cart" onclick="clearCart()">Clear</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Detailed Product Modal (Dynamic for all 30 products) -->
  <div class="modal-backdrop" id="productDetailModal" onclick="closeProductDetailModal(event)"></div>

  <!-- Reservation Modal -->
  <div class="modal-backdrop" id="reservationModal">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">Order Reservation (Tashkent)</h3>
        <button class="modal-close" onclick="closeModal('reservationModal')">✕</button>
      </div>
      <div class="modal-body">
        <p class="modal-desc">
          Your reservation has been confirmed! An SMS code will be sent to confirm device hold at the selected Tashkent retailer.
        </p>
        <div class="modal-selected-summary">
          <div id="modalProductName" style="font-weight: 700; color: #1d1d1f; margin-bottom: 4px;">Selected Device</div>
          <div id="modalStoreName" style="color: #0071e3; font-size: 0.9rem;">Verified Tashkent Store</div>
        </div>
        <button class="btn-primary" style="width: 100%; margin-top: 20px;" onclick="closeModal('reservationModal')">
          Done
        </button>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div class="app-toast" id="appToast">Notification message</div>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container footer-bottom">
      <p>© 2026 Apple Finder Tashkent. Official Model Showcase for ${meta.navTitle}.</p>
      <div class="footer-links-inline">
        <a href="../index.html">← Return to Main Store</a> · 
        <a href="compare.html">Compare Matrix</a> · 
        <a href="${meta.appleUrlRef}" target="_blank" rel="noopener">Official Apple.com/uz Reference ↗</a>
      </div>
    </div>
  </footer>

  <script src="../js/data.js"></script>
  <script src="../js/cart.js"></script>
  <script src="../js/script.js"></script>
</body>
</html>
`;
}

// Generate all 5 subsite pages into pages/ directory
Object.keys(CATEGORY_META).forEach(catKey => {
  const meta = CATEGORY_META[catKey];
  const html = generateSubsiteHTML(catKey);
  const targetPath = path.join(__dirname, 'pages', meta.filename);
  fs.writeFileSync(targetPath, html, 'utf8');
  console.log('Generated subsite:', targetPath);
});

console.log('All Apple Category Subsites generated successfully into pages/ !');
