const cartId = document.body.dataset.cartId;

document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", async () => {
    const pid = btn.dataset.productId;

    await fetch(`/api/cart/${cartId}/products/${pid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: 1 })
    });

    window.location.href = `/cart/${cartId}`;
  });
});
