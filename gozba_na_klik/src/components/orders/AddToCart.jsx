export const addToCart = (restaurantId, meal, quantity = 1, selectedAddons = []) => {
  const cartKey = `cart_${restaurantId}`;
  const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");

  const existingItemIndex = cart.findIndex(
    item => item.mealId === meal.id && 
    JSON.stringify(item.selectedAddons) === JSON.stringify(selectedAddons)
  );

  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      mealId: meal.id,
      mealName: meal.name,
      mealImagePath: meal.imagePath,
      unitPrice: meal.price,
      quantity: quantity,
      selectedAddons: selectedAddons
    });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  return cart;
};

export const updateCartItemQuantity = (restaurantId, itemIndex, newQuantity) => {
  const cartKey = `cart_${restaurantId}`;
  const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
  
  if (itemIndex >= 0 && itemIndex < cart.length) {
    if (newQuantity > 0) {
      cart[itemIndex].quantity = newQuantity;
    } else {
      cart.splice(itemIndex, 1);
    }
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }
  
  return cart;
};

export const removeFromCart = (restaurantId, index) => {
  const cartKey = `cart_${restaurantId}`;
  const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
  
  cart.splice(index, 1);
  localStorage.setItem(cartKey, JSON.stringify(cart));
  return cart;
};

export const getCart = (restaurantId) => {
  const cartKey = `cart_${restaurantId}`;
  return JSON.parse(localStorage.getItem(cartKey) || "[]");
};

export const clearCart = (restaurantId) => {
  const cartKey = `cart_${restaurantId}`;
  localStorage.removeItem(cartKey);
};

export const getCartItemCount = (restaurantId) => {
  const cart = getCart(restaurantId);
  return cart.reduce((total, item) => total + item.quantity, 0);
};