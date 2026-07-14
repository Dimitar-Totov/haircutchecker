/**
 * Shared types for the hairstyle try-on flow.
 *
 * These mirror the state shape driven by `Component` in
 * `Hairstyle Try-On.dc.html` (the interactive design prototype) 1:1 so the
 * screen components (ported from `Screen.dc.html`) can be typed precisely.
 */

export type FlowScreen =
  | 'camera'
  | 'analyzing'
  | 'profile'
  | 'catalog'
  | 'generating'
  | 'result'
  | 'brief'
  | 'show';

export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Heart' | 'Oblong' | 'Diamond';

export type DensityOption = 'Fine' | 'Medium' | 'Thick';

export type HairlineOption = 'Straight' | 'Rounded' | "Widow's peak" | 'Receding';

export type Feasibility = 'today' | 'grow' | 'perm';

export type StyleLength = 'Short' | 'Medium' | 'Long';

export type Lang = 'EN' | 'BG';

export type ShowPanel = 'photo' | 'specs';

export interface StyleOption {
  name: string;
  tags: string[];
  match: number;
  feas: Feasibility;
  len: StyleLength;
  /** Placeholder-photo stand-in caption, e.g. "wavy hair · medium skin". */
  ph: string;
}

export interface FilterChipsState {
  maintenance: boolean;
  length: boolean;
  vibe: boolean;
  achievable: boolean;
}

export interface BarberSpecs {
  sides: string;
  top: string;
  neckline: string;
  extras: string;
}

export type SpecKey = keyof BarberSpecs;

export interface FlowState {
  screen: FlowScreen;
  armed: boolean;
  camStatus: string;
  face: FaceShape;
  lenCm: number;
  /** Index into TEX_SCALE, 0-6. */
  tex: number;
  density: DensityOption;
  hairline: HairlineOption;
  query: string;
  chips: FilterChipsState;
  styleName: string;
  /** Before/after divider position, 0-100. */
  split: number;
  /** Index of the active result variation, 0-2. */
  variation: number;
  saved: boolean;
  paywall: boolean;
  specs: BarberSpecs;
  note: string;
  lang: Lang;
  showPanel: ShowPanel;
}

export interface FlowActions {
  nav: (screen: FlowScreen) => void;
  capture: () => void;
  pickStyle: (name: string) => void;
  regen: () => void;
  setFace: (face: FaceShape) => void;
  setLen: (cm: number) => void;
  setTex: (index: number) => void;
  setDensity: (density: DensityOption) => void;
  setHairline: (hairline: HairlineOption) => void;
  toggleChip: (key: keyof FilterChipsState) => void;
  setQuery: (query: string) => void;
  setSplit: (split: number) => void;
  setVariation: (index: number) => void;
  toggleSave: () => void;
  dismissPaywall: () => void;
  setSpec: (key: SpecKey, value: string) => void;
  setNote: (note: string) => void;
  setLang: (lang: Lang) => void;
  openShow: () => void;
  closeShow: () => void;
  setShowPanel: (panel: ShowPanel) => void;
}
