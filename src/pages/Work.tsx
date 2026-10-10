import SelectedExperiments from '../features/work/SelectedExperiments';
import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function WorkPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      index: '06 / SELECTED EXPERIMENTS',
      title: <>Ideas made <em>tangible.</em></>,
      description: 'Self-initiated concepts exploring what design and intelligent technology can make possible.',
      disclaimer: 'These are concept projects created for exploration—not commissioned client work.',
    },
    fa: {
      index: '06 / آزمایش‌های منتخب',
      title: <>ایده‌ها <em>ملموس.</em></>,
      description: 'مفاهیم خود-راه اندازی شده که امکانات طراحی و تکنولوژی هوشمند را بررسی می‌کنند.',
      disclaimer: 'این پروژه‌های مفهومی برای اکتشاف ایجاد شده‌اند—کار سفارشی مشتری نیست.',
    },
  };

  const t = content[language];

  return (
    <section className="section section-shell work-section" id="work" data-environment="work" aria-labelledby="work-title">
      <div className="page-container">
        <div className="section-heading section-heading--split work-heading">
          <div className="section-heading-left">
            <Reveal immediate><p className="eyebrow section-index"><span>06</span> / {language === 'en' ? 'SELECTED EXPERIMENTS' : 'آزمایش‌های منتخب'}</p></Reveal>
            <Reveal immediate delay={70}><h2 id="work-title">{t.title}</h2></Reveal>
          </div>
          <Reveal immediate delay={100} className="section-heading-right"><p>{t.description}</p></Reveal>
        </div>
        <Reveal immediate delay={120}><SelectedExperiments /></Reveal>
        <p className="work-disclaimer"><span>✳</span> {t.disclaimer}</p>
      </div>
    </section>
  );
}
