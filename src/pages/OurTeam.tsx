import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { useLanguage } from '../contexts/LanguageContext';
import { useEnvironment } from '../environment/EnvironmentProvider';
import { teamMembers } from '../data/team';

export default function OurTeamPage() {
  const { language } = useLanguage();
  const { setFocus } = useEnvironment();

  const content = {
    en: {
      index: '08 / OUR TEAM',
      title: <>The minds behind <em>the magic.</em></>,
      description: "We're a passionate team of designers, developers, and AI specialists who believe in the power of thoughtful technology.",
      cta: "Want to join our team? We're always looking for talented individuals who share our passion.",
      ctaButton: 'Get in touch',
      studioNote: 'THE ATELIER / DESIGN · ENGINEERING · INTELLIGENCE',
    },
    fa: {
      index: '08 / تیم ما',
      title: <>ذهن‌های پشت <em>جادو.</em></>,
      description: 'ما یک تیم پرشور از طراحان، توسعه‌دهندگان و متخصصان هوش مصنوعی هستیم که به قدرت تکنولوژی دلسوزانه باور داریم.',
      cta: 'می‌خواهید به تیم ما بپیوندید؟ ما همیشه به دنبال افراد با استعداد هستیم که اشتیاق ما را به اشتراک می‌گذارند.',
      ctaButton: 'تماس بگیرید',
      studioNote: 'کارگاه / طراحی · مهندسی · هوشمندی',
    },
  };

  const t = content[language];
  const members = teamMembers[language];

  useEffect(() => () => setFocus(null), [setFocus]);

  return (
    <section className="section section-shell team-section" id="our-team" data-environment="team" aria-labelledby="our-team-title">
      <div className="page-container">
        <div className="section-heading section-heading--split team-heading">
          <div className="section-heading-left">
            <Reveal immediate><p className="eyebrow section-index"><span>08</span> / {language === 'en' ? 'OUR TEAM' : 'تیم ما'}</p></Reveal>
            <Reveal immediate delay={70}><h2 id="our-team-title">{t.title}</h2></Reveal>
          </div>
          <Reveal immediate delay={100} className="section-heading-right"><p>{t.description}</p></Reveal>
        </div>

        <p className="team-studio-note" aria-hidden="true">{t.studioNote}</p>

        <Reveal className="team-grid" immediate delay={120}>
          <div className="team-grid__inner" onMouseLeave={() => setFocus(null)}>
            {members.map((member, index) => (
              <article
                key={index}
                className="team-member-card"
                onMouseEnter={() => setFocus(`team:${index}`)}
                onFocus={() => setFocus(`team:${index}`)}
                tabIndex={0}
                aria-label={`${member.name} — ${member.role}`}
              >
                <div className="team-member-image" aria-hidden="true">{member.image}</div>
                <div className="team-member-info">
                  <h3>{member.name}</h3>
                  <p className="team-member-role">{member.role}</p>
                  <p className="team-member-bio">{member.bio}</p>
                </div>
                <span className="team-member-index" aria-hidden="true">0{index + 1} / 0{members.length}</span>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="team-cta" immediate delay={150}>
          <p>{t.cta}</p>
          <Link to="/contact" className="button button--acid">{t.ctaButton} <span aria-hidden="true">↗</span></Link>
        </Reveal>
      </div>
    </section>
  );
}
