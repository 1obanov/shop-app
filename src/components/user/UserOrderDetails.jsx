import { useContext } from "react";
import { ShopContext } from "../../context/context";
import { useParams } from "react-router-dom";
import { OrderItem } from "../../components/order/OrderItem";
import { Preloader } from "../shared/Preloader";

const UserOrderDetails = () => {
  const { id } = useParams();
  const { state } = useContext(ShopContext);
  const { userOrders, loadingUserOrders } = state;

  const order = userOrders.find((o) => o.id === id);

  return loadingUserOrders ? (
    <Preloader />
  ) : !order ? (
    <div className="error-message">
      <h2 className="account__heading">Order not found</h2>
      <p>
        We couldn't find the order you're looking for. Please check the order
        number or try again later.
      </p>
    </div>
  ) : (
    <div className="order-details">
      <h2 className="account__heading">Order No.{order.orderNumber}</h2>
      <span>
        <strong>Date:</strong> {order.orderDate}
      </span>
      <hr className="divider" />
      <div className="order-details__products">
        <h3 className="order-details__heading">
          {order.order.length === 0
            ? ""
            : order.order.length === 1
            ? ` ${order.order.length} item`
            : ` ${order.order.length} items`}{" "}
        </h3>
        <ul className="order-list">
          {order.order.map((item) => (
            <li className="order-list__item" key={item.id}>
              <OrderItem
                {...item}
                showInfo={true}
                showOnlyQty={false}
                enableToggle={false}
              />
            </li>
          ))}
        </ul>
        <div className="order-details__summary">
          <table className="summary-box__table">
            <tbody>
              <tr>
                <th>Subtotal</th>
                <td>${order.subTotalPrice}</td>
              </tr>
              <tr>
                <th>Delivery</th>
                <td>
                  {" "}
                  {order.deliveryPrice === 0
                    ? "Free"
                    : `$${order.deliveryPrice}`}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <td>${order.totalPrice}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <hr className="divider" />
      <div className="order-details__info">
        <div className="order-details__payment-details">
          <h3 className="order-details__heading">Payment details</h3>
          <div>
            <p>
              <strong>{order.orderDetails.cardName}</strong>
            </p>
            <p>
              Card ending in{" "}
              {order.orderDetails.cardNumber?.replace(/\s/g, "").slice(-4)}
            </p>
            <p>Exp: {order.orderDetails.expiryDate}</p>
          </div>
        </div>
        <hr className="vertical-divider" />
        <div className="order-details__delivery-details">
          <h3 className="order-details__heading">Delivery details</h3>
          <div>
            <p>
              <strong>
                {order.orderDetails.firstName} {order.orderDetails.lastName}
              </strong>
            </p>
            <p>{order.orderDetails.email}</p>
            <p>{order.orderDetails.address}</p>
            <p>
              {order.orderDetails.city}, {order.orderDetails.postcode}
            </p>
          </div>
        </div>
        <hr className="vertical-divider" />
        <div className="order-details__shipping-method">
          <h3 className="order-details__heading">Shipping method</h3>
          <div>
            <p>{order.orderDetails.deliveryMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserOrderDetails };
