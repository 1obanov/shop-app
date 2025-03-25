import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const subscribeToCart = (userId, setUserOrder) => {
  if (!userId) return;

  const userCartRef = doc(db, "carts", userId);

  return onSnapshot(userCartRef, (snapshot) => {
    if (snapshot.exists()) {
      setUserOrder(snapshot.data().items || []);
    } else {
      setUserOrder([]);
    }
  });
};

export { subscribeToCart };
