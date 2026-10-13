import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';
import { projects } from '../data/projects';
import { capabilities } from '../data/capabilities';
import { labTools } from '../data/labFeatures';

export default function Home() {
  const { language } = useLanguage();

  const content = {
    en: {
      eyebrow: 'faratech_lab / INDEPENDENT CREATIVE TECHNOLOGY',
      title: <>We build<br /><span className="hero-line-two">digital <em>experiences</em></span><br />that <i>think.</i></>,
      description: 'AI-powered websites and digital experiences designed to help modern businesses stand out, connect, and grow.',
      exploreBtn: 'Explore our capabilities',
      talkBtn: 'Talk to our AI',
      footnoteLeft: 'INDEPENDENT CREATIVE TECHNOLOGY STUDIO',
      footnoteRight: 'DESIGNING FOR WHAT\'S NEXT',
      coordinateTop: '01 / SYSTEM ENTRY',
      coordinateBottom: 'HUMAN-CENTERED INTELLIGENCE',
      baselineLeft: 'SCROLL TO ENTER',
      baselineRight: 'A DIGITAL ENVIRONMENT BY faratech_lab ↓',
      principle: ['STRATEGY', 'DESIGN', 'INTERACTION', 'INTELLIGENCE', 'EXPERIENCE'],
      principleNote: 'MADE TO WORK / MADE TO FEEL',
      workIndex: '02 / SELECTED WORK',
      workTitle: <>Ideas made <em>tangible.</em></>,
      workDescription: 'Self-initiated concepts exploring what design and intelligent technology can make possible.',
      workLink: 'Visit the exhibition',
      workMeta: 'CONCEPT / EXPERIMENT',
      capIndex: '03 / WHAT WE MAKE',
      capTitle: <>A system, not <em>a service list.</em></>,
      capDescription: 'Where considered design meets useful technology. Every part of the experience has a reason to be there.',
      capLink: 'Explore the system',
      aiIndex: '04 / THE EXPERIMENTAL SIDE',
      aiTitle: <>Intelligence is better when it's <em>doing something.</em></>,
      aiDescription: 'The AI Lab holds working demonstrations of the intelligence we build into products — assistants, recommendations, personalization, and semantic search.',
      aiLink: 'Enter the AI Lab',
      aiAssistantLink: 'Talk to faratech_lab',
      aiNote: 'FOUR WORKING DEMOS / NO SMOKE AND MIRRORS',
      ctaEyebrow: 'THE NEXT THING STARTS HERE',
      ctaTitle: <>Have an idea<br />worth <em>building?</em></>,
      ctaDescription: 'Let\'s turn it into an intelligent digital experience.',
      ctaButton: 'Start a project',
      ctaSecondary: 'Meet the team',
    },
    fa: {
      eyebrow: 'faratech_lab / استودیو تکنولوژی خلاق مستقل',
      title: <>ما تجربیات دیجیتالی می‌سازیم<br /><span className="hero-line-two">که <em>می‌اندیشند.</em></span></>,
      description: 'وب‌سایت‌ها و تجربیات دیجیتال قدرت‌گرفته از هوش مصنوعی که برای کمک به کسب‌وکارهای مدرن طراحی شده‌اند تا متمایز شوند، ارتباط برقرار کنند و رشد کنند.',
      exploreBtn: 'توانایی‌های ما را بررسی کنید',
      talkBtn: 'با هوش مصنوعی ما صحبت کنید',
      footnoteLeft: 'استودیو تکنولوژی خلاق مستقل',
      footnoteRight: 'طراحی برای آینده',
      coordinateTop: '01 / ورود به سیستم',
      coordinateBottom: 'هوشمندسازی با تمرکز بر انسان',
      baselineLeft: 'اسکرول کنید برای ورود',
      baselineRight: 'محیط دیجیتال توسط faratech_lab ↓',
      principle: ['استراتژی', 'طراحی', 'تعامل', 'هوشمندی', 'تجربه'],
      principleNote: 'ساخته شده برای کار / ساخته شده برای حس',
      workIndex: '02 / کارهای منتخب',
      workTitle: <>ایده‌ها <em>ملموس.</em></>,
      workDescription: 'مفاهیم خود-راه‌اندازی‌شده که امکانات طراحی و تکنولوژی هوشمند را بررسی می‌کنند.',
      workLink: 'بازدید از نمایشگاه',
      workMeta: 'مفهوم / آزمایش',
      capIndex: '03 / آنچه می‌سازیم',
      capTitle: <>یک سیستم، نه <em>یک فهرست خدمات.</em></>,
      capDescription: 'جایی که طراحی دقیق با تکنولوژی مفید ملاقات می‌کند. هر بخش از تجربه دلیلی برای وجود دارد.',
      capLink: 'کاوش در سیستم',
      aiIndex: '04 / جنبه آزمایشی',
      aiTitle: <>هوشمندی بهتر است<br />وقتی <em>کاری انجام می‌دهد.</em></>,
      aiDescription: 'آزمایشگاه هوش مصنوعی شامل نمایش‌های کاری از هوشمندی است که ما در محصولات می‌سازیم — دستیارها، توصیه‌ها، شخصی‌سازی و جستجوی معنایی.',
      aiLink: 'ورود به آزمایشگاه هوش مصنوعی',
      aiAssistantLink: 'صحبت با faratech_lab',
      aiNote: 'چهار دمو کاری / بدون نمایش توخالی',
      ctaEyebrow: 'چیز بعدی از اینجا شروع می‌شود',
      ctaTitle: <>ایده‌ای دارید<br />ارزش <em>ساختن؟</em></>,
      ctaDescription: 'بیایید آن را به یک تجربه دیجیتال هوشمند تبدیل کنیم.',
      ctaButton: 'شروع یک پروژه',
      ctaSecondary: 'آشنایی با تیم',
    },
  };

  const t = content[language];

  return (
    <>
      <section className="hero section-shell immersive-hero" id="home" data-environment="home-entry" aria-labelledby="hero-title">
        <div className="hero-atmosphere" aria-hidden="true" />
        <div className="hero-grid page-container">
          <div className="hero-copy">
            <Reveal immediate>
              <p className="eyebrow hero-eyebrow"><span className="signal-dot" /> {t.eyebrow}</p>
              <h1 id="hero-title">{t.title}</h1>
              <p className="hero-description">{t.description}</p>
              <div className="hero-actions">
                <Link className="button button--acid" to="/capabilities">{t.exploreBtn} <span aria-hidden="true">↘</span></Link>
                <Link className="button button--quiet" to="/assistant"><span className="button-play" aria-hidden="true">↗</span> {t.talkBtn}</Link>
              </div>
            </Reveal>
            <div className="hero-footnote"><span>{t.footnoteLeft}</span><span>{t.footnoteRight}</span></div>
          </div>
          <div className="hero-coordinate" aria-hidden="true"><span>{t.coordinateTop}</span><i /><span>{t.coordinateBottom}</span></div>
        </div>
        <div className="hero-baseline page-container"><span>{t.baselineLeft}</span><span className="baseline-line"><i /></span><span className="hero-baseline__right">{t.baselineRight}</span></div>
      </section>

      <section className="principle-strip" data-environment="home-entry" aria-label="faratech_lab studio disciplines">
        <div className="page-container principle-strip__inner"><span>{t.principle[0]}</span><i>✳</i><span>{t.principle[1]}</span><i>✳</i><span>{t.principle[2]}</span><i>✳</i><span>{t.principle[3]}</span><i>✳</i><span>{t.principle[4]}</span><span className="principle-strip__note">{t.principleNote}</span></div>
      </section>

      <section className="section section-shell home-work" id="home-work" data-environment="home-work" aria-labelledby="home-work-title">
        <div className="page-container">
          <div className="section-heading section-heading--split">
            <div className="section-heading-left">
              <Reveal><p className="eyebrow section-index"><span>02</span> / {language === 'en' ? 'SELECTED WORK' : 'کارهای منتخب'}</p></Reveal>
              <Reveal delay={70}><h2 id="home-work-title">{t.workTitle}</h2></Reveal>
            </div>
            <Reveal delay={100} className="section-heading-right"><p>{t.workDescription}</p></Reveal>
          </div>
          <div className="home-work-grid">
            {projects.map((project, index) => (
              <Reveal key={project.number} delay={120 + index * 90}>
                <Link className="work-preview-card" to="/work" aria-label={`${project.title} — ${language === 'en' ? 'open the Work exhibition' : 'نمایشگاه کارها را باز کنید'}`}>
                  <span className="work-preview-card__meta"><span>{t.workMeta}</span><span>{project.number} <i>—</i> 03</span></span>
                  <strong>{project.title}</strong>
                  <small>{project.summary}</small>
                  <span className="work-preview-card__discipline">{project.discipline}<i aria-hidden="true">↗</i></span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={180}><Link className="text-link home-section-link" to="/work">{t.workLink} <span aria-hidden="true">↗</span></Link></Reveal>
        </div>
      </section>

      <section className="section section-shell home-capabilities" id="home-capabilities" data-environment="home-capabilities" aria-labelledby="home-cap-title">
        <div className="page-container">
          <div className="section-heading section-heading--split">
            <div className="section-heading-left">
              <Reveal><p className="eyebrow section-index"><span>03</span> / {language === 'en' ? 'WHAT WE MAKE' : 'آنچه می‌سازیم'}</p></Reveal>
              <Reveal delay={70}><h2 id="home-cap-title">{t.capTitle}</h2></Reveal>
            </div>
            <Reveal delay={100} className="section-heading-right"><p>{t.capDescription}</p></Reveal>
          </div>
          <div className="home-capability-rows">
            {capabilities.map((capability, index) => (
              <Reveal key={capability.number} delay={120 + index * 80}>
                <Link className="capability-row" to="/capabilities">
                  <span className="capability-row__number">{capability.number}<i> / 04</i></span>
                  <span className="capability-row__title"><strong>{capability.title}</strong><small>{capability.short}</small></span>
                  <span className="capability-row__symbol" aria-hidden="true">{capability.symbol}</span>
                  <span className="capability-row__arrow" aria-hidden="true">↗</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={180}><Link className="text-link home-section-link" to="/capabilities">{t.capLink} <span aria-hidden="true">↗</span></Link></Reveal>
        </div>
      </section>

      <section className="section section-shell home-ai" id="home-ai" data-environment="home-ai" aria-labelledby="home-ai-title">
        <div className="page-container">
          <div className="home-ai-panel">
            <div className="home-ai-copy">
              <Reveal><p className="eyebrow section-index"><span>04</span> / {language === 'en' ? 'THE EXPERIMENTAL SIDE' : 'جنبه آزمایشی'}</p></Reveal>
              <Reveal delay={70}><h2 id="home-ai-title">{t.aiTitle}</h2></Reveal>
              <Reveal delay={100}><p className="home-ai-description">{t.aiDescription}</p></Reveal>
              <Reveal delay={140}>
                <div className="hero-actions">
                  <Link className="button button--acid" to="/ai-lab">{t.aiLink} <span aria-hidden="true">↗</span></Link>
                  <Link className="button button--quiet" to="/assistant"><span className="button-play" aria-hidden="true">↗</span> {t.aiAssistantLink}</Link>
                </div>
              </Reveal>
              <p className="home-ai-note"><span className="signal-dot" aria-hidden="true" /> {t.aiNote}</p>
            </div>
            <Reveal delay={160} className="home-ai-features">
              <ul>
                {labTools.map((feature) => (
                  <li key={feature.id}>
                    <Link to="/ai-lab">
                      <span>{feature.number} / 04</span>
                      <strong>{feature.title}</strong>
                      <small>{feature.description}</small>
                      <i aria-hidden="true">{feature.glyph}</i>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-shell home-contact" id="home-contact" data-environment="home-contact" aria-labelledby="home-contact-title">
        <div className="page-container">
          <div className="home-contact-band">
            <Reveal><p className="eyebrow"><span className="signal-dot" /> {t.ctaEyebrow}</p></Reveal>
            <Reveal delay={70}><h2 id="home-contact-title">{t.ctaTitle}</h2></Reveal>
            <Reveal delay={100}><p className="home-contact-description">{t.ctaDescription}</p></Reveal>
            <Reveal delay={140}>
              <div className="contact-actions">
                <Link className="button button--acid" to="/contact">{t.ctaButton} <span aria-hidden="true">↗</span></Link>
                <Link className="button button--quiet" to="/our-team">{t.ctaSecondary} <span aria-hidden="true">↗</span></Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
