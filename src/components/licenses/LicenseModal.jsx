import { X, ArrowUpRight } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useCart } from '../../context/CartContext';
import { money } from '../../lib/format';

export function LicenseModal({ beat, licenses, onClose }) {
  const { lang, t } = useLang();
  const { addToCart } = useCart();

  if (!beat) return null;

  const handleSelect = (license) => {
    if (beat.exclusive_sold && license.id === 'exclusive') return;
    addToCart({
      key: `${beat.id}-${license.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      id: beat.id,
      title: beat.title,
      licenseId: license.id,
      license: license.name,
      price: license.price,
      exclusive: license.is_exclusive,
    });
    onClose();
  };

  return (
    <div className="overlay licenseOverlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="licenseModal" role="dialog" aria-modal="true" aria-label={t.details}>
        <div className="drawerHead">
          <div>
            <p className="eyebrow">JAN / LICENSE SELECT</p>
            <h2>{beat.title}</h2>
            <p className="muted">{t.licenseModalSub}</p>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="licenseModalRow">
          {licenses.map((l, i) => {
            const isSold = beat.exclusive_sold && l.is_exclusive;
            return (
              <article className={`licenseOption ${i === 1 ? 'popular' : ''}`} key={l.id}>
                <span className="licenseOptionIndex">0{i + 1} / LICENSE</span>
                <h3>{l.name}</h3>
                <div className="licensePrice">{money(l.price, lang)}</div>
                <ul>
                  {l.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <button
                  className={i === 1 ? 'primary' : 'secondary'}
                  onClick={() => handleSelect(l)}
                  disabled={isSold}
                >
                  {isSold ? t.sold : t.chooseLicense}
                </button>
              </article>
            );
          })}
        </div>
        <p className="licenseFine">{t.licenseFine}</p>
      </section>
    </div>
  );
}
