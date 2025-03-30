import { createContext, useReducer, useEffect } from "react";
import { shopReducer } from "./reducer";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { mergeCarts } from "../utils/mergeCarts";
import { subscribeToWishlist } from "../utils/subscribeToWishlist";
import { subscribeToCart } from "../utils/subscribeToCart";
import { subscribeUserDetails } from "../utils/subscribeUserDetails";
import { subscribeToOrders } from "../utils/subscribeToOrders";

// Create a context for the shop state
export const ShopContext = createContext();

// Initial state for the shop context
const initialState = {
  goods: [],
  cart: JSON.parse(localStorage.getItem("cartItems")) || [],
  userOrders: [],
  userDetails: [],
  wishlist: [],
  isAuthenticated: null,
  isMiniCartShow: false,
  isPopupShow: false,
  loadingGoods: true,
  loadingCart: true,
  loadingUserOrders: true,
  loadingUserDetails: true,
  loadingProduct: true,
  loadingWishlist: true,
  product: {},
  ratings: generateRandomRatings(50),
  currentStep: 0,
};

// Function to generate random ratings for products
function generateRandomRatings(count) {
  const ratings = {};

  for (let i = 1; i <= count; i++) {
    const rate = (Math.random() * (5 - 1) + 1).toFixed(1);
    const count = Math.floor(Math.random() * 500) + 1;

    ratings[i] = {
      rate: parseFloat(rate),
      count: count,
    };
  }

  return ratings;
}

// Context provider component that wraps children and provides state and dispatch
export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  useEffect(() => {
    // Subscribing to the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Set the user as authenticated in state
        dispatch({ type: "SET_AUTHENTICATED", payload: true });

        // Merge cart from previous sessions if any
        await mergeCarts(user.uid);

        // Subscribe to user details
        const unsubscribeUserDetails = subscribeUserDetails(
          user.uid,
          (details) => {
            dispatch({
              type: "SET_USER_DETAILS",
              payload: { userDetails: details, loadingUserDetails: false },
            });
          }
        );

        // Subscribe to orders
        const unsubscribeOrders = subscribeToOrders(user.uid, (orders) => {
          dispatch({
            type: "SET_USER_ORDER",
            payload: { userOrders: orders, loadingUserOrders: false },
          });
        });

        // Subscribe to wishlist
        const unsubscribeWishlist = subscribeToWishlist(user.uid, (items) => {
          dispatch({ type: "SET_WISHLIST", payload: items });
        });

        // Subscribe to cart updates
        const unsubscribeToCart = subscribeToCart(user.uid, (items) => {
          dispatch({ type: "SET_CART", payload: items });
        });

        // Cleanup function to unsubscribe from all listeners when the component unmounts
        return () => {
          unsubscribeUserDetails();
          unsubscribeOrders();
          unsubscribeWishlist();
          unsubscribeToCart();
        };
      } else {
        // If the user is not authenticated, set loading states and clear data
        dispatch({ type: "SET_AUTHENTICATED", payload: false });
        dispatch({ type: "SET_LOADING_WISHLIST", payload: false });
        dispatch({ type: "CLEAR_WISHLIST", payload: false });
        dispatch({
          type: "SET_USER_DETAILS",
          payload: { userDetails: [], loadingUserDetails: true },
        });
        dispatch({
          type: "SET_USER_ORDER",
          payload: { userOrders: [], loadingUserOrders: true },
        });
        dispatch({
          type: "SET_CART",
          payload: JSON.parse(localStorage.getItem("cartItems")) || [],
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // If the user is not authenticated, save the cart to localStorage
    if (!state.isAuthenticated) {
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    }
  }, [state.cart, state.isAuthenticated]);

  return (
    <ShopContext.Provider value={{ state, dispatch }}>
      {children}
    </ShopContext.Provider>
  );
};
