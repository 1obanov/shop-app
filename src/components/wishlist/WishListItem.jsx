import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../../context/context";
import { renderStars } from "../../utils/renderStars";
import { useWishlistActions } from "../../hooks/useWishlistActions";
import { useCartActions } from "../../hooks/useCartActions";
import { ImageWithFallback } from "../../components/shared/ImageWithFallback";
import { Trash2 } from "lucide-react";

function WishListItem(props) {
  const {
    id,
    title,
    price,
    image,
    brand,
    model,
    color,
    discount,
    discountedPrice,
  } = props;
  const { state } = useContext(ShopContext);
  const { cart, ratings } = state;
  const [quantity] = useState(1);
  const { removeFromWishlist } = useWishlistActions();
  const { addToCart } = useCartActions();

  // Fetch the product rating using product ID;
  const productRating = ratings[id] || { rate: "No rating", count: 0 };

  // Function to handle adding product to the shopping cart
  const handleAddToCart = () => {
    addToCart(cart, {
      id,
      title,
      price,
      image,
      brand,
      model,
      color,
      quantity,
      ...(!isNaN(discountedPrice) && { discountedPrice }),
      ...(typeof discount !== "undefined" && { discount }),
    });
  };

  // Function to handle removing the product from the wishlist
  const handleRemoveFromWishlist = () => {
    removeFromWishlist(id);
  };

  return (
    <li className="list__item" product-id={id}>
      <div className="card">
        <div className="card__img">
          <ImageWithFallback src={image} alt={title} />
          {typeof discount !== "undefined" && (
            <span className="discount">-{discount}%</span>
          )}
          <button
            className="remove-from-wishlist"
            onClick={handleRemoveFromWishlist}
          >
            <Trash2 strokeWidth="1.2" size="20" />
          </button>
          <button className="btn btn--small" onClick={handleAddToCart}>
            Add to cart
          </button>
        </div>
        <div className="card__body">
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
          <Link to={`/product/${id}`} className="title">
            {title}
          </Link>
          <div className="rating">
            <div className="stars">{renderStars(productRating.rate)}</div>
            <span className="reviews">{productRating.count} reviews</span>
          </div>
        </div>
      </div>
    </li>
  );
}

export { WishListItem };
