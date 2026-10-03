import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { DiscoveryAnswers } from '../services/aiService';

export type EnvironmentAIState = 'idle' | 'thinking' | 'responding' | 'discovery' | 'success';

export interface EnvironmentProfile extends Partial<DiscoveryAnswers> {}

interface EnvironmentContextValue {
  activeSection: string;
  aiState: EnvironmentAIState;
  profile: EnvironmentProfile;
  progressRef: { current: number };
  pointerRef: { current: { x: number; y: number } };
  setAIState: (state: EnvironmentAIState) => void;
  setProfile: (profile: EnvironmentProfile) => void;
}

const EnvironmentContext = createContext<EnvironmentContextValue | null>(null);

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const activeSectionRef = useRef('entry');
  const [activeSection, setActiveSection] = useState('entry');
  const [aiState, setAIStateValue] = useState<EnvironmentAIState>('idle');
  const [profile, setProfileValue] = useState<EnvironmentProfile>({});
  const frameRef = useRef(0);

  const setAIState = useCallback((state: EnvironmentAIState) => {
    setAIStateValue(state);
    window.dispatchEvent(new Event('nova-environment-change'));
  }, []);

  const setProfile = useCallback((nextProfile: EnvironmentProfile) => {
    setProfileValue(nextProfile);
    window.dispatchEvent(new Event('nova-environment-change'));
  }, []);

  useEffect(() => {
    const updateEnvironment = () => {
      frameRef.current = 0;
      const maximumScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      progressRef.current = Math.min(1, Math.max(0, window.scrollY / maximumScroll));

      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-environment]'));
      const viewportCenter = window.innerHeight * 0.46;
      let closest = sections[0];
      let closestDistance = Number.POSITIVE_INFINITY;
      sections.forEach((section) => {
        const bounds = section.getBoundingClientRect();
        const sectionCenter = Math.min(Math.max(viewportCenter, bounds.top), bounds.bottom);
        const distance = Math.abs(viewportCenter - sectionCenter);
        if (distance < closestDistance) {
          closest = section;
          closestDistance = distance;
        }
      });
      const nextSection = closest?.dataset.environment ?? 'entry';
      if (nextSection !== activeSectionRef.current) {
        activeSectionRef.current = nextSection;
        setActiveSection(nextSection);
      }
      window.dispatchEvent(new Event('nova-environment-scroll'));
    };

    const scheduleUpdate = () => {
      if (!frameRef.current) frameRef.current = window.requestAnimationFrame(updateEnvironment);
    };
    const handlePointer = (event: PointerEvent) => {
      pointerRef.current.x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      pointerRef.current.y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.dispatchEvent(new Event('nova-environment-scroll'));
      }
    };

    updateEnvironment();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    window.addEventListener('pointermove', handlePointer, { passive: true });
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(document.documentElement);

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('pointermove', handlePointer);
    };
  }, []);

  const value = useMemo<EnvironmentContextValue>(() => ({
    activeSection,
    aiState,
    profile,
    progressRef,
    pointerRef,
    setAIState,
    setProfile,
  }), [activeSection, aiState, profile, setAIState, setProfile]);

  return <EnvironmentContext.Provider value={value}>{children}</EnvironmentContext.Provider>;
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (!context) throw new Error('useEnvironment must be used inside EnvironmentProvider.');
  return context;
}
