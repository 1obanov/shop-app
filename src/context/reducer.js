export const shopReducer = (state, action) => {
  switch (action.type) {
    case "SET_GOODS":
      return {
        ...state,
        goods: action.payload,
        loadingGoods: false,
      };

    case "SET_CART":
      return { ...state, cart: action.payload, loadingCart: false };

    case "SET_USER_ORDER":
      return {
        ...state,
        userOrders: action.payload.userOrders,
        loadingUserOrders: action.payload.loadingUserOrders,
      };

    case "SET_USER_DETAILS":
      return {
        ...state,
        userDetails: action.payload.userDetails,
        loadingUserDetails: action.payload.loadingUserDetails,
      };

    case "ADD_TO_BASKET":
      const itemIndex = state.cart.findIndex(
        (cartItem) => cartItem.id === action.payload.id
      );

      let newCartItem = null;
      if (itemIndex < 0) {
        const newItem = {
          ...action.payload,
        };
        newCartItem = [...state.cart, newItem];
      } else {
        newCartItem = state.cart.map((cartItem, index) => {
          if (index === itemIndex) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + action.payload.quantity,
            };
          } else {
            return cartItem;
          }
        });
      }

      return {
        ...state,
        cart: newCartItem,
      };

    case "REMOVE_FROM_BASKET":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };

    case "TOGGLE_MINI_CART":
      return {
        ...state,
        isMiniCartShow: !state.isMiniCartShow,
      };

    case "TOGGLE_POPUP":
      return {
        ...state,
        isPopupShow: !state.isPopupShow,
      };

    case "SET_PRODUCT":
      return {
        ...state,
        product: action.payload,
        loadingProduct: false,
      };

    case "CLEAR_PRODUCT":
      return {
        ...state,
        product: {},
      };

    case "SET_WISHLIST":
      return {
        ...state,
        wishlist: action.payload,
        loadingWishlist: false,
      };

    case "CLEAR_WISHLIST":
      return {
        ...state,
        wishlist: [],
      };

    case "SET_LOADING_WISHLIST":
      return { ...state, loadingWishlist: action.payload };

    case "SET_LOADING_PRODUCT":
      return {
        ...state,
        loadingProduct: action.payload,
      };

    case "SET_CURRENT_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
};
