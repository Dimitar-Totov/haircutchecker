/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    // Hairstyle try-on flow tokens (mapped from the design prototype's
    // --card/--field/--line/--accent CSS vars).
    card: '#F4F4F7',
    field: '#EDEDF1',
    line: 'rgba(0,0,0,0.09)',
    accent: '#5B3DF5',
    accentText: '#FFFFFF',
    feasibilityTodayText: '#0E8F4E',
    feasibilityTodayBackground: 'rgba(14,143,78,0.15)',
    feasibilityGrowText: '#B57E0A',
    feasibilityGrowBackground: 'rgba(181,126,10,0.18)',
    feasibilityPermText: '#C8492A',
    feasibilityPermBackground: 'rgba(200,73,42,0.16)',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    card: '#18181E',
    field: '#25252C',
    line: 'rgba(255,255,255,0.11)',
    accent: '#8B74FF',
    accentText: '#FFFFFF',
    feasibilityTodayText: '#0E8F4E',
    feasibilityTodayBackground: 'rgba(14,143,78,0.15)',
    feasibilityGrowText: '#B57E0A',
    feasibilityGrowBackground: 'rgba(181,126,10,0.18)',
    feasibilityPermText: '#C8492A',
    feasibilityPermBackground: 'rgba(200,73,42,0.16)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
