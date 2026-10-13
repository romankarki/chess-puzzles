import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useStore } from '../storage/store';
import { dateKey, openingFocus, themeFocus } from '../engine/schedule';
import { lineStat } from '../engine/openings';
import { ChessLock } from '../native/ChessLock';
import { setBlockerConfig, useBlocker } from '../native/useBlocker';
import { Button, Card, Pill, Row, SectionTitle } from '../components/ui';
import { colors, radius } from '../theme';

export type PracticeRequest =
  | { kind: 'puzzles' }
  | { kind: 'opening' }
  | { kind: 'theme'; themeId: string }
  | { kind: 'line'; courseId: string; dayIndex: number };

interface Props {
  onPractice: (req: PracticeRequest) => void;
  onOpenApps: () => void;
}

export default function HomeScreen({ onPractice, onOpenApps }: Props) {
  const { settings, progress } = useStore();
  const { config, accessibility, battery } = useBlocker();
  const puzzle = themeFocus(settings);
  const opening = openingFocus(settings);
  const today = progress.daily[dateKey()] ?? { puzzles: 0, openings: 0, challenges: 0 };
  const reps = lineStat(opening.course.id, opening.dayIndex).todayReps;

  const ready = accessibility && config.blockedPackages.length > 0;
  const active = ready && config.enabled;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Row style={{ justifyContent: 'space-between' }}>
        <View>
          <Text style={styles.brand}>♞ ChessLock</Text>
          <Text style={styles.hello}>Today's training</Text>
        </View>
        <View style={styles.ratingBox}>
          <Text style={styles.rating}>{progress.rating}</Text>
          <Text style={styles.ratingLabel}>puzzle rating</Text>
        </View>
      </Row>

      <Card style={[styles.protect, active ? styles.protectOn : null]}>
        <Row>
          <View style={{ flex: 1 }}>
            <Text style={styles.protectTitle}>{active ? 'Protection is on' : 'Protection is off'}</Text>
            <Text style={styles.protectSub}>
              {active
                ? `${config.blockedPackages.length} apps need a chess challenge${
                    config.unlockChallenge ? ' · unlock challenge on' : ''
                  }`
                : ready
                ? 'Turn on to require chess before blocked apps.'
                : 'Finish the setup below to start.'}
            </Text>
          </View>
          <Switch
            value={!!active}
            disabled={!ready}
            onValueChange={v => setBlockerConfig({ enabled: v })}
            trackColor={{ true: colors.accentDim, false: colors.border }}
            thumbColor={active ? colors.accent : '#ccc'}
          />
        </Row>
      </Card>

      {!ready || !battery ? (
        <Card style={{ marginTop: 12 }}>
          <Text style={styles.cardTitle}>Setup</Text>
          <SetupStep
            done={!!accessibility}
            title="Allow ChessLock to detect apps"
            detail="Settings › Accessibility › ChessLock › On. If it is greyed out, open App info › ⋮ › Allow restricted settings first."
            action={accessibility ? undefined : 'Open'}
            onPress={() => ChessLock.openAccessibilitySettings()}
            secondary={accessibility ? undefined : 'App info'}
            onSecondary={() => ChessLock.openAppDetails()}
          />
          <SetupStep
            done={config.blockedPackages.length > 0}
            title="Choose apps to block"
            detail="Social media, YouTube, games… Phone and Messages are never blocked."
            action="Choose"
            onPress={onOpenApps}
          />
          <SetupStep
            done={!!battery}
            title="Keep ChessLock running"
            detail="Exclude ChessLock from battery optimisation so the blocker is not killed."
            action={battery ? undefined : 'Allow'}
            onPress={() => ChessLock.requestIgnoreBatteryOptimizations()}
          />
        </Card>
      ) : null}

      <SectionTitle>Puzzles · 3-day focus</SectionTitle>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={styles.cardTitle}>{puzzle.theme.title}</Text>
          <Pill text={`DAY ${puzzle.dayInBlock} OF 3`} color={colors.gold} />
        </Row>
        <Text style={styles.body}>{puzzle.theme.lesson}</Text>
        <View style={styles.dots}>
          {[1, 2, 3].map(d => (
            <View
              key={d}
              style={[
                styles.dayDot,
                d < puzzle.dayInBlock && { backgroundColor: colors.accentDim },
                d === puzzle.dayInBlock && { backgroundColor: colors.accent },
              ]}
            />
          ))}
        </View>
        <Text style={styles.next}>Next up: {puzzle.next.title}</Text>
        <Button title="Practice puzzles" onPress={() => onPractice({ kind: 'puzzles' })} style={{ marginTop: 14 }} />
      </Card>

      <SectionTitle>Opening of the week</SectionTitle>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={[styles.cardTitle, { flex: 1 }]}>{opening.course.name}</Text>
          <Pill
            text={opening.course.color === 'w' ? 'AS WHITE' : 'AS BLACK'}
            color={opening.course.color === 'w' ? '#EEE' : colors.textDim}
          />
        </Row>
        <Text style={styles.variation}>
          Day {opening.dayIndex + 1} of 7 · {opening.line.name}
        </Text>
        <Text style={styles.body}>{opening.line.note}</Text>
        <View style={styles.week}>
          {opening.course.days.map((d, i) => (
            <View
              key={i}
              style={[
                styles.weekDay,
                i < opening.dayIndex && { backgroundColor: colors.accentDim },
                i === opening.dayIndex && { backgroundColor: colors.accent },
              ]}>
              <Text style={[styles.weekText, i === opening.dayIndex && { color: '#0E1A0A' }]}>
                {'MTWTFSS'[i]}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.next}>
          {reps === 0 ? 'Not practised yet today' : `Practised ${reps}× today`} · next week:{' '}
          {opening.next.name}
        </Text>
        <Button
          title={reps === 0 ? "Learn today's line" : "Drill today's line"}
          onPress={() => onPractice({ kind: 'opening' })}
          style={{ marginTop: 14 }}
        />
      </Card>

      <SectionTitle>Today</SectionTitle>
      <Row style={{ gap: 10 }}>
        <Stat value={today.challenges} label="challenges" />
        <Stat value={today.puzzles} label="puzzles" />
        <Stat value={today.openings} label="openings" />
        <Stat value={progress.streak.count} label="day streak" />
      </Row>
    </ScrollView>
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
  detail: string;
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
      <View style={{ flex: 1 }}>
        <Text style={[styles.stepTitle, done && { color: colors.textDim }]}>{title}</Text>
        {!done && <Text style={styles.stepDetail}>{detail}</Text>}
        {!done && (action || secondary) && (
          <Row style={{ gap: 8, marginTop: 8 }}>
            {action && <Button title={action} small onPress={onPress} />}
            {secondary && onSecondary && (
              <Button title={secondary} small kind="ghost" onPress={onSecondary} />
            )}
          </Row>
        )}
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <Pressable style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  brand: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  hello: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 4,
  },
  ratingBox: {
    alignItems: 'flex-end',
  },
  rating: {
    color: colors.gold,
    fontSize: 26,
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
    backgroundColor: '#17241A',
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
  cardTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  variation: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  body: {
    color: colors.textDim,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  next: {
    color: colors.textFaint,
    fontSize: 12,
    marginTop: 10,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  dayDot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  week: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  weekDay: {
    flex: 1,
    height: 26,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekText: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
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
    color: '#0E1A0A',
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
