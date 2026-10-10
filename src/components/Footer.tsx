import { Link } from 'react-router-dom';
import BrandSymbol from './BrandSymbol';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();

  const content = {
    en: {
      location: 'DALLAS, TX · WORKING EVERYWHERE',
      copyright: '© 2026 NOVA AI STUDIO · CONCEPT SITE / PORTFOLIO SERIES 01',
      links: {
        work: 'Work',
        capabilities: 'Capabilities',
        aiLab: 'AI Lab',
        ourTeam: 'Our Team',
        about: 'About',
      },
    },
    fa: {
      location: 'دالاس، تگزاس · کار در همه جا',
      copyright: '© 2026 NOVA AI STUDIO · سایت مفهومی / سری پرتفولیو 01',
      links: {
        work: 'کارها',
        capabilities: 'قابلیت‌ها',
        aiLab: 'آزمایشگاه هوش مصنوعی',
        ourTeam: 'تیم ما',
        about: 'درباره ما',
      },
    },
  };

  const t = content[language];

  return (
    <footer className="site-footer" data-environment="contact">
      <div className="page-container">
        <div className="footer-top">
          <Link className="brand-lockup footer-brand" to="/"><BrandSymbol /><span className="brand-wordmark">NOVA<span>AI STUDIO</span></span></Link>
          <p>AI × DESIGN × EXPERIENCE<br /><span>{t.location}</span></p>
          <a className="footer-email" href="mailto:hello@nova.studio">HELLO@NOVA.STUDIO <span>↗</span></a>
        </div>
        <div className="footer-bottom">
          <span>{t.copyright}</span>
          <nav aria-label="Footer navigation"><Link to="/work">{t.links.work}</Link><Link to="/capabilities">{t.links.capabilities}</Link><Link to="/ai-lab">{t.links.aiLab}</Link><Link to="/our-team">{t.links.ourTeam}</Link><Link to="/about">{t.links.about}</Link></nav>
          <div className="footer-socials"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
        </div>
      </div>
    </footer>
  );
}
