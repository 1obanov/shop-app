import { Link } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../context/context";
import { CartItem } from "../components/cart/CartItem";
import { CartEmpty } from "../components/cart/CartEmpty";
import { CartSummary } from "../components/cart/CartSummary";
import { Preloader } from "../components/shared/Preloader";
import { House } from "lucide-react";

function Cart() {
  const { state } = useContext(ShopContext);
  const { cart, loadingCart } = state;

  return (
    <div className="section cart">
      <div className="breadcrumb">
        <div className="container">
          <ul>
            <li className="breadcrumb__item">
              <Link to={`/`}>
                <House strokeWidth="2" size="16" />
                Home
              </Link>
            </li>
            <li className="breadcrumb__item active">Cart</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="headline">
          <h1 className="headline__title">
            Cart
            {cart.length === 0
              ? ""
              : cart.length === 1
              ? ` (${cart.length} item)`
              : ` (${cart.length} items)`}
          </h1>
        </div>
        {loadingCart ? (
          <Preloader />
        ) : cart.length > 0 ? (
          <div className="cart__wrapper">
            <ul className="cart-list">
              {cart.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}
            </ul>
            <CartSummary />
          </div>
        ) : (
          <CartEmpty />
        )}
      </div>
    </div>
  );
}

export { Cart };
