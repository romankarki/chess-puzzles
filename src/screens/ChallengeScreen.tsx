import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ChallengeInfo, ChessLock, onChallengeChanged } from '../native/ChessLock';
import { getState, loadState, updateProgress, useStore } from '../storage/store';
import { bumpDay } from '../engine/puzzles';
import { isReviewDay } from '../engine/schedule';
import TrainingSession, { SessionKind, sessionKindFor } from '../components/TrainingSession';
import { colors, radius } from '../theme';

/** Root component of the challenge activity (shown over blocked apps / after unlock). */
export default function ChallengeRoot() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <ChallengeScreen />
    </SafeAreaProvider>
  );
}

function ChallengeScreen() {
  const { loaded, settings } = useStore();
  const [info, setInfo] = useState<ChallengeInfo>({ reason: 'none', packageName: '', appLabel: '' });
  const [kind, setKind] = useState<SessionKind | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 1 });
  const [finished, setFinished] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - 32, 440);

  useEffect(() => {
    loadState();
    ChessLock.getChallengeInfo().then(setInfo).catch(() => {});
    const off = onChallengeChanged(setInfo);
    // Back goes to the home screen (handled natively), never to the blocked app.
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      ChessLock.goHome();
      return true;
    });
    return () => {
      off();
      back.remove();
    };
  }, []);

  // Decide once per challenge what to train, alternating in mixed mode.
  useEffect(() => {
    if (!loaded || kind) {
      return;
    }
    const { settings, progress: p } = getState();
    setKind(sessionKindFor(settings.mode, p.challengeCounter));
    setProgress({ done: 0, total: settings.mode === 'openings' ? 1 : settings.puzzlesPerChallenge });
    updateProgress(prev => ({ ...prev, challengeCounter: prev.challengeCounter + 1 }));
  }, [loaded, kind]);

  const finish = () => {
    setFinished(true);
    updateProgress(p => bumpDay(p, 'challenges'));
    Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    setTimeout(() => ChessLock.completeChallenge(), 700);
  };

  const headline =
    info.reason === 'app' && info.appLabel
      ? `Solve to open ${info.appLabel}`
      : info.reason === 'unlock'
      ? 'Unlock challenge'
      : 'Chess challenge';
  const revision = loaded && isReviewDay(settings) ? 'Revision · ' : '';
  const sub =
    revision +
    (kind === 'opening'
      ? 'Play the line to continue.'
      : progress.total > 1
      ? `Puzzle ${Math.min(progress.done + 1, progress.total)} of ${progress.total}`
      : 'Solve to continue.');

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <Text style={styles.brand}>♞ ChessLock</Text>
        <Text style={styles.headline}>{headline}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body} bounces={false}>
        {loaded && kind ? (
          <TrainingSession
            kind={kind}
            count={progress.total}
            size={boardSize}
            finishLabel={info.reason === 'app' && info.appLabel ? `Open ${info.appLabel}` : 'Unlock'}
            onProgress={(done, total) => setProgress({ done, total })}
            onFinished={finish}
          />
        ) : (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 80 }} />
        )}
      </ScrollView>
      <View style={styles.footer}>
        <FooterButton label="📞  Phone" onPress={() => ChessLock.openDialer()} />
        <FooterButton label="💬  Messages" onPress={() => ChessLock.openMessages()} />
        <FooterButton label="⌂  Home" onPress={() => ChessLock.goHome()} />
      </View>
      {finished && (
        <Animated.View style={[StyleSheet.absoluteFill, styles.done, { opacity: fade }]}>
          <Text style={styles.doneIcon}>✓</Text>
          <Text style={styles.doneText}>Well played!</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

function FooterButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
      style={styles.footerBtn}>
      <Text style={styles.footerText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  top: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
  },
  brand: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  headline: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6,
  },
  sub: {
    color: colors.textDim,
    fontSize: 14,
    marginTop: 2,
  },
  body: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  footerText: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: '600',
  },
  done: {
    backgroundColor: 'rgba(247,247,249,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
  },
  doneIcon: {
    color: colors.success,
    fontSize: 72,
    fontWeight: '800',
  },
  doneText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
});
