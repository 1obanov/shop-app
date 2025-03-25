import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { handleAnimation } from "../utils/handleAnimation";
import { useTogglePopup } from "./useTogglePopup";

export const useWishlistActions = () => {
  const { togglePopup } = useTogglePopup();

  // Function to add a product to the wishlist
  const addToWishlist = async (product) => {
    if (!auth.currentUser) {
      // If the user is not authenticated, show the popup
      togglePopup();
      return;
    }

    const userId = auth.currentUser.uid;
    const wishlistRef = doc(db, "wishlists", userId);

    try {
      const wishlistSnap = await getDoc(wishlistRef);
      const existingWishlist = wishlistSnap.exists()
        ? wishlistSnap.data().items
        : [];

      // Create an updated wishlist by adding the new product
      const updatedWishlist = [
        ...existingWishlist,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          brand: product.brand,
          model: product.model,
          color: product.color,
          ...(!isNaN(product.discountedPrice) && {
            discountedPrice: product.discountedPrice,
          }),
          ...(typeof product.discount !== "undefined" && {
            discount: product.discount,
          }),
        },
      ];

      // Save the updated wishlist to Firestore
      await setDoc(wishlistRef, { items: updatedWishlist });

      // Trigger a "pulse" animation on the wishlist icon
      handleAnimation(".badge--wishlist", "pulse");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  // Function to remove a product from the wishlist
  const removeFromWishlist = async (productId) => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const wishlistRef = doc(db, "wishlists", userId);

    try {
      const wishlistSnap = await getDoc(wishlistRef);
      if (!wishlistSnap.exists()) return;

      const existingWishlist = wishlistSnap.data().items || [];
      const updatedWishlist = existingWishlist.filter(
        (item) => item.id !== productId
      );

      // Save the updated wishlist to Firestore
      await setDoc(wishlistRef, { items: updatedWishlist });

      // Trigger a "pulse" animation on the wishlist icon
      handleAnimation(".badge--wishlist", "pulse");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return { addToWishlist, removeFromWishlist };
};
