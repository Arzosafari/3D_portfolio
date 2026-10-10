import ExperienceLab from '../features/lab/ExperienceLab';
import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function AILabPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      index: '05 / THE EXPERIMENTAL SIDE',
      title: <><span>AI</span> LAB</>,
      subtitle: <>Intelligence is better<br />when it's <em>doing something.</em></>,
      footnote: 'EXPERIMENTAL BY NATURE / USEFUL BY DESIGN',
      note: 'INTERACT WITH THE CONCEPTS ABOVE ↑',
    },
    fa: {
      index: '05 / جنبه آزمایشی',
      title: 'آزمایشگاه هوش مصنوعی',
      subtitle: <>هوشمندی بهتر است<br />وقتی <em>کاری انجام می‌دهد.</em></>,
      footnote: 'طبیعتاً آزمایشی / مفید به طراحی',
      note: 'با مفاهیم بالا تعامل کنید ↑',
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
