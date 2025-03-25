import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const subscribeUserDetails = (userId, setUserDetails) => {
  if (!userId) return;

  const userRef = doc(db, "users", userId);

  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.data();
      setUserDetails(userData);
    } else {
      setUserDetails({});
    }
  });
};

export { subscribeUserDetails };
