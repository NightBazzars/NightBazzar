const products = [
  {
    title: "Creator Launch Kit",
    seller: "Studio North",
    category: "Design",
    type: "Templates",
    price: "$29",
    priceValue: 29,
    rating: "4.9",
    ratingValue: 4.9,
    sales: "2.4k",
    preview: "UI",
    accent: "mint",
    instantDownload: true,
    protectedDelivery: true,
    description: "Landing pages, checkout blocks, and creator storefront layouts."
  },
  {
    title: "Cinematic Sound Pack",
    seller: "Waveforge",
    category: "Audio",
    type: "Audio",
    price: "$18",
    priceValue: 18,
    rating: "4.8",
    ratingValue: 4.8,
    sales: "940",
    preview: "WAV",
    accent: "amber",
    instantDownload: true,
    protectedDelivery: true,
    description: "Loops, hits, risers, and ambient beds for video projects."
  },
  {
    title: "SaaS Icon Library",
    seller: "Glyph Lab",
    category: "Design",
    type: "Design",
    price: "$34",
    priceValue: 34,
    rating: "5.0",
    ratingValue: 5,
    sales: "1.8k",
    preview: "SVG",
    accent: "blue",
    instantDownload: true,
    protectedDelivery: true,
    description: "A crisp icon set for dashboards, docs, and product UIs."
  },
  {
    title: "Next.js Commerce Blocks",
    seller: "Code Harbor",
    category: "Code",
    type: "Code",
    price: "$49",
    priceValue: 49,
    rating: "4.7",
    ratingValue: 4.7,
    sales: "720",
    preview: "TSX",
    accent: "rose",
    instantDownload: true,
    protectedDelivery: true,
    description: "Checkout, pricing, auth, and account components for app builders."
  },
  {
    title: "Motion Promo Templates",
    seller: "Frame Foundry",
    category: "Video",
    type: "Video",
    price: "$35",
    priceValue: 35,
    rating: "4.9",
    ratingValue: 4.9,
    sales: "1.1k",
    preview: "MP4",
    accent: "blue",
    instantDownload: true,
    protectedDelivery: false,
    description: "Reusable product reveal scenes and social launch clips."
  },
  {
    title: "Marketplace Basics Course",
    seller: "Build School",
    category: "Course",
    type: "Course",
    price: "$24",
    priceValue: 24,
    rating: "4.6",
    ratingValue: 4.6,
    sales: "510",
    preview: "VID",
    accent: "mint",
    instantDownload: false,
    protectedDelivery: true,
    description: "A beginner-friendly intro to hosting, servers, and storefronts."
  }
];

const productGrid = document.querySelector("#product-grid");
const resultCount = document.querySelector("#result-count");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const categoryButtons = document.querySelectorAll(".category[data-category]");
const priceFilter = document.querySelector("#price-filter");
const priceValue = document.querySelector("#price-value");
const ratingFilter = document.querySelector("#rating-filter");
const panelCategoryInputs = document.querySelectorAll("[data-panel-category]");
const instantDownloadFilter = document.querySelector("#instant-download");
const protectedDeliveryFilter = document.querySelector("#protected-delivery");
const resetFiltersButton = document.querySelector("#reset-filters");
const collapseButtons = document.querySelectorAll("[data-collapse-toggle]");

let activeCategory = "All";
let activeSearch = "";
let maxPrice = Number(priceFilter.value);
let minRating = Number(ratingFilter.value);
let requireInstantDownload = instantDownloadFilter.checked;
let requireProtectedDelivery = protectedDeliveryFilter.checked;

function selectedPanelCategories() {
  return Array.from(panelCategoryInputs)
    .filter((input) => input.checked)
    .map((input) => input.dataset.panelCategory);
}

function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "productCard";

  article.innerHTML = `
    <div class="productVisual ${product.accent}">
      <span>${product.preview}</span>
      <button class="iconButton floating" type="button" aria-label="Save ${product.title}" title="Save">H</button>
    </div>
    <div class="productBody">
      <div class="productMeta">
        <span>${product.type}</span>
        <span>* ${product.rating}</span>
      </div>
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <div class="sellerRow">
        <span>${product.seller}</span>
        <span>${product.sales} sales</span>
      </div>
      <div class="productFooter">
        <strong>${product.price}</strong>
        <button class="secondaryButton compact" type="button">View</button>
      </div>
    </div>
  `;

  return article;
}

function productMatchesSearch(product) {
  const searchableText = `${product.title} ${product.seller} ${product.category} ${product.description}`;
  return searchableText.toLowerCase().includes(activeSearch.toLowerCase());
}

function renderProducts() {
  const selectedCategories = selectedPanelCategories();

  const visibleProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesPanelCategory = selectedCategories.includes(product.category);
    const matchesPrice = product.priceValue <= maxPrice;
    const matchesRating = product.ratingValue >= minRating;
    const matchesInstant = !requireInstantDownload || product.instantDownload;
    const matchesProtected = !requireProtectedDelivery || product.protectedDelivery;

    return (
      matchesCategory &&
      matchesPanelCategory &&
      matchesPrice &&
      matchesRating &&
      matchesInstant &&
      matchesProtected &&
      productMatchesSearch(product)
    );
  });

  productGrid.innerHTML = "";

  if (visibleProducts.length === 0) {
    productGrid.innerHTML = `<div class="emptyState">No products found. Try another category or search term.</div>`;
  } else {
    visibleProducts.forEach((product) => {
      productGrid.appendChild(createProductCard(product));
    });
  }

  const label = visibleProducts.length === 1 ? "product" : "products";
  resultCount.textContent = `${visibleProducts.length} ${label}`;
}

function updatePriceLabel() {
  priceValue.textContent = `$${maxPrice}`;
}

function resetFilters() {
  activeCategory = "All";
  activeSearch = "";
  maxPrice = 60;
  minRating = 0;
  requireInstantDownload = false;
  requireProtectedDelivery = false;

  searchInput.value = "";
  priceFilter.value = String(maxPrice);
  ratingFilter.value = String(minRating);
  instantDownloadFilter.checked = false;
  protectedDeliveryFilter.checked = false;

  panelCategoryInputs.forEach((input) => {
    input.checked = true;
  });

  categoryButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.category === "All");
  });

  updatePriceLabel();
  renderProducts();
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    categoryButtons.forEach((categoryButton) => {
      categoryButton.classList.toggle("active", categoryButton === button);
    });

    renderProducts();
  });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  activeSearch = searchInput.value.trim();
  renderProducts();
});

searchInput.addEventListener("input", () => {
  activeSearch = searchInput.value.trim();
  renderProducts();
});

priceFilter.addEventListener("input", () => {
  maxPrice = Number(priceFilter.value);
  updatePriceLabel();
  renderProducts();
});

ratingFilter.addEventListener("change", () => {
  minRating = Number(ratingFilter.value);
  renderProducts();
});

panelCategoryInputs.forEach((input) => {
  input.addEventListener("change", renderProducts);
});

instantDownloadFilter.addEventListener("change", () => {
  requireInstantDownload = instantDownloadFilter.checked;
  renderProducts();
});

protectedDeliveryFilter.addEventListener("change", () => {
  requireProtectedDelivery = protectedDeliveryFilter.checked;
  renderProducts();
});

resetFiltersButton.addEventListener("click", resetFilters);

collapseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(`#${button.getAttribute("aria-controls")}`);
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const indicator = button.querySelector("span:last-child");

    button.setAttribute("aria-expanded", String(!isExpanded));
    target.classList.toggle("isCollapsed", isExpanded);
    indicator.textContent = isExpanded ? "+" : "-";
  });
});

updatePriceLabel();
renderProducts();
