/**
 * Runtime smoke test — renders every public page (and the scene host) through
 * the real provider tree using react-dom/server inside jsdom. It catches
 * broken imports, hook-order mistakes, context wiring errors and JSX runtime
 * problems without a browser. WebGL scenes stay lazy and are covered by the
 * production build + manual preview.
 *
 * Run: npm run smoke
 */
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
function expose(name: string, value: unknown) {
  Object.defineProperty(globalThis, name, { value, writable: true, configurable: true });
}
expose('window', dom.window);
expose('document', dom.window.document);
expose('navigator', dom.window.navigator);
expose('HTMLElement', dom.window.HTMLElement);
expose('Event', dom.window.Event);
// jsdom does not implement matchMedia; components only read .matches (false = motion allowed, WebGL paths unaffected in SSR).
const matchMediaStub = (query: string) => ({
  matches: false, media: query, onchange: null,
  addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; },
});
expose('matchMedia', matchMediaStub);
(dom.window as any).matchMedia = matchMediaStub;
expose('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16));
expose('cancelAnimationFrame', (id: number) => clearTimeout(id));

import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { EnvironmentProvider } from '../src/environment/EnvironmentProvider';
import Navigation from '../src/components/Navigation';
import Footer from '../src/components/Footer';
import SceneHost, { sceneKeyForPath } from '../src/environment/SceneHost';
import Home from '../src/pages/Home';
import Work from '../src/pages/Work';
import Capabilities from '../src/pages/Capabilities';
import AILab from '../src/pages/AILab';
import OurTeam from '../src/pages/OurTeam';
import About from '../src/pages/About';
import Contact from '../src/pages/Contact';
import Assistant from '../src/pages/Assistant';
import Discovery from '../src/pages/Discovery';
import Process from '../src/pages/Process';

let failures = 0;

function check(name: string, element: ReactElement, mustContain: string[]) {
  try {
    const html = renderToString(
      <MemoryRouter>
        <LanguageProvider>
          <EnvironmentProvider>{element}</EnvironmentProvider>
        </LanguageProvider>
      </MemoryRouter>,
    );
    const missing = mustContain.filter((needle) => !html.includes(needle));
    if (missing.length) {
      failures += 1;
      console.error(`✗ ${name} — missing content: ${missing.join(', ')}`);
    } else {
      console.log(`✓ ${name} (${html.length} bytes)`);
    }
  } catch (error) {
    failures += 1;
    console.error(`✗ ${name} — render error:`, error);
  }
}

check('Navigation', <Navigation />, ['NOVA', 'Main navigation', 'AI Lab', 'Our Team']);
check('Home', <Home />, ['hero-title', 'home-entry', 'home-work', 'home-capabilities', 'home-ai', 'home-contact', 'AI Fashion Experience', 'Intelligent assistants']);
check('Work', <Work />, ['work-title', 'AI Fashion Experience', 'Intelligent Health Platform', 'Smart Commerce']);
check('Capabilities', <Capabilities />, ['capabilities-title', 'AI-powered websites', '3D &amp; interactive experiences', 'Intelligent assistants', 'Personalized experiences']);
check('AILab', <AILab />, ['lab-title', 'Portfolio assistant', 'Fashion intelligence studio', 'Research &amp; paper explainer', 'AI concept explorer']);
check('OurTeam', <OurTeam />, ['our-team-title', 'Founder &amp; Creative Director', 'AI Engineer', 'UX Designer']);
check('About', <About />, ['about-title', 'about-story-title', 'about-method-title', 'about-principles-title', 'Discover', 'Launch']);
check('Contact', <Contact />, ['contact-title', 'mailto:hello@nova.studio', 'HELLO@NOVA.STUDIO', 'Instagram', 'LinkedIn']);
check('Assistant', <Assistant />, ['assistant-title', 'NOVA AI']);
check('Discovery', <Discovery />, ['discovery-title']);
check('Process', <Process />, ['process-title', 'Good digital experiences']);
check('Footer', <Footer />, ['HELLO@NOVA.STUDIO', 'Footer navigation']);
function checkHost(name: string, initialEntry: string, mustContain: string[]) {
  try {
    const html = renderToString(
      <MemoryRouter initialEntries={[initialEntry]}>
        <LanguageProvider>
          <EnvironmentProvider>
            <SceneHost />
          </EnvironmentProvider>
        </LanguageProvider>
      </MemoryRouter>,
    );
    const missing = mustContain.filter((needle) => !html.includes(needle));
    if (missing.length) {
      failures += 1;
      console.error(`✗ ${name} — missing content: ${missing.join(', ')}`);
    } else {
      console.log(`✓ ${name} (${html.length} bytes)`);
    }
  } catch (error) {
    failures += 1;
    console.error(`✗ ${name} — render error:`, error);
  }
}

// jsdom has no WebGL, so SceneHost must degrade to the CSS environment.
checkHost('SceneHost @ / (no-WebGL fallback)', '/', ['environment-fallback-css', 'environment-fallback-layers']);
checkHost('SceneHost @ /admin', '/admin', ['environment-stage--admin']);

// Route → world mapping must cover every page.
const expectedScenes: Array<[string, string]> = [
  ['/', 'home'], ['/work', 'work'], ['/capabilities', 'capabilities'], ['/ai-lab', 'lab'],
  ['/our-team', 'team'], ['/about', 'about'], ['/contact', 'contact'],
  ['/assistant', 'corridor'], ['/discovery', 'corridor'], ['/process', 'corridor'], ['/admin', 'none'],
];
for (const [path, scene] of expectedScenes) {
  const actual = sceneKeyForPath(path);
  if (actual !== scene) {
    failures += 1;
    console.error(`✗ sceneKeyForPath('${path}') → '${actual}', expected '${scene}'`);
  }
}
console.log(`✓ route → scene mapping (${expectedScenes.length} routes)`);

if (failures > 0) {
  console.error(`\n${failures} smoke check(s) failed.`);
  process.exit(1);
}
console.log('\nAll smoke checks passed.');
