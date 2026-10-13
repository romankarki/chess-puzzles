import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useStore } from '../storage/store';
import { ALL_COURSES, Course, enabledThemes, lineKey, openingFocus, themeFocus } from '../engine/schedule';
import { themeSize } from '../engine/puzzles';
import { Card, Pill, Row, Segmented, SectionTitle } from '../components/ui';
import { colors, radius } from '../theme';
import type { PracticeRequest } from './HomeScreen';

type Tab = 'openings' | 'puzzles';

export default function LearnScreen({ onPractice }: { onPractice: (r: PracticeRequest) => void }) {
  const { settings } = useStore();
  const [tab, setTab] = useState<Tab>('openings');
  const [courseId, setCourseId] = useState<string | null>(null);
  const focus = openingFocus(settings);
  const shown = ALL_COURSES.find(c => c.id === courseId) ?? focus.course;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Learn</Text>
      <Segmented<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { value: 'openings', label: 'Openings' },
          { value: 'puzzles', label: 'Puzzle themes' },
        ]}
      />
      {tab === 'openings' ? (
        <>
          <CourseDetail
            course={shown}
            isCurrent={shown.id === focus.course.id}
            todayIndex={focus.dayIndex}
            onPractice={onPractice}
          />
          <SectionTitle>All openings ({ALL_COURSES.length})</SectionTitle>
          {(['w', 'b'] as const).map(color => (
            <View key={color}>
              <Text style={styles.group}>{color === 'w' ? 'As White' : 'As Black'}</Text>
              <View style={styles.grid}>
                {ALL_COURSES.filter(c => c.color === color).map(c => (
                  <Pressable
                    key={c.id}
                    onPress={() => setCourseId(c.id)}
                    style={[styles.chip, c.id === shown.id && styles.chipActive]}>
                    <Text style={[styles.chipText, c.id === shown.id && styles.chipTextActive]}>
                      {c.name}
                    </Text>
                    <Text style={styles.level}>{'●'.repeat(c.level)}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </>
      ) : (
        <ThemeList onPractice={onPractice} />
      )}
    </ScrollView>
  );
}

function CourseDetail({
  course,
  isCurrent,
  todayIndex,
  onPractice,
}: {
  course: Course;
  isCurrent: boolean;
  todayIndex: number;
  onPractice: (r: PracticeRequest) => void;
}) {
  const { progress } = useStore();
  return (
    <Card style={{ marginTop: 16 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text style={[styles.courseName, { flex: 1 }]}>{course.name}</Text>
        {isCurrent ? <Pill text="THIS WEEK" color={colors.gold} /> : null}
      </Row>
      <Text style={styles.side}>
        You play {course.color === 'w' ? 'White' : 'Black'} · level {course.level}/3
      </Text>
      <Text style={styles.body}>{course.summary}</Text>
      {course.ideas.map((idea, i) => (
        <Text key={i} style={styles.idea}>
          • {idea}
        </Text>
      ))}
      <Text style={styles.linesTitle}>Variations — tap to practise</Text>
      {course.days.map((d, i) => {
        const stat = progress.lineStats[lineKey(course.id, i)];
        const today = isCurrent && i === todayIndex;
        return (
          <Pressable
            key={i}
            onPress={() => onPractice({ kind: 'line', courseId: course.id, dayIndex: i })}
            style={[styles.line, today && styles.lineToday]}>
            <Text style={[styles.lineDay, today && { color: colors.gold }]}>
              {isCurrent ? 'MTWTFSS'[i] : i + 1}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.lineName}>{d.name}</Text>
              <Text style={styles.lineMoves} numberOfLines={1}>
                {tailMoves(d.moves)}
              </Text>
            </View>
            {stat ? (
              <Text style={styles.lineStat}>
                {stat.perfect}/{stat.reps}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </Card>
  );
}

/** The last moves of a line (where variations differ), e.g. "… 6.Bg5 e6 7.f4 Be7". */
function tailMoves(moves: string[], count = 8): string {
  const start = Math.max(0, moves.length - count);
  const parts = moves.slice(start).map((m, k) => {
    const ply = start + k;
    if (ply % 2 === 0) {
      return `${ply / 2 + 1}.${m}`;
    }
    return k === 0 ? `${(ply + 1) / 2}...${m}` : m;
  });
  return (start > 0 ? '… ' : '') + parts.join(' ');
}

function ThemeList({ onPractice }: { onPractice: (r: PracticeRequest) => void }) {
  const { settings, progress } = useStore();
  const focus = themeFocus(settings);
  const themes = enabledThemes(settings);
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.body}>
        Each theme is trained for 3 days in a row, in this order. Puzzles get harder as your rating
        grows. Tap a theme to practise it any time.
      </Text>
      {themes.map((t, i) => {
        const stat = progress.themeStats[t.id];
        const current = t.id === focus.theme.id;
        return (
          <Pressable
            key={t.id}
            onPress={() => onPractice({ kind: 'theme', themeId: t.id })}
            style={[styles.theme, current && styles.lineToday]}>
            <Text style={[styles.themeIndex, current && { color: colors.gold }]}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Row style={{ gap: 8 }}>
                <Text style={styles.lineName}>{t.title}</Text>
                {current ? <Pill text={`DAY ${focus.dayInBlock}/3`} color={colors.gold} /> : null}
              </Row>
              <Text style={styles.themeLesson}>{t.lesson}</Text>
              <Text style={styles.themeMeta}>
                {themeSize(t.id)} puzzles
                {stat ? ` · ${stat.solved} solved · ${stat.failed} missed` : ''}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 14,
  },
  courseName: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '800',
  },
  side: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  body: {
    color: colors.textDim,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  idea: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  linesTitle: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 4,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
  },
  lineToday: {
    backgroundColor: colors.surfaceAlt,
  },
  lineDay: {
    width: 18,
    color: colors.textDim,
    fontWeight: '800',
    textAlign: 'center',
  },
  lineName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  lineMoves: {
    color: colors.textFaint,
    fontSize: 12,
    marginTop: 2,
  },
  lineStat: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  group: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  chipActive: {
    borderColor: colors.accent,
    backgroundColor: '#17241A',
  },
  chipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.accent,
  },
  level: {
    color: colors.gold,
    fontSize: 8,
    marginTop: 2,
  },
  theme: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
    marginTop: 4,
  },
  themeIndex: {
    width: 22,
    color: colors.textFaint,
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 1,
  },
  themeLesson: {
    color: colors.textDim,
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
  themeMeta: {
    color: colors.textFaint,
    fontSize: 11,
    marginTop: 4,
  },
});
