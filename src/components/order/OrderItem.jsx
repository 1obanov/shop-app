import { Link } from "react-router-dom";
import { useToggleMiniCart } from "../../hooks/useToggleMiniCart";
import { ImageWithFallback } from "../../components/shared/ImageWithFallback";

function OrderItem({
  id,
  title,
  image,
  price,
  brand,
  model,
  color,
  quantity,
  discountedPrice,
  showInfo = true,
  showOnlyQty = false,
  enableToggle = true,
  imageModifier = "",
}) {
  const { toggleMiniCart } = useToggleMiniCart();

  const handleLinkClick = () => {
    if (enableToggle) {
      toggleMiniCart();
    }
  };

  return (
    <div className="order-card">
      <Link
        to={`/product/${id}`}
        className="order-card__wrapper"
        onClick={handleLinkClick}
      >
        <div
          className={`image ${imageModifier ? `image--${imageModifier}` : ""}`}
        >
          <ImageWithFallback src={image} alt={title} size="20" />
        </div>
        <div className="content">
          <span className="title">{title}</span>
          {showInfo && (
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
                {quantity && (
                  <>
                    <dt>Quantity:</dt>
                    <dd>{quantity}</dd>
                  </>
                )}
              </dl>
            </div>
          )}
          {showOnlyQty && (
            <div className="info">
              <dl>
                <dt>Quantity:</dt>
                <dd>{quantity}</dd>
              </dl>
            </div>
          )}
        </div>
        <div className="price">
          {!isNaN(discountedPrice) && (
            <span className="price__discounted">
              ${discountedPrice.toFixed(2)}
            </span>
          )}
          <span
            className={`price__full ${
              !isNaN(discountedPrice) ? "price__full--crossed" : ""
            }`}
          >
            ${price.toFixed(2)}
          </span>
        </div>
      </Link>
    </div>
  );
}

export { OrderItem };
