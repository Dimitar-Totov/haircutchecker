import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { getFeasibilityMeta } from '@/features/try-on/derived';
import type { Feasibility } from '@/features/try-on/types';
import { useTheme } from '@/hooks/use-theme';

export function FeasibilityBadge({ feasibility }: { feasibility: Feasibility }) {
  const meta = getFeasibilityMeta(feasibility);
  const theme = useTheme();

  return (
    <View style={[styles.badge, { backgroundColor: theme[meta.backgroundColor] }]}>
      <ThemedText type="smallBold" style={styles.text} themeColor={meta.textColor}>
        {meta.icon} {meta.label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  text: {
    fontSize: 11,
    lineHeight: 14,
  },
});
