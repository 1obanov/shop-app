import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const subscribeToWishlist = (userId, setUserWishlist) => {
  if (!userId) return;

  const userWishlistRef = doc(db, "wishlists", userId);

  return onSnapshot(userWishlistRef, (snapshot) => {
    if (snapshot.exists()) {
        setUserWishlist(snapshot.data().items || []);
    } else {
        setUserWishlist([]);
    }
  });
};

export { subscribeToWishlist };