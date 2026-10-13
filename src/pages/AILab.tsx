import ExperienceLab from '../features/lab/ExperienceLab';
import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function AILabPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      index: '05 / THE EXPERIMENTAL SIDE',
      title: <><span>AI</span> LAB</>,
      subtitle: <>Explore AI through <em>interaction.</em><br />Experiment with intelligent systems,<br />personalized recommendations and AI-assisted research.</>,
      footnote: 'EXPERIMENTAL BY NATURE / USEFUL BY DESIGN',
      note: 'EACH TOOL RUNS ON A LIVE MODEL ↑',
    },
    fa: {
      index: '05 / جنبه آزمایشی',
      title: 'آزمایشگاه هوش مصنوعی',
      subtitle: <>هوش مصنوعی را از طریق <em>تعامل</em> کاوش کنید.<br />با سیستم‌های هوشمند، پیشنهادهای شخصی‌سازی‌شده<br />و پژوهش با کمک هوش مصنوعی آزمایش کنید.</>,
      footnote: 'طبیعتاً آزمایشی / مفید به طراحی',
      note: 'هر ابزار روی یک مدل زنده اجرا می‌شود ↑',
    },
  };

  const t = content[language];

  return (
    <section className="section section-shell lab-section" id="ai-lab" data-environment="ai-lab" aria-labelledby="lab-title">
      <div className="lab-backdrop-mark" aria-hidden="true">AI</div>
      <div className="page-container">
        <div className="section-heading section-heading--split lab-heading">
          <div className="section-heading-left">
            <Reveal immediate><p className="eyebrow section-index"><span>05</span> / {language === 'en' ? 'THE EXPERIMENTAL SIDE' : 'جنبه آزمایشی'}</p></Reveal>
            <Reveal immediate delay={70}><h2 id="lab-title">{t.title}</h2></Reveal>
          </div>
          <Reveal immediate delay={100} className="section-heading-right"><p>{t.subtitle}</p></Reveal>
        </div>
        <Reveal immediate delay={120}><ExperienceLab /></Reveal>
        <div className="lab-footnote"><span>{t.footnote}</span><span>{t.note}</span></div>
      </div>
    </section>
  );
}
