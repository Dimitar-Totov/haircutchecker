# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Testing
Do not run tests (npm test, npx playwright test, vitest, jest, etc.) automatically
after implementing a feature or fixing a bug. Only run tests when explicitly asked to.

## Project state

Started from the Expo Router starter template (`create-expo-app`) under the app name "haircutchecker".
The template's demo screens have been replaced with the start of the actual product: a hairstyle
try-on flow (`src/features/try-on/`) ported from a design prototype. `src/app/index.tsx` (Home),
`src/app/saved.tsx`, and `src/app/profile.tsx` are still minimal stubs — only the try-on flow
(`src/app/try-on.tsx`) is fully built out.

## Commands

```bash
npm install          # install dependencies
npx expo start        # start the dev server (press a/i/w to open Android/iOS/web)
npm run android        # start with Android target
npm run ios            # start with iOS target
npm run web             # start with web target
npm run lint             # expo lint (ESLint)
npm run reset-project    # moves template code to app-example/ and gives you a blank src/app
```

There is no test runner configured yet. There is no `tsc` script; use your editor's TypeScript
diagnostics or run `npx tsc --noEmit` directly to type-check.

## Architecture

- **Routing**: Expo Router (file-based) rooted at `src/app`, not the default `app/` — see the `main`
  entry (`expo-router/entry`) and `expo-router` config. Typed routes are enabled
  (`experiments.typedRoutes` in `app.json`), and the React Compiler is enabled
  (`experiments.reactCompiler`).
- **Path aliases**: `@/*` → `src/*`, `@/assets/*` → `assets/*` (see `tsconfig.json`).
- **Tab navigation** (`src/components/app-tabs.tsx` / `app-tabs.web.tsx`): four tabs — Home
  (`index`), Try on (`try-on`), Saved (`saved`), Profile (`profile`) — platform-specific
  implementations selected automatically via the `.web.tsx` extension convention.
  - Native uses `expo-router/unstable-native-tabs` (`NativeTabs`) for OS-native tab bars.
  - Web uses `expo-router/ui` (`Tabs`/`TabList`/`TabTrigger`/`TabSlot`) with a custom pill-style tab bar.
  - This same `.web.tsx` override pattern is used elsewhere (e.g. `animated-icon.tsx` /
    `animated-icon.web.tsx`, `use-color-scheme.ts` / `use-color-scheme.web.ts`) — check for a web
    variant before assuming one file covers all platforms.
  - `_layout.tsx` wraps the tabs in `GestureHandlerRootView` (required by the try-on flow's
    gesture-driven controls) alongside the existing `ThemeProvider` / `AnimatedSplashOverlay`.
- **Theming**: no external styling library. `src/constants/theme.ts` defines `Colors` (light/dark),
  `Fonts`, and `Spacing` scale constants directly. `src/hooks/use-theme.ts` resolves the active
  `Colors` entry from `useColorScheme()` (treating `'unspecified'` as `'light'`). `ThemedView` and
  `ThemedText` (`src/components/`) consume this instead of hardcoded colors/styles — prefer them
  over raw `View`/`Text` when adding UI. `Colors` also carries the try-on flow's tokens
  (`card`/`field`/`line`/`accent`/`accentText`/`feasibility*`) — extend these rather than hardcoding
  hex values in feature code; a few screens intentionally hardcode literal colors instead (see below).
- **Global CSS**: `src/global.css` is imported once from `src/constants/theme.ts` and defines
  web font vars (`--font-display`, `--font-mono`, etc.) referenced by `Fonts.web` in `theme.ts`.
- **Splash/animation**: `src/components/animated-icon.tsx` (native) and `.web.tsx` (web) implement
  a custom animated splash screen and logo using `react-native-reanimated` `Keyframe`s, wired up in
  `src/app/_layout.tsx` via `AnimatedSplashOverlay` alongside `expo-splash-screen`.

### Hairstyle try-on flow (`src/features/try-on/`)

The core product loop — camera → analyzing → hair profile → catalog → generating → result
(before/after) → barber brief → show-at-shop mode — lives entirely under this directory and is
mounted at the `try-on` tab route (`src/app/try-on.tsx`).

- **State machine**: `flow-context.tsx` defines `TryOnFlowProvider`/`useTryOnFlow()`, a single
  provider owning all flow state (`FlowState` in `types.ts`) and every transition/setter
  (`FlowActions`), including the simulated async delays (camera arm, analyzing, generating/regen).
  It is scoped to the `try-on` route, not global — navigating to another tab and back resets the
  flow to the camera step.
- **Screen switch**: `try-on-flow.tsx` renders one of the 8 screens in `screens/` based on
  `state.screen`; each screen reads `state`/`actions` via `useTryOnFlow()` rather than receiving
  props.
- **Derived data**: `styles-data.ts` (the hardcoded style catalog) and `derived.ts` (face
  shape/density/hairline option lists, texture scale labels, feasibility color/label mapping,
  catalog filtering logic) are pure and screen-agnostic — extend these rather than duplicating
  logic inside a screen component.
- **Shared primitives**: `components/chip.tsx`, `feasibility-badge.tsx`, `labeled-slider.tsx`,
  `placeholder-pattern.tsx` — `placeholder-pattern.tsx` reproduces the design source's diagonal
  hatch stand-in photography using rotated `View`s (RN has no `repeating-linear-gradient`).
- **No real camera/AI integration**: the camera, analyzing, and generating screens are visual
  scaffolds with `setTimeout`-driven fake transitions — there is no `expo-camera`, image-library, or
  backend call wired up yet.
- **Custom gesture controls**: the hair-length slider and the result screen's before/after divider
  are built on `react-native-gesture-handler` + `react-native-reanimated` (both already installed)
  rather than a slider dependency — don't add one for similar future controls.
- **Intentional hardcoded colors**: the result screen (always-dark) and show-mode screen
  (always-light) use literal color values instead of theme tokens, matching the design source which
  hardcodes those surfaces independently of the light/dark `--accent` var — this is deliberate, not
  an oversight to "fix".

## Notes

- Read the versioned Expo docs at https://docs.expo.dev/versions/v57.0.0/ before writing code —
  the API surface has changed from older Expo/Expo Router versions (see `AGENTS.md`).
- `expo-env.d.ts` is generated by Expo; do not hand-edit it.
