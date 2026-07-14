import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PlaceholderPattern } from '@/features/try-on/components/placeholder-pattern';
import { useTheme } from '@/hooks/use-theme';

const CHECKLIST_ITEMS = [
  { label: 'Finding your face shape…', delay: 0 },
  { label: 'Reading hair texture…', delay: 500 },
  { label: 'Measuring length…', delay: 1000 },
] as const;

export function AnalyzingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scanY = useSharedValue(-40);
  const dotOpacity = useSharedValue(0.25);

  useEffect(() => {
    scanY.value = withRepeat(
      withTiming(300, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    dotOpacity.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
  }, [scanY, dotOpacity]);

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanY.value }],
  }));
  const dotStyle = useAnimatedStyle(() => ({ opacity: dotOpacity.value }));

  return (
    <ThemedView style={[styles.root, { paddingTop: Math.max(insets.top, 40) + 56 }]}>
      <View style={styles.selfieCard}>
        <PlaceholderPattern style={StyleSheet.absoluteFill} label="your selfie" />
        <Animated.View
          style={[styles.scanLine, { borderBottomColor: theme.accent }, scanStyle]}
        />
      </View>

      <View style={styles.checklist}>
        {CHECKLIST_ITEMS.map((item, index) => {
          const isDone = index < 2;
          return (
            <Animated.View
              key={item.label}
              entering={FadeInDown.delay(item.delay).duration(400)}
              style={styles.checklistRow}>
              {isDone ? (
                <View style={[styles.checkBadge, { backgroundColor: theme.accent }]}>
                  <ThemedText type="smallBold" themeColor="accentText" style={styles.checkGlyph}>
                    ✓
                  </ThemedText>
                </View>
              ) : (
                <View style={[styles.pendingBadge, { borderColor: theme.textSecondary }]}>
                  <Animated.View
                    style={[
                      styles.pendingDot,
                      { backgroundColor: theme.textSecondary },
                      dotStyle,
                    ]}
                  />
                </View>
              )}
              <ThemedText themeColor={isDone ? 'text' : 'textSecondary'} style={styles.checklistText}>
                {item.label}
              </ThemedText>
            </Animated.View>
          );
        })}
      </View>
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
  selfieCard: {
    width: 200,
    height: 256,
    borderRadius: 22,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 44,
    backgroundColor: 'rgba(91,61,245,0.3)',
    borderBottomWidth: 2,
  },
  checklist: {
    marginTop: 40,
    width: '100%',
    maxWidth: 280,
    gap: 18,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkGlyph: {
    fontSize: 13,
    lineHeight: 15,
  },
  pendingBadge: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  checklistText: {
    fontSize: 16,
  },
});
