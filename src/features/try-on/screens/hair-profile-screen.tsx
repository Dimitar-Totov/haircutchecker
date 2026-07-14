import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Chip } from '@/features/try-on/components/chip';
import { LabeledSlider } from '@/features/try-on/components/labeled-slider';
import { DENSITY_OPTIONS, FACE_SHAPES, HAIRLINE_OPTIONS, TEX_SCALE, getLenLabel } from '@/features/try-on/derived';
import { useTryOnFlow } from '@/features/try-on/flow-context';
import { useTheme } from '@/hooks/use-theme';

export function HairProfileScreen() {
  const { state, actions } = useTryOnFlow();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 26) + 40 }]}>
      <ThemedText type="title" style={styles.title}>
        Your profile
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.subtitle}>
        Tap to fix anything we got wrong.
      </ThemedText>

      <View style={styles.cardsGroup}>
        <ThemedView type="card" style={styles.card}>
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.cardLabel}>
            FACE SHAPE
          </ThemedText>
          <ThemedText type="subtitle" style={styles.cardValue}>
            {state.face}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.cardCaption}>
            Most lengths work for you
          </ThemedText>
          <View style={styles.chipRow}>
            {FACE_SHAPES.map((shape) => (
              <Chip
                key={shape}
                label={shape}
                active={shape === state.face}
                onPress={() => actions.setFace(shape)}
              />
            ))}
          </View>
        </ThemedView>

        <ThemedView type="card" style={styles.card}>
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.cardLabel}>
            HAIR LENGTH
          </ThemedText>
          <ThemedText type="subtitle" style={styles.cardValue}>
            {getLenLabel(state.lenCm)}
          </ThemedText>
          <LabeledSlider
            min={1}
            max={30}
            value={state.lenCm}
            onChange={actions.setLen}
            accessibilityLabel="Hair length in centimeters"
          />
          <View style={styles.sliderTicks}>
            <ThemedText type="small" themeColor="textSecondary">
              1 cm
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              15 cm
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              30 cm
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView type="card" style={styles.card}>
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.cardLabel}>
            TEXTURE
          </ThemedText>
          <ThemedText type="subtitle" style={styles.cardValue}>
            {TEX_SCALE[state.tex]}
          </ThemedText>
          <View style={styles.texRow}>
            <View style={[styles.texLine, { backgroundColor: theme.line }]} />
            {TEX_SCALE.map((label, index) => {
              const active = index === state.tex;
              return (
                <Pressable
                  key={label}
                  onPress={() => actions.setTex(index)}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  accessibilityState={{ selected: active }}
                  hitSlop={8}
                  style={[
                    styles.texDot,
                    {
                      width: active ? 20 : 12,
                      height: active ? 20 : 12,
                      borderColor: theme.background,
                      backgroundColor: active ? theme.accent : theme.textSecondary,
                      opacity: active ? 1 : 0.5,
                    },
                  ]}
                />
              );
            })}
          </View>
          <View style={styles.sliderTicks}>
            <ThemedText type="small" themeColor="textSecondary">
              Straight
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Coily
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView type="card" style={styles.card}>
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.groupLabel}>
            DENSITY & HAIRLINE
          </ThemedText>
          <View style={styles.chipRow}>
            {DENSITY_OPTIONS.map((option) => (
              <Chip
                key={option}
                label={option}
                active={option === state.density}
                onPress={() => actions.setDensity(option)}
              />
            ))}
          </View>
          <View style={styles.chipRow}>
            {HAIRLINE_OPTIONS.map((option) => (
              <Chip
                key={option}
                label={option}
                active={option === state.hairline}
                onPress={() => actions.setHairline(option)}
              />
            ))}
          </View>
        </ThemedView>
      </View>

      <Pressable
        onPress={() => actions.nav('catalog')}
        accessibilityRole="button"
        style={({ pressed }) => [styles.cta, { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 }]}>
        <ThemedText type="default" themeColor="accentText" style={styles.ctaText}>
          Show me my styles
        </ThemedText>
      </Pressable>

      <Pressable
        onPress={() => actions.nav('camera')}
        accessibilityRole="button"
        style={styles.retakeButton}>
        <ThemedText type="small" themeColor="textSecondary">
          Not you? Retake photo
        </ThemedText>
      </Pressable>
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
  title: {
    fontSize: 28,
    lineHeight: 32,
    marginBottom: 2,
  },
  subtitle: {
    marginBottom: 20,
  },
  cardsGroup: {
    gap: 14,
  },
  card: {
    borderRadius: 20,
    padding: 18,
  },
  cardLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  groupLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 20,
    lineHeight: 24,
    marginTop: 3,
    marginBottom: 2,
  },
  cardCaption: {
    marginBottom: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  sliderTicks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  texRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 24,
    marginTop: 4,
  },
  texLine: {
    position: 'absolute',
    left: 9,
    right: 9,
    height: 3,
    borderRadius: 2,
  },
  texDot: {
    borderRadius: 999,
    borderWidth: 2,
  },
  cta: {
    marginTop: 22,
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '600',
  },
  retakeButton: {
    marginTop: 14,
    alignItems: 'center',
  },
});
