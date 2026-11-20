import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, updateQuantity } from './CartSlice';
import { useAnalytics } from './analytics/AnalyticsContext';
import { formatEur } from './data/products';

export default function CartItem({ onContinueShopping }) {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const { record } = useAnalytics();
  const total = items.reduce((sum, item) => sum + item.priceEur * item.quantity, 0);
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);

  function changeQuantity(item, quantity) {
    if (quantity === 0) {
      dispatch(removeItem({ id: item.id }));
    } else {
      dispatch(updateQuantity({ id: item.id, quantity }));
    }
  }

  function beginCheckout() {
    record('begin_checkout', 'demo_cart', Math.round(total * 100) / 100);
    window.alert('Demo checkout only. No payment is required.');
  }

  return (
    <section className="mrl-cart" aria-label="Shopping cart">
      <div className="mrl-heading">
        <h2>Your demo cart</h2>
        <button type="button" onClick={onContinueShopping}>Back to plants</button>
      </div>
      {items.length === 0 && <p>Your cart is empty.</p>}
      {items.map((item) => (
        <article className="mrl-cart-line" key={item.id}>
          <span className="mrl-emoji" aria-hidden="true">{item.emoji}</span>
          <div className="mrl-cart-product">
            <strong>{item.name}</strong>
            <p>{formatEur(item.priceEur)} each · {formatEur(item.priceEur * item.quantity)} total</p>
          </div>
          <div className="mrl-qty">
            <button
              type="button"
              aria-label={`Decrease ${item.name}`}
              onClick={() => changeQuantity(item, item.quantity - 1)}
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              type="button"
              aria-label={`Increase ${item.name}`}
              onClick={() => changeQuantity(item, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="mrl-remove"
            aria-label={`Remove ${item.name}`}
            onClick={() => dispatch(removeItem({ id: item.id }))}
          >
            Remove
          </button>
        </article>
      ))}
      <div className="mrl-heading">
        <strong>{quantity} {quantity === 1 ? 'item' : 'items'} · {formatEur(total)}</strong>
        <button type="button" disabled={!items.length} onClick={beginCheckout}>Demo checkout</button>
      </div>
    </section>
  );
}

CartItem.propTypes = {
  onContinueShopping: PropTypes.func.isRequired,
};
