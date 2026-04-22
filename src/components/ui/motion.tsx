/**
 * motion.tsx — Reusable Framer Motion wrappers
 * All animation components live here so pages stay clean.
 */
import React from 'react';
import { motion, AnimatePresence, Variants, MotionProps } from 'framer-motion';

// ─── Shared Variants ──────────────────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit:    { opacity: 0,  transition: { duration: 0.25 } },
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export const slideRight: Variants = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, x: 24, transition: { duration: 0.25 } },
};

export const slideUp: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

export const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
};

export const popIn: Variants = {
  hidden:  { scale: 0.75, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 22 } },
  exit:    { scale: 0.8, opacity: 0, transition: { duration: 0.15 } },
};

// ─── Page Transition ──────────────────────────────────────────────────────────
export const PageTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className = '',
}) => (
  <motion.div
    className={className}
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    {children}
  </motion.div>
);

// ─── Fade In ──────────────────────────────────────────────────────────────────
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, delay = 0, duration = 0.4, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// ─── Slide Up ─────────────────────────────────────────────────────────────────
export const SlideUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

// ─── Stagger Container ────────────────────────────────────────────────────────
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}> = ({ children, className = '', delay = 0, gap = 0.07 }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={{
      hidden:  {},
      visible: { transition: { staggerChildren: gap, delayChildren: delay } },
    }}
  >
    {children}
  </motion.div>
);

// ─── Stagger Item ─────────────────────────────────────────────────────────────
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <motion.div
    className={className}
    variants={fadeUp}
  >
    {children}
  </motion.div>
);

// ─── Animated Card ────────────────────────────────────────────────────────────
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}> = ({ children, className = '', delay = 0, onClick }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] }}
    whileHover={{ y: -3, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

// ─── Scale On Hover ───────────────────────────────────────────────────────────
export const HoverScale: React.FC<{
  children: React.ReactNode;
  className?: string;
  scale?: number;
}> = ({ children, className = '', scale = 1.03 }) => (
  <motion.div
    className={className}
    whileHover={{ scale, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  </motion.div>
);

// ─── Animated Number Counter ──────────────────────────────────────────────────
export const AnimatedNumber: React.FC<{ value: number | string }> = ({ value }) => (
  <motion.span
    key={String(value)}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
  >
    {value}
  </motion.span>
);

// ─── Shimmer Skeleton ─────────────────────────────────────────────────────────
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

// ─── Modal / Overlay ──────────────────────────────────────────────────────────
export const ModalOverlay: React.FC<{
  children: React.ReactNode;
  onClose?: () => void;
}> = ({ children, onClose }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
  >
    <motion.div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
    <motion.div
      className="relative z-10 w-full max-w-lg"
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  </motion.div>
);

// ─── Floating Orb (decorative) ────────────────────────────────────────────────
export const FloatingOrb: React.FC<{
  color: string;
  size?: number;
  x?: string;
  y?: string;
  delay?: number;
  opacity?: number;
}> = ({ color, size = 300, x = '0px', y = '0px', delay = 0, opacity = 0.15 }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none hero-orb"
    style={{ width: size, height: size, background: color, left: x, top: y, opacity }}
    animate={{ y: [0, -20, 0], x: [0, 8, 0] }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ─── AnimatePresence re-export for convenience ────────────────────────────────
export { AnimatePresence, motion };
