import { useRef, useState } from 'react';
import type { CollectionCard } from '~/lib/sanity/products';

interface CollectionCardSectionProps {
  cards: CollectionCard[];
}

export function CollectionCardSection({ cards }: CollectionCardSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  if (!cards || cards.length === 0) return null;

  return (
    <section className="collection-card-section">
      {/* Navigation arrows */}
      <div className="ccs-nav">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="ccs-arrow"
          aria-label="Scroll left"
        >
          ‹
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="ccs-arrow"
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>

      {/* Scrollable cards row */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="ccs-track"
      >
        {cards.map((card, i) => (
          <CardItem key={i} card={card} />
        ))}
      </div>

      <style>{`
        .collection-card-section {
          position: relative;
          margin: 40px 0;
        }
        .ccs-nav {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-bottom: 12px;
          padding-right: 4px;
        }
        .ccs-arrow {
          width: 36px;
          height: 36px;
          border: 1px solid #d1d5db;
          border-radius: 50%;
          background: #fff;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, border-color 0.2s;
        }
        .ccs-arrow:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }
        .ccs-arrow:disabled {
          opacity: 0.35;
          cursor: default;
        }
        .ccs-track {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .ccs-track::-webkit-scrollbar { display: none; }

        .ccs-card {
          flex: 0 0 320px;
          scroll-snap-align: start;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #f0f0f0;
          padding: 0 0 16px 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }
        .ccs-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .ccs-card-link {
          display: flex;
          flex-direction: column;
          flex: 1;
          text-decoration: none !important;
          color: inherit;
        }
        .ccs-card-link:hover, .ccs-card-link:focus, .ccs-card-link:active {
          text-decoration: none !important;
        }

        /* Tag */
        .ccs-tag {
          display: inline-block;
          background: #111;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.02em;
          border-radius: 999px;
          padding: 4px 10px;
          margin: 16px 16px 8px 16px;
          align-self: flex-start;
        }

        /* Title */
        .ccs-title {
          font-size: 20px;
          font-weight: 800;
          line-height: 1.3;
          margin: 0 16px 6px 16px;
          color: #111;
          text-decoration: none !important;
        }

        /* Description */
        .ccs-desc {
          font-size: 18px;
          line-height: 1.55;
          color: #555;
          margin: 0 16px 16px 16px;
          flex: 1;
          text-decoration: none !important;
        }
        .ccs-desc strong, .ccs-desc b {
          color: #e05a00;
        }

        .ccs-img-wrap {
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-top: 10px;
        }
        .ccs-img {
          width: 250px;
          height: 250px;
          object-fit: contain;
          object-position: bottom center;
          display: block;
        }
      `}</style>
    </section>
  );
}

function CardItem({ card }: { card: CollectionCard }) {
  const inner = (
    <>
      {card.tag && (
        <span 
          className="ccs-tag" 
          style={card.tagColor ? { color: card.tagColor } : undefined}
        >
          {card.tag}
        </span>
      )}
      {card.title && <h3 className="ccs-title">{card.title}</h3>}
      {card.description && <p className="ccs-desc">{card.description}</p>}
      <div className="ccs-img-wrap">
        {card.image?.asset?.url ? (
          <img
            src={card.image.asset.url}
            alt={card.title ?? ''}
            className="ccs-img"
            loading="lazy"
          />
        ) : (
          <div style={{ width: '90%', height: '90%', background: '#e5e7eb', borderRadius: 8 }} />
        )}
      </div>
    </>
  );

  return (
    <div className="ccs-card">
      {card.link ? (
        <a href={card.link} className="ccs-card-link">
          {inner}
        </a>
      ) : (
        <div className="ccs-card-link">
          {inner}
        </div>
      )}
    </div>
  );
}
