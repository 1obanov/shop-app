import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { handleToastNotification } from "../../utils/handleToastNotification";
import { Eye, EyeOff } from "lucide-react";

// Schema for form validation using Yup
const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Enter your current password"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm your new password"),
});

const UserPassword = () => {
  const [editState, setEditState] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const auth = getAuth();
  const user = auth.currentUser;

  // Function to toggle password visibility
  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Function to toggle the edit state
  const toggleEdit = () => {
    setEditState((prev) => !prev);
  };

  // useForm hook to handle form state and validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const handleChangePassword = async (data) => {
    setFirebaseError("");

    try {
      // Re-authenticate the user using the current password
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update the user's password in Firebase
      await updatePassword(user, data.newPassword);
      handleToastNotification("Your password has been updated");
      setEditState(false);
      reset();
    } catch (error) {
      setFirebaseError("The current password is incorrect. Please try again.");
    }
  };

  return (
    <>
      {user?.providerData[0]?.providerId === "password" && (
        <>
          {!editState && (
            <div className="account-block">
              <div className="account-block__row">
                <div className="account-block__item">
                  <span>Password</span>
                  <span>***********</span>
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
                  <h3>Edit password</h3>
                </div>
                <div className="account-block__item">
                  <span className="link" onClick={() => toggleEdit()}>
                    Close
                  </span>
                </div>
              </div>

              <div className="account-block__row">
                <div className="account-block__item">
                  <p>Edit your password below</p>
                </div>
              </div>

              <div className="account-block__row account-block__row--column">
                <form
                  className="form"
                  onSubmit={handleSubmit(handleChangePassword)}
                >
                  {["currentPassword", "newPassword", "confirmPassword"].map(
                    (field, index) => (
                      <div className="form-row" key={index}>
                        <div className="form-group">
                          <div className="form-group__wrap form-group__wrap--icon">
                            <input
                              id={field}
                              name={field}
                              type={showPassword[field] ? "text" : "password"}
                              placeholder=" "
                              {...register(field)}
                            />
                            <label className="label" htmlFor={field}>
                              {field === "currentPassword"
                                ? "Current Password"
                                : field === "newPassword"
                                ? "New Password"
                                : "Repeat New Password"}
                            </label>
                            <span
                              className="password-toggle"
                              onClick={() => togglePassword(field)}
                            >
                              {showPassword[field] ? (
                                <Eye strokeWidth="1.2" size="20" />
                              ) : (
                                <EyeOff strokeWidth="1.2" size="20" />
                              )}
                            </span>
                          </div>
                          {errors[field] && (
                            <p className="error">{errors[field].message}</p>
                          )}
                        </div>
                      </div>
                    )
                  )}

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
      )}
    </>
  );
};

export { UserPassword };
