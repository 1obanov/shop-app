import { useContext } from "react";
import { ShopContext } from "../../context/context";
import { Link } from "react-router-dom";
import { useToggleMiniCart } from "../../hooks/useToggleMiniCart";
import { OrderItem } from "../order/OrderItem";
import { X } from "lucide-react";

function MiniCart() {
  const { state } = useContext(ShopContext);
  const { cart, isMiniCartShow } = state;
  const { toggleMiniCart } = useToggleMiniCart();

  const totalPrice = Number(
    cart
      .reduce(
        (sum, el) =>
          sum +
          (el.discountedPrice ? el.discountedPrice : el.price) * el.quantity,
        0
      )
      .toFixed(2)
  );

  return (
    <>
      <div className={isMiniCartShow ? "mini-cart show" : "mini-cart"}>
        <div className="mini-cart__header">
          <h2>Cart</h2>
          <span className="close" onClick={toggleMiniCart}>
            <X size="25" />
          </span>
        </div>

        <div className="mini-cart__body">
          <ul className="order-list">
            {cart.length ? (
              cart.map((item) => (
                <li className="order-list__item" key={item.id}>
                  <OrderItem {...item} />
                </li>
              ))
            ) : (
              <li>Your cart is empty</li>
            )}
          </ul>
        </div>
        <div className="mini-cart__footer">
          {cart.length ? (
            <>
              <div className="total-price">
                <span className="total-price__title">Total price:</span>
                <span className="total-price__amount">${totalPrice}</span>
              </div>
              <div className="btns">
                <Link
                  to={`/checkout`}
                  className="btn checkout"
                  onClick={toggleMiniCart}
                >
                  Checkout
                </Link>
                <Link
                  to={`/cart`}
                  className="btn btn--outline shopping-bag"
                  onClick={toggleMiniCart}
                >
                  View cart
                </Link>
              </div>
            </>
          ) : (
            <div className="btns">
              <Link to={`/`} className="btn checkout" onClick={toggleMiniCart}>
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
      {isMiniCartShow && <div className="backdrop"></div>}
    </>
  );
}

export { MiniCart };
