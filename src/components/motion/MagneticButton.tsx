import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  class?: string;
}

const STRENGTH = 0.3;

export default function MagneticButton({ children, href, class: className }: MagneticButtonProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(query.matches);

    const onChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (prefersReducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setOffset({
      x: (event.clientX - bounds.left - bounds.width / 2) * STRENGTH,
      y: (event.clientY - bounds.top - bounds.height / 2) * STRENGTH,
    });
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 });
  }

  const sharedClassName = [
    'inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const sharedProps = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    animate: { x: offset.x, y: offset.y },
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { type: 'spring' as const, stiffness: 150, damping: 12, mass: 0.3 },
    className: sharedClassName,
  };

  if (href) {
    return (
      <motion.a href={href} {...sharedProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" {...sharedProps}>
      {children}
    </motion.button>
  );
}
