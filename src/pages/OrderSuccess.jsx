import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { OrderItem } from "../components/order/OrderItem";
import { Preloader } from "../components/shared/Preloader";

function OrderSuccess() {
  const [lastOrder, setLastOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch the last order of the user
    const fetchLastOrder = async () => {
      try {
        // Get the orders collection
        const ordersRef = collection(db, "orders");

        // Check if the user is authenticated
        const userId = auth.currentUser ? auth.currentUser.uid : "guest";

        // Create a query to get the last order for the current user (or guest)
        const q = query(
          ordersRef,
          where("userId", "==", userId),
          orderBy("timestamp", "desc"),
          limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // If there's a valid order, get the data
          const lastOrderData = querySnapshot.docs[0].data();
          setLastOrder(lastOrderData);
        } else {
          console.error("Last order not found.");
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching last order:", error);
        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastOrder();
  }, [navigate]);

  useEffect(() => {
    // Effect to check if the "orderSuccessViewed" session item is set
    if (!isLoading) {
      if (sessionStorage.getItem("orderSuccessViewed")) {
        navigate("/", { replace: true });
      } else {
        sessionStorage.setItem("orderSuccessViewed", "true");
      }
    }
  }, [isLoading, navigate]);

  if (isLoading || !lastOrder) {
    return <Preloader />;
  }

  return (
    <div className="section order-success">
      <div className="container container--sm">
        <div className="order-success__wrapper">
          <div className="order-success__content">
            <div className="headline headline--align-left p-0">
              <h1 className="headline__title">Thank you for your purchase!</h1>
              <p className="headline__subtitle">
                Your order will processed within 24 hours during working days.
                We will notify you by email once your order has been shipped.
              </p>
            </div>
            <div className="billing-details">
              <h2>Billing details</h2>
              <div className="billing-details__info">
                <dl>
                  <dt>Full Name</dt>
                  <dd>
                    {lastOrder.orderDetails.firstName}{" "}
                    {lastOrder.orderDetails.lastName}
                  </dd>
                  <dt>Address</dt>
                  <dd>
                    {lastOrder.orderDetails.address}
                    <br />
                    {lastOrder.orderDetails.city},{" "}
                    {lastOrder.orderDetails.postcode}
                  </dd>
                  <dt>Email</dt>
                  <dd>{lastOrder.orderDetails.email}</dd>
                </dl>
              </div>
            </div>
            <Link to="/" className="btn">
              Back to home page
            </Link>
          </div>
          <div className="order-success-summary">
            <div className="checkout-success">
              <div className="checkout-success__title">
                <h2>Order summary</h2>
              </div>
              <ul className="checkout-success__order-details">
                <li>
                  <span>Date</span>
                  {lastOrder.orderDate}
                </li>
                <li>
                  <span>Order Number</span>
                  {lastOrder.orderNumber}
                </li>
                <li>
                  <span>Payment Method</span>
                  By card
                </li>
              </ul>
              <div className="checkout-success__order">
                <ul className="order-list">
                  {lastOrder.order.map((item) => (
                    <li className="order-list__item" key={item.id}>
                      <OrderItem
                        {...item}
                        showInfo={false}
                        showOnlyQty={true}
                        enableToggle={false}
                        imageModifier="small"
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <table className="checkout-success__order-summary checkout-success__order-summary--border-top">
                <tbody>
                  <tr>
                    <th>Subtotal</th>
                    <td>${lastOrder.subTotalPrice}</td>
                  </tr>
                  <tr>
                    <th>Delivery</th>
                    <td>
                      {lastOrder.deliveryPrice === 0
                        ? "Free"
                        : `$${lastOrder.deliveryPrice.toFixed(2)}`}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <td>${lastOrder.totalPrice}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { OrderSuccess };
