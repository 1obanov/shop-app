import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ContextProvider } from "./context/context";
import { ToastContainer } from "react-toastify";

import { Header } from "./components/header/Header";
import { Footer } from "./components/shared/Footer";

import { Shop } from "./pages/Shop";
import { ProductDetails } from "./pages/ProductDetails";
import { WishList } from "./pages/WishList";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrderSuccess } from "./pages/OrderSuccess";
import { NotFound } from "./pages/NotFound";
import { MiniCart } from "./components/cart/MiniCart";
import { Auth } from "./components/user/Auth";
import { ResetPassword } from "./pages/ResetPassword";
import { WishListPopup } from "./components/wishlist/WishListPopup";

import { UserAccount } from "./components/user/UserAccount";
import { UserDetails } from "./components/user/UserDetails";
import { UserOrders } from "./components/user/UserOrders";
import { UserOrderDetails } from "./components/user/UserOrderDetails";
import { UserAddresses } from "./components/user/UserAddresses";

import { ScrollToTop } from "./components/shared/ScrollToTop";

function App() {
  return (
    <ContextProvider>
      <Router>
        <ScrollToTop>
          <div className="wrapper">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/wishlist" element={<WishList />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/account" element={<UserAccount />}>
                  <Route path="details" element={<UserDetails />} />
                  <Route path="orders" element={<UserOrders />} />
                  <Route path="orders/:id" element={<UserOrderDetails />} />
                  <Route path="addresses" element={<UserAddresses />} />
                </Route>
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <MiniCart />
              <WishListPopup />
            </main>
            <Footer />
          </div>
          <ToastContainer />
        </ScrollToTop>
      </Router>
    </ContextProvider>
  );
}

export default App;
