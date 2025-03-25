import { useContext } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { ShopContext } from "../../context/context";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useWishlistActions } from "../../hooks/useWishlistActions";
import { useCartActions } from "../../hooks/useCartActions";
import { ImageWithFallback } from "../../components/shared/ImageWithFallback";
import { Heart, Trash2 } from "lucide-react";

const rootStyles = getComputedStyle(document.documentElement);

const selectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "40px",
    minWidth: "76px",
    borderColor: rootStyles.getPropertyValue("--gray-400"),
    boxShadow: "none",
    cursor: "pointer",
    transition: "border-color 0.3s",
    "&:hover": {
      borderColor: `${rootStyles.getPropertyValue("--gray-500")} !important`,
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    textAlign: "center",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? rootStyles.getPropertyValue("--primary")
      : rootStyles.getPropertyValue("--white"),
    color: state.isSelected
      ? rootStyles.getPropertyValue("--white")
      : rootStyles.getPropertyValue("--black"),
    "&:hover": {
      backgroundColor: state.isSelected
        ? rootStyles.getPropertyValue("--primary")
        : rootStyles.getPropertyValue("--gray-150"),
    },
  }),
  menu: (provided) => ({
    ...provided,
    border: `1px solid ${rootStyles.getPropertyValue("--gray-400")}`,
    borderRadius: "4px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  }),
};

function CartItem(props) {
  const {
    id,
    title,
    price,
    discountedPrice,
    discount,
    image,
    quantity,
    brand,
    model,
    color,
  } = props;

  const { state, dispatch } = useContext(ShopContext);
  const { cart, wishlist } = state;
  const { addToWishlist, removeFromWishlist } = useWishlistActions();
  const { removeFromCart } = useCartActions();

  const quantityOptions = Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }));

  const isInWishlist = wishlist.some((item) => item.id === id);

  const handleRemoveFromCart = async () => {
    removeFromCart(id);
  };

  const handleAddToWishlist = () => {
    addToWishlist({
      id,
      title,
      price,
      image,
      brand,
      model,
      color,
      discountedPrice,
      discount,
    });
  };

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(id);
  };

  const handleQuantityChange = async (selectedOption) => {
    const newQuantity = selectedOption.value;

    if (auth.currentUser) {
      // If the user is authenticated, update the cart in Firestore
      const userCartRef = doc(db, "carts", auth.currentUser.uid);
      await updateDoc(userCartRef, {
        items: cart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        ),
      });
    } else {
      // If the user is not authenticated, update the local cart state
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity: newQuantity },
      });
    }
  };

  return (
    <li className="cart-list__item" product-id={id}>
      <div className="cart-card">
        <div className="cart-card__img">
          <ImageWithFallback src={image} alt={title} size="20" />
        </div>
        <div className="cart-card__body">
          <div className="details">
            <Link to={`/product/${id}`} className="title">
              {title}
            </Link>
            <div className="price">
              <span
                className={`price__full ${
                  !isNaN(discountedPrice) ? "price__full--crossed" : ""
                }`}
              >
                ${price.toFixed(2)}
              </span>
              {!isNaN(discountedPrice) && (
                <span className="price__discounted">
                  ${discountedPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="info">
              <dl>
                {brand && (
                  <>
                    <dt>Brand:</dt>
                    <dd>{brand}</dd>
                  </>
                )}
                {model && (
                  <>
                    <dt>Model:</dt>
                    <dd>{model}</dd>
                  </>
                )}
                {color && (
                  <>
                    <dt>Color:</dt>
                    <dd>{color}</dd>
                  </>
                )}
              </dl>
            </div>
            <div className="actions">
              <Select
                options={quantityOptions}
                value={quantityOptions.find((opt) => opt.value === quantity)}
                className="select-container"
                classNamePrefix="select"
                styles={selectStyles}
                onChange={handleQuantityChange}
              />
              {isInWishlist ? (
                <button
                  className="wishlist-btn"
                  onClick={handleRemoveFromWishlist}
                >
                  <Heart
                    strokeWidth="1.2"
                    size="22"
                    fill="#E50010"
                    stroke="#E50010"
                  />
                </button>
              ) : (
                <button className="wishlist-btn" onClick={handleAddToWishlist}>
                  <Heart strokeWidth="1.2" size="22" />
                </button>
              )}
            </div>
          </div>
          <button className="remove" onClick={handleRemoveFromCart}>
            <Trash2 strokeWidth="1.2" size="22" />
          </button>
        </div>
      </div>
    </li>
  );
}

export { CartItem };
