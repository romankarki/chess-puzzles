import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { updateSettings, useStore } from '../storage/store';
import { ALL_COURSES, dateKey, dayNumber, needsNewPick, weekFocus, weekNumber } from '../engine/schedule';
import { THEMES } from '../data/themes';
import { lineStat } from '../engine/openings';
import { themeSkill } from '../engine/puzzles';
import { dueMissed, reviewLines, reviewThemes } from '../engine/review';
import { ChessLock } from '../native/ChessLock';
import { setBlockerConfig, useBlocker } from '../native/useBlocker';
import { Button, Card, Divider, Row, SectionTitle, Select, SelectOption } from '../components/ui';
import { colors, radius } from '../theme';

export type PracticeRequest =
  | { kind: 'puzzles' }
  | { kind: 'opening' }
  | { kind: 'line'; courseId: string; dayIndex: number }
  | { kind: 'review'; what: 'puzzles' | 'opening' };

const THEME_OPTIONS: SelectOption<string>[] = THEMES.map(t => ({
  value: t.id,
  label: t.title,
  detail: t.lesson,
}));

const COURSE_OPTIONS: SelectOption<string>[] = (['w', 'b'] as const).flatMap(color =>
  ALL_COURSES.filter(c => c.color === color)
    .sort((a, b) => a.level - b.level)
    .map(c => ({
      value: c.id,
      label: c.name,
      detail: `Level ${c.level}/3`,
      group: color === 'w' ? 'As White' : 'As Black',
    })),
);

interface Props {
  onPractice: (req: PracticeRequest) => void;
  onOpenApps: () => void;
}

export default function HomeScreen({ onPractice, onOpenApps }: Props) {
  const { settings, progress } = useStore();
  const { config, accessibility, battery } = useBlocker();
  const focus = weekFocus(settings);
  const today = progress.daily[dateKey()] ?? { puzzles: 0, openings: 0, challenges: 0 };
  const reps = lineStat(focus.course.id, focus.dayIndex).todayReps;
  const stale = needsNewPick(settings);

  const ready = accessibility && config.blockedPackages.length > 0;
  const active = ready && config.enabled;

  const pick = (patch: { weekTheme?: string; weekCourse?: string }) =>
    updateSettings({ ...patch, pickedWeek: weekNumber(dayNumber()) });

  const lineOptions: SelectOption<number>[] = focus.course.days.map((d, i) => ({
    value: i,
    label: d.name,
    detail: `Day ${i + 1}`,
  }));

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Row style={styles.between}>
        <View>
          <Text style={styles.brand}>♞ ChessLock</Text>
          <Text style={styles.title}>Today</Text>
        </View>
        <View style={styles.ratingBox}>
          <Text style={styles.rating}>{progress.rating}</Text>
          <Text style={styles.ratingLabel}>rating</Text>
        </View>
      </Row>

      <Card style={[styles.protect, active ? styles.protectOn : null]}>
        <Row>
          <View style={styles.flex}>
            <Text style={styles.protectTitle}>{active ? 'Protection on' : 'Protection off'}</Text>
            <Text style={styles.protectSub}>
              {active
                ? `${config.blockedPackages.length} apps need a chess challenge`
                : ready
                ? 'Blocked apps open without a challenge.'
                : 'Finish the setup below.'}
            </Text>
          </View>
          <Switch
            value={!!active}
            disabled={!ready}
            onValueChange={v => setBlockerConfig({ enabled: v })}
            trackColor={{ true: '#F3B0B7', false: colors.border }}
            thumbColor={active ? colors.accent : '#FFFFFF'}
          />
        </Row>
      </Card>

      {!ready || !battery ? (
        <Card style={styles.gap}>
          <SetupStep
            done={!!accessibility}
            title="Allow ChessLock to detect apps"
            detail="Settings › Accessibility › ChessLock. Greyed out? App info › ⋮ › Allow restricted settings."
            action={accessibility ? undefined : 'Open'}
            onPress={() => ChessLock.openAccessibilitySettings()}
            secondary={accessibility ? undefined : 'App info'}
            onSecondary={() => ChessLock.openAppDetails()}
          />
          <SetupStep
            done={config.blockedPackages.length > 0}
            title="Choose apps to block"
            action="Choose"
            onPress={onOpenApps}
          />
          <SetupStep
            done={!!battery}
            title="Keep ChessLock running"
            detail="Unrestricted battery use, so the blocker is not stopped."
            action={battery ? undefined : 'Allow'}
            onPress={() => ChessLock.requestIgnoreBatteryOptimizations()}
          />
        </Card>
      ) : null}

      <SectionTitle>This week</SectionTitle>
      <Card>
        {stale && <Text style={styles.nudge}>New week — pick a fresh theme and opening.</Text>}
        <Select
          label="Puzzle theme"
          value={settings.weekTheme}
          options={THEME_OPTIONS}
          onChange={weekTheme => pick({ weekTheme })}
        />
        <Select
          label="Opening"
          value={settings.weekCourse}
          options={COURSE_OPTIONS}
          onChange={weekCourse => pick({ weekCourse })}
          style={styles.gapSmall}
        />
      </Card>

      {focus.review ? (
        <RevisionCard
          retries={dueMissed(progress).length}
          themes={reviewThemes(progress).length}
          lines={reviewLines(progress).length}
          onPractice={onPractice}
        />
      ) : (
        <>
          <SectionTitle>Today</SectionTitle>
          <Card>
            <Row style={styles.between}>
              <View style={styles.flex}>
                <Text style={styles.itemTitle}>{focus.theme.title}</Text>
                <Text style={styles.itemSub}>Puzzles · rating {themeSkill(progress, focus.theme.id)}</Text>
              </View>
              <Button title="Solve" small onPress={() => onPractice({ kind: 'puzzles' })} />
            </Row>
            <Divider />
            <Row style={styles.between}>
              <View style={styles.flex}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {focus.line.name}
                </Text>
                <Text style={styles.itemSub} numberOfLines={1}>
                  {focus.course.name} · day {focus.dayIndex + 1}
                  {reps > 0 ? ` · ${reps}× today` : ''}
                </Text>
              </View>
              <Button title={reps === 0 ? 'Learn' : 'Drill'} small onPress={() => onPractice({ kind: 'opening' })} />
            </Row>
            <Select
              label="Other lines"
              placeholder="Practise another line…"
              value={null}
              options={lineOptions}
              onChange={dayIndex => onPractice({ kind: 'line', courseId: focus.course.id, dayIndex })}
              style={styles.gap}
            />
          </Card>
        </>
      )}

      <SectionTitle>Stats</SectionTitle>
      <Row style={styles.gapRow}>
        <Stat value={today.challenges} label="challenges" />
        <Stat value={today.puzzles} label="puzzles" />
        <Stat value={today.openings} label="openings" />
        <Stat value={progress.streak.count} label="day streak" />
      </Row>
    </ScrollView>
  );
}

function RevisionCard({
  retries,
  themes,
  lines,
  onPractice,
}: {
  retries: number;
  themes: number;
  lines: number;
  onPractice: (req: PracticeRequest) => void;
}) {
  const parts = [
    retries ? `${retries} missed puzzle${retries > 1 ? 's' : ''}` : null,
    themes ? `${themes} theme${themes > 1 ? 's' : ''}` : null,
    lines ? `${lines} line${lines > 1 ? 's' : ''}` : null,
  ].filter(Boolean);
  return (
    <>
      <SectionTitle>Sunday revision</SectionTitle>
      <Card style={styles.reviewCard}>
        <Text style={styles.itemSub}>
          {parts.length ? `Up for revision: ${parts.join(' · ')}` : 'Nothing to revise yet — train a few days first.'}
        </Text>
        <Row style={[styles.gapRow, styles.gap]}>
          <Button
            title="Puzzles"
            disabled={themes === 0 && retries === 0}
            onPress={() => onPractice({ kind: 'review', what: 'puzzles' })}
            style={styles.flex}
          />
          <Button
            title="Openings"
            disabled={lines === 0}
            onPress={() => onPractice({ kind: 'review', what: 'opening' })}
            style={styles.flex}
          />
        </Row>
      </Card>
    </>
  );
}

function SetupStep({
  done,
  title,
  detail,
  action,
  onPress,
  secondary,
  onSecondary,
}: {
  done: boolean;
  title: string;
  detail?: string;
  action?: string;
  onPress: () => void;
  secondary?: string;
  onSecondary?: () => void;
}) {
  return (
    <View style={styles.step}>
      <View style={[styles.check, done && styles.checkDone]}>
        <Text style={styles.checkText}>{done ? '✓' : ''}</Text>
      </View>
      <View style={styles.flex}>
        <Text style={[styles.stepTitle, done && { color: colors.textDim }]}>{title}</Text>
        {!done && detail ? <Text style={styles.stepDetail}>{detail}</Text> : null}
        {!done && (action || secondary) && (
          <Row style={[styles.gapRow, styles.gapSmall]}>
            {action && <Button title={action} small onPress={onPress} />}
            {secondary && onSecondary && <Button title={secondary} small kind="ghost" onPress={onSecondary} />}
          </Row>
        )}
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  flex: {
    flex: 1,
  },
  between: {
    justifyContent: 'space-between',
  },
  gap: {
    marginTop: 12,
  },
  gapSmall: {
    marginTop: 8,
  },
  gapRow: {
    gap: 8,
  },
  brand: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  ratingBox: {
    alignItems: 'flex-end',
  },
  rating: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: '800',
  },
  ratingLabel: {
    color: colors.textDim,
    fontSize: 11,
  },
  protect: {
    marginTop: 18,
  },
  protectOn: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim,
  },
  protectTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  protectSub: {
    color: colors.textDim,
    fontSize: 13,
    marginTop: 3,
  },
  nudge: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  itemSub: {
    color: colors.textDim,
    fontSize: 13,
    marginTop: 3,
  },
  reviewCard: {
    borderColor: colors.accent,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkText: {
    color: colors.onAccent,
    fontWeight: '900',
    fontSize: 13,
  },
  stepTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  stepDetail: {
    color: colors.textDim,
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  statValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 2,
  },
});
