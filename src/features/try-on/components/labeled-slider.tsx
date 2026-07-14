import { useCallback, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

/**
 * A minimal draggable slider built on `react-native-gesture-handler` +
 * `react-native-reanimated` (no slider dependency) — used for the "Hair
 * length" control on the hair-profile screen. Ported behaviour from the
 * prototype's native `<input type="range">`.
 */
export function LabeledSlider({
  min,
  max,
  value,
  step = 1,
  onChange,
  accessibilityLabel,
}: {
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (value: number) => void;
  accessibilityLabel: string;
}) {
  const theme = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);

  const clampedRatio = Math.min(1, Math.max(0, (value - min) / (max - min)));

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  }, []);

  const updateFromX = useCallback(
    (x: number) => {
      if (trackWidth <= 0) return;
      const ratio = Math.min(1, Math.max(0, x / trackWidth));
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      onChange(Math.min(max, Math.max(min, stepped)));
    },
    [trackWidth, min, max, step, onChange],
  );

  const pan = Gesture.Pan()
    .onBegin((event) => {
      runOnJS(updateFromX)(event.x);
    })
    .onUpdate((event) => {
      runOnJS(updateFromX)(event.x);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    left: `${clampedRatio * 100}%`,
  }));

  const increment = useCallback(() => onChange(Math.min(max, value + step)), [onChange, max, value, step]);
  const decrement = useCallback(() => onChange(Math.max(min, value - step)), [onChange, min, value, step]);

  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') increment();
        else if (event.nativeEvent.actionName === 'decrement') decrement();
      }}>
      <GestureDetector gesture={pan}>
        <View style={styles.track} onLayout={onLayout}>
          <View style={[styles.trackLine, { backgroundColor: theme.line }]} />
          <View
            style={[
              styles.trackFill,
              { backgroundColor: theme.accent, width: `${clampedRatio * 100}%` },
            ]}
          />
          <Animated.View
            style={[styles.thumb, { backgroundColor: theme.accent, borderColor: theme.background }, thumbStyle]}
          />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 32,
    justifyContent: 'center',
  },
  track: {
    height: 32,
    justifyContent: 'center',
  },
  trackLine: {
    position: 'absolute',
    left: 9,
    right: 9,
    height: 3,
    borderRadius: 2,
  },
  trackFill: {
    position: 'absolute',
    left: 9,
    height: 3,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    marginLeft: -10,
    borderRadius: 999,
    borderWidth: 2,
  },
});
