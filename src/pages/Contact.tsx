import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function ContactPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      eyebrow: 'THE NEXT THING STARTS HERE',
      title: <>Have an idea<br />worth <em>building?</em></>,
      description: "Let's turn it into an intelligent digital experience.",
      startProject: 'Start a project',
      talkToAI: 'Talk to NOVA AI',
      aside: 'GOOD IDEAS START WITH A HELLO.',
      channelsHeading: 'DIRECT CHANNELS',
      emailLabel: 'Email the studio',
      socialLabel: 'Elsewhere',
      replyNote: 'Usually replied within one business day.',
      assistantNote: 'Prefer to explore first? NOVA AI is a working prototype that helps you find a useful starting point.',
    },
    fa: {
      eyebrow: 'چیز بعدی از اینجا شروع می‌شود',
      title: <>ایده‌ای دارید<br />ارزش <em>ساختن؟</em></>,
      description: 'بیایید آن را به یک تجربه دیجیتال هوشمند تبدیل کنیم.',
      startProject: 'شروع یک پروژه',
      talkToAI: 'صحبت با NOVA AI',
      aside: 'ایده‌های خوب با یک سلام شروع می‌شوند.',
      channelsHeading: 'راه‌های ارتباطی مستقیم',
      emailLabel: 'ایمیل به استودیو',
      socialLabel: 'جای دیگر',
      replyNote: 'معمولاً ظرف یک روز کاری پاسخ می‌دهیم.',
      assistantNote: 'ترجیح می‌دهید اول کاوش کنید؟ نووا ای‌آی یک نمونه اولیه کاری است که به شما کمک می‌کند نقطه شروع مفیدی پیدا کنید.',
    },
  };

  const t = content[language];

  return (
    <section className="section section-shell contact-section" id="contact" data-environment="contact" aria-labelledby="contact-title">
      <div className="page-container">
        <div className="section-heading section-heading--split">
          <div className="section-heading-left">
            <Reveal immediate><p className="eyebrow"><span className="signal-dot" /> {t.eyebrow}</p></Reveal>
            <Reveal immediate delay={70}><h2 id="contact-title">{t.title}</h2></Reveal>
          </div>
          <Reveal immediate delay={100} className="section-heading-right"><p>{t.description}</p></Reveal>
        </div>
        <Reveal className="contact-content" immediate delay={120}><div className="contact-actions"><a href="mailto:hello@nova.studio?subject=Let%27s%20build%20something" className="button button--acid">{t.startProject} <span aria-hidden="true">↗</span></a><Link to="/assistant" className="button button--quiet"><span className="button-play" aria-hidden="true">↗</span> {t.talkToAI}</Link></div></Reveal>
        <Reveal className="contact-channels" immediate delay={150}>
          <div className="contact-channel">
            <span className="contact-channel__label">{t.channelsHeading} / 01</span>
            <a href="mailto:hello@nova.studio" className="contact-channel__value">{t.emailLabel}<strong>HELLO@NOVA.STUDIO ↗</strong></a>
            <small>{t.replyNote}</small>
          </div>
          <div className="contact-channel">
            <span className="contact-channel__label">{t.channelsHeading} / 02</span>
            <div className="contact-channel__value contact-channel__socials">
              <span>{t.socialLabel}</span>
              <strong>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              </strong>
            </div>
            <small>{t.assistantNote}</small>
          </div>
        </Reveal>
        <div className="contact-aside"><span>{t.aside}</span><a href="mailto:hello@nova.studio">HELLO@NOVA.STUDIO ↗</a></div>
      </div>
    </section>
  );
}
