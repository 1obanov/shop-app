import { useContext, useEffect } from "react";
import { ShopContext } from "../context/context";
import { GoodsList } from "../components/goods/GoodsList";
import { Preloader } from "../components/shared/Preloader";

function Shop() {
  const { state, dispatch } = useContext(ShopContext);
  const { goods, ratings, loadingGoods } = state;

  useEffect(() => {
    if (!goods.length) {
      // If there are no goods in the state, fetch data from API
      fetch("https://fakestoreapi.in/api/products?limit=50")
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            const goodsWithRatings = data.products.map((product) => ({
              ...product,
              rating: ratings[product.id],
            }));
            // Dispatch action to update the goods in the context
            dispatch({ type: "SET_GOODS", payload: goodsWithRatings });
          }
        });
    }
  }, [goods, dispatch, ratings]);

  return loadingGoods ? (
    <Preloader />
  ) : (
    <div className="section shop">
      <div className="container">
        <div className="headline">
          <h1 className="headline__title">Shop</h1>
        </div>
        <GoodsList />
      </div>
    </div>
  );
}

export { Shop };
