import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export function subscribeToOrders(userId, callback) {
  if (!userId) return;

  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", userId));

  return onSnapshot(q, (querySnapshot) => {
    const updatedOrders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(updatedOrders);
  });
}
