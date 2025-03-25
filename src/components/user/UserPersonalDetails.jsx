import { useState, useContext } from "react";
import { ShopContext } from "../../context/context";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { handleToastNotification } from "../../utils/handleToastNotification";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const fullNameDOBSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
});

const UserPersonalDetails = () => {
  const { state } = useContext(ShopContext);
  const { userDetails } = state;
  const [editState, setEditState] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    userDetails?.dob ? new Date(userDetails.dob.seconds * 1000) : null
  );
  const auth = getAuth();
  const user = auth.currentUser;

  const toggleEdit = () => {
    setEditState((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(fullNameDOBSchema),
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setValue("dob", date);
  };

  const handleChangePersonalDetails = async (data) => {
    setFirebaseError("");

    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, data);

      handleToastNotification("Your personal details has been updated");
      setEditState(false);
      reset();
    } catch (error) {
      setFirebaseError(
        "The provided personal details are incorrect. Please check and try again."
      );
    }
  };

  return (
    <>
      {!editState && (
        <div className="account-block">
          <div className="account-block__row">
            <div className="account-block__item">
              <span>Full name</span>
              <span>
                {userDetails.firstName} {userDetails.lastName}
              </span>
            </div>
            <div className="account-block__item">
              <span>Date of birth</span>
              <span>
                {userDetails.dob
                  ? format(
                      new Date(userDetails.dob.seconds * 1000),
                      "dd-MM-yyyy"
                    )
                  : "--"}
              </span>
            </div>
            <div className="account-block__item">
              <span className="link" onClick={() => toggleEdit()}>
                Edit
              </span>
            </div>
          </div>
        </div>
      )}
      {editState && (
        <div className="account-block account-block--selected">
          <div className="account-block__row">
            <div className="account-block__item">
              <h3>Edit personal details</h3>
            </div>
            <div className="account-block__item">
              <span className="link" onClick={() => toggleEdit()}>
                Close
              </span>
            </div>
          </div>

          <div className="account-block__row">
            <div className="account-block__item">
              <p>Edit your personal details below</p>
            </div>
          </div>

          <div className="account-block__row account-block__row--column">
            <form
              className="form"
              onSubmit={handleSubmit(handleChangePersonalDetails)}
            >
              <div className="form-row form-row--half">
                <div className="form-group">
                  <div className="form-group__wrap">
                    <input
                      id="firstName"
                      name="firstName"
                      placeholder=" "
                      defaultValue={userDetails ? userDetails.firstName : ""}
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
                      defaultValue={userDetails ? userDetails.lastName : ""}
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
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="DD-MM-YYYY"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      maxDate={new Date()}
                      className="date-picker-input"
                    />
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
                    {isSubmitting ? "Saving.." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
            {firebaseError && <p className="error">{firebaseError}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export { UserPersonalDetails };
