import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { runOnJS } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { PlaceholderPattern } from '@/features/try-on/components/placeholder-pattern';
import { useTryOnFlow } from '@/features/try-on/flow-context';
import { useTheme } from '@/hooks/use-theme';

// The prototype hardcodes this brand purple for the paywall banner, the
// "after" overlay tint, and the AFTER pill — independent of the light/dark
// `--accent` var used elsewhere. Reproduced verbatim rather than mapped onto
// the theme's adaptive accent token.
const BRAND_PURPLE = '#5b3df5';
const ACTION_BAR_HEIGHT = 96;

export function ResultScreen() {
  const { state, actions } = useTryOnFlow();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [areaWidth, setAreaWidth] = useState(0);

  const actionBarHeight = ACTION_BAR_HEIGHT + insets.bottom;

  const onAreaLayout = useCallback((event: LayoutChangeEvent) => {
    setAreaWidth(event.nativeEvent.layout.width);
  }, []);

  const updateFromX = useCallback(
    (x: number) => {
      if (areaWidth <= 0) return;
      const pct = Math.min(100, Math.max(0, Math.round((x / areaWidth) * 100)));
      actions.setSplit(pct);
    },
    [areaWidth, actions],
  );

  const pan = Gesture.Pan()
    .onBegin((event) => runOnJS(updateFromX)(event.x))
    .onUpdate((event) => runOnJS(updateFromX)(event.x));

  return (
    <View style={[styles.root, { backgroundColor: '#0c0c0e' }]}>
      <StatusBar style="light" />

      <GestureDetector gesture={pan}>
        <View
          style={[styles.comparisonArea, { bottom: actionBarHeight }]}
          onLayout={onAreaLayout}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel="Before and after comparison divider"
          accessibilityValue={{ min: 0, max: 100, now: state.split }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === 'increment') {
              actions.setSplit(Math.min(100, state.split + 5));
            } else if (event.nativeEvent.actionName === 'decrement') {
              actions.setSplit(Math.max(0, state.split - 5));
            }
          }}>
          <PlaceholderPattern
            style={StyleSheet.absoluteFill}
            tone="dark"
            label={`your try-on · ${state.styleName}`}
          />
          <View
            style={[
              styles.afterLayer,
              { left: `${state.split}%` },
            ]}>
            <PlaceholderPattern
              style={StyleSheet.absoluteFill}
              label=""
              tone="dark"
            />
            <View style={[StyleSheet.absoluteFill, styles.afterTint]} />
          </View>

          <View style={[styles.dividerLine, { left: `${state.split}%` }]}>
            <View style={styles.dividerHandle}>
              <ThemedText type="smallBold" style={styles.dividerGlyph}>
                ‹ ›
              </ThemedText>
            </View>
          </View>

          <View style={styles.labelRow}>
            <View style={styles.beforeLabel}>
              <ThemedText type="smallBold" style={styles.pillText}>
                BEFORE
              </ThemedText>
            </View>
            <View style={[styles.afterLabel, { backgroundColor: 'rgba(91,61,245,0.85)' }]}>
              <ThemedText type="smallBold" style={styles.pillText}>
                AFTER
              </ThemedText>
            </View>
          </View>
        </View>
      </GestureDetector>

      <View style={[styles.styleNamePill, { top: insets.top + 14 }]} pointerEvents="none">
        <ThemedText type="smallBold" style={styles.pillText}>
          {state.styleName}
        </ThemedText>
      </View>

      {state.paywall ? (
        <View style={[styles.paywall, { bottom: actionBarHeight + 40 }]}>
          <ThemedText type="smallBold" style={styles.paywallText}>
            Unlimited try-ons, HD & back views with Pro
          </ThemedText>
          <Pressable
            onPress={actions.dismissPaywall}
            accessibilityRole="button"
            accessibilityLabel="Dismiss Pro upsell"
            style={styles.paywallDismiss}>
            <ThemedText style={styles.pillText}>✕</ThemedText>
          </Pressable>
        </View>
      ) : null}

      <View style={[styles.dotsRow, { bottom: actionBarHeight + 20 }]}>
        {[0, 1, 2].map((i) => (
          <Pressable
            key={i}
            onPress={() => actions.setVariation(i)}
            accessibilityRole="button"
            accessibilityLabel={`Variation ${i + 1}`}
            accessibilityState={{ selected: i === state.variation }}
            style={[
              styles.dot,
              {
                width: i === state.variation ? 22 : 7,
                backgroundColor: i === state.variation ? '#fff' : 'rgba(255,255,255,0.45)',
              },
            ]}
          />
        ))}
      </View>

      <View style={[styles.actionBar, { height: actionBarHeight, paddingBottom: insets.bottom }]}>
        <Pressable
          onPress={actions.regen}
          accessibilityRole="button"
          accessibilityLabel="Regenerate try-on"
          style={styles.roundButton}>
          <SymbolView
            name={{ ios: 'arrow.clockwise', android: 'autorenew', web: 'autorenew' }}
            tintColor="#fff"
            size={22}
          />
        </Pressable>
        <Pressable
          onPress={actions.toggleSave}
          accessibilityRole="button"
          accessibilityLabel={state.saved ? 'Remove from saved' : 'Save style'}
          accessibilityState={{ selected: state.saved }}
          style={styles.roundButton}>
          <SymbolView
            name={{ ios: state.saved ? 'heart.fill' : 'heart', android: 'favorite', web: 'favorite' }}
            tintColor={state.saved ? '#ff5a7a' : '#fff'}
            size={22}
          />
        </Pressable>
        <Pressable
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="Share (not available in this preview)"
          style={styles.roundButton}>
          <SymbolView
            name={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
            tintColor="#fff"
            size={22}
          />
        </Pressable>
        <Pressable
          onPress={() => actions.nav('brief')}
          accessibilityRole="button"
          style={[styles.briefButton, { backgroundColor: theme.accent }]}>
          <ThemedText type="default" themeColor="accentText" style={styles.briefButtonText}>
            Get barber brief
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
  comparisonArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  afterLayer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    overflow: 'hidden',
  },
  afterTint: {
    backgroundColor: BRAND_PURPLE,
    opacity: 0.32,
  },
  dividerLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#fff',
    marginLeft: -1,
  },
  dividerHandle: {
    position: 'absolute',
    top: '44%',
    left: -20,
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerGlyph: {
    color: '#0c0c0e',
    fontSize: 14,
  },
  labelRow: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  beforeLabel: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  afterLabel: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  pillText: {
    color: '#fff',
    fontSize: 12,
  },
  styleNamePill: {
    position: 'absolute',
    left: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  paywall: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(91,61,245,0.95)',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paywallText: {
    flex: 1,
    color: '#fff',
  },
  paywallDismiss: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 7,
  },
  dot: {
    height: 7,
    borderRadius: 999,
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  roundButton: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  briefButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  briefButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
