import { Link } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../../context/context";

function CartSummary() {
  const { state } = useContext(ShopContext);
  const { cart } = state;

  const subTotalPrice = Number(
    cart
      .reduce(
        (sum, el) =>
          sum +
          (el.discountedPrice ? el.discountedPrice : el.price) * el.quantity,
        0
      )
      .toFixed(2)
  );

  let totalPrice = subTotalPrice;

  return (
    <div className="summary-box">
      <h2 className="summary-box__title">Order summary</h2>
      <table className="summary-box__table">
        <tbody>
          <tr>
            <th>Subtotal</th>
            <td>${subTotalPrice}</td>
          </tr>
          <tr>
            <th>Delivery</th>
            <td>calculated at checkout</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <td>${totalPrice}</td>
          </tr>
        </tfoot>
      </table>
      <Link to={`/checkout`} className="btn">
        Checkout
      </Link>
    </div>
  );
}

export { CartSummary };
