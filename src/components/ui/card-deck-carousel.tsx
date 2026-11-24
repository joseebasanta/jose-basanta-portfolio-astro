import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import './card-deck-carousel.css';

type Slide = { image: string; alt: string };
type Props = { slides: Slide[]; title: string };
type Position = {
  index: number;
  x: number;
  y: number;
  rotation: number;
  mode: 'drag' | 'fly' | 'snap';
};
type Drag = {
  pointer: number;
  x: number;
  y: number;
  lastX: number;
  time: number;
  velocity: number;
};

const autoplayDelay = 4200;
const wrap = (index: number, count: number) => ((index % count) + count) % count;
const pad = (number: number) => String(number).padStart(2, '0');
const tiltFor = (index: number) => {
  const fraction = (((index + 1) * 2654435761) >>> 0) / 2 ** 32;
  return (fraction * 2 - 1) * 6;
};

function CardDeckCarousel({ slides, title }: Props) {
  const count = slides.length;
  const [top, setTop] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const topIndex = useRef(0);
  const busy = useRef(false);
  const lastInteraction = useRef(-Infinity);
  const timeout = useRef<number | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);
  const drag = useRef<Drag | null>(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(timeout.current);
      if (frame.current !== undefined) window.cancelAnimationFrame(frame.current);
    },
    [],
  );

  const settle = useCallback(
    (next: number, manual: boolean, delay = 0) => {
      const finish = () => {
        topIndex.current = next;
        setTop(next);
        setPosition(null);
        if (manual) setAnnouncement(`Card ${next + 1} of ${count}. ${slides[next].alt}`);
        busy.current = false;
      };
      if (delay) timeout.current = window.setTimeout(finish, delay);
      else finish();
    },
    [count, slides],
  );

  const throwTop = useCallback(
    (manual: boolean, direction = 1, x = 0, y = 0) => {
      if (busy.current || drag.current || count < 2) return;
      busy.current = true;
      const index = topIndex.current;
      const next = wrap(index + 1, count);
      if (reduceMotion) {
        settle(next, manual);
        return;
      }

      const width = deck.current?.offsetWidth ?? 400;
      setPosition({
        index,
        x: x + direction * width * 1.25,
        y: y * 1.4 - 40,
        rotation: direction * 16,
        mode: 'fly',
      });
      settle(next, manual, 430);
    },
    [count, reduceMotion, settle],
  );

  const pullBack = () => {
    if (busy.current || drag.current || count < 2) return;
    busy.current = true;
    const index = wrap(topIndex.current - 1, count);
    if (reduceMotion) {
      settle(index, true);
      return;
    }

    const width = deck.current?.offsetWidth ?? 400;
    setPosition({ index, x: -width * 1.25, y: -40, rotation: -16, mode: 'snap' });
    frame.current = window.requestAnimationFrame(() => {
      frame.current = window.requestAnimationFrame(() => {
        setPosition({ index, x: 0, y: 0, rotation: 0, mode: 'fly' });
        settle(index, true, 450);
      });
    });
  };

  useEffect(() => {
    if (reduceMotion || count < 2) return;
    const timer = window.setInterval(() => {
      if (
        document.hidden ||
        drag.current ||
        root.current?.matches(':focus-visible, :has(:focus-visible)') ||
        performance.now() - lastInteraction.current < autoplayDelay
      )
        return;
      throwTop(false);
    }, autoplayDelay);
    return () => window.clearInterval(timer);
  }, [count, reduceMotion, throwTop]);

  const previous = () => {
    lastInteraction.current = performance.now();
    pullBack();
  };

  const next = () => {
    lastInteraction.current = performance.now();
    throwTop(true);
  };

  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') previous();
    else if (event.key === 'ArrowRight') next();
    else return;
    event.preventDefault();
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || busy.current) return;
    lastInteraction.current = performance.now();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      pointer: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      time: event.timeStamp,
      velocity: 0,
    };
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = drag.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    const elapsed = Math.max(1, event.timeStamp - gesture.time);
    gesture.velocity = (0.8 * (event.clientX - gesture.lastX)) / elapsed + 0.2 * gesture.velocity;
    gesture.lastX = event.clientX;
    gesture.time = event.timeStamp;
    if (reduceMotion) return;
    const x = event.clientX - gesture.x;
    const y = event.clientY - gesture.y;
    setPosition({ index: topIndex.current, x, y, rotation: x * 0.05, mode: 'drag' });
  };

  const cancelDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointer !== event.pointerId) return;
    drag.current = null;
    setPosition(null);
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = drag.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    drag.current = null;
    lastInteraction.current = performance.now();
    const x = event.clientX - gesture.x;
    const y = event.clientY - gesture.y;
    const width = deck.current?.offsetWidth ?? 400;
    const distance = Math.abs(x);
    if (distance > width * 0.28 || (Math.abs(gesture.velocity) > 0.55 && distance > 24)) {
      throwTop(true, Math.sign(x), x, y);
    } else {
      setPosition(null);
    }
  };

  return (
    <div
      className="card-deck"
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} images`}
      tabIndex={0}
      onKeyDown={handleKey}
    >
      <div className="card-deck-stack" ref={deck}>
        {slides.map((slide, index) => {
          const depth = wrap(index - top, count);
          const layer = Math.min(depth, 3);
          const isTop = depth === 0;
          const override = position?.index === index ? position : null;
          const tilt = isTop || reduceMotion ? 0 : tiltFor(index);
          const transform = override
            ? `translate(${override.x}px, ${override.y}px) rotate(${override.rotation}deg)`
            : `translateY(${-layer * 16}px) scale(${1 - layer * 0.055}) rotate(${tilt.toFixed(2)}deg)`;

          return (
            <div
              key={slide.image}
              className="card-deck-print"
              data-top={isTop ? '' : undefined}
              data-motion={override?.mode}
              style={{
                transform,
                zIndex: override ? count + 1 : count - depth,
                opacity: override || depth < 4 ? 1 : 0,
                filter: override || isTop ? undefined : `brightness(${1 - layer * 0.07})`,
              }}
              aria-hidden={!isTop}
              onPointerDown={isTop ? startDrag : undefined}
              onPointerMove={isTop ? moveDrag : undefined}
              onPointerUp={isTop ? finishDrag : undefined}
              onPointerCancel={isTop ? cancelDrag : undefined}
              onLostPointerCapture={isTop ? cancelDrag : undefined}
            >
              <img src={slide.image} alt={isTop ? slide.alt : ''} draggable={false} />
            </div>
          );
        })}
      </div>
      <div className="card-deck-controls">
        <button type="button" aria-label="Previous image" onClick={previous}>
          <i className="ph ph-caret-left" aria-hidden="true" />
        </button>
        <h2>{title}</h2>
        <span className="card-deck-count" aria-hidden="true">
          <b>{pad(top + 1)}</b> / {pad(count)}
        </span>
        <button type="button" aria-label="Next image" onClick={next}>
          <i className="ph ph-caret-right" aria-hidden="true" />
        </button>
      </div>
      <span className="sr-only" role="status">
        {announcement}
      </span>
    </div>
  );
}

export function DialogCardDeckCarousel(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = host.current?.closest('dialog');
    if (!dialog) return;

    const sync = () => setOpen(dialog.open);
    const observer = new MutationObserver(sync);
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    sync();
    return () => observer.disconnect();
  }, []);

  return <div ref={host}>{open && <CardDeckCarousel {...props} />}</div>;
}
