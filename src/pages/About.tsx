import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';
import { steps } from '../components/HowWeBuild';

export default function AboutPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      index: '07 / A LITTLE ABOUT US',
      title: <>Technology should feel <em>human.</em></>,
      description: "We're a small creative technology studio combining design, interaction, and artificial intelligence to make digital experiences that are not only beautiful, but genuinely useful.",
      link: 'A little more about our approach',
      storyIndex: 'STRATUM 01 / WHO WE ARE',
      storyTitle: <>An independent studio for <em>intelligent</em> digital work.</>,
      storyLead: 'faratech_lab is an independent creative technology studio. We build modern websites, AI-powered web applications, interactive digital experiences, and custom web solutions — one considered system at a time.',
      offeringsHeading: 'WHAT WE BUILD',
      offerings: [
        { title: 'Modern websites', note: 'Editorial, fast, built around a clear idea.' },
        { title: 'AI-powered web applications', note: 'Useful intelligence with human boundaries.' },
        { title: 'Interactive digital experiences', note: 'Depth, motion, and dimension with purpose.' },
        { title: 'Custom web solutions', note: 'Product logic shaped around real needs.' },
      ],
      methodIndex: 'STRATUM 02 / HOW WE WORK',
      methodTitle: <>Good digital experiences aren't <em>accidents.</em></>,
      methodLead: 'Four clear steps. One thoughtful team. A process that leaves room for the unexpected.',
      methodLink: 'See the full method',
      principlesIndex: 'STRATUM 03 / WHAT WE BELIEVE',
      principlesTitle: <>Made to work. <em>Made to feel.</em></>,
      principles: ['STRATEGY', 'DESIGN', 'INTERACTION', 'INTELLIGENCE', 'EXPERIENCE'],
      beliefs: [
        'Technology should feel human.',
        "Intelligence is better when it's doing something.",
        'Every part of the experience has a reason to be there.',
      ],
      ctaIndex: 'STRATUM 04 / WHERE IT LEADS',
      ctaTitle: <>Every project ends at the same place: <em>contact.</em></>,
      ctaButton: 'Start a project',
      ctaSecondary: 'See the work',
    },
    fa: {
      index: '07 / کمی درباره ما',
      title: <>تکنولوژی باید <em>انسانی</em> باشد.</>,
      description: 'ما یک استودیوی کوچک تکنولوژی خلاق هستیم که طراحی، تعامل و هوش مصنوعی را ترکیب می‌کنیم تا تجربیات دیجیتال بسازیم که نه تنها زیبا، بلکه واقعاً مفید هستند.',
      link: 'کمی بیشتر درباره رویکرد ما',
      storyIndex: 'لایه ۰۱ / ما که هستیم',
      storyTitle: <>یک استودیوی مستقل برای کار دیجیتال <em>هوشمند.</em></>,
      storyLead: 'faratech_lab یک استودیو تکنولوژی خلاق مستقل است. ما وب‌سایت‌های مدرن، اپلیکیشن‌های وب مبتنی بر هوش مصنوعی، تجربیات دیجیتال تعاملی و راه‌حل‌های سفارشی وب می‌سازیم — هر بار یک سیستم دقیق.',
      offeringsHeading: 'آنچه می‌سازیم',
      offerings: [
        { title: 'وب‌سایت‌های مدرن', note: 'دقیق، سریع، ساخته‌شده حول یک ایده شفاف.' },
        { title: 'اپلیکیشن‌های وب مبتنی بر هوش مصنوعی', note: 'هوشمندی مفید با مرزهای انسانی.' },
        { title: 'تجربیات دیجیتال تعاملی', note: 'عمق، حرکت و بُعد با هدف.' },
        { title: 'راه‌حل‌های سفارشی وب', note: 'منطق محصول متناسب با نیازهای واقعی.' },
      ],
      methodIndex: 'لایه ۰۲ / چگونه کار می‌کنیم',
      methodTitle: <>تجربیات دیجیتال خوب <em>تصادفی نیست.</em></>,
      methodLead: 'چهار مرحله واضح. یک تیم با دقت. فرآیندی که جای اتفاق‌های خوب را خالی می‌گذارد.',
      methodLink: 'دیدن روش کامل',
      principlesIndex: 'لایه ۰۳ / آنچه باور داریم',
      principlesTitle: <>ساخته‌شده برای کار. <em>ساخته‌شده برای حس.</em></>,
      principles: ['استراتژی', 'طراحی', 'تعامل', 'هوشمندی', 'تجربه'],
      beliefs: [
        'تکنولوژی باید انسانی باشد.',
        'هوشمندی وقتی بهتر است که کاری انجام دهد.',
        'هر بخش از تجربه دلیلی برای بودن دارد.',
      ],
      ctaIndex: 'لایه ۰۴ / به کجا می‌رسد',
      ctaTitle: <>هر پروژه به یک نقطه ختم می‌شود: <em>تماس.</em></>,
      ctaButton: 'شروع یک پروژه',
      ctaSecondary: 'دیدن کارها',
    },
  };

  const t = content[language];

  return (
    <>
      <section className="section section-shell about-section about-entry" id="about" data-environment="about-entry" aria-labelledby="about-title">
        <div className="page-container">
          <div className="section-heading section-heading--split">
            <div className="section-heading-left">
              <Reveal immediate><p className="eyebrow section-index"><span>07</span> / {language === 'en' ? 'A LITTLE ABOUT US' : 'کمی درباره ما'}</p></Reveal>
              <Reveal immediate delay={70}><h2 id="about-title">{t.title}</h2></Reveal>
            </div>
            <Reveal immediate delay={100} className="section-heading-right"><p>{t.description}</p></Reveal>
          </div>
          <Reveal className="about-copy" immediate delay={120}><div className="about-symbol" aria-hidden="true"><span /><i /><b /></div><Link to="/contact" className="text-link">{t.link} <span aria-hidden="true">↗</span></Link></Reveal>
        </div>
      </section>

      <section className="section section-shell about-stratum" data-environment="about-story" aria-labelledby="about-story-title">
        <div className="page-container">
          <div className="stratum-layout">
            <div className="stratum-side">
              <Reveal><p className="eyebrow section-index"><span aria-hidden="true">✳</span> {t.storyIndex}</p></Reveal>
              <Reveal delay={70}><h2 id="about-story-title">{t.storyTitle}</h2></Reveal>
            </div>
            <div className="stratum-body">
              <Reveal delay={100}><p className="stratum-lead">{t.storyLead}</p></Reveal>
              <Reveal delay={140}>
                <ul className="offerings-list" aria-label={t.offeringsHeading}>
                  {t.offerings.map((offering) => (
                    <li key={offering.title}>
                      <strong>{offering.title}</strong>
                      <small>{offering.note}</small>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-shell about-stratum" data-environment="about-method" aria-labelledby="about-method-title">
        <div className="page-container">
          <div className="stratum-layout stratum-layout--reverse">
            <div className="stratum-side">
              <Reveal><p className="eyebrow section-index"><span aria-hidden="true">✳</span> {t.methodIndex}</p></Reveal>
              <Reveal delay={70}><h2 id="about-method-title">{t.methodTitle}</h2></Reveal>
              <Reveal delay={100}><p className="stratum-lead">{t.methodLead}</p></Reveal>
              <Reveal delay={140}><Link className="text-link" to="/process">{t.methodLink} <span aria-hidden="true">↗</span></Link></Reveal>
            </div>
            <div className="stratum-body">
              <Reveal delay={120}>
                <ol className="method-steps">
                  {steps.map((step) => (
                    <li key={step.number}>
                      <span>{step.number}</span>
                      <div><strong>{step.title}</strong><small>{step.description}</small></div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-shell about-stratum" data-environment="about-principles" aria-labelledby="about-principles-title">
        <div className="page-container">
          <div className="stratum-layout">
            <div className="stratum-side">
              <Reveal><p className="eyebrow section-index"><span aria-hidden="true">✳</span> {t.principlesIndex}</p></Reveal>
              <Reveal delay={70}><h2 id="about-principles-title">{t.principlesTitle}</h2></Reveal>
            </div>
            <div className="stratum-body">
              <Reveal delay={100}>
                <ul className="beliefs-list">
                  {t.beliefs.map((belief) => (
                    <li key={belief}><i aria-hidden="true">✳</i> {belief}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={140}>
                <p className="principles-row" aria-label={language === 'en' ? 'Studio disciplines' : 'رشته‌های استودیو'}>
                  {t.principles.map((principle, index) => (
                    <span key={principle}>{index > 0 && <i aria-hidden="true">✳</i>}{principle}</span>
                  ))}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-shell about-cta" data-environment="about-contact" aria-labelledby="about-cta-title">
        <div className="page-container">
          <div className="home-contact-band">
            <Reveal><p className="eyebrow section-index">{t.ctaIndex}</p></Reveal>
            <Reveal delay={70}><h2 id="about-cta-title">{t.ctaTitle}</h2></Reveal>
            <Reveal delay={120}>
              <div className="contact-actions">
                <Link className="button button--acid" to="/contact">{t.ctaButton} <span aria-hidden="true">↗</span></Link>
                <Link className="button button--quiet" to="/work">{t.ctaSecondary} <span aria-hidden="true">↗</span></Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
