import { useState } from "react";
import { Login } from "../../components/user/Login";
import { Register } from "../../components/user/Register";
import { Truck, BookUser, RefreshCw } from 'lucide-react';

function Auth() {
  const [authMode, setAuthMode] = useState("login");

  return (
    <>
      <div className="section auth">
        <div className="container container--sm">
          <div className="auth__wrapper">
            <div className="auth__item auth__item--login">
              <h2>Already have an account? Log in</h2>
              {authMode === "login" && <Login />}

              {authMode !== "login" && (
                <span
                  className="btn btn--outline w-100"
                  onClick={() => setAuthMode("login")}
                >
                  Sign In
                </span>
              )}
            </div>
            <div className="auth__item auth__item--register">
              <h2>Don't have an account yet? Register now</h2>

              {authMode === "register" && <Register />}

              {authMode !== "register" && (
                <>
                  <span
                    className="btn btn--outline w-100"
                    onClick={() => setAuthMode("register")}
                  >
                    Create Account
                  </span>

                  <ul className="auth__options-register">
                    <li>
                      <span className="icon">
                        <Truck strokeWidth="1.2" size="22" />
                      </span>
                      Track your orders
                    </li>
                    <li>
                      <span className="icon">
                        <BookUser strokeWidth="1.2" size="22" />
                      </span>
                      Save your shipping and payment details and save time next
                      time you shop with us
                    </li>
                    <li>
                      <span className="icon">
                        <RefreshCw strokeWidth="1.2" size="22" />
                      </span>
                      You will be able to make returns online
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { Auth };
