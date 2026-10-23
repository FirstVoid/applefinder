// ==========================================================================
// Apple Finder Tashkent — Shared Unified Cart Engine
// ==========================================================================
// Persists cart items across all pages in the current session using sessionStorage
// Enforces strict uniqueness: each product can be added ONLY ONCE (1 item max per productId)

const CART_STORAGE_KEY = "apple_finder_cart_items";

// Helper: Get cart array from sessionStorage
function getCart() {
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Error reading cart from sessionStorage", e);
  }
  return [];
}

// Helper: Save cart array to sessionStorage
function saveCart(cart) {
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("Error saving cart to sessionStorage", e);
  }
}

// Check if a specific product ID is currently in the cart
function isProductInCart(productId) {
  if (!productId) return false;
  const cart = getCart();
  return cart.some(item => item.productId === productId);
}

// Format price in Uzbek Som (UZS)
function formatPriceUZS(num) {
  if (typeof num !== "number") {
    num = parseInt(String(num).replace(/[^0-9]/g, ""), 10) || 0;
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " UZS";
}

// Resolve canonical product from ID or title
function findProductData(productIdOrTitle) {
  if (typeof PRODUCTS_DATA === "undefined" || !Array.isArray(PRODUCTS_DATA)) {
    return null;
  }
  if (!productIdOrTitle) return null;

  // 1. Direct ID match
  let p = PRODUCTS_DATA.find(item => item.id === productIdOrTitle);
  if (p) return p;

  // 2. Exact or substring Name match
  const searchStr = String(productIdOrTitle).toLowerCase().trim();
  p = PRODUCTS_DATA.find(item => item.name.toLowerCase() === searchStr);
  if (p) return p;

  p = PRODUCTS_DATA.find(item => searchStr.startsWith(item.name.toLowerCase()) || item.name.toLowerCase().startsWith(searchStr));
  if (p) return p;

  return null;
}

// Add item to cart with strict 1-product limit
function addToCart(productIdOrTitle, priceOverride, imageOverride, storeOverride, colorOverride, storageOverride) {
  const p = findProductData(productIdOrTitle);
  const cart = getCart();

  // Canonical product ID
  const pId = p ? p.id : String(productIdOrTitle).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const pName = p ? p.name : String(productIdOrTitle);

  // Check if product is already in cart: strictly reject duplicate
  const alreadyInCart = cart.some(item => item.productId === pId);
  if (alreadyInCart) {
    triggerToast(`⚠️ "${pName}" is already in your cart (limit: 1 unit per model)`);
    return false;
  }

  // Determine final attributes
  const pPrice = priceOverride || (p ? p.price : 14990000);
  const pImage = imageOverride || (p ? p.image : "assets/images/iphone.jpg");
  const pStore = storeOverride || (p ? p.defaultStore : "MacBro (C-1)");
  const pCategory = p ? p.category : "Apple Device";
  const pStorage = storageOverride || (p && p.storage ? p.storage[0] : "Standard");
  const pColor = colorOverride || (p && p.colors && p.colors[0] ? p.colors[0].name : "Standard");

  // Normalize image path relative to root
  const cleanImage = pImage.replace(/^(\.\.\/|\.\/)/, "");

  const newItem = {
    productId: pId,
    name: pName,
    category: pCategory,
    price: pPrice,
    priceFormatted: formatPriceUZS(pPrice),
    image: cleanImage,
    store: pStore,
    storage: pStorage,
    color: pColor,
    addedAt: Date.now()
  };

  cart.push(newItem);
  saveCart(cart);

  // Synchronize UI everywhere
  updateAllCartUI();
  triggerToast(`🛍️ "${pName}" added to cart!`);

  return true;
}

// Remove item from cart by productId
function removeFromCart(productId) {
  let cart = getCart();
  const removedItem = cart.find(item => item.productId === productId);
  cart = cart.filter(item => item.productId !== productId);
  saveCart(cart);

  updateAllCartUI();
  if (removedItem) {
    triggerToast(`Removed: ${removedItem.name}`);
  } else {
    triggerToast("Item removed from cart");
  }
}

// Clear all items from cart
function clearCart() {
  saveCart([]);
  updateAllCartUI();
  triggerToast("Cart cleared");
}

// Synchronize all UI indicators, buttons, counters, and pages
function updateAllCartUI() {
  const cart = getCart();
  const totalCount = cart.length;

  // 1. Update all cart count badges in headers
  document.querySelectorAll("#cartCount, .cart-count-pill").forEach(el => {
    el.textContent = totalCount;
    if (totalCount > 0) {
      el.classList.add("bump");
      setTimeout(() => el.classList.remove("bump"), 300);
    }
  });

  const countLabel = document.getElementById("cartItemCountLabel");
  if (countLabel) {
    countLabel.textContent = `${totalCount} ${totalCount === 1 ? 'item' : 'items'}`;
  }

  // 2. Update button states on current page (catalog, compare, details)
  // Check any product buttons with data-product-id
  document.querySelectorAll("[data-cart-product-id]").forEach(btn => {
    const id = btn.getAttribute("data-cart-product-id");
    if (isProductInCart(id)) {
      btn.classList.add("btn-in-cart");
      btn.innerHTML = "<span>✓ In Cart</span>";
    } else {
      btn.classList.remove("btn-in-cart");
      btn.innerHTML = "<span>+ 🛍️ Add to Cart</span>";
    }
  });

  // Check compare page specific buttons
  document.querySelectorAll(".compare-add-cart-btn").forEach(btn => {
    const pId = btn.getAttribute("data-compare-product-id");
    if (pId && isProductInCart(pId)) {
      btn.classList.add("btn-in-cart");
      btn.textContent = "✓ In Cart";
    } else if (pId) {
      btn.classList.remove("btn-in-cart");
      btn.textContent = "+ 🛍️ Add to Cart";
    }
  });

  // 3. If on Cart Page (pages/cart.html), render complete cart page view
  const cartPageItemsList = document.getElementById("cartPageItemsList");
  if (cartPageItemsList) {
    renderCartPageContent();
  }

  // 4. If cart drawer exists on page, render drawer contents
  renderCartDrawerContent();
}

// Render dedicated Cart Page view (pages/cart.html)
function renderCartPageContent() {
  const container = document.getElementById("cartPageItemsList");
  const summaryBox = document.getElementById("cartPageSummaryBox");
  if (!container) return;

  const cart = getCart();
  const isSubpage = window.location.pathname.includes("/pages/") || window.location.href.includes("/pages/");
  const imgPrefix = isSubpage ? "../" : "";

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state-box">
        <div class="cart-empty-icon-wrap">🛍️</div>
        <h2 class="cart-empty-title">Your Cart is Empty</h2>
        <p class="cart-empty-desc">
          There are currently no items in your reservation cart. Explore our Apple catalog or use the comparison matrix to reserve a device in Tashkent.
        </p>
        <div class="cart-empty-actions">
          <a href="../index.html#categories" class="btn-primary">
            <span>Browse Catalog</span>
            <span>→</span>
          </a>
          <a href="compare.html" class="btn-secondary">
            <span>Compare Models</span>
          </a>
        </div>
      </div>
    `;

    if (summaryBox) {
      summaryBox.style.display = "none";
    }
    return;
  }

  if (summaryBox) {
    summaryBox.style.display = "block";
  }

  let totalSum = 0;
  const itemsHTML = cart.map(item => {
    totalSum += item.price;
    const resolvedImg = imgPrefix + item.image;

    return `
      <div class="cart-item-row" id="cart-row-${item.productId}">
        <!-- Product Thumbnail with click to open details -->
        <div class="cart-item-media" onclick="openProductDetailModal('${item.productId}')" title="Click to view full specifications">
          <img src="${resolvedImg}" alt="${item.name}" class="cart-item-img">
        </div>

        <!-- Product Information with click to open details -->
        <div class="cart-item-details-col">
          <div class="cart-item-cat-badge">${item.category}</div>
          <h3 class="cart-item-title" onclick="openProductDetailModal('${item.productId}')" title="Click to view details">${item.name}</h3>
          
          <div class="cart-item-options-strip">
            <span class="cart-opt-chip">💾 ${item.storage}</span>
            <span class="cart-opt-chip">🎨 ${item.color}</span>
          </div>

          <div class="cart-item-store-meta">
            <span>🏬 In stock at: <strong>${item.store}</strong></span>
            <span class="cart-badge-warranty">✓ 1-Year Official Warranty</span>
            <span class="cart-badge-imei">✓ UzIMEI Registered</span>
          </div>
        </div>

        <!-- Price & Quick Actions -->
        <div class="cart-item-actions-col">
          <div class="cart-item-price-val">${item.priceFormatted}</div>
          <div class="cart-item-limit-notice">Limit: 1 unit</div>
          
          <div class="cart-item-btn-group">
            <button class="btn-cart-view-modal" onclick="openProductDetailModal('${item.productId}')">
              ℹ️ Specs
            </button>
            <button class="btn-cart-remove-row" onclick="removeFromCart('${item.productId}')" title="Remove from cart">
              ✕ Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = itemsHTML;

  // Update Summary Card elements
  const totalFormatted = formatPriceUZS(totalSum);
  const subtotalEl = document.getElementById("cartPageSubtotal");
  const totalEl = document.getElementById("cartPageTotal");
  const countBadge = document.getElementById("cartPageItemCount");

  if (subtotalEl) subtotalEl.textContent = totalFormatted;
  if (totalEl) totalEl.textContent = totalFormatted;
  if (countBadge) countBadge.textContent = `${cart.length} ${cart.length === 1 ? 'item' : 'items'}`;
}

// Render quick Cart Drawer on other pages
function renderCartDrawerContent() {
  const container = document.getElementById("cartItemsList");
  const footer = document.getElementById("cartFooter");
  const emptyState = document.getElementById("cartEmptyState");
  if (!container) return;

  const cart = getCart();
  const isSubpage = window.location.pathname.includes("/pages/") || window.location.href.includes("/pages/");
  const imgPrefix = isSubpage ? "../" : "";
  const cartPageLink = isSubpage ? "cart.html" : "pages/cart.html";

  if (cart.length === 0) {
    if (emptyState) emptyState.style.display = "block";
    if (footer) footer.style.display = "none";
    container.innerHTML = `
      <div class="cart-empty-state" style="padding: 40px 20px; text-align: center;">
        <span class="cart-empty-icon" style="font-size: 2.5rem; display: block; margin-bottom: 12px;">🛍️</span>
        <h4 style="font-weight: 700; margin-bottom: 6px;">Your cart is empty</h4>
        <p style="font-size: 0.88rem; color: #86868b; line-height: 1.4;">Add products from the catalog or comparison matrix.</p>
      </div>
    `;
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (footer) footer.style.display = "block";

  let totalSum = 0;
  const itemsHTML = cart.map(item => {
    totalSum += item.price;
    const resolvedImg = imgPrefix + item.image;

    return `
      <div class="cart-drawer-item">
        <div class="cart-drawer-img-box" onclick="openProductDetailModal('${item.productId}')" style="cursor: pointer;" title="View details">
          <img src="${resolvedImg}" alt="${item.name}">
        </div>
        <div class="cart-drawer-info">
          <h4 class="cart-drawer-title" onclick="openProductDetailModal('${item.productId}')" style="cursor: pointer;">${item.name}</h4>
          <div class="cart-drawer-meta">${item.storage} • ${item.color}</div>
          <div class="cart-drawer-store">🏬 ${item.store}</div>
          <div class="cart-drawer-price">${item.priceFormatted}</div>
        </div>
        <button class="cart-drawer-remove" onclick="removeFromCart('${item.productId}')" title="Remove">✕</button>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div style="padding-bottom: 12px;">
      <a href="${cartPageLink}" class="btn-subtle-nav" style="display: block; text-align: center; margin-bottom: 14px; background: #f5f5f7; border-radius: 8px; padding: 8px;">
        Open full Cart page ↗
      </a>
      ${itemsHTML}
    </div>
  `;

  const totalEl = document.getElementById("cartTotalPrice");
  if (totalEl) totalEl.textContent = formatPriceUZS(totalSum);
}

// Drawer Toggle Handlers
function toggleCartDrawer() {
  const drawer = document.getElementById("cartDrawerBackdrop");
  if (drawer) {
    drawer.classList.toggle("open");
  } else {
    // If no drawer, navigate directly to cart subpage
    const isSubpage = window.location.pathname.includes("/pages/") || window.location.href.includes("/pages/");
    window.location.href = isSubpage ? "cart.html" : "pages/cart.html";
  }
}

function closeCartDrawer(e) {
  if (e && e.target && e.target.id === "cartDrawerBackdrop") {
    const drawer = document.getElementById("cartDrawerBackdrop");
    if (drawer) drawer.classList.remove("open");
  }
}

// Finalize Reservation
function proceedCartCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    triggerToast("Your cart is empty. Select devices to reserve.");
    return;
  }

  const nameInput = document.getElementById("cartCustName");
  const phoneInput = document.getElementById("cartCustPhone");
  const storeSelect = document.getElementById("cartPickupStore");

  const custName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : "Valued Customer";
  const storeName = storeSelect ? storeSelect.value : (cart[0].store || "MacBro (C-1)");

  const resModal = document.getElementById("reservationModal");
  if (resModal) {
    const pNameEl = document.getElementById("modalProductName");
    if (pNameEl) {
      pNameEl.textContent = `${cart.length} device(s): ${cart.map(c => c.name).join(", ")}`;
    }
    const storeEl = document.getElementById("modalStoreName");
    if (storeEl) {
      storeEl.textContent = `🏬 Pickup Store: ${storeName} (24-hour hold for ${custName})`;
    }
    resModal.classList.add("active");
  } else {
    alert(`Reservation Confirmed!\nStore: ${storeName}\nDevices: ${cart.map(c => c.name).join(", ")}\nPrice Lock Duration: 24 hours.`);
  }
}

// Toast notification helper
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

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  updateAllCartUI();
});
