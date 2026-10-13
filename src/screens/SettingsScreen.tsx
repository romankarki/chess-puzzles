import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { resetProgress, updateProgress, updateSettings, useStore } from '../storage/store';
import { openingFocus, themeFocus } from '../engine/schedule';
import { THEMES } from '../data/themes';
import { ChessLock } from '../native/ChessLock';
import { setBlockerConfig, useBlocker } from '../native/useBlocker';
import { Button, Card, Row, Segmented, SectionTitle } from '../components/ui';
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
  const puzzle = themeFocus(settings);
  const opening = openingFocus(settings);

  const toggleTheme = (id: string, on: boolean) => {
    const disabled = new Set(settings.disabledThemes);
    if (on) {
      disabled.delete(id);
    } else if (THEMES.length - disabled.size > 1) {
      disabled.add(id);
    }
    updateSettings({ disabledThemes: [...disabled] });
  };

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
          detail={
            accessibility
              ? 'Blocked apps need a chess challenge.'
              : 'Turn on ChessLock in Accessibility settings first.'
          }
          value={config.enabled}
          disabled={!accessibility}
          onChange={v => setBlockerConfig({ enabled: v })}
        />
        <Divider />
        <ToggleRow
          title="Challenge on every unlock"
          detail="Solve a puzzle each time you unlock your phone. Phone & Messages stay available."
          value={config.unlockChallenge}
          onChange={v => setBlockerConfig({ unlockChallenge: v })}
        />
        <Divider />
        <Text style={styles.label}>After solving, re-open the same app freely for</Text>
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
        <Text style={styles.hint}>
          While you stay in an app you are never interrupted. This sets how long you can leave and
          come back without another challenge.
        </Text>
      </Card>

      <SectionTitle>Training</SectionTitle>
      <Card>
        <Text style={styles.label}>Challenges use</Text>
        <Segmented
          value={settings.mode}
          onChange={mode => updateSettings({ mode })}
          options={[
            { value: 'puzzles', label: 'Puzzles' },
            { value: 'openings', label: 'Openings' },
            { value: 'mixed', label: 'Mixed' },
          ]}
        />
        <Text style={styles.hint}>
          {settings.mode === 'puzzles'
            ? 'Puzzles focus on one tactical theme for 3 days, then move to the next.'
            : settings.mode === 'openings'
            ? 'One opening per week; each day you drill one variation until it sticks.'
            : 'Alternate between puzzles and the opening of the week.'}
        </Text>

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

        <Text style={styles.label}>Openings to learn</Text>
        <Segmented
          value={settings.openingSide}
          onChange={openingSide => updateSettings({ openingSide })}
          options={[
            { value: 'both', label: 'Both' },
            { value: 'w', label: 'White' },
            { value: 'b', label: 'Black' },
          ]}
        />

        <Text style={styles.label}>Your level (puzzle rating {progress.rating})</Text>
        <Segmented<number>
          value={nearestLevel.value}
          onChange={rating => updateProgress(p => ({ ...p, rating }))}
          options={LEVELS}
        />
        <Text style={styles.hint}>Your rating adjusts automatically after every puzzle.</Text>
      </Card>

      <SectionTitle>Schedule</SectionTitle>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Puzzle theme: {puzzle.theme.title}</Text>
            <Text style={styles.hint}>
              Day {puzzle.dayInBlock} of 3 · next: {puzzle.next.title}
            </Text>
          </View>
          <Button
            title="Skip"
            small
            kind="secondary"
            onPress={() => updateSettings({ themeOffset: settings.themeOffset + 1 })}
          />
        </Row>
        <Divider />
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Opening: {opening.course.name}</Text>
            <Text style={styles.hint}>Next week: {opening.next.name}</Text>
          </View>
          <Button
            title="Skip"
            small
            kind="secondary"
            onPress={() => updateSettings({ courseOffset: settings.courseOffset + 1 })}
          />
        </Row>
      </Card>

      <SectionTitle>Puzzle themes in rotation</SectionTitle>
      <Card>
        {THEMES.map((t, i) => (
          <View key={t.id}>
            {i > 0 && <Divider />}
            <ToggleRow
              title={t.title}
              value={!settings.disabledThemes.includes(t.id)}
              onChange={v => toggleTheme(t.id, v)}
            />
          </View>
        ))}
      </Card>

      <SectionTitle>Permissions</SectionTitle>
      <Card>
        <PermissionRow
          title="Accessibility service"
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
        <PermissionRow
          title="App info (restricted settings)"
          ok
          action="Open"
          onPress={() => ChessLock.openAppDetails()}
        />
      </Card>

      <SectionTitle>Data</SectionTitle>
      <Card>
        <Button
          title="Reset progress"
          kind="ghost"
          onPress={() =>
            Alert.alert('Reset progress?', 'Your rating, history and streak will be cleared.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: () => resetProgress(1000) },
            ])
          }
        />
      </Card>

      <Text style={styles.credits}>
        Puzzles from the lichess.org puzzle database and opening names from lichess
        chess-openings (both CC0). Pieces: cburnett (CC BY-SA 3.0).
      </Text>
      <Text
        style={[styles.credits, { color: colors.info }]}
        onPress={() => Linking.openURL('https://database.lichess.org/#puzzles')}>
        database.lichess.org
      </Text>
    </ScrollView>
  );
}

function ToggleRow({
  title,
  detail,
  value,
  onChange,
  disabled,
}: {
  title: string;
  detail?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Row style={{ gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {detail ? <Text style={styles.hint}>{detail}</Text> : null}
      </View>
      <Switch
        value={value}
        disabled={disabled}
        onValueChange={onChange}
        trackColor={{ true: colors.accentDim, false: colors.border }}
        thumbColor={value ? colors.accent : '#ccc'}
      />
    </Row>
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
    <Row style={{ gap: 12 }}>
      <Text style={[styles.status, { color: ok ? colors.accent : colors.danger }]}>{ok ? '✓' : '!'}</Text>
      <Text style={[styles.rowTitle, { flex: 1 }]}>{title}</Text>
      <Button title={action} small kind="secondary" onPress={onPress} />
    </Row>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 8,
  },
  rowTitle: {
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
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  status: {
    width: 18,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  credits: {
    color: colors.textFaint,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
  },
});
