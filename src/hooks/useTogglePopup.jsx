import { useContext } from "react";
import { ShopContext } from "../context/context";

export const useTogglePopup = () => {
    const { dispatch } = useContext(ShopContext);

  const togglePopup = () => {
    dispatch({ type: "TOGGLE_POPUP" });
  };

  return { togglePopup };
};