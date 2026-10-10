import DiscoveryFlow from '../features/discovery/DiscoveryFlow';
import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function DiscoveryPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      index: '03 / FIND YOUR DIRECTION',
      title: <>The right website starts with <em>the right questions.</em></>,
      description: 'A small discovery tool for a big first decision. Share a little about your business and get a tailored experience direction you can actually build on.',
      trustLabel: 'Not a generic template.',
      trustDesc: 'A recommendation shaped around your goals.',
      indexMark: 'N / 03',
    },
    fa: {
      index: '03 / مسیر خود را پیدا کنید',
      title: <>وب‌سایت درست با <em>سوالات درست.</em></>,
      description: 'یک ابزار کشف کوچک برای یک تصمیم بزرگ اول. کمی درباره کسب‌وکار خود به اشتراک بگذارید و یک مسیر تجربه متناسب واقعاً قابل ساخت دریافت کنید.',
      trustLabel: 'یک قالب عمومی نیست.',
      trustDesc: 'توصیه‌ای متناسب با اهداف شما.',
      indexMark: 'N / 03',
    },
  };

  const t = content[language];

  return (
    <section className="section section-shell discovery-section" id="discovery" data-environment="discovery" aria-labelledby="discovery-title">
      <div className="page-container">
        <div className="section-heading section-heading--split">
          <div className="section-heading-left">
            <Reveal immediate><p className="eyebrow section-index"><span>03</span> / {language === 'en' ? 'FIND YOUR DIRECTION' : 'مسیر خود را پیدا کنید'}</p></Reveal>
            <Reveal immediate delay={70}><h2 id="discovery-title">{t.title}</h2></Reveal>
          </div>
          <Reveal immediate delay={100} className="section-heading-right"><p className="section-body">{t.description}</p></Reveal>
        </div>
        <Reveal className="discovery-content" immediate delay={120}>
          <div className="discovery-trust"><span className="discovery-trust-icon">✳</span><span><strong>{t.trustLabel}</strong><small>{t.trustDesc}</small></span></div>
          <div className="discovery-index-mark" aria-hidden="true">{t.indexMark}</div>
          <DiscoveryFlow />
        </Reveal>
      </div>
    </section>
  );
}
