import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { loadState, updateProgress, updateSettings, useStore } from './src/storage/store';
import HomeScreen, { PracticeRequest } from './src/screens/HomeScreen';
import AppsScreen from './src/screens/AppsScreen';
import SettingsScreen, { LEVELS } from './src/screens/SettingsScreen';
import TrainingSession from './src/components/TrainingSession';
import { Button, Card, Segmented } from './src/components/ui';
import { setMondayReminder } from './src/native/reminder';
import { colors } from './src/theme';
import { dayNumber, weekNumber } from './src/engine/schedule';

type Tab = 'home' | 'apps' | 'settings';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Today', icon: '♞' },
  { id: 'apps', label: 'Apps', icon: '⊘' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <Main />
    </SafeAreaProvider>
  );
}

function Main() {
  const { loaded, settings } = useStore();
  const [tab, setTab] = useState<Tab>('home');
  const [practice, setPractice] = useState<PracticeRequest | null>(null);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (tab !== 'home') {
        setTab('home');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [tab]);

  if (!loaded) {
    return <View style={styles.root} />;
  }
  if (!settings.onboarded) {
    return <Onboarding />;
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.flex}>
        {tab === 'home' && <HomeScreen onPractice={setPractice} onOpenApps={() => setTab('apps')} />}
        {tab === 'apps' && <AppsScreen />}
        {tab === 'settings' && <SettingsScreen />}
      </View>
      <View style={styles.tabs}>
        {TABS.map(t => (
          <Pressable key={t.id} style={styles.tab} onPress={() => setTab(t.id)}>
            <Text style={[styles.tabIcon, tab === t.id && styles.tabActive]}>{t.icon}</Text>
            <Text style={[styles.tabLabel, tab === t.id && styles.tabActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
      <PracticeModal request={practice} onClose={() => setPractice(null)} />
    </SafeAreaView>
  );
}

function PracticeModal({
  request,
  onClose,
}: {
  request: PracticeRequest | null;
  onClose: () => void;
}) {
  const { width } = useWindowDimensions();
  const size = Math.min(width - 32, 440);
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setRound(0);
    setDone(false);
  }, [request]);

  if (!request) {
    return null;
  }
  const review = request.kind === 'review';
  const isOpening =
    request.kind === 'opening' || request.kind === 'line' || (review && request.what === 'opening');

  return (
    <Modal visible animationType="slide" onRequestClose={onClose} statusBarTranslucent={false}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{review ? 'Revision' : isOpening ? 'Opening' : 'Puzzles'}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalBody}>
            {done ? (
              <Card style={[styles.doneCard, { width: size }]}>
                <Text style={styles.doneIcon}>✓</Text>
                <Text style={styles.doneText}>Line complete</Text>
                <Button
                  title={review ? 'Next line' : 'Again'}
                  onPress={() => {
                    setDone(false);
                    setRound(r => r + 1);
                  }}
                  style={styles.doneBtn}
                />
                <Button title="Close" kind="ghost" onPress={onClose} style={styles.doneBtnSmall} />
              </Card>
            ) : (
              <TrainingSession
                key={round}
                kind={isOpening ? 'opening' : 'puzzles'}
                count={isOpening ? 1 : 1000}
                size={size}
                line={request.kind === 'line' ? request : undefined}
                review={review}
                finishLabel="Finish"
                onFinished={() => (isOpening ? setDone(true) : onClose())}
              />
            )}
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

function Onboarding() {
  const [rating, setRating] = useState(1000);
  const [mode, setMode] = useState<'puzzles' | 'openings' | 'mixed'>('puzzles');
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.onboarding}>
        <Text style={styles.logo}>♞</Text>
        <Text style={styles.welcome}>ChessLock</Text>
        <Text style={styles.welcomeSub}>A few moves of chess before your distracting apps open.</Text>
        <Text style={styles.q}>Your level</Text>
        <Segmented<number> value={rating} onChange={setRating} options={LEVELS} />
        <Text style={styles.q}>Challenges</Text>
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: 'puzzles', label: 'Puzzles' },
            { value: 'openings', label: 'Openings' },
            { value: 'mixed', label: 'Mixed' },
          ]}
        />
        <Button
          title="Start"
          style={styles.start}
          onPress={() => {
            updateProgress(p => ({ ...p, rating }));
            updateSettings({ mode, onboarded: true, pickedWeek: weekNumber(dayNumber()) });
            setMondayReminder(true);
          }}
        />
      </ScrollView>
    </SafeAreaView>
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabIcon: {
    color: colors.textFaint,
    fontSize: 20,
  },
  tabLabel: {
    color: colors.textFaint,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  tabActive: {
    color: colors.accent,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  close: {
    color: colors.textDim,
    fontSize: 22,
  },
  modalBody: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  doneCard: {
    alignItems: 'center',
  },
  doneIcon: {
    color: colors.success,
    fontSize: 56,
    fontWeight: '800',
  },
  doneText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  doneBtn: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
  doneBtnSmall: {
    marginTop: 8,
    alignSelf: 'stretch',
  },
  onboarding: {
    padding: 20,
    paddingTop: 48,
  },
  logo: {
    color: colors.accent,
    fontSize: 64,
    textAlign: 'center',
  },
  welcome: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
  },
  welcomeSub: {
    color: colors.textDim,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  q: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 8,
  },
  start: {
    marginTop: 32,
  },
});
