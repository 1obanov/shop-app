import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

function CartEmpty() {

  return (
    <div className="wishlist-empty">
      <div className="wishlist-empty__ico">
        <ShoppingCart strokeWidth="1.2" size="25" />
      </div>
      <h4 className="wishlist-empty__title">
        Looks like your cart is empty
      </h4>
      <p className="wishlist-empty__text">
        Discover products and add items to your cart!
      </p>
      <Link to={`/`} className="btn">
        Continue Shopping
      </Link>
    </div>
  );
}

export { CartEmpty };
