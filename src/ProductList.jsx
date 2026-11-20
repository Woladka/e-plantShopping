import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from './CartSlice';
import CartItem from './CartItem';
import { demoProducts, formatEur } from './data/products';
import { useAnalytics } from './analytics/AnalyticsContext';
import './ProductList.css';

export default function ProductList() {
  const [showCart, setShowCart] = useState(false);
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const { record } = useAnalytics();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  function addToCart(product) {
    dispatch(addItem(product));
    record('add_to_cart', product.id, product.priceEur);
  }

  return (
    <main className="mrl-store">
      <header className="mrl-topbar">
        <strong>Paradise Nursery</strong>
        <button type="button" onClick={() => setShowCart(!showCart)}>
          {showCart ? 'Browse plants' : `Cart (${cartCount})`}
        </button>
      </header>
      {showCart ? (
        <CartItem onContinueShopping={() => setShowCart(false)} />
      ) : (
        <>
          <h2 className="mrl-intro">Shop plants</h2>
          <section className="mrl-grid" aria-label="Demo products">
            {demoProducts.map((product) => (
              <article className="mrl-product" key={product.id}>
                <span className="mrl-emoji" aria-hidden="true">{product.emoji}</span>
                <span className="mrl-category">{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>{formatEur(product.priceEur)}</strong>
                <div className="mrl-row">
                  <button
                    type="button"
                    className="mrl-outline"
                    onClick={() => record('view_item', product.id, product.priceEur)}
                  >
                    Track product view
                  </button>
                  <button type="button" onClick={() => addToCart(product)}>Add to cart</button>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
