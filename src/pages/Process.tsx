import HowWeBuild from '../components/HowWeBuild';
import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function ProcessPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      index: '04 / HOW WE BUILD',
      title: <>Good digital experiences aren't <em>accidents.</em></>,
      description: 'Four clear steps. One thoughtful team. A process that leaves room for the unexpected.',
    },
    fa: {
      index: '04 / چگونه می‌سازیم',
      title: <>تجربیات دیجیتال خوب <em>تصادفی نیست.</em></>,
      description: 'چهار مرحله واضح. یک تیم با دقت. فرآیندی که جای unexpected باقی می‌گذارد.',
    },
  };

  const t = content[language];

  return (
    <section className="section section-shell process-section" id="process" data-environment="process" aria-labelledby="process-title">
      <div className="page-container">
        <div className="section-heading section-heading--split section-heading--process">
          <div className="section-heading-left">
            <Reveal immediate><p className="eyebrow section-index"><span>04</span> / {language === 'en' ? 'HOW WE BUILD' : 'چگونه می‌سازیم'}</p></Reveal>
            <Reveal immediate delay={70}><h2 id="process-title">{t.title}</h2></Reveal>
          </div>
          <Reveal immediate delay={100} className="section-heading-right"><p>{t.description}</p></Reveal>
        </div>
        <Reveal immediate delay={120}><HowWeBuild /></Reveal>
      </div>
    </section>
  );
}
