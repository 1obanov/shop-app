import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { saveOrderToFirestore } from "../utils/saveOrderToFirestore";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { CheckoutSummary } from "../components/checkout/CheckoutSummary";
import { ExpiryDateInput } from "../components/cart/ExpiryDateInput";
import { Preloader } from "../components/shared/Preloader";

// Schema for form validation using Yup
const validationSchemas = [
  yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    address: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    postcode: yup.string().required("Postcode is required"),
  }),
  yup.object().shape({
    cardNumber: yup
      .string()
      .required("Card number is required")
      .transform((value) => value.replace(/\s/g, ""))
      .matches(/^\d{16}$/, "Card number must be exactly 16 digits"),
    expiryDate: yup
      .string()
      .required("Expiry date is required")
      .matches(
        /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
        "Invalid expiry date format (MM/YY)"
      )
      .test(
        "valid-date",
        "Expiry date must be at least one month ahead",
        (value) => {
          if (!value) return false;
          const [month, year] = value.split("/").map(Number);
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;
          const currentYear = currentDate.getFullYear() % 100;
          return (
            year > currentYear || (year === currentYear && month > currentMonth)
          );
        }
      ),
    cvv: yup
      .string()
      .required("CVV is required")
      .matches(/^\d{3}$/, "CVV must be exactly 3 digits"),
    cardName: yup.string().required("Name on card is required"),
  }),
  yup.object().shape({}), // Empty schema for the third step
];

function Checkout() {
  const { state, dispatch } = useContext(ShopContext);
  const {
    userDetails,
    loadingUserDetails,
    isAuthenticated,
    currentStep,
    loadingCart,
    cart,
  } = state;
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const navigate = useNavigate();

  // Calculate subtotal price from cart items
  const subTotalPrice = Number(
    cart
      .reduce(
        (sum, el) =>
          sum +
          (el.discountedPrice ? el.discountedPrice : el.price) * el.quantity,
        0
      )
      .toFixed(2)
  );

  // Calculate total price (subtotal + delivery)
  let totalPrice;
  totalPrice = Number((subTotalPrice + deliveryPrice).toFixed(2));

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchemas[currentStep]),
  });

  const selectedDeliveryMethod = watch("deliveryMethod");
  const orderDetails = getValues();

  // Watch for selected delivery method and update delivery price accordingly
  useEffect(() => {
    if (selectedDeliveryMethod === "Standard Delivery (7-30 business days)") {
      setDeliveryPrice(0);
    } else if (
      selectedDeliveryMethod === "Express Delivery (1-3 business days)"
    ) {
      setDeliveryPrice(17.99);
    }
  }, [selectedDeliveryMethod]);

  // Set default delivery method on the first step
  useEffect(() => {
    if (currentStep === 0 && !getValues("deliveryMethod")) {
      setValue("deliveryMethod", "Standard Delivery (7-30 business days)");
    }
  }, [currentStep, setValue, getValues]);

  // Reset current step to 0 when component unmounts
  useEffect(() => {
    return () => {
      dispatch({ type: "SET_CURRENT_STEP", payload: 0 });
    };
  }, [dispatch]);

  // Redirect to home if cart is empty
  useEffect(() => {
    if (!loadingCart && cart.length === 0) {
      navigate("/");
    }
  }, [cart, loadingCart, navigate]);

  const handleNextStep = () => {
    dispatch({ type: "SET_CURRENT_STEP", payload: currentStep + 1 });
  };

  // Function to handle placing the order
  const handlePlaceOrder = async () => {
    if (isSubmitting) return;
    const orderDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }); // Format: "24 January 2025"

    const orderNumber = `${Math.floor(Date.now() / 1000)}`;

    const userId = auth.currentUser ? auth.currentUser.uid : "guest";

    const orderData = {
      orderNumber,
      order: cart,
      orderDetails,
      deliveryPrice,
      subTotalPrice,
      totalPrice,
      orderDate,
      userId,
      timestamp: Date.now(),
    };

    const deliveryAddress = {
      address: orderDetails.address,
      city: orderDetails.city,
      email: orderDetails.email,
      firstName: orderDetails.firstName,
      lastName: orderDetails.lastName,
      postcode: orderDetails.postcode,
    };

    try {
      // Save order to Firestore
      await saveOrderToFirestore(orderData);

      if (auth.currentUser) {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { address: deliveryAddress });

        // Clear the user's cart in Firestore
        const userCartRef = doc(db, "carts", userId);
        await setDoc(userCartRef, { items: [] });
      }

      // Clear sessionStorage to allow the OrderSuccess page to open again
      sessionStorage.removeItem("orderSuccessViewed");

      dispatch({ type: "CLEAR_CART" });
      navigate("/order-success");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // Render shipping details from form values
  const renderShippingData = () => {
    const values = getValues();
    return (
      <>
        <div className="checkout-main__review">
          <div>
            <p>
              <strong>
                {values.firstName} {values.lastName}
              </strong>
            </p>
            <p>{values.email}</p>
            <p>{values.address}</p>
            <p>
              {values.city}, {values.postcode}
            </p>
          </div>
          <div>
            <p>{values.deliveryMethod}</p>
          </div>
        </div>
      </>
    );
  };

  // Render payment details from form values
  const renderPaymentData = () => {
    const values = getValues();
    return (
      <>
        <div className="checkout-main__review">
          <div>
            <p>
              <strong>{values.cardName}</strong>
            </p>
            <p>
              Card ending in {values.cardNumber?.replace(/\s/g, "").slice(-4)}
            </p>
            <p>Exp: {values.expiryDate}</p>
          </div>
        </div>
      </>
    );
  };

  if (isAuthenticated === null || (isAuthenticated && loadingUserDetails)) {
    return <Preloader />;
  }

  return (
    <div className="section checkout">
      <div className="container">
        <div className="headline">
          <h1 className="headline__title">Checkout</h1>
        </div>

        <div className="checkout__wrapper">
          <div className="checkout-main">
            {currentStep === 0 && (
              <>
                <div className="checkout-main__block">
                  <div className="checkout-main__title">
                    <h2>Shipping Method</h2>
                  </div>
                  <div className="form-row">
                    <div className="form-group form-group--radio">
                      <label className="label">
                        <span className="label__title">
                          <input
                            type="radio"
                            value="Standard Delivery (7-30 business days)"
                            {...register("deliveryMethod", {
                              required: "Please select a delivery method",
                            })}
                            checked={
                              selectedDeliveryMethod ===
                              "Standard Delivery (7-30 business days)"
                            }
                          />
                          <span>
                            Standard Delivery
                            <em>(7-30 busienss days)</em>
                          </span>
                        </span>
                        <span className="label__info">
                          <strong>Free</strong>
                        </span>
                      </label>
                      <label className="label">
                        <span className="label__title">
                          <input
                            type="radio"
                            value="Express Delivery (1-3 business days)"
                            {...register("deliveryMethod", {
                              required: "Please select a delivery method",
                            })}
                            checked={
                              selectedDeliveryMethod ===
                              "Express Delivery (1-3 business days)"
                            }
                          />
                          <span>
                            Express Delivery
                            <em>(1-3 busienss days)</em>
                          </span>
                        </span>
                        <span className="label__info">
                          <strong>$17.99</strong>
                        </span>
                      </label>
                      {errors.deliveryMethod && (
                        <p className="error">{errors.deliveryMethod.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="checkout-main__block">
                  <div className="checkout-main__title">
                    <h2>Delivery Information</h2>
                  </div>
                  <form className="form">
                    <div className="form-row form-row--half">
                      <div className="form-group">
                        <div className="form-group__wrap">
                          <input
                            id="firstName"
                            name="firstName"
                            placeholder=" "
                            defaultValue={
                              userDetails.address
                                ? userDetails.address.firstName
                                : ""
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
                              userDetails.address
                                ? userDetails.address.lastName
                                : ""
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
                            id="email"
                            name="email"
                            placeholder=" "
                            type="email"
                            defaultValue={userDetails ? userDetails.email : ""}
                            disabled={userDetails?.length !== 0}
                            {...register("email")}
                          />
                          <label className="label" htmlFor="email">
                            Email
                          </label>
                        </div>
                        {errors.email && (
                          <p className="error">{errors.email.message}</p>
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
                              userDetails.address
                                ? userDetails.address.address
                                : ""
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
                              userDetails.address
                                ? userDetails.address.city
                                : ""
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
                              userDetails.address
                                ? userDetails.address.postcode
                                : ""
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
                  </form>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <div className="checkout-main__block">
                  <div className="checkout-main__title">
                    <h2>Shipping Details</h2>
                    <span
                      className="link"
                      onClick={() =>
                        dispatch({ type: "SET_CURRENT_STEP", payload: 0 })
                      }
                    >
                      Edit
                    </span>
                  </div>

                  {renderShippingData()}
                </div>
                <div className="checkout-main__block">
                  <div className="checkout-main__title">
                    <h2>Payment Information</h2>
                  </div>
                  <form className="form">
                    <div className="form-row">
                      <div className="form-group">
                        <div className="form-group__wrap">
                          <input
                            id="cardNumber"
                            type="text"
                            placeholder=" "
                            maxLength={19}
                            onInput={(e) => {
                              let input = e.target.value.replace(/\D/g, "");
                              input = input.slice(0, 16);
                              input = input.match(/.{1,4}/g)?.join(" ") || "";
                              e.target.value = input;
                            }}
                            {...register("cardNumber")}
                          />
                          <label className="label" htmlFor="cardNumber">
                            Card Number
                          </label>
                        </div>
                        {errors.cardNumber && (
                          <p className="error">{errors.cardNumber.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-row form-row--half">
                      <div className="form-group">
                        <ExpiryDateInput control={control} />
                      </div>
                      <div className="form-group">
                        <div className="form-group__wrap">
                          <input
                            id="cvv"
                            type="text"
                            placeholder=" "
                            maxLength={3}
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                            }}
                            {...register("cvv")}
                          />
                          <label className="label" htmlFor="cvv">
                            CVV
                          </label>
                        </div>
                        {errors.cvv && (
                          <p className="error">{errors.cvv.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <div className="form-group__wrap">
                          <input
                            id="cardName"
                            placeholder=" "
                            {...register("cardName")}
                          />
                          <label className="label" htmlFor="cardName">
                            Name on card
                          </label>
                        </div>
                        {errors.cardName && (
                          <p className="error">{errors.cardName.message}</p>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="checkout-main__block">
                  <div className="checkout-main__title">
                    <h2>Shipping Details</h2>
                    <span
                      className="link"
                      onClick={() =>
                        dispatch({ type: "SET_CURRENT_STEP", payload: 0 })
                      }
                    >
                      Edit
                    </span>
                  </div>

                  {renderShippingData()}
                </div>

                <div className="checkout-main__block">
                  <div className="checkout-main__title">
                    <h2>Payment Details</h2>
                    <span
                      className="link"
                      onClick={() =>
                        dispatch({ type: "SET_CURRENT_STEP", payload: 1 })
                      }
                    >
                      Edit
                    </span>
                  </div>

                  {renderPaymentData()}
                </div>
              </>
            )}
          </div>
          <CheckoutSummary
            currentStep={currentStep}
            onNextStep={handleSubmit(handleNextStep)}
            isSubmitting={isSubmitting}
            deliveryPrice={deliveryPrice}
            subTotalPrice={subTotalPrice}
            totalPrice={totalPrice}
            handlePlaceOrder={handleSubmit(handlePlaceOrder)}
          />
        </div>
      </div>
    </div>
  );
}

export { Checkout };
