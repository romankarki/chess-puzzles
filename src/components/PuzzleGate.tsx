import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PuzzleTrainer from './PuzzleTrainer';
import { getState } from '../storage/store';
import { weekFocus } from '../engine/schedule';
import { formAdjustment, pickPuzzle, recordPuzzle, targetRating, themeSkill } from '../engine/puzzles';
import { colors } from '../theme';

interface Pending {
  /** Shown under the heading, e.g. "Solve to unblock Instagram". */
  title: string;
  run: () => void;
}

/**
 * Anything that loosens the blocking (unblocking an app, turning protection
 * off) costs one puzzle first, so the block list isn't an easy way out.
 */
export function useGate() {
  const [pending, setPending] = useState<Pending | null>(null);
  const gate = (title: string, run: () => void) => setPending({ title, run });
  const element = (
    <PuzzleGate
      pending={pending}
      onDone={() => {
        pending?.run();
        setPending(null);
      }}
      onCancel={() => setPending(null)}
    />
  );
  return { gate, element };
}

function PuzzleGate({
  pending,
  onDone,
  onCancel,
}: {
  pending: Pending | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { width } = useWindowDimensions();
  const size = Math.min(width - 32, 440);
  const puzzle = useMemo(() => {
    if (!pending) {
      return null;
    }
    const { settings, progress } = getState();
    const theme = weekFocus(settings).theme.id;
    const target = targetRating(themeSkill(progress, theme), formAdjustment(progress.recent));
    return pickPuzzle(theme, target, progress.seen);
  }, [pending]);

  if (!pending || !puzzle) {
    return null;
  }
  return (
    <Modal visible animationType="slide" onRequestClose={onCancel} statusBarTranslucent={false}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <View style={styles.flex}>
              <Text style={styles.title}>Earn it</Text>
              <Text style={styles.sub}>{pending.title}</Text>
            </View>
            <Pressable onPress={onCancel} hitSlop={12}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body}>
            <PuzzleTrainer
              key={puzzle.id}
              puzzle={puzzle}
              size={size}
              continueLabel="Apply"
              onComplete={r => {
                recordPuzzle(puzzle, r.clean);
                onDone();
              }}
            />
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  sub: {
    color: colors.textDim,
    fontSize: 13,
    marginTop: 2,
  },
  close: {
    color: colors.textDim,
    fontSize: 22,
  },
  body: {
    alignItems: 'center',
    paddingBottom: 24,
  },
});
