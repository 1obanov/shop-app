import { useEffect, useContext } from "react";
import { ShopContext } from "../../context/context";
import { useNavigate, Outlet, useLocation, NavLink } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Preloader } from "../shared/Preloader";
import { LogOut, UserRound, Package2, BookUser } from "lucide-react";

const UserAccount = () => {
  const { state } = useContext(ShopContext);
  const { userDetails, loadingUserDetails } = state;
  const navigate = useNavigate();
  const location = useLocation();

  // SignOut handler function
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  // If the user is not authenticated, navigate to the homepage
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return loadingUserDetails ? (
    <Preloader />
  ) : (
    <div className="section account">
      <div className="container">
        <div className="account__wrapper">
          <div className="account-menu">
            <div className="account-menu__heading">
              <h3>Your account</h3>
              <span className="account-menu__link" onClick={handleSignOut}>
                <LogOut strokeWidth="1.2" size="24" />
                Sign Out
              </span>
            </div>
            <nav className="account-menu__nav">
              <ul className="account-menu__list">
                <li className="account-menu__item">
                  <NavLink
                    to="/account/details"
                    className={({ isActive }) =>
                      `account-menu__link ${isActive ? "active" : ""}`
                    }
                  >
                    <UserRound strokeWidth="1.2" size="20" />
                    Details
                  </NavLink>
                </li>
                <li className="account-menu__item">
                  <NavLink
                    to="/account/orders"
                    className={({ isActive }) =>
                      `account-menu__link ${isActive ? "active" : ""}`
                    }
                  >
                    <Package2 strokeWidth="1.2" size="20" />
                    Orders
                  </NavLink>
                </li>
                <li className="account-menu__item">
                  <NavLink
                    to="/account/addresses"
                    className={({ isActive }) =>
                      `account-menu__link ${isActive ? "active" : ""}`
                    }
                  >
                    <BookUser strokeWidth="1.2" size="20" />
                    Addresses
                  </NavLink>
                </li>
                <hr className="divider" />
                <li className="account-menu__item">
                  <span className="account-menu__link" onClick={handleSignOut}>
                    <LogOut strokeWidth="1.2" size="20" />
                    Sign Out
                  </span>
                </li>
              </ul>
            </nav>
          </div>

          <div className="account__content">
            {location.pathname === "/account" && (
              <div className="account__intro">
                <h2>
                  Welcome, {userDetails?.firstName} {userDetails?.lastName}!
                </h2>
                <p>
                  We're glad to have you with us. <br /> Here, you can manage
                  your orders, personal data, and other account-related
                  information.
                </p>
                <span>Member ID: {userDetails?.uid}</span>
              </div>
            )}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserAccount };
