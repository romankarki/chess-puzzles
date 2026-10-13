import { DeviceEventEmitter } from 'react-native';
import NativeChessLock, {
  BlockerConfig,
  ChallengeInfo,
  InstalledApp,
  ProtectedApps,
} from '../../specs/NativeChessLock';

export type { BlockerConfig, ChallengeInfo, InstalledApp, ProtectedApps };

export const ChessLock = NativeChessLock;

export function onChallengeChanged(fn: (info: ChallengeInfo) => void) {
  const sub = DeviceEventEmitter.addListener('ChessLockChallengeChanged', fn);
  return () => sub.remove();
}
