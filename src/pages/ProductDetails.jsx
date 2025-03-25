import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/context";
import { Preloader } from "../components/shared/Preloader";
import { renderStars } from "../utils/renderStars";
import { useWishlistActions } from "../hooks/useWishlistActions";
import { useCartActions } from "../hooks/useCartActions";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { House, Heart } from "lucide-react";

import "toastify-js/src/toastify.css";

function ProductDetails() {
  const { id } = useParams();
  const { state, dispatch } = useContext(ShopContext);
  const { product, loadingProduct, cart, ratings, wishlist } = state;
  const [quantity, setQuantity] = useState(1);
  const { addToWishlist, removeFromWishlist } = useWishlistActions();
  const { addToCart } = useCartActions();

  // Checking if the product is already in the wishlist
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  // Calculating the discounted price
  const discountedPrice = product.price * (1 - product.discount / 100);

  // Function to handle the adding the product to the cart
  const handleAddToCart = () => {
    addToCart(cart, {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      brand: product.brand,
      model: product.model,
      color: product.color,
      quantity,
      ...(!isNaN(discountedPrice) && { discountedPrice }),
      ...(typeof product.discount !== "undefined" && {
        discount: product.discount,
      }),
    });
  };

  // Function to handle the adding the product to the wishlist
  const handleAddToWishlist = () => {
    addToWishlist({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      brand: product.brand,
      model: product.model,
      color: product.color,
      discountedPrice,
      discount: product.discount,
    });
  };

  // Function to handle the removing the product from the wishlist
  const handleRemoveFromWishlist = () => {
    removeFromWishlist(product.id);
  };

  // Function to handle the changing the quantity of the product
  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "increment") {
        return Math.min(20, prev + 1);
      } else {
        return Math.max(1, prev - 1);
      }
    });
  };

  useEffect(() => {
    // Fetching product details by id from the API
    fetch(`https://fakestoreapi.in/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const productWithRating = {
            ...data.product,
            rating: ratings[data.product.id],
          };
          dispatch({ type: "SET_PRODUCT", payload: productWithRating });
        }
      });

    // Cleanup function to clear product details when the component unmounts or id changes
    return () => {
      dispatch({ type: "CLEAR_PRODUCT" });
      dispatch({ type: "SET_LOADING_PRODUCT", payload: true });
    };
  }, [id, dispatch, ratings]);

  return loadingProduct ? (
    <Preloader />
  ) : (
    <div className="section product-details">
      <div className="breadcrumb">
        <div className="container">
          <ul>
            <li className="breadcrumb__item">
              <Link to={`/`}>
                <House strokeWidth="2" size="16" />
                Home
              </Link>
            </li>
            <li className="breadcrumb__item active">{product.title}</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="product-details__wrapper">
          <div className="product-details__image">
            <ImageWithFallback src={product.image} alt={product.title} />
          </div>
          <div className="product-details__info">
            <div className="price">
              <span
                className={`price__full ${
                  !isNaN(discountedPrice) ? "price__full--crossed" : ""
                }`}
              >
                {product && product.price && `$${product.price.toFixed(2)}`}
              </span>
              {!isNaN(discountedPrice) && (
                <span className="price__discounted">
                  ${discountedPrice.toFixed(2)}
                </span>
              )}
            </div>
            <h1 className="product-details__title">{product.title}</h1>
            <div className="rating">
              {product.rating ? (
                <>
                  <div className="stars">
                    {renderStars(product.rating.rate)}
                  </div>
                  <span className="divider">|</span>
                  <span className="reviews">
                    ({product.rating.count} customer review)
                  </span>
                </>
              ) : (
                <span>No reviews yet</span>
              )}
            </div>
            <p className="product-details__description">
              {product.description}
            </p>
            <div className="product-details__actions">
              <div className="quantity">
                <span
                  className="decrement"
                  onClick={() => handleQuantityChange("decrement")}
                >
                  -
                </span>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                    )
                  }
                />
                <span
                  className="increament"
                  onClick={() => handleQuantityChange("increment")}
                >
                  +
                </span>
              </div>
              <button className="btn" onClick={handleAddToCart}>
                Add to cart
              </button>
            </div>
            <div className="product-details__wishlist">
              {isInWishlist ? (
                <button
                  className="wishlist-btn"
                  onClick={handleRemoveFromWishlist}
                >
                  <span className="ico">
                    <Heart
                      strokeWidth="1.2"
                      size="20"
                      fill="#E50010"
                      stroke="#E50010"
                    />
                  </span>
                  <span className="text">Remove from wishlist</span>
                </button>
              ) : (
                <button className="wishlist-btn" onClick={handleAddToWishlist}>
                  <span className="ico">
                    <Heart strokeWidth="1.2" size="20" />
                  </span>
                  <span className="text">Add to wishlist</span>
                </button>
              )}
            </div>
            <div className="product-details__meta">
              <dl>
                {product.brand && (
                  <>
                    <dt>Brand:</dt>
                    <dd>{product.brand}</dd>
                  </>
                )}
                {product.model && (
                  <>
                    <dt>Model:</dt>
                    <dd>{product.model}</dd>
                  </>
                )}
                {product.color && (
                  <>
                    <dt>Color:</dt>
                    <dd>{product.color}</dd>
                  </>
                )}
                {product.category && (
                  <>
                    <dt>Category:</dt>
                    <dd>{product.category}</dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ProductDetails };
