import { useContext } from "react";
import { ShopContext } from "../../context/context";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "../shared/ImageWithFallback";
import { Preloader } from "../shared/Preloader";

const UserOrders = () => {
  const { state } = useContext(ShopContext);
  const { userOrders, loadingUserOrders } = state;

  return loadingUserOrders ? (
    <Preloader />
  ) : (
    <div className="account__orders">
      <h2 className="account__heading">Your orders</h2>
      {userOrders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <>
          {[...userOrders]
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((order) => (
              <div className="order-block" key={order.id}>
                <div className="order-block__heading">
                  <span>No.{order.orderNumber}</span>
                  <span>{order.orderDate}</span>
                </div>
                <span>
                  <strong>${order.totalPrice}</strong>
                </span>
                <div className="order-block__content">
                  <div className="order-block__images">
                    {order.order.map((item) => (
                      <div key={item.id} className="image">
                        <ImageWithFallback src={item.image} alt={item.title} />
                      </div>
                    ))}
                  </div>
                  <Link to={`${order.id}`} className="link">
                    View order
                  </Link>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export { UserOrders };
