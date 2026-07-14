import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

// A diagonal hatch made of rotated bars, offset horizontally — a stand-in for
// the prototype's `repeating-linear-gradient(45deg, …)` placeholder photo
// texture (React Native's style engine has no repeating-gradient support).
const STRIPE_OFFSETS = Array.from({ length: 14 }, (_, i) => (i - 6) * 34);

export type PlaceholderTone = 'neutral' | 'accent' | 'dark';

/**
 * Full-bleed "stand-in for real photography" placeholder used across the
 * catalog, generating, result, and barber-brief screens.
 */
export function PlaceholderPattern({
  style,
  tone = 'neutral',
  label,
  labelAlign = 'bottom',
  shimmer = false,
}: {
  style?: StyleProp<ViewStyle>;
  tone?: PlaceholderTone;
  label?: string;
  labelAlign?: 'bottom' | 'center';
  shimmer?: boolean;
}) {
  const theme = useTheme();
  const stripeColor = tone === 'accent' ? theme.accent : theme.textSecondary;
  const stripeOpacity = tone === 'accent' ? 0.24 : tone === 'dark' ? 0.16 : 0.15;
  const backgroundColor = tone === 'dark' ? 'rgba(255,255,255,0.06)' : theme.field;

  const shimmerX = useSharedValue(-1);

  useEffect(() => {
    if (!shimmer) return;
    shimmerX.value = -1;
    shimmerX.value = withRepeat(
      withTiming(1, { duration: 1300, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(shimmerX);
  }, [shimmer, shimmerX]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value * 260 }, { rotate: '18deg' }],
  }));

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {STRIPE_OFFSETS.map((offset) => (
          <View
            key={offset}
            style={[
              styles.stripe,
              {
                backgroundColor: stripeColor,
                opacity: stripeOpacity,
                transform: [{ translateX: offset }, { rotate: '45deg' }],
              },
            ]}
          />
        ))}
      </View>
      {shimmer ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.shimmerBand, { backgroundColor: theme.accent }, shimmerStyle]}
        />
      ) : null}
      {label ? (
        <ThemedText
          type="code"
          themeColor="textSecondary"
          style={[styles.label, labelAlign === 'center' && styles.labelCenter]}>
          {label}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  stripe: {
    position: 'absolute',
    top: -300,
    left: '50%',
    width: 16,
    height: 900,
    marginLeft: -8,
  },
  shimmerBand: {
    position: 'absolute',
    top: -100,
    bottom: -100,
    width: 90,
    left: '50%',
    marginLeft: -45,
    opacity: 0.22,
  },
  label: {
    marginBottom: 10,
    fontSize: 10,
  },
  labelCenter: {
    marginBottom: 0,
  },
});
