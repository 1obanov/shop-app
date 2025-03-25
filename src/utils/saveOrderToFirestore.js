import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

// Function to save an order to Firestore
export async function saveOrderToFirestore(order) {
  try {
    const docRef = await addDoc(collection(db, "orders"), order);
    return docRef.id;
  } catch (error) {
    console.error("Error adding order:", error);
  }
}
