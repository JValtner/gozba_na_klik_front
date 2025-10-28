export function addToCart(restaurantId, meal, quantity, selectedAddons = []) {
  if (!meal || !meal.id) {
    console.error("❌ Pokušaj dodavanja jela bez ID-a u korpu:", meal);
    return;
  }

  const key = `cart_${restaurantId}`;
  const existingCart = JSON.parse(localStorage.getItem(key)) || [];

  const newItem = {
    mealId: meal.id,
    mealName: meal.name,
    mealImagePath: meal.imagePath,
    unitPrice: meal.price,
    quantity: quantity || 1,
    selectedAddons: selectedAddons || [],
  };

  const existingIndex = existingCart.findIndex(
    (item) =>
      item.mealId === newItem.mealId &&
      JSON.stringify((item.selectedAddons || []).map(a => a.id).sort()) ===
        JSON.stringify((newItem.selectedAddons || []).map(a => a.id).sort())
  );

  if (existingIndex >= 0) {
    existingCart[existingIndex].quantity += newItem.quantity;
  } else {
    existingCart.push(newItem);
  }

  localStorage.setItem(key, JSON.stringify(existingCart));
  try {
    localStorage.setItem("last_cart_restaurant_id", String(restaurantId));
  } catch (e) {
    // ignore storage errors
  }
}

export function getCart(restaurantId) {
  const key = `cart_${restaurantId}`;
  const cart = JSON.parse(localStorage.getItem(key)) || [];

  const validCart = cart.filter(item => item.mealId);
  if (validCart.length !== cart.length) {
    console.warn("🧹 Uklonjene neispravne stavke bez mealId iz korpe");
    localStorage.setItem(key, JSON.stringify(validCart));
  }

  return validCart;
}

export function removeFromCart(restaurantId, index) {
  const key = `cart_${restaurantId}`;
  const cart = getCart(restaurantId);
  cart.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(cart));
}

export function clearCart(restaurantId) {
  const key = `cart_${restaurantId}`;
  localStorage.removeItem(key);
}

export function updateCartItemQuantity(restaurantId, index, newQuantity) {
  const key = `cart_${restaurantId}`;
  const cart = getCart(restaurantId);
  if (cart[index]) {
    cart[index].quantity = newQuantity;
    localStorage.setItem(key, JSON.stringify(cart));
  }
}

export function getCartItemCount(restaurantId) {
  const key = `cart_${restaurantId}`;
  const cart = getCart(restaurantId);
  return cart.reduce((total, item) => total + item.quantity, 0);
}
