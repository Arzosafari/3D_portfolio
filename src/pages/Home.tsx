import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { language } = useLanguage();

  const content = {
    en: {
      eyebrow: 'NOVA AI STUDIO / INDEPENDENT CREATIVE TECHNOLOGY',
      title: <>We build<br /><span className="hero-line-two">digital <em>experiences</em></span><br />that <i>think.</i></>,
      description: 'AI-powered websites and digital experiences designed to help modern businesses stand out, connect, and grow.',
      exploreBtn: 'Explore our capabilities',
      talkBtn: 'Talk to our AI',
      footnoteLeft: 'INDEPENDENT CREATIVE TECHNOLOGY STUDIO',
      footnoteRight: 'DESIGNING FOR WHAT\'S NEXT',
      coordinateTop: '01 / SYSTEM ENTRY',
      coordinateBottom: 'HUMAN-CENTERED INTELLIGENCE',
      baselineLeft: 'SCROLL TO ENTER',
      baselineRight: 'A DIGITAL ENVIRONMENT BY NOVA ↓',
      principle: ['STRATEGY', 'DESIGN', 'INTERACTION', 'INTELLIGENCE', 'EXPERIENCE'],
      principleNote: 'MADE TO WORK / MADE TO FEEL',
    },
    fa: {
      eyebrow: 'نووا ای‌آی استودیو / استودیو تکنولوژی خلاق مستقل',
      title: <>ما تجربیات دیجیتالی می‌سازیم<br /><span className="hero-line-two">که <em>می‌اندیشند.</em></span></>,
      description: 'وب‌سایت‌ها و تجربیات دیجیتال قدرت‌گرفته از هوش مصنوعی که برای کمک به کسب‌وکارهای مدرن طراحی شده‌اند تا متمایز شوند، ارتباط برقرار کنند و رشد کنند.',
      exploreBtn: 'توانایی‌های ما را بررسی کنید',
      talkBtn: 'با هوش مصنوعی ما صحبت کنید',
      footnoteLeft: 'استودیو تکنولوژی خلاق مستقل',
      footnoteRight: 'طراحی برای آینده',
      coordinateTop: '01 / ورود به سیستم',
      coordinateBottom: 'هوشمندسازی با تمرکز بر انسان',
      baselineLeft: 'اسکرول کنید برای ورود',
      baselineRight: 'محیط دیجیتال توسط نووا ↓',
      principle: ['استراتژی', 'طراحی', 'تعامل', 'هوشمندی', 'تجربه'],
      principleNote: 'ساخته شده برای کار / ساخته شده برای حس',
    },
  };

  const t = content[language];

  return (
    <>
      <section className="hero section-shell immersive-hero" id="home" data-environment="entry" aria-labelledby="hero-title">
        <div className="hero-atmosphere" aria-hidden="true" />
        <div className="hero-grid page-container">
          <div className="hero-copy">
            <Reveal immediate>
              <p className="eyebrow hero-eyebrow"><span className="signal-dot" /> {t.eyebrow}</p>
              <h1 id="hero-title">{t.title}</h1>
              <p className="hero-description">{t.description}</p>
              <div className="hero-actions">
                <a className="button button--acid" href="/capabilities">{t.exploreBtn} <span aria-hidden="true">↘</span></a>
                <a className="button button--quiet" href="/assistant"><span className="button-play" aria-hidden="true">↗</span> {t.talkBtn}</a>
              </div>
            </Reveal>
            <div className="hero-footnote"><span>{t.footnoteLeft}</span><span>{t.footnoteRight}</span></div>
          </div>
          <div className="hero-coordinate" aria-hidden="true"><span>{t.coordinateTop}</span><i /><span>{t.coordinateBottom}</span></div>
        </div>
        <div className="hero-baseline page-container"><span>{t.baselineLeft}</span><span className="baseline-line"><i /></span><span className="hero-baseline__right">{t.baselineRight}</span></div>
      </section>

      <section className="principle-strip" data-environment="entry" aria-label="NOVA studio disciplines">
        <div className="page-container principle-strip__inner"><span>{t.principle[0]}</span><i>✳</i><span>{t.principle[1]}</span><i>✳</i><span>{t.principle[2]}</span><i>✳</i><span>{t.principle[3]}</span><i>✳</i><span>{t.principle[4]}</span><span className="principle-strip__note">{t.principleNote}</span></div>
      </section>
    </>
  );
}
