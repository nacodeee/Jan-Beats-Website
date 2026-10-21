import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { money } from '../../lib/format';

export function LicenseSection({ licenses, onChooseInCatalog }) {
  const { lang, t } = useLang();

  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="section licenseSection" id="licenses">
      <div className="sectionHead">
        <div>
          <p className="eyebrow">03 / YOUR RIGHTS</p>
          <h2>{t.licenses}</h2>
          <p className="muted">{t.licSub}</p>
        </div>
      </div>
      <div className="licenseGrid">
        {licenses.map((l, i) => (
          <article
            className={`licenseCard ${i === 1 ? 'popular' : ''} ${l.is_exclusive ? 'exclusiveCard' : ''}`}
            key={l.id}
          >
            <div className="licenseTop">
              <span>0{i + 1} / LICENSE</span>
              {i === 1 && <b>POPULAR</b>}
              {l.is_exclusive && <b>{lang === 'es' ? 'EXCLUSIVA' : 'EXCLUSIVE'}</b>}
            </div>
            <h3>{l.name}</h3>
            <div className="licensePrice">{money(l.price, lang)}</div>
            <ul>
              {l.items.map((item) => (
                <li key={item}><span>↗</span>{item}</li>
              ))}
            </ul>
            <button
              className={i === 1 ? 'primary' : 'secondary'}
              onClick={() => { onChooseInCatalog(l.id); jump('beats'); }}
            >
              {t.chooseInCatalog}
              <ArrowUpRight size={16} />
            </button>
            <p className="licenseFine">{t.licenseFine}</p>
          </article>
        ))}
      </div>
      <p className="legalNote">{t.exclusiveNote}</p>
    </section>
  );
}
