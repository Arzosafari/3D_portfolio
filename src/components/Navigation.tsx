import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import BrandSymbol from './BrandSymbol';
import { useLanguage } from '../contexts/LanguageContext';

const links = [
  { label: 'Home', labelFa: 'خانه', href: '/' },
  { label: 'Work', labelFa: 'کارها', href: '/work' },
  { label: 'Capabilities', labelFa: 'توانایی‌ها', href: '/capabilities' },
  { label: 'AI Lab', labelFa: 'آزمایشگاه هوش مصنوعی', href: '/ai-lab' },
  { label: 'Our Team', labelFa: 'تیم ما', href: '/our-team' },
  { label: 'About', labelFa: 'درباره ما', href: '/about' },
  { label: 'Contact', labelFa: 'تماس', href: '/contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fa' : 'en');
  };

  return (
    <header className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''} ${menuOpen ? 'site-nav--open' : ''}`}>
      <div className="nav-inner">
        <Link className="brand-lockup" to="/" onClick={closeMenu} aria-label="NOVA AI Studio home">
          <BrandSymbol />
          <span className="brand-wordmark">NOVA<span>AI STUDIO</span></span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.href} to={link.href} end={link.href === '/'}>
              {({ isActive }) => (
                <>
                  <span className="nav-link__label">{language === 'en' ? link.label : link.labelFa}</span>
                  {isActive && <span className="nav-link__current" aria-hidden="true" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="lang-toggle" onClick={toggleLanguage} aria-label="Toggle language">
            {language === 'en' ? 'FA' : 'EN'}
          </button>
          <Link className="nav-cta" to="/contact">{language === 'en' ? 'Start a project' : 'شروع پروژه'} <span aria-hidden="true">↗</span></Link>
        </div>

        <button
          className="menu-toggle"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span /><span />
        </button>
      </div>

      <div className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`} id="mobile-navigation" aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          <button className="mobile-lang-toggle" onClick={toggleLanguage} aria-label="Toggle language">
            {language === 'en' ? 'FA' : 'EN'}
          </button>
          {links.map((link, index) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              onClick={closeMenu}
              style={{ '--item-index': index } as React.CSSProperties}
              tabIndex={menuOpen ? 0 : -1}
            >
              {({ isActive }) => (
                <>
                  <span>0{index + 1}</span>
                  <span className={isActive ? 'mobile-nav__label mobile-nav__label--current' : 'mobile-nav__label'}>{language === 'en' ? link.label : link.labelFa}</span>
                  <span aria-hidden="true">{isActive ? '●' : '↗'}</span>
                </>
              )}
            </NavLink>
          ))}
          <Link className="mobile-nav-cta" to="/contact" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>{language === 'en' ? 'Start a project' : 'شروع پروژه'} <span aria-hidden="true">↗</span></Link>
        </nav>
      </div>
    </header>
  );
}
