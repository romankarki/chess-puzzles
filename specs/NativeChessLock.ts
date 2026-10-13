import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type InstalledApp = {
  packageName: string;
  label: string;
  /** PNG, base64 encoded (no data: prefix). */
  icon: string;
  isSystem: boolean;
};

export type BlockerConfig = {
  enabled: boolean;
  unlockChallenge: boolean;
  blockedPackages: string[];
  graceMinutes: number;
};

export type ProtectedApps = {
  dialer: string;
  sms: string;
  launchers: string[];
  self: string;
};

export type ChallengeInfo = {
  reason: string; // "unlock" | "app" | "none"
  packageName: string;
  appLabel: string;
};

export interface Spec extends TurboModule {
  getInstalledApps(): Promise<InstalledApp[]>;
  getProtectedApps(): Promise<ProtectedApps>;
  setConfig(config: BlockerConfig): void;
  getConfig(): Promise<BlockerConfig>;
  isAccessibilityEnabled(): Promise<boolean>;
  openAccessibilitySettings(): void;
  isIgnoringBatteryOptimizations(): Promise<boolean>;
  requestIgnoreBatteryOptimizations(): void;
  openAppDetails(): void;
  getChallengeInfo(): Promise<ChallengeInfo>;
  /** Called by the challenge screen once the puzzle/opening is solved. */
  completeChallenge(): void;
  /** Leaves the challenge without unlocking anything (goes to the home screen). */
  goHome(): void;
  openDialer(): void;
  openMessages(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ChessLock');
