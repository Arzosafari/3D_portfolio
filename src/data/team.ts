/**
 * Team roster shown on Our Team — the same members the site shipped with,
 * in both languages. Portraits stay honest: until real photography exists,
 * installations use monograms derived from these actual names.
 */

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const teamMembers: Record<'en' | 'fa', TeamMember[]> = {
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

/** Monogram initials for the 3D portrait installations. */
export function monogramFor(member: TeamMember, index: number): string {
  const parts = member.name.trim().split(/\s+/);
  const initials = (parts[0]?.[0] ?? 'N') + (parts[1]?.[0] ?? String(index + 1));
  return initials.toUpperCase();
}
