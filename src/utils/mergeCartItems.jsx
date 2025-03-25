// Function to merge items from Firebase cart and local cart
const mergeCartItems = (firebaseCart, localCart) => {
  const mergedCart = [...firebaseCart];

  localCart.forEach((localItem) => {
    const existingItemIndex = mergedCart.findIndex(
      (item) => item.id === localItem.id
    );

    if (existingItemIndex !== -1) {
      // If the item already exists, increase the quantity (limit to 20)
      mergedCart[existingItemIndex].quantity = Math.min(
        mergedCart[existingItemIndex].quantity + localItem.quantity,
        20
      );
    } else {
      // If the item doesn't exist, add it with a quantity limited to 20
      mergedCart.push({
        ...localItem,
        quantity: Math.min(localItem.quantity, 20),
      });
    }
  });

  return mergedCart;
};

export { mergeCartItems };
