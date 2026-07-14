import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

/**
 * Placeholder account "Profile" tab — distinct from the in-flow "hair
 * profile" step (face shape/length/texture editor) that lives inside the
 * try-on flow. The design prototype doesn't specify this tab's content
 * beyond its icon, so this is a minimal stub pending a real product spec
 * (see the scaffold report for details).
 */
export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Profile
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          Account settings will live here. Your hair profile (face shape, length,
          texture) is edited inside the Try on flow.
        </ThemedText>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.two,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 300,
  },
});
