import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function AboutPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      index: '07 / A LITTLE ABOUT US',
      title: <>Technology should feel <em>human.</em></>,
      description: "We're a small creative technology studio combining design, interaction, and artificial intelligence to make digital experiences that are not only beautiful, but genuinely useful.",
      link: 'A little more about our approach',
    },
    fa: {
      index: '07 / کمی درباره ما',
      title: <>تکنولوژی باید <em>انسانی</em> باشد.</>,
      description: 'ما یک استودیوی کوچک تکنولوژی خلاق هستیم که طراحی، تعامل و هوش مصنوعی را ترکیب می‌کنیم تا تجربیات دیجیتال بسازیم که نه تنها زیبا، بلکه واقعاً مفید هستند.',
      link: 'کمی بیشتر درباره رویکرد ما',
    },
  };

  const t = content[language];

  return (
    <section className="section section-shell about-section" id="about" data-environment="about" aria-labelledby="about-title">
      <div className="page-container">
        <div className="section-heading section-heading--split">
          <div className="section-heading-left">
            <Reveal immediate><p className="eyebrow section-index"><span>07</span> / {language === 'en' ? 'A LITTLE ABOUT US' : 'کمی درباره ما'}</p></Reveal>
            <Reveal immediate delay={70}><h2 id="about-title">{t.title}</h2></Reveal>
          </div>
          <Reveal immediate delay={100} className="section-heading-right"><p>{t.description}</p></Reveal>
        </div>
        <Reveal className="about-copy" immediate delay={120}><div className="about-symbol" aria-hidden="true"><span /><i /><b /></div><a href="/contact" className="text-link">{t.link} <span>↗</span></a></Reveal>
      </div>
    </section>
  );
}
