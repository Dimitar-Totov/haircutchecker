import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

/**
 * Pill-shaped selectable chip. Ported from the `chip(sel)` style helper in
 * `Screen.dc.html`'s `renderVals()`.
 */
export function Chip({
  label,
  active,
  onPress,
  icon,
  style,
  accessibilityLabel,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: active ? theme.accent : theme.line,
          backgroundColor: active ? theme.accent : theme.field,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}>
      {icon ? (
        <ThemedText
          type="smallBold"
          style={styles.icon}
          themeColor={active ? 'accentText' : 'text'}>
          {icon}
        </ThemedText>
      ) : null}
      <ThemedText type="smallBold" themeColor={active ? 'accentText' : 'text'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
    borderWidth: 1,
  },
  icon: {
    fontSize: 13,
  },
});
