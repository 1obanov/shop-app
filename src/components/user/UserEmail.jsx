import { useContext } from "react";
import { ShopContext } from "../../context/context";
import { getAuth } from "firebase/auth";

const UserEmail = () => {
  const { state } = useContext(ShopContext);
  const { userDetails } = state;
  const user = getAuth().currentUser;

  const providerId = user?.providerData[0]?.providerId;

  const providerInfo = {
    "google.com": {
      message: "You signed in with Google. The email cannot be updated.",
      icon: (
        <svg
          width="16"
          height="16"
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
      ),
    },
    password: {
      message:
        "You signed in with email and password. The email cannot be updated.",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 -4 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M29.0909 0H2.90909C1.30244 0 0 1.30244 0 2.90909V20.3636C0 21.9703 1.30244 23.2727 2.90909 23.2727H29.0909C30.6976 23.2727 32 21.9703 32 20.3636V2.90909C32 1.30244 30.6976 0 29.0909 0Z"
            fill="url(#paint0_linear_103_1797)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M29.0909 0H2.90909C2.52332 0 2.15223 0.0738135 1.79583 0.221441C1.43942 0.369069 1.12483 0.579272 0.852049 0.852054L13.943 13.943C14.2157 14.2157 14.5303 14.4259 14.8867 14.5735C15.2431 14.7212 15.6142 14.7951 16 14.7951C16.3857 14.7951 16.7568 14.7212 17.1133 14.5735C17.4696 14.4259 17.7842 14.2157 18.057 13.943L31.1479 0.852049C30.8752 0.57927 30.5606 0.369067 30.2042 0.22144C29.8478 0.0738131 29.4767 0 29.0909 0Z"
            fill="url(#paint1_linear_103_1797)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_103_1797"
              x1="16"
              y1="0"
              x2="16"
              y2="23.2727"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FAC227" />
              <stop offset="1" stopColor="#FAA627" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_103_1797"
              x1="16.0002"
              y1="0"
              x2="16.0002"
              y2="14.7951"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FCE4B1" />
              <stop offset="1" stopColor="#FFD272" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
  };

  const { message, icon } = providerInfo[providerId] || {};

  return (
    <div className="account-block">
      <div className="account-block__row">
        {message && (
          <>
            <div className="account-block__item">
              <span>Email</span>
              <span>{userDetails.email}</span>
              <span>{message}</span>
            </div>
            <div className="account-block__item">
              {icon}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { UserEmail };
