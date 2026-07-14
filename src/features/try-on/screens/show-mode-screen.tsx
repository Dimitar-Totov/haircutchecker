import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { PlaceholderPattern } from '@/features/try-on/components/placeholder-pattern';
import { useTryOnFlow } from '@/features/try-on/flow-context';
import type { SpecKey } from '@/features/try-on/types';

// "Show at the shop" mode is a deliberately theme-independent, always-light
// presentation surface in the prototype (it hardcodes #fff/#0c0c0e rather
// than the --bg/--fg vars used everywhere else), so it's reproduced with
// fixed colors rather than theme tokens.
const SURFACE = '#ffffff';
const ON_SURFACE = '#0c0c0e';
const MUTED = '#888888';

const SPEC_ROWS: { key: SpecKey; label: string }[] = [
  { key: 'sides', label: 'Sides' },
  { key: 'top', label: 'Top' },
  { key: 'neckline', label: 'Neckline' },
  { key: 'extras', label: 'Extras' },
];

export function ShowModeScreen() {
  const { state, actions } = useTryOnFlow();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: SURFACE }]}>
      <StatusBar style="dark" />

      <Pressable
        onPress={actions.closeShow}
        accessibilityRole="button"
        accessibilityLabel="Close show mode"
        style={[styles.closeButton, { top: insets.top + 14 }]}>
        <ThemedText style={styles.closeGlyph}>✕</ThemedText>
      </Pressable>

      <View style={styles.body}>
        {state.showPanel === 'photo' ? (
          <View style={styles.photoPanel}>
            <View style={styles.photoBox}>
              <PlaceholderPattern
                style={StyleSheet.absoluteFill}
                tone="neutral"
                label={`your try-on · ${state.styleName}`}
              />
            </View>
            <ThemedText style={styles.photoTitle}>{state.styleName}</ThemedText>
          </View>
        ) : (
          <View style={styles.specsPanel}>
            <ThemedText style={styles.specsTitle}>{state.styleName}</ThemedText>
            {SPEC_ROWS.map((row) => (
              <View key={row.key} style={styles.specRow}>
                <ThemedText style={styles.specLabel}>{row.label}</ThemedText>
                <ThemedText style={styles.specValue}>{state.specs[row.key]}</ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.panelToggle, { paddingBottom: Math.max(insets.bottom, 40) }]}>
        <Pressable
          onPress={() => actions.setShowPanel('photo')}
          accessibilityRole="button"
          accessibilityState={{ selected: state.showPanel === 'photo' }}
          style={[styles.panelButton, state.showPanel === 'photo' && styles.panelButtonActive]}>
          <ThemedText style={[styles.panelButtonText, state.showPanel === 'photo' && styles.panelButtonTextActive]}>
            Photo
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => actions.setShowPanel('specs')}
          accessibilityRole="button"
          accessibilityState={{ selected: state.showPanel === 'specs' }}
          style={[styles.panelButton, state.showPanel === 'specs' && styles.panelButtonActive]}>
          <ThemedText style={[styles.panelButtonText, state.showPanel === 'specs' && styles.panelButtonTextActive]}>
            Specs
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  closeGlyph: {
    color: ON_SURFACE,
    fontSize: 20,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingTop: 70,
    paddingBottom: 20,
  },
  photoPanel: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  photoBox: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  photoTitle: {
    marginTop: 22,
    fontSize: 26,
    fontWeight: '700',
    color: ON_SURFACE,
    textAlign: 'center',
  },
  specsPanel: {
    width: '100%',
    maxWidth: 320,
  },
  specsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: ON_SURFACE,
    marginBottom: 12,
  },
  specRow: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  specLabel: {
    fontSize: 15,
    color: MUTED,
    fontWeight: '600',
  },
  specValue: {
    fontSize: 22,
    fontWeight: '600',
    color: ON_SURFACE,
    marginTop: 2,
  },
  panelToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 16,
  },
  panelButton: {
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  panelButtonActive: {
    backgroundColor: ON_SURFACE,
  },
  panelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: ON_SURFACE,
  },
  panelButtonTextActive: {
    color: '#fff',
  },
});
