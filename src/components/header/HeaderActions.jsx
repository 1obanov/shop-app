import { useContext } from "react";
import { ShopContext } from "../../context/context";
import { Link } from "react-router-dom";
import { useToggleMiniCart } from "../../hooks/useToggleMiniCart";
import { UserRound, Heart, ShoppingCart } from "lucide-react";

function HeaderActions() {
  const { state } = useContext(ShopContext);
  const { cart, wishlist, isAuthenticated } = state;
  const { toggleMiniCart } = useToggleMiniCart();

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  return (
    <div className="header-actions">
      {isAuthenticated ? (
        <Link to="/account" className="badge badge--account">
          <UserRound strokeWidth="1.2" size="25" />
        </Link>
      ) : (
        <Link to="/auth" className="badge badge--account">
          <UserRound strokeWidth="1.2" size="25" />
        </Link>
      )}
      <Link to="/wishlist" className="badge badge--wishlist">
        <Heart strokeWidth="1.2" size="25" />
        {wishlistCount ? <span>{wishlistCount}</span> : null}
      </Link>
      <div className="badge badge--basket" onClick={toggleMiniCart}>
        <ShoppingCart strokeWidth="1.2" size="25" />
        {cartCount ? <span>{cartCount}</span> : null}
      </div>
    </div>
  );
}

export { HeaderActions };
