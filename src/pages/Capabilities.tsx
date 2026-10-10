import Capabilities from '../components/Capabilities';
import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function CapabilitiesPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      index: '01 / WHAT WE MAKE',
      title: <>Systems designed<br />to make people <em>feel.</em></>,
      description: 'Where considered design meets useful technology. Every part of the experience has a reason to be there.',
    },
    fa: {
      index: '01 / آنچه می‌سازیم',
      title: <>سیستم‌هایی طراحی شده<br />تا باعث <em>حس خوشحالکی</em> شوند.</>,
      description: 'جایی که طراحی دقیق با تکنولوژی مفید ملاقات می‌کند. هر بخش از تجربه دلیلی برای وجود دارد.',
    },
  };

  const t = content[language];

  return (
    <section className="section section-shell capabilities-section" id="capabilities" data-environment="capabilities" aria-labelledby="capabilities-title">
      <div className="page-container">
        <div className="section-heading section-heading--split">
          <div className="section-heading-left">
            <Reveal immediate><p className="eyebrow section-index"><span>01</span> / {language === 'en' ? 'WHAT WE MAKE' : 'آنچه می‌سازیم'}</p></Reveal>
            <Reveal immediate delay={70}><h2 id="capabilities-title">{t.title}</h2></Reveal>
          </div>
          <Reveal immediate delay={100} className="section-heading-right"><p>{t.description}</p></Reveal>
        </div>
        <Reveal className="capability-list-reveal" immediate delay={120}><Capabilities /></Reveal>
      </div>
    </section>
  );
}
