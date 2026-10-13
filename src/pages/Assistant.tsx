import ChatAssistant from '../features/assistant/ChatAssistant';
import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function AssistantPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      index: '02 / A BETTER FIRST QUESTION',
      title: <>A useful conversation beats <em>another form.</em></>,
      description: 'Meet faratech_lab, a first-pass business guide. Tell it what you\'re working on and see how a thoughtful assistant can turn a vague idea into a sharper next step.',
      note1: 'Context-aware conversation',
      note2: 'Designed around real business needs',
      note3: 'A clear path to a human',
      disclaimer: 'A working prototype · responses are generated locally',
    },
    fa: {
      index: '02 / سوال بهتر اول',
      title: <>یک مکالمه مفید بهتر از <em>یک فرم دیگر است.</em></>,
      description: 'با faratech_lab آشنا شوید، یک راهنمای تجاری اولیه. بگویید که روی چه چیزی کار می‌کنید و ببینید چگونه یک دستیار هوشمند می‌تواند یک ایده مبهم را به یک قدم بعدی واضح‌تر تبدیل کند.',
      note1: 'مکالمه آگاه به زمینه',
      note2: 'طراحی شده بر اساس نیازهای واقعی کسب‌وکار',
      note3: 'مسیر واضح به یک انسان',
      disclaimer: 'یک نمونه اولیه · پاسخ‌ها به صورت محلی تولید می‌شوند',
    },
  };

  const t = content[language];

  return (
    <section className="section section-shell assistant-section" id="assistant" data-environment="assistant" aria-labelledby="assistant-title">
      <div className="assistant-backdrop-grid" aria-hidden="true" />
      <div className="page-container">
        <div className="section-heading section-heading--split">
          <div className="section-heading-left">
            <Reveal immediate><p className="eyebrow section-index"><span>02</span> / {language === 'en' ? 'A BETTER FIRST QUESTION' : 'سوال بهتر اول'}</p></Reveal>
            <Reveal immediate delay={70}><h2 id="assistant-title">{t.title}</h2></Reveal>
          </div>
          <Reveal immediate delay={100} className="section-heading-right"><p className="section-body">{t.description}</p></Reveal>
        </div>
        <Reveal className="assistant-content" immediate delay={120}>
          <div className="assistant-notes"><span><i>01</i> {t.note1}</span><span><i>02</i> {t.note2}</span><span><i>03</i> {t.note3}</span></div>
          <span className="prototype-disclaimer"><i /> {t.disclaimer}</span>
          <ChatAssistant />
        </Reveal>
      </div>
    </section>
  );
}
