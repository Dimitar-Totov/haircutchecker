import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PlaceholderPattern } from '@/features/try-on/components/placeholder-pattern';
import { useTryOnFlow } from '@/features/try-on/flow-context';
import { useTheme } from '@/hooks/use-theme';

export function GeneratingScreen() {
  const { actions } = useTryOnFlow();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0.06);

  useEffect(() => {
    progress.value = 0.06;
    progress.value = withSequence(
      withTiming(0.82, { duration: 1190, easing: Easing.out(Easing.cubic) }),
      withTiming(0.94, { duration: 510, easing: Easing.out(Easing.cubic) }),
    );
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <ThemedView style={[styles.root, { paddingTop: Math.max(insets.top, 34) + 48 }]}>
      <View style={styles.thumbRow}>
        <View style={styles.thumb}>
          <PlaceholderPattern style={StyleSheet.absoluteFill} label="you" />
        </View>
        <ThemedText themeColor="textSecondary" style={styles.arrow}>
          →
        </ThemedText>
        <View style={styles.thumb}>
          <PlaceholderPattern style={StyleSheet.absoluteFill} tone="accent" label="style" />
        </View>
      </View>

      <View style={styles.bigBox}>
        <PlaceholderPattern style={StyleSheet.absoluteFill} tone="accent" shimmer />
      </View>

      <ThemedText type="smallBold" style={styles.copy}>
        Blending your hairline…
      </ThemedText>

      <View style={[styles.progressTrack, { backgroundColor: theme.field }]}>
        <Animated.View style={[styles.progressFill, { backgroundColor: theme.accent }, progressStyle]} />
      </View>

      <Pressable onPress={() => actions.nav('catalog')} accessibilityRole="button" style={styles.cancel}>
        <ThemedText themeColor="textSecondary">Cancel</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  thumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 26,
  },
  thumb: {
    width: 70,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
  },
  arrow: {
    fontSize: 20,
  },
  bigBox: {
    width: 230,
    height: 290,
    borderRadius: 22,
    overflow: 'hidden',
  },
  copy: {
    fontSize: 17,
    marginTop: 26,
  },
  progressTrack: {
    width: 230,
    height: 6,
    borderRadius: 99,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 99,
  },
  cancel: {
    marginTop: 22,
  },
});
