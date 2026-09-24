import type { LucideIcon } from 'lucide-react';
import {
  Atom,
  Award,
  BarChart3,
  BookOpen,
  FlaskConical,
  CalendarCheck,
  Code2,
  Database,
  FileCheck2,
  Gauge,
  Globe,
  Headphones,
  Languages,
  Layers,
  Monitor,
  ShieldCheck,
  Rocket,
  Smartphone,
  Store,
  UserPlus,
  WifiOff,
} from 'lucide-react';

/** Platform key (see FeaturedWork.platforms) → icon. */
export const PLATFORM_ICONS: Record<string, LucideIcon> = {
  web: Globe,
  android: Smartphone,
  windows: Monitor,
};

/**
 * Stack label → icon. Matched case-insensitively on a substring so
 * 'PostgreSQL RLS' and 'Canvas / WebGL' resolve without a second list.
 */
const STACK_ICON_RULES: Array<[RegExp, LucideIcon]> = [
  [/postgres|rls/i, ShieldCheck],
  [/supabase|sql|database/i, Database],
  [/canvas|webgl|three/i, Layers],
  [/react|typescript|node/i, Code2],
];

export const stackIcon = (label: string): LucideIcon =>
  STACK_ICON_RULES.find(([re]) => re.test(label))?.[1] ?? Code2;

/** Highlight key (see FeaturedWork.highlights) → icon. */
export const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  // hawza
  enrollment: UserPlus,
  lessons: Headphones,
  attendance: CalendarCheck,
  exams: FileCheck2,
  grading: BarChart3,
  certificates: Award,
  // raqeem
  curriculum: BookOpen,
  experiments: FlaskConical,
  mobile: Smartphone,
  physics: Atom,
  offline: WifiOff,
  performance: Gauge,
  arabic: Languages,
};

/** Roadmap key (see FeaturedWork.roadmap) → icon. */
export const ROADMAP_ICONS: Record<string, LucideIcon> = {
  play_store: Store,
  chem_bio_launch: Rocket,
};
