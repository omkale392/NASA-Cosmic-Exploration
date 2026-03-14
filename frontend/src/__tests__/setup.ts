import '@testing-library/jest-dom';
import { createElement, type ReactNode } from 'react';

// jsdom does not implement scrollTo — polyfill it globally
window.HTMLElement.prototype.scrollTo = function () {};
window.Element.prototype.scrollTo = function () {};

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, tag: string) => {
        const Component = ({
          children,
          // Strip all framer-motion-specific props so they don't reach the DOM
          initial: _i, animate: _a, exit: _e, transition: _t,
          variants: _v, whileHover: _wh, whileTap: _wt, whileFocus: _wf,
          whileInView: _wiv, layoutId: _lid, custom: _c,
          onAnimationComplete: _oac, onHoverStart: _ohs, onHoverEnd: _ohe,
          drag: _d, dragConstraints: _dc, dragElastic: _de,
          ...domProps
        }: Record<string, unknown> & { children?: ReactNode }) =>
          createElement(tag as string, domProps, children);
        Component.displayName = `motion.${tag}`;
        return Component;
      },
    }
  ),
  AnimatePresence: ({ children }: { children?: ReactNode }) => children ?? null,
  useAnimation: () => ({ start: () => {}, stop: () => {} }),
  useMotionValue: (initial: unknown) => ({ get: () => initial, set: () => {} }),
  useTransform: () => ({ get: () => 0 }),
}));
