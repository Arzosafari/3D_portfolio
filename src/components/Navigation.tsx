import { useEffect, useState } from 'react';
import BrandSymbol from './BrandSymbol';

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'AI Lab', href: '#ai-lab' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''} ${menuOpen ? 'site-nav--open' : ''}`}>
      <div className="nav-inner">
        <a className="brand-lockup" href="#home" onClick={closeMenu} aria-label="NOVA AI Studio home">
          <BrandSymbol />
          <span className="brand-wordmark">NOVA<span>AI STUDIO</span></span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>

        <a className="nav-cta" href="#contact">Start a project <span aria-hidden="true">↗</span></a>

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
          {links.map((link, index) => (
            <a key={link.href} href={link.href} onClick={closeMenu} style={{ '--item-index': index } as React.CSSProperties} tabIndex={menuOpen ? 0 : -1}>
              <span>0{index + 1}</span>{link.label}<span aria-hidden="true">↗</span>
            </a>
          ))}
          <a className="mobile-nav-cta" href="#contact" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>Start a project <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  );
}
