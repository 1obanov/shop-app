import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HeaderActions } from "./HeaderActions";
import { CheckoutStepper } from "../checkout/CheckoutStepper";

function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const location = useLocation();
  const isCheckoutPage = location.pathname === "/checkout";

  // Effect to track page scroll and update `hasScrolled` accordingly
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`header 
    ${hasScrolled ? "scrolled" : ""} 
    ${isCheckoutPage ? "header--checkout" : ""}`}
    >
      <div className="container">
        <Link to={`/`} className="logo">
          Cartify
        </Link>
        {isCheckoutPage && <CheckoutStepper />}
        {!isCheckoutPage && <HeaderActions />}
      </div>
    </header>
  );
}

export { Header };
