import { Mail, Music2 } from 'lucide-react';
import { SiInstagram, SiYoutube, SiTiktok, SiSoundcloud } from 'react-icons/si';
import { site } from '../../config/site';
import { useLang } from '../../context/LangContext';
import { Link } from 'react-router-dom';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <a className="logo" href="#">JAN<span>®</span></a>
      <p>{site.tagline}</p>
      <div className="socials">
        <a href={site.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
          <SiInstagram size={18} />
        </a>
        <a href={site.socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
          <SiYoutube size={18} />
        </a>
        <a href={site.socials.soundcloud} target="_blank" rel="noreferrer" aria-label="SoundCloud">
          <SiSoundcloud size={18} />
        </a>
        <a href={site.socials.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
          <SiTiktok size={18} />
        </a>
        <a href={`mailto:${site.contactEmail}`} aria-label="Email">
          <Mail size={18} />
        </a>
      </div>
      <div className="footerBottom">
        <span>© 2026 JAN — {t.footer}</span>
        <span>
          <Link to="/legal/privacy">{t.privacy}</Link>
          {' · '}
          <Link to="/legal/terms">{t.terms}</Link>
          {' · '}
          <Link to="/legal/licenses">{t.licenseInfo}</Link>
          {' · '}
          <Link to="/legal/refunds">{t.refunds}</Link>
        </span>
        <span>{t.rights}</span>
      </div>
    </footer>
  );
}
