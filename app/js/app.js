const products = [
  { id: "canton", name: "Lucky Me Pancit Canton", price: 18, cat: "merienda", blurb: "Classic chili mansi, ready in 3 minutes.", emoji: "🍜", swatch: "#f4c430" },
  { id: "piattos", name: "Piattos Cheese", price: 22, cat: "merienda", blurb: "Chichirya pambata at pampulutan.", emoji: "🧀", swatch: "#ffcc80" },
  { id: "skyflakes", name: "SkyFlakes Crackers", price: 12, cat: "merienda", blurb: "Pang-almusal with kape or sardinas.", emoji: "🍪", swatch: "#bbdefb" },
  { id: "chippy", name: "Chippy BBQ", price: 16, cat: "merienda", blurb: "After-school staple. Crunchy, smoky.", emoji: "🍟", swatch: "#ef9a9a" },
  { id: "coke", name: "Coke 1.5L", price: 75, cat: "inumin", blurb: "Malamig from the cooler. Family size.", emoji: "🥤", swatch: "#e53935" },
  { id: "royal", name: "Royal Tru-Orange 1.5L", price: 72, cat: "inumin", blurb: "Pamparty at pambiryahan sa kanto.", emoji: "🍊", swatch: "#fb8c00" },
  { id: "c2", name: "C2 Apple 230ml", price: 20, cat: "inumin", blurb: "Iced tea in a bottle. Hapon favorite.", emoji: "🍏", swatch: "#81c784" },
  { id: "sting", name: "Sting Energy", price: 28, cat: "inumin", blurb: "Pang-gabi sa construction at overtime.", emoji: "⚡", swatch: "#ce93d8" },
  { id: "rice", name: "Bigas (per kilo)", price: 58, cat: "groceries", blurb: "Sinandomeng, sako or kilo-kilo.", emoji: "🍚", swatch: "#fff8e1" },
  { id: "tuna", name: "Century Tuna Flakes", price: 38, cat: "groceries", blurb: "Ulam emergency. Oil or spicy.", emoji: "🐟", swatch: "#90caf9" },
  { id: "corned", name: "Argentina Corned Beef", price: 48, cat: "groceries", blurb: "Breakfast with rice and itlog.", emoji: "🥩", swatch: "#ef9a9a" },
  { id: "bear", name: "Bear Brand 33g", price: 15, cat: "groceries", blurb: "Gatas sa umaga. Sachet handy pack.", emoji: "🥛", swatch: "#ffe082" },
  { id: "soy", name: "Silver Swan Soy Sauce", price: 32, cat: "groceries", blurb: "Pantimpla ng adobo at pancit.", emoji: "🫗", swatch: "#bcaaa4" },
  { id: "magic", name: "Magic Sarap 8g", price: 8, cat: "groceries", blurb: "One sachet, buong kawali.", emoji: "✨", swatch: "#fff59d" },
  { id: "egg", name: "Itlog (per piece)", price: 9, cat: "groceries", blurb: "Fresh from the tray. Medium size.", emoji: "🥚", swatch: "#ffe0b2" },
  { id: "surf", name: "Surf Powder 70g", price: 12, cat: "bahay", blurb: "Labahan ng damit, mabango pa.", emoji: "🧺", swatch: "#4fc3f7" },
  { id: "safeguard", name: "Safeguard White", price: 28, cat: "bahay", blurb: "Sabon pampaligo ng buong pamilya.", emoji: "🧼", swatch: "#b3e5fc" },
  { id: "colgate", name: "Colgate Sachet", price: 10, cat: "bahay", blurb: "Toothpaste pang-uod ng budget.", emoji: "😁", swatch: "#e0f7fa" },
  { id: "yelo", name: "Yelo (plastic bag)", price: 15, cat: "bahay", blurb: "Pang-cooler at pang-inuman.", emoji: "🧊", swatch: "#e3f2fd" },
  { id: "load100", name: "Regular Load ₱100", price: 100, cat: "load", blurb: "Globe / Smart / DITO. Promo +₱20 today.", emoji: "📱", swatch: "#c5e1a5" },
  { id: "load50", name: "Regular Load ₱50", price: 50, cat: "load", blurb: "Pang-text at pang-data muna.", emoji: "💬", swatch: "#dcedc8" },
  { id: "data", name: "Unli Data Promo", price: 99, cat: "load", blurb: "Ask Aling Rosa which promo is live.", emoji: "📡", swatch: "#a5d6a7" },
];

const grid = document.querySelector("[data-product-grid]");
const cartItemsEl = document.querySelector("[data-cart-items]");
const cartCountEl = document.querySelector("[data-cart-count]");
const cartTotalEl = document.querySelector("[data-cart-total]");
const drawer = document.querySelector("[data-cart-drawer]");
const backdrop = document.querySelector("[data-cart-backdrop]");
const toastEl = document.querySelector("[data-toast]");
const yearEl = document.querySelector("[data-year]");

const cart = new Map();
let activeFilter = "all";
let toastTimer;

function peso(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.hidden = true;
  }, 2200);
}

function renderProducts() {
  const list = products.filter((item) => activeFilter === "all" || item.cat === activeFilter);
  grid.innerHTML = list
    .map(
      (item) => `
      <article class="product-card">
        <div class="product-swatch" style="background:${item.swatch}">${item.emoji}</div>
        <h3>${item.name}</h3>
        <p class="price">${peso(item.price)}</p>
        <p>${item.blurb}</p>
        <button class="btn btn-primary" type="button" data-add="${item.id}">Dagdag sa bayong</button>
      </article>`
    )
    .join("");
}

function cartEntries() {
  return [...cart.entries()].map(([id, qty]) => {
    const product = products.find((item) => item.id === id);
    return { ...product, qty };
  });
}

function cartTotal() {
  return cartEntries().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  const items = cartEntries();
  cartCountEl.textContent = items.reduce((sum, item) => sum + item.qty, 0);
  cartTotalEl.textContent = peso(cartTotal());

  if (!items.length) {
    cartItemsEl.innerHTML = "<p>Walang laman pa ang bayong. Magdagdag mula sa estante.</p>";
    return;
  }

  cartItemsEl.innerHTML = items
    .map(
      (item) => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong>
          <div>${peso(item.price)} × ${item.qty}</div>
        </div>
        <div class="qty-row">
          <button type="button" data-dec="${item.id}" aria-label="Decrease">−</button>
          <span>${item.qty}</span>
          <button type="button" data-inc="${item.id}" aria-label="Increase">+</button>
        </div>
      </div>`
    )
    .join("");
}

function addToCart(id) {
  cart.set(id, (cart.get(id) ?? 0) + 1);
  renderCart();
  const product = products.find((item) => item.id === id);
  showToast(`${product.name} nasa bayong na.`);
}

function setQty(id, next) {
  if (next <= 0) cart.delete(id);
  else cart.set(id, next);
  renderCart();
}

function openCart() {
  drawer.hidden = false;
  backdrop.hidden = false;
}

function closeCart() {
  drawer.hidden = true;
  backdrop.hidden = true;
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((el) => el.classList.toggle("is-active", el === button));
    renderProducts();
  });
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

cartItemsEl.addEventListener("click", (event) => {
  const inc = event.target.closest("[data-inc]");
  const dec = event.target.closest("[data-dec]");
  if (inc) setQty(inc.dataset.inc, (cart.get(inc.dataset.inc) ?? 0) + 1);
  if (dec) setQty(dec.dataset.dec, (cart.get(dec.dataset.dec) ?? 0) - 1);
});

document.querySelector("[data-open-cart]").addEventListener("click", openCart);
document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);

document.querySelector("[data-checkout]").addEventListener("click", () => {
  if (!cart.size) {
    showToast("Pili muna ng paninda, suki.");
    return;
  }
  const method = document.querySelector("[data-pay-method]").value;
  const payLabel = method === "gcash" ? "GCash" : "cash sa pickup";
  showToast(`Reserved! Bayad via ${payLabel}. Kita tayo sa tindahan.`);
  cart.clear();
  renderCart();
  closeCart();
});

document.querySelector("[data-pickup-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("[data-form-status]");
  const name = new FormData(form).get("name");
  status.hidden = false;
  status.textContent = `Salamat, ${name}. Tatawag si Aling Rosa para sa pickup.`;
  form.reset();
});

yearEl.textContent = new Date().getFullYear();
renderProducts();
renderCart();
