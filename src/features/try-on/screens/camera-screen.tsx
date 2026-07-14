import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { useTryOnFlow } from '@/features/try-on/flow-context';
import { useTheme } from '@/hooks/use-theme';

// Near-black viewfinder backdrop — a one-off visual for the camera mock,
// not a reusable design token.
const VIEWFINDER_BACKGROUND = '#141417';
const ARMED_DOT = '#4fd08a';
const UNARMED_DOT = '#e6a423';

export function CameraScreen() {
  const { state, actions } = useTryOnFlow();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const armedProgress = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    armedProgress.value = withTiming(state.armed ? 1 : 0, { duration: 250 });
  }, [state.armed, armedProgress]);

  useEffect(() => {
    if (!state.armed) {
      pulse.value = 0;
      return;
    }
    pulse.value = 0;
    pulse.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.out(Easing.ease) }), -1, false);
    return () => cancelAnimation(pulse);
  }, [state.armed, pulse]);

  const chipStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      armedProgress.value,
      [0, 1],
      ['rgba(0,0,0,0.55)', theme.accent],
    ),
  }));

  const innerCircleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(armedProgress.value, [0, 1], ['#ffffff', theme.accent]),
  }));

  const pulseRingStyle = useAnimatedStyle(() => ({
    opacity: state.armed ? 0.55 * (1 - pulse.value) : 0,
    transform: [{ scale: 1 + pulse.value * 0.3 }],
  }));

  return (
    <View style={[styles.root, { backgroundColor: VIEWFINDER_BACKGROUND }]}>
      <StatusBar style="light" />

      <ThemedText type="code" themeColor="textSecondary" style={styles.previewLabel}>
        live camera preview
      </ThemedText>

      {/* Vignette + face guide */}
      <View style={styles.faceGuideWrap} pointerEvents="none">
        <View style={[styles.vignetteBar, styles.vignetteTop]} />
        <View style={[styles.vignetteBar, styles.vignetteBottom]} />
        <View style={styles.vignetteRow}>
          <View style={styles.vignetteSide} />
          <View style={styles.faceOval} />
          <View style={styles.vignetteSide} />
        </View>
      </View>

      <View style={styles.statusRow} pointerEvents="none">
        <Animated.View style={[styles.statusChip, chipStyle]}>
          <View
            style={[styles.statusDot, { backgroundColor: state.armed ? ARMED_DOT : UNARMED_DOT }]}
          />
          <ThemedText type="smallBold" style={styles.statusText}>
            {state.camStatus}
          </ThemedText>
        </Animated.View>
      </View>

      <View style={[styles.topIcons, { top: insets.top + 16 }]}>
        <Pressable
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="Flash (not available in this preview)"
          style={styles.iconButton}>
          <SymbolView name={{ ios: 'bolt', android: 'flash_on', web: 'flash_on' }} tintColor="#fff" size={22} />
        </Pressable>
        <Pressable
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="Flip camera (not available in this preview)"
          style={styles.iconButton}>
          <SymbolView
            name={{ ios: 'arrow.triangle.2.circlepath', android: 'cameraswitch', web: 'cameraswitch' }}
            tintColor="#fff"
            size={22}
          />
        </Pressable>
      </View>

      <View style={[styles.bottomRow, { bottom: Math.max(insets.bottom, 12) + 46 }]}>
        <Pressable
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="Choose from gallery (not available in this preview)"
          style={styles.galleryButton}
        />

        <Pressable
          onPress={actions.capture}
          accessibilityRole="button"
          accessibilityLabel="Take photo"
          style={({ pressed }) => [styles.shutter, pressed && styles.shutterPressed]}>
          <Animated.View
            style={[styles.pulseRing, { borderColor: theme.accent }, pulseRingStyle]}
          />
          <Animated.View style={[styles.shutterInner, innerCircleStyle]} />
        </Pressable>

        <View style={styles.bottomSpacer} />
      </View>

      <View style={[styles.useAnywayRow, { bottom: Math.max(insets.bottom, 12) }]}>
        <Pressable onPress={actions.capture} accessibilityRole="button">
          <ThemedText type="small" style={styles.useAnywayText}>
            Use anyway
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const OVAL_WIDTH = 236;
const OVAL_HEIGHT = 306;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  previewLabel: {
    position: 'absolute',
    top: 210,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  faceGuideWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  vignetteBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  vignetteTop: {
    top: 0,
    height: '50%',
    marginTop: -OVAL_HEIGHT * 0.28,
  },
  vignetteBottom: {
    bottom: 0,
    height: '50%',
    marginBottom: -OVAL_HEIGHT * 0.72,
  },
  vignetteRow: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: OVAL_HEIGHT,
    marginTop: -OVAL_HEIGHT * 0.56,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  vignetteSide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  faceOval: {
    width: OVAL_WIDTH,
    height: OVAL_HEIGHT,
    borderRadius: OVAL_WIDTH,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  statusRow: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
  },
  statusText: {
    color: '#fff',
    fontSize: 15,
  },
  topIcons: {
    position: 'absolute',
    right: 22,
    gap: 14,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
  },
  bottomSpacer: {
    width: 46,
  },
  galleryButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  shutter: {
    width: 78,
    height: 78,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterPressed: {
    transform: [{ scale: 0.92 }],
  },
  pulseRing: {
    position: 'absolute',
    width: 78,
    height: 78,
    borderRadius: 999,
    borderWidth: 3,
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 999,
  },
  useAnywayRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  useAnywayText: {
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
});
