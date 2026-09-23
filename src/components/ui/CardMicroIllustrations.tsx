import React from 'react';

/** File names under /public/illustrations (without .svg). */
export type IllustrationName =
  | 'voice_ai'
  | 'erp'
  | 'design'
  | 'app'
  | 'data'
  | 'hardware'
  | 'ai'
  | 'service_web'
  | 'service_erp'
  | 'service_uiux'
  | 'service_ai';

interface Props {
  name: IllustrationName;
}

/**
 * Card artwork: the SVG on a neutral stage. No text lives here on purpose;
 * the card's title and description are the only words on a card, so the
 * picture can never say something different from the heading under it.
 * The glow behind the art is driven by CSS and only appears on hover /
 * the active card (see .card-art__glow in redesign.css).
 */
export const CardMicroIllustration: React.FC<Props> = ({ name }) => (
  <div className="card-art" aria-hidden="true">
    <span className="card-art__glow" />
    <img
      src={`/illustrations/${name}.svg`}
      alt=""
      width={128}
      height={96}
      loading="lazy"
      decoding="async"
      className="card-art__img"
    />
  </div>
);

export default CardMicroIllustration;
