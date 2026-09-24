/**
 * Single source of truth for the Vision and Services cards on the home page.
 *
 * Each card is ONE object: the illustration it shows and the translation key
 * that holds its title and description. Title, description and artwork can no
 * longer drift apart, because there is nothing else to keep in sync.
 *
 * Text lives in `vision.cards.<key>` / `services_section.cards.<key>` in
 * src/i18n/locales/{en,ar}.json as `{ title, desc }`.
 */
import type { IllustrationName } from '@/components/ui/CardMicroIllustrations';

export interface ServiceCard {
  /** i18n leaf key and React key. */
  key: string;
  /** Which SVG in /public/illustrations to show. */
  illustration: IllustrationName;
}

/** "Our Vision": the six things EL8 builds. Order = display order. */
export const VISION_CARDS: ServiceCard[] = [
  { key: 'apps',       illustration: 'app' },
  { key: 'business',   illustration: 'erp' },
  { key: 'data',       illustration: 'data' },
  { key: 'hardware',   illustration: 'hardware' },
  { key: 'ai_infra',   illustration: 'ai' },
  { key: 'design',     illustration: 'design' },
];

/** "What we do": the four services sold on the home page. */
export const SERVICE_CARDS: ServiceCard[] = [
  { key: 'web',      illustration: 'service_web' },
  { key: 'business', illustration: 'service_erp' },
  { key: 'uiux',     illustration: 'service_uiux' },
  { key: 'ai',       illustration: 'service_ai' },
];
