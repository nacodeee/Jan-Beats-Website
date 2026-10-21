import { ArrowUpRight, Mail } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { site } from '../../config/site';

export function ContactForm() {
  const { t } = useLang();

  const handleSubmit = (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    window.location.href = `mailto:${site.contactEmail}?subject=${encodeURIComponent('JAN — ' + d.get('email'))}&body=${encodeURIComponent(d.get('message'))}`;
  };

  return (
    <section className="contactSection" id="contact">
      <div>
        <p className="eyebrow">04 / LET'S WORK</p>
        <h2>{t.contact}</h2>
        <p className="muted">{t.contactSub}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          {t.email}
          <input name="email" type="email" required placeholder="artist@email.com" />
        </label>
        <label>
          {t.message}
          <textarea name="message" rows="3" required placeholder={t.message} />
        </label>
        <button className="primary" type="submit">
          {t.send}
          <ArrowUpRight size={16} />
        </button>
      </form>
    </section>
  );
}
