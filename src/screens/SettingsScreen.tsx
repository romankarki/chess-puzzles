import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text } from 'react-native';
import { resetProgress, updateProgress, updateSettings, useStore } from '../storage/store';
import { ChessLock } from '../native/ChessLock';
import { setBlockerConfig, useBlocker } from '../native/useBlocker';
import { setMondayReminder } from '../native/reminder';
import { Button, Card, Divider, Row, SectionTitle, Segmented, ToggleRow } from '../components/ui';
import { useGate } from '../components/PuzzleGate';
import { colors } from '../theme';

export const LEVELS = [
  { value: 700, label: 'New' },
  { value: 1000, label: 'Casual' },
  { value: 1300, label: 'Club' },
  { value: 1600, label: 'Strong' },
  { value: 1900, label: 'Expert' },
];

export default function SettingsScreen() {
  const { settings, progress } = useStore();
  const { config, accessibility, battery } = useBlocker();
  const { gate, element: gateModal } = useGate();

  const nearestLevel = LEVELS.reduce((best, l) =>
    Math.abs(l.value - progress.rating) < Math.abs(best.value - progress.rating) ? l : best,
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <SectionTitle>Protection</SectionTitle>
      <Card>
        <ToggleRow
          title="ChessLock enabled"
          detail={accessibility ? undefined : 'Turn on ChessLock in Accessibility settings first.'}
          value={config.enabled}
          disabled={!accessibility}
          onChange={v =>
            v
              ? setBlockerConfig({ enabled: true })
              : gate('Solve to turn protection off', () => setBlockerConfig({ enabled: false }))
          }
        />
        <Divider />
        <ToggleRow
          title="Puzzle on every unlock"
          detail="Until solved, every app except Phone and Messages asks for it."
          value={config.unlockChallenge}
          onChange={v => setBlockerConfig({ unlockChallenge: v })}
        />
        <Divider />
        <Text style={styles.label}>Re-open the same app freely for</Text>
        <Segmented<number>
          value={config.graceMinutes}
          onChange={v => setBlockerConfig({ graceMinutes: v })}
          options={[
            { value: 0, label: 'Never' },
            { value: 1, label: '1 min' },
            { value: 5, label: '5 min' },
            { value: 15, label: '15 min' },
          ]}
        />
      </Card>

      <SectionTitle>Training</SectionTitle>
      <Card>
        <Text style={[styles.label, styles.first]}>Challenges</Text>
        <Segmented
          value={settings.mode}
          onChange={mode => updateSettings({ mode })}
          options={[
            { value: 'puzzles', label: 'Puzzles' },
            { value: 'openings', label: 'Openings' },
            { value: 'mixed', label: 'Mixed' },
          ]}
        />
        {settings.mode !== 'openings' && (
          <>
            <Text style={styles.label}>Puzzles per challenge</Text>
            <Segmented<number>
              value={settings.puzzlesPerChallenge}
              onChange={n => updateSettings({ puzzlesPerChallenge: n })}
              options={[
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' },
              ]}
            />
          </>
        )}
        <Text style={styles.label}>Level</Text>
        <Segmented<number>
          value={nearestLevel.value}
          onChange={rating => updateProgress(p => ({ ...p, rating }))}
          options={LEVELS}
        />
        <Text style={styles.hint}>Rating {progress.rating} · adjusts as you solve.</Text>
        <Divider />
        <ToggleRow
          title="Sunday revision"
          detail="Revisit older themes, missed puzzles and learned lines."
          value={settings.sundayReview}
          onChange={sundayReview => updateSettings({ sundayReview })}
        />
        <Divider />
        <ToggleRow
          title="Monday reminder"
          detail="Notification at 9:00 to pick the week's theme and opening."
          value={settings.mondayReminder}
          onChange={on => setMondayReminder(on)}
        />
      </Card>

      <SectionTitle>Permissions</SectionTitle>
      <Card>
        <PermissionRow
          title="Accessibility"
          ok={!!accessibility}
          action="Open"
          onPress={() => ChessLock.openAccessibilitySettings()}
        />
        <Divider />
        <PermissionRow
          title="Unrestricted battery"
          ok={!!battery}
          action="Allow"
          onPress={() => ChessLock.requestIgnoreBatteryOptimizations()}
        />
        <Divider />
        <PermissionRow title="App info" ok action="Open" onPress={() => ChessLock.openAppDetails()} />
      </Card>

      <Button
        title="Reset progress"
        kind="ghost"
        style={styles.reset}
        onPress={() =>
          Alert.alert('Reset progress?', 'Your rating, history and streak will be cleared.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset', style: 'destructive', onPress: () => resetProgress(1000) },
          ])
        }
      />

      <Text style={styles.credits}>
        Puzzles: lichess.org (CC0) · Pieces: cburnett (CC BY-SA 3.0) ·{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://database.lichess.org/#puzzles')}>
          database.lichess.org
        </Text>
      </Text>
      {gateModal}
    </ScrollView>
  );
}

function PermissionRow({
  title,
  ok,
  action,
  onPress,
}: {
  title: string;
  ok: boolean;
  action: string;
  onPress: () => void;
}) {
  return (
    <Row style={styles.permission}>
      <Text style={[styles.status, { color: ok ? colors.success : colors.danger }]}>{ok ? '✓' : '!'}</Text>
      <Text style={styles.rowTitle}>{title}</Text>
      <Button title={action} small kind="secondary" onPress={onPress} />
    </Row>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 8,
  },
  first: {
    marginTop: 0,
  },
  rowTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  hint: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 6,
    lineHeight: 17,
  },
  permission: {
    gap: 12,
  },
  status: {
    width: 18,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  reset: {
    marginTop: 22,
  },
  credits: {
    color: colors.textFaint,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 18,
    textAlign: 'center',
  },
  link: {
    color: colors.info,
  },
});
