import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Capabilities from './pages/Capabilities';
import Assistant from './pages/Assistant';
import Discovery from './pages/Discovery';
import Process from './pages/Process';
import AILab from './pages/AILab';
import Work from './pages/Work';
import OurTeam from './pages/OurTeam';
import About from './pages/About';
import Contact from './pages/Contact';
import { EnvironmentProvider } from './environment/EnvironmentProvider';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import SceneHost from './environment/SceneHost';
import AdminPanel from './admin/AdminPanel';

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  // Home already opens inside its navy atrium world; every other route gets the
  // same treatment as a band of live world above its white page.
  const showWorldBand = pathname !== '/';
  return (
    <div className="site-content">
      <Navigation />
      <main>
        {showWorldBand && <div className="world-band" aria-hidden="true" />}
        {children}
      </main>
      <Footer />
    </div>
  );
}

/** Every route starts at the top of its own world; browser history is untouched. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <SceneHost />
      <Routes>
        <Route path="/admin" element={<AdminLayout><AdminPanel /></AdminLayout>} />
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/capabilities" element={<MainLayout><Capabilities /></MainLayout>} />
        <Route path="/assistant" element={<MainLayout><Assistant /></MainLayout>} />
        <Route path="/discovery" element={<MainLayout><Discovery /></MainLayout>} />
        <Route path="/process" element={<MainLayout><Process /></MainLayout>} />
        <Route path="/ai-lab" element={<MainLayout><AILab /></MainLayout>} />
        <Route path="/work" element={<MainLayout><Work /></MainLayout>} />
        <Route path="/our-team" element={<MainLayout><OurTeam /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
      </Routes>
    </>
  );
}

function AppWrapper() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return <AppContent />;
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <EnvironmentProvider>
          <AppWrapper />
        </EnvironmentProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
