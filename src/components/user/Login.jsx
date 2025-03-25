import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

// Schema for form validation using Yup
const loginSchema = yup.object().shape({
  login_email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  login_password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // useForm hook to handle form state and validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // Function to handle login with email and password
  const handleLogin = async (data) => {
    setFirebaseError("");

    try {
      await signInWithEmailAndPassword(
        auth,
        data.login_email,
        data.login_password
      );
      navigate("/account");
    } catch (err) {
      setFirebaseError(
        "Looks like your email and password don't match. Please try again."
      );
    }
  };

  // Function to handle login with Google
  const handleGoogleLogin = async () => {
    setFirebaseError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Split first and last name
      const [firstName, lastName] = user.displayName?.split(" ") || ["", ""];

      // Add user to Firestore if not already present
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          firstName: firstName,
          lastName: lastName,
          email: user.email || "",
          photoURL: user.photoURL || "",
          address: "",
        });
      }

      navigate("/account");
    } catch (err) {
      setFirebaseError("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <>
      <form className="form form--login" onSubmit={handleSubmit(handleLogin)}>
        <div className="form-row">
          <div className="form-group">
            <div className="form-group__wrap">
              <input
                id="login_email"
                type="email"
                placeholder=" "
                {...register("login_email")}
              />
              <label className="label" htmlFor="login_email">
                Email
              </label>
            </div>
            {errors.login_email && (
              <p className="error">{errors.login_email.message}</p>
            )}
          </div>

          <div className="form-group">
            <div className="form-group__wrap form-group__wrap--icon">
              <input
                id="login_password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                {...register("login_password")}
              />
              <label className="label" htmlFor="login_password">
                Password
              </label>
              <span
                className="password-toggle"
                onClick={() => togglePassword()}
              >
                {showPassword ? (
                  <Eye strokeWidth="1.2" size="20" />
                ) : (
                  <EyeOff strokeWidth="1.2" size="20" />
                )}
              </span>
            </div>
            {errors.login_password && (
              <p className="error">{errors.login_password.message}</p>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <Link to="/reset-password" className="link">
              Forgot Password
            </Link>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <button type="submit" className="btn w-100" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </div>
      </form>
      {firebaseError && <p className="error">{firebaseError}</p>}

      <div className="google-login">
        <div className="google-login__title">
          <span>Log in or register with</span>
        </div>
        <div className="google-login__btn" onClick={handleGoogleLogin}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <path
              fill="#4285F4"
              d="M14.9 8.161c0-.476-.039-.954-.121-1.422h-6.64v2.695h3.802a3.24 3.24 0 01-1.407 2.127v1.75h2.269c1.332-1.22 2.097-3.02 2.097-5.15z"
            />
            <path
              fill="#34A853"
              d="M8.14 15c1.898 0 3.499-.62 4.665-1.69l-2.268-1.749c-.631.427-1.446.669-2.395.669-1.836 0-3.393-1.232-3.952-2.888H1.85v1.803A7.044 7.044 0 008.14 15z"
            />
            <path
              fill="#FBBC04"
              d="M4.187 9.342a4.17 4.17 0 010-2.68V4.859H1.849a6.97 6.97 0 000 6.286l2.338-1.803z"
            />
            <path
              fill="#EA4335"
              d="M8.14 3.77a3.837 3.837 0 012.7 1.05l2.01-1.999a6.786 6.786 0 00-4.71-1.82 7.042 7.042 0 00-6.29 3.858L4.186 6.66c.556-1.658 2.116-2.89 3.952-2.89z"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export { Login };
