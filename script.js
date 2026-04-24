// ---- DATA ----
const products = [
  { id:0, name:'Swiss Precision Chronograph', brand:'Maison Royale', price:1299, oldPrice:1999, image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', rating:4.9, reviews:128, badge:'sale', category:'watches' },
  { id:1, name:'Midnight Rose Eau de Parfum', brand:'Parfums de Paris', price:285, oldPrice:null, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop', rating:4.8, reviews:94, badge:'new', category:'fragrance' },
  { id:2, name:'Quilted Lambskin Clutch', brand:'Atelier LV', price:1850, oldPrice:null, image:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop', rating:4.9, reviews:67, badge:'hot', category:'accessories' },
  { id:3, name:'Diamond Halo Tennis Bracelet', brand:'Orfèvre', price:3200, oldPrice:3800, image:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop', rating:5.0, reviews:41, badge:'sale', category:'jewelry' },
  { id:4, name:'Tourbillon Skeleton Watch', brand:'Horlogerie Suisse', price:8900, oldPrice:null, image:'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop', rating:4.9, reviews:22, badge:'new', category:'watches' },
  { id:5, name:'Oud Noir Intense Parfum', brand:'Maison Orient', price:420, oldPrice:null, image:'https://images.unsplash.com/photo-1541643600914-78b084683633?w=400&h=400&fit=crop', rating:4.7, reviews:156, badge:'hot', category:'fragrance' },
  { id:6, name:'Grain Leather Tote Bag', brand:'Studio Craft', price:1100, oldPrice:1400, image:'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop', rating:4.8, reviews:83, badge:'sale', category:'accessories' },
  { id:7, name:'Pearl & Gold Necklace Set', brand:'Orfèvre', price:2100, oldPrice:null, image:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop', rating:4.9, reviews:59, badge:'new', category:'jewelry' },
];

let cart = [];
let wishlist = [];
let currentFilter = 'all';

// ---- LOADER ----
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    renderProducts('all');
    animateStats();
  }, 1800);
});

// ---- CURSOR ----
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => { ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px'; }, 80);
});
document.addEventListener('mousedown', () => { cursor.style.transform = 'translate(-50%,-50%) scale(0.6)'; });
document.addEventListener('mouseup', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; });

// ---- NAV SCROLL ----
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 80);
  revealOnScroll();
});

// ---- SCROLL REVEAL ----
function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('visible');
  });
}
revealOnScroll();

// ---- STATS COUNTER ----
function animateStats() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = +el.dataset.target;
    let count = 0;
    const step = target / 80;
    const interval = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = (target >= 1000 ? Math.round(count).toLocaleString() : Math.round(count)) + (el.nextElementSibling?.textContent.includes('%') ? '%' : '+');
      if (count >= target) clearInterval(interval);
    }, 20);
  });
}

// ---- PRODUCTS ----
function renderProducts(filter) {
  const grid = document.getElementById('productsGrid');
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  grid.innerHTML = '';
  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = (i * 0.08) + 's';
    card.innerHTML = `
      <div class="product-img">
        <img src="${p.image}" alt="${p.name}" />
        <span class="product-badge badge-${p.badge}">${p.badge.toUpperCase()}</span>
        <div class="product-actions">
          <button class="action-btn" onclick="addToCart(${p.id})">Add to Cart</button>
          <button class="action-btn icon-btn wishlist-btn" onclick="toggleWishlist(${p.id},this)" title="Wishlist">🤍</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.floor(p.rating))}${p.rating % 1 >= 0.5 ? '☆' : ''}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price-current">$${p.price.toLocaleString()}</span>
          ${p.oldPrice ? `<span class="price-old">$${p.oldPrice.toLocaleString()}</span>` : ''}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterProducts(filter, btn) {
  currentFilter = filter;
  if (btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  renderProducts(filter);
  if (btn) document.getElementById('products').scrollIntoView({ behavior:'smooth', block:'start' });
}

// ---- CART ----
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  updateCartUI();
  showToast(`<strong>${product.name}</strong> added to cart!`);
}

function addProductById(id) { addToCart(id); }

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
  renderCartItems();
}

function updateQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const count = cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = '$' + total.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
  renderCartItems();
}

function renderCartItems() {
  const el = document.getElementById('cartItems');
  if (cart.length === 0) {
    el.innerHTML = `<div class="empty-cart"><span class="empty-cart-icon">🛒</span><p>Your cart is empty</p><p style="font-size:13px;color:var(--muted);margin-top:8px">Add some luxury items to get started</p></div>`;
    return;
  }
  el.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji"><img src="${item.image}" alt="${item.name}" /></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id},1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑</button>
    </div>
  `).join('');
}

function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  renderCartItems();
}

function closeCartOnOverlay(e) {
  if (e.target === e.currentTarget) toggleCart();
}

function checkout() {
  if (cart.length === 0) { showToast('Your cart is empty!'); return; }
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  showToast(`✅ Order placed! Total: <strong>$${total.toLocaleString()}</strong>`);
  cart = [];
  updateCartUI();
  toggleCart();
}

// ---- WISHLIST ----
function toggleWishlist(id, btn) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    btn.textContent = '❤️';
    btn.classList.add('liked');
    showToast('Added to <strong>Wishlist</strong>');
  } else {
    wishlist.splice(idx, 1);
    btn.textContent = '🤍';
    btn.classList.remove('liked');
  }
  document.getElementById('wishlistCount').textContent = wishlist.length;
}

// ---- TOAST ----
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').innerHTML = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---- SEARCH ----
function toggleSearch() {
  document.getElementById('searchBar').classList.toggle('open');
  if (document.getElementById('searchBar').classList.contains('open')) {
    setTimeout(() => document.getElementById('searchInput').focus(), 400);
  }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.getElementById('searchBar').classList.remove('open');
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); toggleSearch(); }
});

// ---- NEWSLETTER ----
function subscribeNewsletter() {
  const email = document.getElementById('emailInput').value;
  if (!email || !email.includes('@')) { showToast('Please enter a valid email'); return; }
  showToast(`🎉 Welcome! <strong>${email}</strong> is now subscribed`);
  document.getElementById('emailInput').value = '';
}

// ---- COUNTDOWN ----
let saleEnd = new Date();
saleEnd.setHours(saleEnd.getHours() + 8, saleEnd.getMinutes() + 34);
function updateCountdown() {
  const now = new Date();
  let diff = Math.max(0, saleEnd - now);
  const h = Math.floor(diff / 3600000);
  diff %= 3600000;
  const m = Math.floor(diff / 60000);
  diff %= 60000;
  const s = Math.floor(diff / 1000);
  const pad = n => String(n).padStart(2,'0');
  document.getElementById('cd-hours').textContent = pad(h);
  document.getElementById('cd-mins').textContent = pad(m);
  document.getElementById('cd-secs').textContent = pad(s);
}
setInterval(updateCountdown, 1000);
updateCountdown();