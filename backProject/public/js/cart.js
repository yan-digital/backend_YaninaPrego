const socket = io();
const cartId = document.querySelector("#cart-container")?.dataset.cartId;

function renderCart(cart) {
  const container = document.getElementById("cart-container");
  if (!container) return;

  if (!cart.products.length) {
    container.innerHTML = "<p>El carrito está vacío 😢</p>";
    return;
  }

  let html = "";
  cart.products.forEach((p) => {
    const subtotal = p.product.price * p.quantity;
    html += `
      <div class="card" data-product-id="${p.product._id}">
        <img src="${p.product.thumbnail}" alt="${p.product.title}">
        <h3>${p.product.title}</h3>
        <p>Precio: $${p.product.price}</p>
        <p>Cantidad: <span class="quantity">${p.quantity}</span></p>
        <p><strong>Subtotal:</strong> $<span class="subtotal">${subtotal}</span></p>
        <button class="increase">➕</button>
        <button class="decrease" ${
          p.quantity === 1 ? "disabled" : ""
        }>➖</button>
        <input type="number" class="quantity-input" value="${
          p.quantity
        }" min="1">
        <button class="delete-product">❌ Eliminar</button>
      </div>
    `;
  });

  html += `<h2>Total: $<span id="cart-total">${cart.products.reduce(
    (acc, p) => acc + p.product.price * p.quantity,
    0
  )}</span></h2>`;
  html += `<button id="clear-cart">🧹 Vaciar carrito</button>`;
  container.innerHTML = html;

  attachEventListeners();
}

socket.on("cartUpdated", ({ cid, cart }) => {
  if (cid === cartId) renderCart(cart);
});

function attachEventListeners() {
  document.querySelectorAll(".increase").forEach((btn) => {
    btn.onclick = async (e) => {
      const id = e.target.closest(".card").dataset.productId;

      await fetch(`/api/cart/${cartId}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: 1 }),
      });
    };
  });

  document.querySelectorAll(".decrease").forEach((btn) => {
    btn.onclick = async (e) => {
      const id = e.target.closest(".card").dataset.productId;

      await fetch(`/api/cart/${cartId}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: -1 }),
      });
    };
  });

  document.querySelectorAll(".delete-product").forEach((btn) => {
    btn.onclick = async (e) => {
      const id = e.target.closest(".card").dataset.productId;
      await fetch(`/api/cart/${cartId}/products/${id}`, { method: "DELETE" });
    };
  });

  const clearCartBtn = document.getElementById("clear-cart");
  if (clearCartBtn) {
    clearCartBtn.onclick = async () => {
      await fetch(`/api/cart/${cartId}`, { method: "DELETE" });
    };
  }
}

attachEventListeners();
