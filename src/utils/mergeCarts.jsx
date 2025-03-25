import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { mergeCartItems } from "./mergeCartItems";

// Function to merge carts (local and Firebase)
const mergeCarts = async (userId) => {
  if (!userId) return;

  const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
  const userCartRef = doc(db, "carts", userId);

  try {
    const userCartSnap = await getDoc(userCartRef);
    let firebaseCart = userCartSnap.exists() ? userCartSnap.data().items : [];

    // Merge the local and Firebase carts
    const mergedCart = mergeCartItems(firebaseCart, localCart);

    // Save the merged cart back to Firebase
    await setDoc(userCartRef, { items: mergedCart });

    // Clear the localStorage after successful merging
    localStorage.removeItem("cartItems");

    return mergedCart;
  } catch (error) {
    console.error("Error merging carts:", error);
    return [];
  }
};

export { mergeCarts };
