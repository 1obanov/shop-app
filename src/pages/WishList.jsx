import { Link } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../context/context";
import { WishListItem } from "../components/wishlist/WishListItem";
import { WishListEmpty } from "../components/wishlist/WishListEmpty";
import { Preloader } from "../components/shared/Preloader";
import { House } from "lucide-react";

function WishList() {
  const { state } = useContext(ShopContext);
  const { wishlist, loadingWishlist } = state;

  return (
    <div className="section wishlist">
      <div className="breadcrumb">
        <div className="container">
          <ul>
            <li className="breadcrumb__item">
              <Link to={`/`}>
                <House strokeWidth="2" size="16" />
                Home
              </Link>
            </li>
            <li className="breadcrumb__item active">Wishlist</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="headline">
          <h1 className="headline__title">Wishlist</h1>
        </div>
        {loadingWishlist ? (
          <Preloader />
        ) : wishlist.length > 0 ? (
          <ul className="list">
            {wishlist.map((item) => (
              <WishListItem key={item.id} {...item} />
            ))}
          </ul>
        ) : (
          <WishListEmpty />
        )}
      </div>
    </div>
  );
}

export { WishList };
