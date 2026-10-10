import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import AdminPanel from './admin/AdminPanel';

const EnvironmentStage = lazy(() => import('./environment/EnvironmentStage'));

function AdminLayout({ children }) {
  return <>{children}</>;
}

function MainLayout({ children }) {
  return (
    <div className="site-content">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function AppContent() {
  return (
    <>
      <Suspense fallback={<div className="environment-stage environment-stage--loading" aria-hidden="true"><div className="environment-vignette" /></div>}>
        <EnvironmentStage />
      </Suspense>
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
