import { useState, useContext } from "react";
import { ShopContext } from "../../context/context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth, db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Preloader } from "../shared/Preloader";
import { handleToastNotification } from "../../utils/handleToastNotification";

// Schema for form validation using Yup
const addressSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  postcode: yup.string().required("Postcode is required"),
});

const UserAddresses = () => {
  const { state } = useContext(ShopContext);
  const { userDetails, loadingUserDetails } = state;
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // useForm hook to handle form state and validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(addressSchema),
  });

  // Function to handle the adding or editing an address
  const handleSubmitAddress = async (data) => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "users", auth.currentUser.uid);
    try {
      // Start the saving process
      setIsSaving(true);

      // Include email in the address data object without modifying it
      const userData = {
        ...data,
        email: userDetails.email,
      };

      // Update the user's address in Firestore
      await updateDoc(userRef, { address: userData });

      // Show toast notification depending on whether it's adding or editing an address
      if (!isEditing) {
        handleToastNotification("Your address has been added");
      } else {
        handleToastNotification("Your address has been updated");
      }

      // Finish saving process and reset form states
      setIsSaving(false);
      setIsVisible(false);
      setIsEditing(false);
      reset();
    } catch (error) {
      setIsSaving(false);
    }
  };

  return loadingUserDetails ? (
    <Preloader />
  ) : (
    <div className="account__details">
      <h2 className="account__heading">Billing & delivery address</h2>
      {!isEditing && userDetails?.address ? (
        <div className="account-block">
          <div className="account-block__row">
            <div className="account-block__item">
              <h3>
                {userDetails.address.firstName} {userDetails.address.lastName}
              </h3>
              <p>{userDetails.address.address}</p>
              <p>
                {userDetails.address.city}, {userDetails.address.postcode}
              </p>
              <br />
              <p>{userDetails.address.email}</p>
            </div>
            <div className="account-block__item">
              <span className="link" onClick={() => setIsEditing(true)}>
                Edit
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {!isEditing && !userDetails?.address && !isVisible && (
        <button
          className="btn btn--outline w-100"
          onClick={() => setIsVisible(true)}
        >
          Add new address
        </button>
      )}

      {(isVisible || isEditing) && !isSaving && (
        <div className="account-block account-block--selected">
          <div className="account-block__row">
            <div className="account-block__item">
              <h3>{isEditing ? "Edit Address" : "Add new address"}</h3>
            </div>
            <div className="account-block__item">
              <span
                className="link"
                onClick={() => {
                  isEditing ? setIsEditing(false) : setIsVisible(false);
                }}
              >
                Close
              </span>
            </div>
          </div>

          <div className="account-block__row">
            <div className="account-block__item">
              <p>
                {isEditing
                  ? "Edit your address below"
                  : "Add a new address below. Postage labels will show the address exactly as you enter it here"}
              </p>
            </div>
          </div>

          <div className="account-block__row">
            <form className="form" onSubmit={handleSubmit(handleSubmitAddress)}>
              <div className="form-row form-row--half">
                <div className="form-group">
                  <div className="form-group__wrap">
                    <input
                      id="firstName"
                      name="firstName"
                      placeholder=" "
                      defaultValue={
                        userDetails.address ? userDetails.address.firstName : ""
                      }
                      {...register("firstName")}
                    />
                    <label className="label" htmlFor="firstName">
                      First Name
                    </label>
                  </div>
                  {errors.firstName && (
                    <p className="error">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <div className="form-group__wrap">
                    <input
                      id="lastName"
                      name="lastName"
                      placeholder=" "
                      defaultValue={
                        userDetails.address ? userDetails.address.lastName : ""
                      }
                      {...register("lastName")}
                    />
                    <label className="label" htmlFor="lastName">
                      Last Name
                    </label>
                  </div>
                  {errors.lastName && (
                    <p className="error">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <div className="form-group__wrap">
                    <input
                      id="address"
                      name="address"
                      placeholder=" "
                      defaultValue={
                        userDetails.address ? userDetails.address.address : ""
                      }
                      {...register("address")}
                    />
                    <label className="label" htmlFor="address">
                      Address
                    </label>
                  </div>
                  {errors.address && (
                    <p className="error">{errors.address.message}</p>
                  )}
                </div>
              </div>

              <div className="form-row form-row--half">
                <div className="form-group">
                  <div className="form-group__wrap">
                    <input
                      id="city"
                      name="city"
                      placeholder=" "
                      defaultValue={
                        userDetails.address ? userDetails.address.city : ""
                      }
                      {...register("city")}
                    />
                    <label className="label" htmlFor="city">
                      City
                    </label>
                  </div>
                  {errors.city && (
                    <p className="error">{errors.city.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <div className="form-group__wrap">
                    <input
                      id="postcode"
                      name="postcode"
                      placeholder=" "
                      defaultValue={
                        userDetails.address ? userDetails.address.postcode : ""
                      }
                      {...register("postcode")}
                    />
                    <label className="label" htmlFor="postcode">
                      Postcode
                    </label>
                  </div>
                  {errors.postcode && (
                    <p className="error">{errors.postcode.message}</p>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="form-group__wrap">
                    <input
                      id="email"
                      name="email"
                      placeholder=" "
                      value={userDetails.email}
                      disabled
                    />
                    <label className="label" htmlFor="email">
                      Email
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : isEditing
                      ? "Save Changes"
                      : "Add new address"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { UserAddresses };
