import { ShoppingBag, X, ArrowUpRight, Music2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLang } from '../../context/LangContext';
import { money } from '../../lib/format';

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, total, count, clearCart } = useCart();
  const { lang, t } = useLang();

  if (!cartOpen) return null;

  const handleCheckout = async () => {
    try {
      const items = cart.map((item) => ({ beatId: item.id, licenseId: item.licenseId }));
      const resp = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        showToast(data.error || t.checkoutError, 'error');
        return;
      }

      const { url } = await resp.json();
      if (url) {
        window.location.href = url;
      } else {
        showToast(t.paymentsNotConfigured, 'error');
      }
    } catch {
      showToast(t.checkoutError, 'error');
    }
  };

  const jump = (id) => {
    setCartOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setCartOpen(false); }}>
      <aside className="cartDrawer">
        <div className="drawerHead">
          <div>
            <p className="eyebrow">JAN / CHECKOUT</p>
            <h2>{t.cart} <span>({count})</span></h2>
          </div>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>
        {count === 0 ? (
          <div className="cartEmpty">
            <ShoppingBag size={34} />
            <p>{t.cartEmpty}</p>
            <button className="secondary" onClick={() => jump('beats')}>{t.explore}</button>
          </div>
        ) : (
          <>
            <div className="cartItems">
              {cart.map((item) => (
                <div className="cartItem" key={item.key}>
                  <div className="miniCover"><Music2 size={20} /></div>
                  <div className="cartItemInfo">
                    <strong>{item.title}</strong>
                    <span>{item.license}</span>
                    <button onClick={() => removeFromCart(item.key)}>{t.remove}</button>
                  </div>
                  <b>{money(item.price, lang)}</b>
                </div>
              ))}
            </div>
            <div className="cartTotal">
              <span>{t.subtotal}</span>
              <strong>{money(total, lang)}</strong>
            </div>
            <button className="primary full" onClick={handleCheckout}>
              {t.checkout}
              <ArrowUpRight size={16} />
            </button>
          </>
        )}
      </aside>
    </div>
  );
}
