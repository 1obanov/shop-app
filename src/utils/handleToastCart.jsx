import { toast, Slide } from "react-toastify";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";

const handleToastCart = ({
  cart,
  id,
  title,
  image,
  price,
  brand,
  model,
  color,
  quantity,
  discountedPrice,
}) => {
  const existingItem = cart.find((item) => item.id === id);
  const currentQuantity = existingItem ? existingItem.quantity : 0;
  const totalQuantity = currentQuantity + quantity;

  if (totalQuantity > 20) {
    const remainingQuantity = 20 - currentQuantity;
    const message =
      remainingQuantity > 0
        ? `You can only add ${remainingQuantity} more of this product as there are already ${currentQuantity} in the cart.`
        : `You can not add more of this product. Maximum limit of 20 reached.`;

    toast.error(`${message}`, {
      autoClose: 3000,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      transition: Slide,
    });

    return false;
  }

  toast.success(
    <div className="Toastify__content">
      <h3>Added to bag</h3>
      <div className="Toastify__product-info">
        <div className="image">
          <ImageWithFallback src={image} alt={title} size="20" />
        </div>
        <div className="info">
          <div className="info__heading">
            <span className="title">{title}</span>
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
          </div>
          <div className="info__meta">
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
        </div>
      </div>
    </div>,
    {
      autoClose: 3000,
      icon: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      transition: Slide,
    }
  );

  return true;
};

export { handleToastCart };
