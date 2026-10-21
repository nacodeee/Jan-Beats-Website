import { ShoppingBag, Globe2, Menu } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export function Header() {
  const { lang, toggle, t } = useLang();
  const { count, setCartOpen } = useCart();
  const [mobileMenu, setMobileMenu] = useState(false);

  const jump = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  };

  return (
    <header className="header">
      <a
        className="logo"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        JAN<span>®</span>
      </a>
      <nav className={mobileMenu ? 'nav open' : 'nav'}>
        <button onClick={() => jump('beats')}>{t.navBeats}</button>
        <button onClick={() => jump('licenses')}>{t.navLic}</button>
        <button onClick={() => jump('about')}>{t.navAbout}</button>
        <button onClick={() => jump('contact')}>{t.navContact}</button>
      </nav>
      <div className="headerActions">
        <button className="lang" onClick={toggle}>
          <Globe2 size={15} />
          {t.language}
        </button>
        <button className="cartButton" onClick={() => setCartOpen(true)} aria-label={t.cart}>
          <ShoppingBag size={18} />
          <span>{count}</span>
        </button>
        <button className="menuButton" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
