import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const STEPS = [
  { title: 'Take a photo', body: 'A quick selfie is all we need to read your face and hair.' },
  { title: 'Check your profile', body: 'Fine-tune face shape, length, texture, density, and hairline.' },
  { title: 'Browse styles', body: 'See what fits, try it on, and take the look to your barber.' },
];

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            Hairstyle Try-On
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            See yourself in a new haircut before you book the chair.
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          {STEPS.map((step, index) => (
            <View key={step.title} style={styles.stepRow}>
              <ThemedView type="card" style={styles.stepIndex}>
                <ThemedText type="smallBold">{index + 1}</ThemedText>
              </ThemedView>
              <View style={styles.stepCopy}>
                <ThemedText type="smallBold">{step.title}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {step.body}
                </ThemedText>
              </View>
            </View>
          ))}
        </ThemedView>

        <Pressable
          onPress={() => router.push('/try-on')}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
          ]}>
          <ThemedText type="default" themeColor="accentText" style={styles.ctaText}>
            Start your try-on
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    justifyContent: 'center',
    gap: Spacing.four,
  },
  heroSection: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  stepContainer: {
    gap: Spacing.three,
    borderRadius: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  stepIndex: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCopy: {
    flex: 1,
    gap: Spacing.half,
  },
  cta: {
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
