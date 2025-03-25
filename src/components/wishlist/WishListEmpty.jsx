import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

function WishListEmpty() {
  return (
    <div className="wishlist-empty">
      <div className="wishlist-empty__ico">
        <Heart strokeWidth="1.2" size="25" />
      </div>
      <h4 className="wishlist-empty__title">
        Looks like your wishlist is empty
      </h4>
      <p className="wishlist-empty__text">
        Make your wishlist by clicking the heart icon on each product
      </p>
      <Link to={`/`} className="btn">
        Continue Shopping
      </Link>
    </div>
  );
}

export { WishListEmpty };
