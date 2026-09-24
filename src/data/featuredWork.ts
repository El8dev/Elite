/**
 * Shipped, publicly reachable EL8 work — hard-coded on purpose.
 *
 * The community showcase on /projects comes from Supabase, so it is only as
 * available as that database is. These two are the studio's own proof of work
 * and must be in the HTML that crawlers receive whether Supabase answers or
 * not, so they live in the bundle and are prerendered with the page.
 *
 * Facts (url, stack, platforms, year) live here. Prose lives in
 * `work.<slug>.*` in src/i18n/locales/{ar,en}.json so it can be written
 * Arabic-first and translated, never duplicated.
 */

export interface WorkShot {
  /** Image under /public. */
  src: string;
  /** i18n leaf key under `work.<slug>.gallery.*` — the caption. */
  key: string;
  /** Portrait phone capture; rendered narrow rather than full width. */
  phone?: boolean;
  /** From a build that has not launched yet; labelled as such on the page. */
  preview?: boolean;
}

export interface FeaturedWork {
  /** URL slug and i18n leaf key: /project/<slug>. */
  slug: string;
  /** Public production URL. */
  liveUrl: string;
  /** Hostname shown on the card, so the link is legible before it is clicked. */
  displayUrl: string;
  /** Cover screenshot under /public. Falls back to a placeholder if absent. */
  image: string;
  /** Year the platform went live. */
  year: string;
  /** Shown as pills. Proper nouns, so they are not translated. */
  stack: string[];
  /** i18n leaf keys under `work.platforms.*`. */
  platforms: string[];
  /** i18n leaf keys under `work.<slug>.highlights.*`, in display order. */
  highlights: string[];
  /** Screens from the real product, in display order. */
  gallery?: WorkShot[];
  /**
   * Announced but not yet shipped. Kept separate from `highlights` so nothing
   * unreleased is ever described as if it were already available.
   * i18n leaf keys under `work.<slug>.roadmap.*`.
   */
  roadmap?: string[];
}

export const FEATURED_WORK: FeaturedWork[] = [
  {
    slug: 'hawza',
    liveUrl: 'https://hawzw.app',
    displayUrl: 'hawzw.app',
    image: '/images/work/hawza.webp',
    year: '2026',
    stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL RLS'],
    platforms: ['web', 'android', 'windows'],
    highlights: ['enrollment', 'lessons', 'attendance', 'exams', 'grading', 'certificates'],
    gallery: [
      { src: '/images/work/hawza-students.webp', key: 'students' },
      { src: '/images/work/hawza-admin.webp', key: 'admin' },
    ],
    roadmap: ['play_store'],
  },
  {
    slug: 'raqeem',
    liveUrl: 'https://raqeem.study',
    displayUrl: 'raqeem.study',
    image: '/images/work/raqeem.webp',
    year: '2026',
    stack: ['Canvas / WebGL', 'TypeScript', 'React'],
    platforms: ['web', 'android', 'windows'],
    highlights: ['curriculum', 'experiments', 'mobile', 'offline', 'performance', 'arabic'],
    gallery: [
      { src: '/images/work/phys-labs.webp', key: 'physics_chapters' },
      { src: '/images/work/chem-chapters.webp', key: 'chem_chapters', preview: true },
      { src: '/images/work/chem-exp1.webp', key: 'chem_experiment', preview: true },
      { src: '/images/work/chem-exp2.webp', key: 'chem_heat', preview: true },
      { src: '/images/work/chem-chapter.webp', key: 'chem_hub', preview: true },
      { src: '/images/work/chem-mobile.webp', key: 'mobile', phone: true, preview: true },
    ],
    roadmap: ['chem_bio_launch', 'play_store'],
  },
];

export const getFeaturedWork = (slug: string): FeaturedWork | undefined =>
  FEATURED_WORK.find((w) => w.slug === slug);
