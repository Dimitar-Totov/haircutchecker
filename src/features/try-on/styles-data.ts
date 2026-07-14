import type { StyleOption } from '@/features/try-on/types';

/**
 * Ported verbatim from the `STYLES` constant in
 * `Hairstyle Try-On.dc.html`.
 */
export const STYLES: StyleOption[] = [
  {
    name: 'Textured crop',
    tags: ['Low upkeep', 'Office-safe'],
    match: 92,
    feas: 'today',
    len: 'Short',
    ph: 'wavy hair · medium skin',
  },
  {
    name: 'Mid skin fade',
    tags: ['Sharp', 'Office-safe'],
    match: 88,
    feas: 'today',
    len: 'Short',
    ph: 'coily hair · deep skin',
  },
  {
    name: 'Long layers',
    tags: ['Soft', 'Versatile'],
    match: 90,
    feas: 'today',
    len: 'Long',
    ph: 'wavy hair · light skin',
  },
  {
    name: 'Sponge coils',
    tags: ['Defined', 'Low upkeep'],
    match: 86,
    feas: 'today',
    len: 'Short',
    ph: 'coily hair · deep skin',
  },
  {
    name: 'Buzz cut',
    tags: ['Zero upkeep'],
    match: 79,
    feas: 'today',
    len: 'Short',
    ph: 'straight hair · tan skin',
  },
  {
    name: 'Curtain fringe',
    tags: ['Trendy', 'Office-safe'],
    match: 84,
    feas: 'grow',
    len: 'Medium',
    ph: 'straight hair · fair skin',
  },
  {
    name: 'Slick back',
    tags: ['Formal'],
    match: 81,
    feas: 'grow',
    len: 'Medium',
    ph: 'straight hair · olive skin',
  },
  {
    name: 'Soft perm waves',
    tags: ['Bold change'],
    match: 77,
    feas: 'perm',
    len: 'Medium',
    ph: 'straight→wavy · fair skin',
  },
];
