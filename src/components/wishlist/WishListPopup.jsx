import React from "react";
import { Link } from "react-router-dom";
import { useTogglePopup } from "../../hooks/useTogglePopup";
import { useContext } from "react";
import { ShopContext } from "../../context/context";
import { Heart, X } from "lucide-react";

const WishListPopup = () => {
  const { state } = useContext(ShopContext);
  const { isPopupShow } = state;
  const { togglePopup } = useTogglePopup();

  if (!isPopupShow) return null;

  return (
    <div className="popup-overlay" onClick={togglePopup}>
      <div className="popup-dialog">
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <button className="popup-close" onClick={togglePopup}>
            <X size="20" />
          </button>
          <div className="wishlist-empty">
            <div className="wishlist-empty__ico">
              <Heart strokeWidth="1.2" size="25" />
            </div>
            <h4 className="wishlist-empty__title">Unlock your favorites</h4>
            <p className="wishlist-empty__text">
              Sign in or create an account to add products to your favorites and
              save them for later.
            </p>
            <Link to={`/auth`} className="btn" onClick={togglePopup}>
              Sign in or Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { WishListPopup };
