import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PlaceholderPattern } from '@/features/try-on/components/placeholder-pattern';
import { useTryOnFlow } from '@/features/try-on/flow-context';
import type { SpecKey } from '@/features/try-on/types';
import { useTheme } from '@/hooks/use-theme';

const SPEC_ROWS: { key: SpecKey; label: string }[] = [
  { key: 'sides', label: 'Sides' },
  { key: 'top', label: 'Top' },
  { key: 'neckline', label: 'Neckline' },
  { key: 'extras', label: 'Extras' },
];

export function BarberBriefScreen() {
  const { state, actions } = useTryOnFlow();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 26) + 40 }]}>
      <View style={styles.headerRow}>
        <ThemedText type="title" style={styles.title}>
          Barber brief
        </ThemedText>
        <View style={[styles.langToggle, { backgroundColor: theme.field }]}>
          <Pressable
            onPress={() => actions.setLang('EN')}
            accessibilityRole="button"
            accessibilityState={{ selected: state.lang === 'EN' }}
            style={[
              styles.langButton,
              state.lang === 'EN' && { backgroundColor: theme.background, ...styles.langButtonActiveShadow },
            ]}>
            <ThemedText
              type="smallBold"
              themeColor={state.lang === 'EN' ? 'text' : 'textSecondary'}
              style={styles.langButtonText}>
              EN
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => actions.setLang('BG')}
            accessibilityRole="button"
            accessibilityState={{ selected: state.lang === 'BG' }}
            style={[
              styles.langButton,
              state.lang === 'BG' && { backgroundColor: theme.background, ...styles.langButtonActiveShadow },
            ]}>
            <ThemedText
              type="smallBold"
              themeColor={state.lang === 'BG' ? 'text' : 'textSecondary'}
              style={styles.langButtonText}>
              BG
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <ThemedView type="card" style={styles.briefCard}>
        <View style={styles.photoRow}>
          <View style={styles.frontPhoto}>
            <PlaceholderPattern style={StyleSheet.absoluteFill} label="front" />
          </View>
          <View style={styles.proColumn}>
            <View style={[styles.proPlaceholder, { borderColor: theme.line }]}>
              <ThemedText type="code" themeColor="textSecondary" style={styles.proLabel}>
                side · Pro
              </ThemedText>
            </View>
            <View style={[styles.proPlaceholder, { borderColor: theme.line }]}>
              <ThemedText type="code" themeColor="textSecondary" style={styles.proLabel}>
                back · Pro
              </ThemedText>
            </View>
          </View>
        </View>

        <ThemedText type="subtitle" style={styles.styleName}>
          {state.styleName}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitleText}>
          Show this at the shop — everything is editable.
        </ThemedText>

        <View>
          {SPEC_ROWS.map((row) => (
            <View key={row.key} style={[styles.specRow, { borderTopColor: theme.line }]}>
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.specLabel}>
                {row.label}
              </ThemedText>
              <TextInput
                value={state.specs[row.key]}
                onChangeText={(text) => actions.setSpec(row.key, text)}
                style={[styles.specInput, { color: theme.text }]}
                accessibilityLabel={row.label}
              />
            </View>
          ))}
        </View>
      </ThemedView>

      <ThemedView type="card" style={styles.noteCard}>
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.noteLabel}>
          Anything else?
        </ThemedText>
        <TextInput
          value={state.note}
          onChangeText={actions.setNote}
          placeholder="e.g. 'last time it was too short on top'"
          placeholderTextColor={theme.textSecondary}
          multiline
          style={[styles.noteInput, { color: theme.text }]}
          accessibilityLabel="Anything else for your barber"
        />
      </ThemedView>

      <Pressable
        onPress={actions.openShow}
        accessibilityRole="button"
        style={({ pressed }) => [styles.cta, { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 }]}>
        <ThemedText type="default" themeColor="accentText" style={styles.ctaText}>
          Show at the shop
        </ThemedText>
      </Pressable>

      <View style={styles.shareRow}>
        <Pressable
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="Save as image (not available in this preview)"
          style={[styles.shareButton, { borderColor: theme.line, backgroundColor: theme.field }]}>
          <ThemedText type="smallBold">Save as image</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="Share (not available in this preview)"
          style={[styles.shareButton, { borderColor: theme.line, backgroundColor: theme.field }]}>
          <ThemedText type="smallBold">Share</ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
  },
  langToggle: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 3,
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  langButtonActiveShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  langButtonText: {
    fontSize: 13,
  },
  briefCard: {
    borderRadius: 22,
    padding: 16,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  frontPhoto: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 14,
    overflow: 'hidden',
  },
  proColumn: {
    width: 64,
    gap: 10,
  },
  proPlaceholder: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  proLabel: {
    fontSize: 8,
    textAlign: 'center',
  },
  styleName: {
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 13,
    marginBottom: 14,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderTopWidth: 1,
  },
  specLabel: {
    width: 78,
    fontSize: 14,
  },
  specInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    padding: 0,
  },
  noteCard: {
    marginTop: 14,
    borderRadius: 18,
    padding: 16,
  },
  noteLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  noteInput: {
    fontSize: 15,
    minHeight: 44,
    textAlignVertical: 'top',
    padding: 0,
  },
  cta: {
    marginTop: 20,
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '600',
  },
  shareRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  shareButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
});
