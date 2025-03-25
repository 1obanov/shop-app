import { useContext } from "react";
import { ShopContext } from "../../context/context";
import { Preloader } from "../shared/Preloader";
import { UserPersonalDetails } from "../user/UserPersonalDetails";
import { UserEmail } from "../user/UserEmail";
import { UserPassword } from "../user/UserPassword";

const UserDetails = () => {
  const { state } = useContext(ShopContext);
  const { loadingUserDetails } = state;

  return loadingUserDetails ? (
    <Preloader />
  ) : (
    <div className="account__details">
      <h2 className="account__heading">Personal details</h2>
      <UserPersonalDetails />
      <UserEmail />
      <UserPassword />
    </div>
  );
};

export { UserDetails };
