import { Headphones, ShieldCheck, Download, ArrowUpRight } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import React from 'react';

export function Hero() {
  const { t } = useLang();
  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero">
      <div className="heroShade"></div>
      <div className="heroContent">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>
          {t.headline.split('\n').map((x, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {x}
            </React.Fragment>
          ))}
        </h1>
        <p className="heroSub">{t.sub}</p>
        <button className="primary" onClick={() => jump('beats')}>
          {t.explore}
          <ArrowUpRight size={17} />
        </button>
        <div className="heroMeta">
          <span><Headphones size={15} /> Curated sound</span>
          <span><ShieldCheck size={15} /> Clear licenses</span>
          <span><Download size={15} /> Instant delivery*</span>
        </div>
        <small>*After checkout integration is enabled.</small>
      </div>
      <div className="heroStamp">
        JAN<br />
        <span>PRODUCER</span>
        <b>001 — 026</b>
      </div>
    </section>
  );
}
