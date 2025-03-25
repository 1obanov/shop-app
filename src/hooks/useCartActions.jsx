import { useContext } from "react";
import { ShopContext } from "../context/context";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { handleAnimation } from "../utils/handleAnimation";
import { handleToastCart } from "../utils/handleToastCart";
import { mergeCartItems } from "../utils/mergeCartItems";

export const useCartActions = () => {
  const { dispatch } = useContext(ShopContext);

  // Function to add an item to the cart
  const addToCart = async (cart, product) => {
    // Handle the toast notification for adding to cart
    const isSuccess = handleToastCart({
      cart: cart,
      ...product,
    });

    if (!isSuccess) return;

    if (auth.currentUser) {
      // If the user is authenticated, update their cart in Firebase
      const userCartRef = doc(db, "carts", auth.currentUser.uid);
      try {
        const cartSnap = await getDoc(userCartRef);
        const existingCart = cartSnap.exists() ? cartSnap.data().items : [];

        // Merge the existing cart items with the new product (if it's not already in the cart)
        const updatedCart = mergeCartItems(existingCart, [product]);

        // Save the updated cart to Firestore
        await setDoc(userCartRef, { items: updatedCart });
      } catch (error) {
        console.error("Error saving cart to Firebase:", error);
      }
    } else {
      // If the user is not authenticated, update the local cart state
      dispatch({ type: "ADD_TO_BASKET", payload: product });
    }

    // Trigger a "pulse" animation on the cart icon
    handleAnimation(".badge--basket", "pulse");
  };

  // Function to remove an item from the cart
  const removeFromCart = async (productId) => {
    if (auth.currentUser) {
      // If the user is authenticated, remove the item from their cart in Firebase
      const userId = auth.currentUser.uid;
      const cartRef = doc(db, "carts", userId);

      try {
        const cartSnap = await getDoc(cartRef);
        if (!cartSnap.exists()) return;

        const existingCart = cartSnap.data().items || [];
        const updatedCart = existingCart.filter(
          (item) => item.id !== productId
        );

        // Update the cart in Firestore with the new list of items
        await setDoc(cartRef, { items: updatedCart });
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    } else {
      // If the user is not authenticated, update the local cart state
      dispatch({ type: "REMOVE_FROM_BASKET", payload: productId });
    }

    // Trigger a "pulse" animation on the cart icon
    handleAnimation(".badge--basket", "pulse");
  };

  return { addToCart, removeFromCart };
};
