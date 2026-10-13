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
import LearnScreen from './src/screens/LearnScreen';
import AppsScreen from './src/screens/AppsScreen';
import SettingsScreen, { LEVELS } from './src/screens/SettingsScreen';
import TrainingSession from './src/components/TrainingSession';
import { Button, Card, Segmented } from './src/components/ui';
import { colors } from './src/theme';

type Tab = 'home' | 'learn' | 'apps' | 'settings';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Today', icon: '♞' },
  { id: 'learn', label: 'Learn', icon: '♜' },
  { id: 'apps', label: 'Apps', icon: '⛔' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
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
      <View style={{ flex: 1 }}>
        {tab === 'home' && <HomeScreen onPractice={setPractice} onOpenApps={() => setTab('apps')} />}
        {tab === 'learn' && <LearnScreen onPractice={setPractice} />}
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
  const isOpening = request.kind === 'opening' || request.kind === 'line';

  return (
    <Modal visible animationType="slide" onRequestClose={onClose} statusBarTranslucent={false}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{isOpening ? 'Opening practice' : 'Puzzle practice'}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalBody}>
            {done ? (
              <Card style={{ width: size, alignItems: 'center' }}>
                <Text style={styles.doneIcon}>✓</Text>
                <Text style={styles.doneText}>Line complete</Text>
                <Button
                  title="Again"
                  onPress={() => {
                    setDone(false);
                    setRound(r => r + 1);
                  }}
                  style={{ marginTop: 16, alignSelf: 'stretch' }}
                />
                <Button title="Close" kind="ghost" onPress={onClose} style={{ marginTop: 8, alignSelf: 'stretch' }} />
              </Card>
            ) : (
              <TrainingSession
                key={round}
                kind={isOpening ? 'opening' : 'puzzles'}
                count={isOpening ? 1 : 1000}
                size={size}
                themeId={request.kind === 'theme' ? request.themeId : undefined}
                line={request.kind === 'line' ? request : undefined}
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
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
        <Text style={styles.logo}>♞</Text>
        <Text style={styles.welcome}>Welcome to ChessLock</Text>
        <Text style={styles.welcomeSub}>
          Turn every phone unlock and every distracting app into a few moves of chess training.
          Puzzles focus on one tactic for 3 days; openings focus on one opening per week with a new
          variation each day.
        </Text>
        <Text style={styles.q}>How strong are you?</Text>
        <Segmented<number> value={rating} onChange={setRating} options={LEVELS} />
        <Text style={styles.qHint}>
          New: just learned the moves · Club: play regularly · Expert: tournament player
        </Text>
        <Text style={styles.q}>What should challenges train?</Text>
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: 'puzzles', label: 'Puzzles' },
            { value: 'openings', label: 'Openings' },
            { value: 'mixed', label: 'Mixed' },
          ]}
        />
        <Text style={styles.qHint}>You can change this any time in Settings.</Text>
        <Button
          title="Start training"
          style={{ marginTop: 32 }}
          onPress={() => {
            updateProgress(p => ({ ...p, rating }));
            updateSettings({ mode, onboarded: true });
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
    paddingVertical: 14,
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
    paddingBottom: 32,
  },
  doneIcon: {
    color: colors.accent,
    fontSize: 56,
    fontWeight: '800',
  },
  doneText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  logo: {
    fontSize: 64,
    color: colors.accent,
    textAlign: 'center',
  },
  welcome: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
  },
  welcomeSub: {
    color: colors.textDim,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
  },
  q: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 10,
  },
  qHint: {
    color: colors.textFaint,
    fontSize: 12,
    marginTop: 8,
  },
});
