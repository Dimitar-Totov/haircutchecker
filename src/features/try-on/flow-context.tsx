import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import type {
  BarberSpecs,
  DensityOption,
  FaceShape,
  FilterChipsState,
  FlowActions,
  FlowScreen,
  FlowState,
  HairlineOption,
  Lang,
  ShowPanel,
  SpecKey,
} from '@/features/try-on/types';

/**
 * Port of the `Component` state machine in `Hairstyle Try-On.dc.html`.
 * One provider owns all flow state + transitions; every screen consumes it
 * through `useTryOnFlow()`.
 */

const CAMERA_ARM_DELAY_MS = 1400;
const ANALYZING_DELAY_MS = 1700;
const GENERATING_DELAY_MS = 1800;
const REGEN_DELAY_MS = 1500;

const INITIAL_STATE: FlowState = {
  screen: 'camera',
  armed: false,
  camStatus: 'Move closer',
  face: 'Oval',
  lenCm: 5,
  tex: 3,
  density: 'Medium',
  hairline: 'Straight',
  query: '',
  chips: { maintenance: false, length: false, vibe: false, achievable: false },
  styleName: 'Textured crop',
  split: 50,
  variation: 0,
  saved: false,
  paywall: true,
  specs: {
    sides: 'Skin fade, guard #2',
    top: 'Keep 7–8 cm, textured',
    neckline: 'Tapered',
    extras: 'Keep natural part',
  },
  note: '',
  lang: 'EN',
  showPanel: 'photo',
};

interface TryOnFlowContextValue {
  state: FlowState;
  actions: FlowActions;
}

const TryOnFlowContext = createContext<TryOnFlowContextValue | null>(null);

export function TryOnFlowProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FlowState>(INITIAL_STATE);

  const armTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analyzingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generatingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (armTimer.current) clearTimeout(armTimer.current);
    if (analyzingTimer.current) clearTimeout(analyzingTimer.current);
    if (generatingTimer.current) clearTimeout(generatingTimer.current);
  }, []);

  // Starts (or restarts) the "hold still" arm timer. Split out from
  // `goCamera` so the mount effect below only ever touches state from inside
  // a timer callback, never synchronously in the effect body.
  const armCamera = useCallback(() => {
    if (armTimer.current) clearTimeout(armTimer.current);
    armTimer.current = setTimeout(() => {
      setState((prev) => ({ ...prev, armed: true, camStatus: 'Perfect — hold still' }));
    }, CAMERA_ARM_DELAY_MS);
  }, []);

  const goCamera = useCallback(() => {
    setState((prev) => ({ ...prev, screen: 'camera', armed: false, camStatus: 'Move closer' }));
    armCamera();
  }, [armCamera]);

  // componentDidMount() { this.goCamera(); } — initial state already matches
  // the camera screen's reset values, so on mount we only need to arm it.
  useEffect(() => {
    armCamera();
    return clearTimers;
  }, [armCamera, clearTimers]);

  const nav = useCallback(
    (screen: FlowScreen) => {
      if (screen === 'camera') {
        goCamera();
        return;
      }
      setState((prev) => ({ ...prev, screen }));
    },
    [goCamera],
  );

  const capture = useCallback(() => {
    setState((prev) => ({ ...prev, screen: 'analyzing' }));
    if (analyzingTimer.current) clearTimeout(analyzingTimer.current);
    analyzingTimer.current = setTimeout(() => {
      setState((prev) => ({ ...prev, screen: 'profile' }));
    }, ANALYZING_DELAY_MS);
  }, []);

  const pickStyle = useCallback((name: string) => {
    setState((prev) => ({ ...prev, styleName: name, screen: 'generating', variation: 0, split: 50 }));
    if (generatingTimer.current) clearTimeout(generatingTimer.current);
    generatingTimer.current = setTimeout(() => {
      setState((prev) => ({ ...prev, screen: 'result' }));
    }, GENERATING_DELAY_MS);
  }, []);

  const regen = useCallback(() => {
    setState((prev) => ({ ...prev, screen: 'generating' }));
    if (generatingTimer.current) clearTimeout(generatingTimer.current);
    generatingTimer.current = setTimeout(() => {
      setState((prev) => ({ ...prev, screen: 'result', variation: (prev.variation + 1) % 3 }));
    }, REGEN_DELAY_MS);
  }, []);

  const setFace = useCallback((face: FaceShape) => setState((prev) => ({ ...prev, face })), []);
  const setLen = useCallback((cm: number) => setState((prev) => ({ ...prev, lenCm: cm })), []);
  const setTex = useCallback((index: number) => setState((prev) => ({ ...prev, tex: index })), []);
  const setDensity = useCallback(
    (density: DensityOption) => setState((prev) => ({ ...prev, density })),
    [],
  );
  const setHairline = useCallback(
    (hairline: HairlineOption) => setState((prev) => ({ ...prev, hairline })),
    [],
  );
  const toggleChip = useCallback((key: keyof FilterChipsState) => {
    setState((prev) => ({ ...prev, chips: { ...prev.chips, [key]: !prev.chips[key] } }));
  }, []);
  const setQuery = useCallback((query: string) => setState((prev) => ({ ...prev, query })), []);
  const setSplit = useCallback((split: number) => setState((prev) => ({ ...prev, split })), []);
  const setVariation = useCallback(
    (index: number) => setState((prev) => ({ ...prev, variation: index })),
    [],
  );
  const toggleSave = useCallback(() => setState((prev) => ({ ...prev, saved: !prev.saved })), []);
  const dismissPaywall = useCallback(() => setState((prev) => ({ ...prev, paywall: false })), []);
  const setSpec = useCallback((key: SpecKey, value: string) => {
    setState((prev) => ({ ...prev, specs: { ...prev.specs, [key]: value } as BarberSpecs }));
  }, []);
  const setNote = useCallback((note: string) => setState((prev) => ({ ...prev, note })), []);
  const setLang = useCallback((lang: Lang) => setState((prev) => ({ ...prev, lang })), []);
  const openShow = useCallback(
    () => setState((prev) => ({ ...prev, screen: 'show', showPanel: 'photo' })),
    [],
  );
  const closeShow = useCallback(() => setState((prev) => ({ ...prev, screen: 'brief' })), []);
  const setShowPanel = useCallback(
    (panel: ShowPanel) => setState((prev) => ({ ...prev, showPanel: panel })),
    [],
  );

  const actions = useMemo<FlowActions>(
    () => ({
      nav,
      capture,
      pickStyle,
      regen,
      setFace,
      setLen,
      setTex,
      setDensity,
      setHairline,
      toggleChip,
      setQuery,
      setSplit,
      setVariation,
      toggleSave,
      dismissPaywall,
      setSpec,
      setNote,
      setLang,
      openShow,
      closeShow,
      setShowPanel,
    }),
    [
      nav,
      capture,
      pickStyle,
      regen,
      setFace,
      setLen,
      setTex,
      setDensity,
      setHairline,
      toggleChip,
      setQuery,
      setSplit,
      setVariation,
      toggleSave,
      dismissPaywall,
      setSpec,
      setNote,
      setLang,
      openShow,
      closeShow,
      setShowPanel,
    ],
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <TryOnFlowContext.Provider value={value}>{children}</TryOnFlowContext.Provider>;
}

export function useTryOnFlow(): TryOnFlowContextValue {
  const ctx = useContext(TryOnFlowContext);
  if (!ctx) {
    throw new Error('useTryOnFlow must be used within a TryOnFlowProvider');
  }
  return ctx;
}
