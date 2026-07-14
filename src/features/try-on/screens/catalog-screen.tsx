import { useRouter } from 'expo-router';
import { SymbolView, type AndroidSymbol } from 'expo-symbols';
import { useMemo } from 'react';
import type { SFSymbol } from 'sf-symbols-typescript';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/features/try-on/components/chip';
import { FeasibilityBadge } from '@/features/try-on/components/feasibility-badge';
import { PlaceholderPattern } from '@/features/try-on/components/placeholder-pattern';
import { filterStyles } from '@/features/try-on/derived';
import { useTryOnFlow } from '@/features/try-on/flow-context';
import { useTheme } from '@/hooks/use-theme';

const FILTER_CHIPS = [
  { key: 'maintenance' as const, label: 'Low upkeep' },
  { key: 'length' as const, label: 'Short' },
  { key: 'vibe' as const, label: 'Office-safe' },
];

export function CatalogScreen() {
  const { state, actions } = useTryOnFlow();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const cards = useMemo(
    () => filterStyles(state.chips, state.query),
    [state.chips, state.query],
  );

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(insets.top, 20) + 40, paddingBottom: 96 + insets.bottom },
        ]}>
        <ThemedText type="title" style={styles.title}>
          Styles for you
        </ThemedText>

        <View style={[styles.searchBar, { backgroundColor: theme.field }]}>
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            tintColor={theme.textSecondary}
            size={18}
          />
          <TextInput
            value={state.query}
            onChangeText={actions.setQuery}
            placeholder="Search styles…"
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
            accessibilityLabel="Search styles"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          <Chip
            label="Achievable today"
            icon="✓"
            active={state.chips.achievable}
            onPress={() => actions.toggleChip('achievable')}
          />
          {FILTER_CHIPS.map((chip) => (
            <Chip
              key={chip.key}
              label={chip.label}
              active={state.chips[chip.key]}
              onPress={() => actions.toggleChip(chip.key)}
            />
          ))}
          <View style={[styles.sortChip, { borderColor: theme.line, backgroundColor: theme.field }]}>
            <ThemedText type="smallBold">Sort · Match %</ThemedText>
          </View>
        </ScrollView>

        {cards.length > 0 ? (
          <View style={styles.grid}>
            {cards.map((card) => (
              <Pressable
                key={card.name}
                onPress={() => actions.pickStyle(card.name)}
                accessibilityRole="button"
                accessibilityLabel={`Try ${card.name}, ${card.match}% match`}
                style={styles.cardPressable}>
                <View style={styles.cardImage}>
                  <PlaceholderPattern
                    style={StyleSheet.absoluteFill}
                    label={card.ph}
                    labelAlign="center"
                  />
                  <View style={styles.matchBadge}>
                    <ThemedText type="smallBold" style={styles.matchBadgeText}>
                      {card.match}% match
                    </ThemedText>
                  </View>
                  <View style={styles.feasBadgeWrap}>
                    <FeasibilityBadge feasibility={card.feas} />
                  </View>
                </View>
                <View style={styles.cardMeta}>
                  <ThemedText type="smallBold" style={styles.cardName}>
                    {card.name}
                  </ThemedText>
                  <View style={styles.tagRow}>
                    {card.tags.map((tag) => (
                      <View key={tag} style={[styles.tag, { backgroundColor: theme.field }]}>
                        <ThemedText type="small" themeColor="textSecondary" style={styles.tagText}>
                          {tag}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <ThemedText themeColor="textSecondary" style={styles.emptyText}>
              Nothing fits those filters — try removing one.
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.tabBar,
          { backgroundColor: theme.background, borderTopColor: theme.line, paddingBottom: Math.max(insets.bottom, 10) },
        ]}>
        <TabBarButton
          label="Home"
          active
          sf="house"
          md="home"
          onPress={() => router.push('/')}
        />
        <TabBarButton
          label="Try on"
          highlighted
          sf="camera"
          md="photo_camera"
          onPress={() => actions.nav('camera')}
        />
        <TabBarButton
          label="Saved"
          sf="bookmark"
          md="bookmark"
          onPress={() => router.push('/saved')}
        />
        <TabBarButton
          label="Profile"
          sf="person.crop.circle"
          md="person"
          onPress={() => router.push('/profile')}
        />
      </View>
    </View>
  );
}

function TabBarButton({
  label,
  onPress,
  active,
  highlighted,
  sf,
  md,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  highlighted?: boolean;
  sf: SFSymbol;
  md: AndroidSymbol;
}) {
  const theme = useTheme();

  if (highlighted) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.tabBarButton}>
        <View style={[styles.tabBarHighlightedIcon, { backgroundColor: theme.accent }]}>
          <SymbolView name={{ ios: sf, android: md, web: md }} tintColor="#fff" size={26} />
        </View>
        <ThemedText type="small" themeColor="textSecondary" style={styles.tabBarLabel}>
          {label}
        </ThemedText>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.tabBarButton}>
      <SymbolView
        name={{ ios: sf, android: md, web: md }}
        tintColor={active ? theme.accent : theme.textSecondary}
        size={26}
      />
      <ThemedText
        type="small"
        themeColor={active ? 'accent' : 'textSecondary'}
        style={styles.tabBarLabel}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const CARD_GAP = 14;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 9,
    paddingVertical: 14,
  },
  sortChip: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  cardPressable: {
    width: '48%',
  },
  cardImage: {
    aspectRatio: 3 / 4,
    borderRadius: 18,
    overflow: 'hidden',
  },
  matchBadge: {
    position: 'absolute',
    top: 9,
    left: 9,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  matchBadgeText: {
    color: '#fff',
    fontSize: 12,
  },
  feasBadgeWrap: {
    position: 'absolute',
    top: 9,
    right: 9,
  },
  cardMeta: {
    paddingTop: 9,
  },
  cardName: {
    fontSize: 16,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  tag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 12,
  },
  emptyState: {
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  tabBarButton: {
    alignItems: 'center',
    gap: 3,
    width: 56,
  },
  tabBarHighlightedIcon: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
