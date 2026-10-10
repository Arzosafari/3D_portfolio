import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';

const teamMembers = {
  en: [
    {
      name: 'Your Name',
      role: 'Founder & Creative Director',
      bio: 'Creative technologist with expertise in AI, design systems, and digital experiences. Passionate about building products that make a difference.',
      image: '👤',
    },
    {
      name: 'Team Member',
      role: 'AI Engineer',
      bio: 'Specialist in machine learning and natural language processing. Building intelligent systems that understand and assist users.',
      image: '👤',
    },
    {
      name: 'Team Member',
      role: 'UX Designer',
      bio: 'Designer focused on creating intuitive and beautiful user experiences. Believes in the power of thoughtful design.',
      image: '👤',
    },
  ],
  fa: [
    {
      name: 'نام شما',
      role: 'بنیان‌گذار و مدیر خلاق',
      bio: 'تکنولوژیست خلاق با تخصص در هوش مصنوعی، سیستم‌های طراحی و تجربیات دیجیتال. شیفته ساخت محصولاتی که تفاوت ایجاد می‌کنند.',
      image: '👤',
    },
    {
      name: 'عضو تیم',
      role: 'مهندس هوش مصنوعی',
      bio: 'متخصص در یادگیری ماشین و پردازش زبان طبیعی. ساخت سیستم‌های هوشمند که کاربران را درک و کمک می‌کنند.',
      image: '👤',
    },
    {
      name: 'عضو تیم',
      role: 'طراح تجربه کاربری',
      bio: 'طراح متمرکز بر ساخت تجربیات کاربری شهودی و زیبا. باور به قدرت طراحی دلسوزانه.',
      image: '👤',
    },
  ],
};

export default function OurTeamPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      index: '08 / OUR TEAM',
      title: <>The minds behind <em>the magic.</em></>,
      description: "We're a passionate team of designers, developers, and AI specialists who believe in the power of thoughtful technology.",
      cta: "Want to join our team? We're always looking for talented individuals who share our passion.",
      ctaButton: 'Get in touch',
    },
    fa: {
      index: '08 / تیم ما',
      title: <>ذهن‌های پشت <em>جادو.</em></>,
      description: 'ما یک تیم پرشور از طراحان، توسعه‌دهندگان و متخصصان هوش مصنوعی هستیم که به قدرت تکنولوژی دلسوزانه باور داریم.',
      cta: 'می‌خواهید به تیم ما بپیوندید؟ ما همیشه به دنبال افراد با استعداد هستیم که اشتیاق ما را به اشتراک می‌گذارند.',
      ctaButton: 'تماس بگیرید',
    },
  };

  const t = content[language];
  const members = teamMembers[language];

  return (
    <section className="section section-shell about-section" id="our-team" data-environment="about" aria-labelledby="our-team-title">
      <div className="page-container">
        <div className="section-heading section-heading--split team-heading">
          <div className="section-heading-left">
            <Reveal immediate><p className="eyebrow section-index"><span>08</span> / {language === 'en' ? 'OUR TEAM' : 'تیم ما'}</p></Reveal>
            <Reveal immediate delay={70}><h2 id="our-team-title">{t.title}</h2></Reveal>
          </div>
          <Reveal immediate delay={100} className="section-heading-right"><p>{t.description}</p></Reveal>
        </div>

        <Reveal className="team-grid" immediate delay={120}>
          {members.map((member, index) => (
            <div key={index} className="team-member-card">
              <div className="team-member-image">{member.image}</div>
              <div className="team-member-info">
                <h3>{member.name}</h3>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal className="team-cta" immediate delay={150}>
          <p>{t.cta}</p>
          <a href="/contact" className="button button--acid">{t.ctaButton} <span aria-hidden="true">↗</span></a>
        </Reveal>
      </div>
    </section>
  );
}
