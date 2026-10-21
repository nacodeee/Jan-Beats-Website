import { useLang } from '../../context/LangContext';

export function About() {
  const { t } = useLang();
  return (
    <section className="manifesto" id="about">
      <div className="manifestoMark">J<span>A</span>N</div>
      <div>
        <p className="eyebrow">02 / THE APPROACH</p>
        <h2>{t.about}</h2>
        <p>{t.aboutText}</p>
      </div>
      <div className="manifestoSide">
        SOUND<br />
        IS A<br />
        <em>FEELING.</em>
      </div>
    </section>
  );
}
