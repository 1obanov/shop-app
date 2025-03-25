import { useContext } from "react";
import { ShopContext } from "../context/context";

export const useToggleMiniCart = () => {
    const { dispatch } = useContext(ShopContext);

  const toggleMiniCart = () => {
    dispatch({ type: "TOGGLE_MINI_CART" });
  };

  return { toggleMiniCart };
};