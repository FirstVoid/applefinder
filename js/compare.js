// Apple Finder Tashkent — Interactive Compare Engine
// Compares 2 to 4 Apple products side by side with live specs, prices & cart

let activeCompareIds = ["iphone-17-pro-max", "iphone-16-pro-max", "iphone-17-air"];

document.addEventListener("DOMContentLoaded", () => {
  renderCompareTable();
  if (typeof updateAllCartUI === "function") {
    updateAllCartUI();
  }
});

function getProductById(id) {
  if (typeof PRODUCTS_DATA !== "undefined") {
    return PRODUCTS_DATA.find(p => p.id === id) || null;
  }
  return null;
}

function renderCompareTable() {
  const tableContainer = document.getElementById("compareTableContainer");
  if (!tableContainer) return;

  const products = activeCompareIds.map(id => getProductById(id)).filter(Boolean);

  // Build header row with selectors
  let theadHTML = `
    <tr>
      <th class="compare-spec-col">
        <div class="compare-spec-header-box">
          <span class="compare-col-label">Specifications</span>
          <button class="btn-preset-reset" onclick="resetToDefaultComparison()">Reset</button>
        </div>
      </th>
  `;

  products.forEach((prod, idx) => {
    // Generate dropdown options with category grouping
    let optionsHTML = "";
    const categories = ["iPhone", "MacBook", "iPad", "Apple Watch", "AirPods"];
    categories.forEach(cat => {
      const catProds = PRODUCTS_DATA.filter(p => p.category === cat);
      optionsHTML += `<optgroup label="${cat}">`;
      catProds.forEach(p => {
        const isSelected = (p.id === prod.id) ? "selected" : "";
        optionsHTML += `<option value="${p.id}" ${isSelected}>${p.name}</option>`;
      });
      optionsHTML += `</optgroup>`;
    });

    const colorDots = prod.colors.map(c => `
      <span class="color-dot" style="background: ${c.hex};" title="${c.name}"></span>
    `).join("");

    const inCart = (typeof isProductInCart === "function") && isProductInCart(prod.id);

    theadHTML += `
      <th class="compare-prod-col">
        <div class="compare-card-head">
          <div class="compare-card-top-bar">
            <span class="compare-badge">${prod.badge || 'Verified'}</span>
            ${products.length > 2 ? `<button class="btn-remove-compare-col" onclick="removeCompareDevice(${idx})" title="Remove column">✕</button>` : ''}
          </div>
          
          <div class="compare-selector-wrap">
            <select class="compare-device-select" onchange="changeCompareDevice(${idx}, this.value)">
              ${optionsHTML}
            </select>
          </div>

          <div class="compare-card-img-box" onclick="openProductDetailModal('${prod.id}')" style="cursor: pointer;" title="View Specifications">
            <img src="../${prod.image}" alt="${prod.name}" class="compare-card-img">
          </div>

          <div class="compare-card-colors">
            ${colorDots}
          </div>

          <h3 class="compare-card-title" onclick="openProductDetailModal('${prod.id}')" style="cursor: pointer;" title="View Product Details">${prod.name}</h3>
          <div class="compare-card-price">${prod.priceFormatted}</div>
          <div class="compare-card-store">🏬 ${prod.defaultStore}</div>

          <button class="btn-primary compare-add-cart-btn ${inCart ? 'btn-in-cart' : ''}" data-compare-product-id="${prod.id}" onclick="addToCart('${prod.id}')">
            ${inCart ? '✓ In Cart' : '+ 🛍️ Add to Cart'}
          </button>
        </div>
      </th>
    `;
  });

  // Add "+" column button if fewer than 4 items
  if (products.length < 4) {
    theadHTML += `
      <th class="compare-add-col-th">
        <button class="btn-add-compare-col" onclick="addCompareDevice()">
          <span class="plus-icon">+</span>
          <span>Add Device</span>
        </button>
      </th>
    `;
  }

  theadHTML += `</tr>`;

  // Specification Rows Data
  const specRows = [
    {
      title: "Category & Series",
      extract: p => `<strong>${p.category}</strong> (${p.series})`
    },
    {
      title: "Starting Price (UZS)",
      extract: p => `<span class="spec-highlight-price">${p.priceFormatted}</span>`
    },
    {
      title: "Processor & Silicon",
      extract: p => `<strong>${p.chip}</strong>`
    },
    {
      title: "Display & Screen",
      extract: p => p.screen || "Retina OLED Display"
    },
    {
      title: "Battery & Endurance",
      extract: p => p.battery || "All-day battery life"
    },
    {
      title: "Camera & Optics / Sensors",
      extract: p => p.camera || "Advanced sensor array"
    },
    {
      title: "Materials & Build",
      extract: p => p.materials || "Premium aluminum / aerospace titanium"
    },
    {
      title: "Weight",
      extract: p => p.weight || "Lightweight design"
    },
    {
      title: "Storage Capacities",
      extract: p => (p.storage && p.storage.length > 0) ? p.storage.join(" • ") : "Standard Configuration"
    },
    {
      title: "Available Finishes",
      extract: p => p.colors.map(c => c.name).join(", ")
    },
    {
      title: "Authorized Tashkent Store",
      extract: p => `📍 ${p.defaultStore} (In stock, 1 Yr Warranty)`
    }
  ];

  let tbodyHTML = "";
  specRows.forEach((row, rIdx) => {
    const isAlt = rIdx % 2 === 0 ? "class='alt-row'" : "";
    tbodyHTML += `<tr ${isAlt}><td class="spec-name-cell">${row.title}</td>`;
    products.forEach(p => {
      tbodyHTML += `<td class="spec-val-cell">${row.extract(p)}</td>`;
    });
    if (products.length < 4) {
      tbodyHTML += `<td class="empty-col-cell"></td>`;
    }
    tbodyHTML += `</tr>`;
  });

  tableContainer.innerHTML = `
    <table class="compare-main-table">
      <thead>${theadHTML}</thead>
      <tbody>${tbodyHTML}</tbody>
    </table>
  `;

  // Update header count
  const countBadge = document.getElementById("compareActiveCount");
  if (countBadge) countBadge.textContent = `${products.length} / 4 Devices (Max 4)`;
}

function changeCompareDevice(colIndex, newId) {
  activeCompareIds[colIndex] = newId;
  renderCompareTable();
  triggerToast(`Loaded ${getProductById(newId)?.name || 'device'} into comparison`);
}

function removeCompareDevice(colIndex) {
  if (activeCompareIds.length <= 2) {
    triggerToast("Minimum 2 devices required for comparison");
    return;
  }
  const removed = getProductById(activeCompareIds[colIndex]);
  activeCompareIds.splice(colIndex, 1);
  renderCompareTable();
  triggerToast(`Removed ${removed?.name || 'device'} from comparison`);
}

function addCompareDevice() {
  if (activeCompareIds.length >= 4) {
    triggerToast("⚠️ Limit reached: maximum 4 devices can be compared simultaneously");
    return;
  }
  // Pick a device not already compared
  const available = PRODUCTS_DATA.find(p => !activeCompareIds.includes(p.id));
  if (available) {
    activeCompareIds.push(available.id);
    renderCompareTable();
    triggerToast(`Added ${available.name} (${activeCompareIds.length}/4)`);
  }
}

function setComparePreset(presetList) {
  activeCompareIds = presetList.slice(0, 4);
  renderCompareTable();
  const first = getProductById(presetList[0]);
  const second = getProductById(presetList[1]);
  triggerToast(`Preset loaded: ${first?.name || ''} vs ${second?.name || ''}`);
  
  // Smooth scroll down to table
  const table = document.getElementById("compareTableContainer");
  if (table) {
    table.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function resetToDefaultComparison() {
  activeCompareIds = ["iphone-17-pro-max", "iphone-16-pro-max", "iphone-17-air"];
  renderCompareTable();
  triggerToast("Comparison reset to 2025–2026 flagships");
}

// Unified Cart synchronization: compare page uses js/cart.js

