import { STYLES } from '@/features/try-on/styles-data';
import type {
  DensityOption,
  Feasibility,
  FaceShape,
  FilterChipsState,
  HairlineOption,
  StyleOption,
} from '@/features/try-on/types';

/** Ported from `Screen.dc.html` / `Hairstyle Try-On.dc.html` `renderVals()`. */

export const FACE_SHAPES: FaceShape[] = ['Oval', 'Round', 'Square', 'Heart', 'Oblong', 'Diamond'];

export const DENSITY_OPTIONS: DensityOption[] = ['Fine', 'Medium', 'Thick'];

export const HAIRLINE_OPTIONS: HairlineOption[] = [
  'Straight',
  'Rounded',
  "Widow's peak",
  'Receding',
];

export const TEX_SCALE = [
  'Straight 1A',
  'Straight 1C',
  'Wavy 2A',
  'Wavy 2B',
  'Curly 3B',
  'Coily 4A',
  'Coily 4C',
] as const;

export function getLenLabel(lenCm: number): string {
  const bucket = lenCm <= 6 ? 'Short' : lenCm <= 15 ? 'Medium' : 'Long';
  return `${bucket} — around ${lenCm} cm`;
}

export interface FeasibilityMeta {
  label: string;
  icon: string;
  textColor: 'feasibilityTodayText' | 'feasibilityGrowText' | 'feasibilityPermText';
  backgroundColor:
    | 'feasibilityTodayBackground'
    | 'feasibilityGrowBackground'
    | 'feasibilityPermBackground';
}

const FEASIBILITY_META: Record<Feasibility, FeasibilityMeta> = {
  today: {
    label: 'Today',
    icon: '✓',
    textColor: 'feasibilityTodayText',
    backgroundColor: 'feasibilityTodayBackground',
  },
  grow: {
    label: 'Growth',
    icon: '↑',
    textColor: 'feasibilityGrowText',
    backgroundColor: 'feasibilityGrowBackground',
  },
  perm: {
    label: 'Perm',
    icon: '↺',
    textColor: 'feasibilityPermText',
    backgroundColor: 'feasibilityPermBackground',
  },
};

export function getFeasibilityMeta(feas: Feasibility): FeasibilityMeta {
  return FEASIBILITY_META[feas];
}

/** Ported from the outer frame's `renderVals()` `filtered` computation. */
export function filterStyles(
  chips: FilterChipsState,
  query: string,
  styles: StyleOption[] = STYLES,
): StyleOption[] {
  return styles.filter((style) => {
    if (chips.achievable && style.feas !== 'today') return false;
    if (chips.maintenance && !style.tags.some((tag) => /upkeep/i.test(tag))) return false;
    if (chips.length && style.len !== 'Short') return false;
    if (chips.vibe && !style.tags.includes('Office-safe')) return false;
    if (query && !style.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
}
