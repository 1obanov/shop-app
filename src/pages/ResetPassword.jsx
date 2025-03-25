import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

// Schema for form validation using Yup
const resetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

function ResetPassword() {
  const [firebaseError, setFirebaseError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // useForm hook to handle form state and validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  // Function to handle resetting the password
  const handlePasswordReset = async (data) => {
    setFirebaseError("");
    setResetMessage("");

    try {
      await sendPasswordResetEmail(auth, data.email);
      setResetMessage(
        "If you have a registered account with us, you'll receive an email with instructions on how to reset your password."
      );
      reset();
    } catch (err) {
      setFirebaseError("Error sending reset email. Please try again.");
    }
  };

  return (
    <>
      <div className="section reset-password">
        <div className="container container--xs">
          <div className="reset-password__wrapper">
            {!resetMessage ? (
              <>
                <h2>Forgot Your Password?</h2>
                <p>
                  No worries. Enter your email address below and we'll send you
                  a reset link for your password.
                </p>

                <form
                  className="form"
                  onSubmit={handleSubmit(handlePasswordReset)}
                >
                  <div className="form-row">
                    <div className="form-group">
                      <div className="form-group__wrap">
                        <input
                          id="email"
                          type="email"
                          placeholder=" "
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
                      <button
                        type="submit"
                        className="btn w-100"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Sending Reset Link..."
                          : "Send Reset Link"}
                      </button>
                    </div>
                  </div>
                </form>

                {firebaseError && <p className="error">{firebaseError}</p>}
              </>
            ) : (
              <>
                <h2>Check Your Inbox</h2>
                <p>{resetMessage}</p>
              </>
            )}
          </div>

          <div className="reset-password__links">
            You can{" "}
            <Link to="/auth" className="link">
              Sign In
            </Link>{" "}
            or{" "}
            <Link to="/auth" className="link">
              Create An Account
            </Link>
            .
          </div>
        </div>
      </div>
    </>
  );
}

export { ResetPassword };
