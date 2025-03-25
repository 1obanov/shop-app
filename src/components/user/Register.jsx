import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

// Schema for form validation using Yup
const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Register = () => {
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
    resolver: yupResolver(registerSchema),
  });

  // Function to handle the registration process
  const handleRegister = async (data) => {
    setFirebaseError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Update the displayName in Firebase Auth with first and last name
      await updateProfile(user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });

      // Save user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        createdAt: new Date(),
      });

      navigate("/account");
    } catch (err) {
      setFirebaseError("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <form
        className="form form--register"
        onSubmit={handleSubmit(handleRegister)}
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
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
        </div>

        <div className="form-row form-row--half">
          <div className="form-group">
            <div className="form-group__wrap">
              <input
                id="firstName"
                type="text"
                placeholder=" "
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
                type="text"
                placeholder=" "
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
            <div className="form-group__wrap form-group__wrap--icon">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                {...register("password")}
              />
              <label className="label" htmlFor="password">
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
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <button type="submit" className="btn w-100" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </div>
      </form>
      {firebaseError && <p className="error">{firebaseError}</p>}
    </>
  );
};

export { Register };
