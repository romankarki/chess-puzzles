import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { BlockerConfig, ChessLock, ProtectedApps } from './ChessLock';

const DEFAULT_CONFIG: BlockerConfig = {
  enabled: false,
  unlockChallenge: false,
  blockedPackages: [],
  graceMinutes: 0,
};

let cached: BlockerConfig | null = null;
const listeners = new Set<(c: BlockerConfig) => void>();

function publish(c: BlockerConfig) {
  cached = c;
  listeners.forEach(l => l(c));
}

export function setBlockerConfig(patch: Partial<BlockerConfig>) {
  const next = { ...(cached ?? DEFAULT_CONFIG), ...patch };
  ChessLock.setConfig(next);
  publish(next);
}

/** Blocker config (persisted natively) plus live permission status. */
export function useBlocker() {
  const [config, setConfig] = useState<BlockerConfig>(cached ?? DEFAULT_CONFIG);
  const [accessibility, setAccessibility] = useState<boolean | null>(null);
  const [battery, setBattery] = useState<boolean | null>(null);
  const [protectedApps, setProtectedApps] = useState<ProtectedApps | null>(null);

  const refresh = useCallback(() => {
    ChessLock.isAccessibilityEnabled().then(setAccessibility).catch(() => setAccessibility(false));
    ChessLock.isIgnoringBatteryOptimizations().then(setBattery).catch(() => setBattery(false));
  }, []);

  useEffect(() => {
    listeners.add(setConfig);
    if (!cached) {
      ChessLock.getConfig()
        .then(publish)
        .catch(() => {});
    }
    ChessLock.getProtectedApps().then(setProtectedApps).catch(() => {});
    refresh();
    // Permissions are granted in system settings; re-check when we come back.
    const sub = AppState.addEventListener('change', s => s === 'active' && refresh());
    return () => {
      listeners.delete(setConfig);
      sub.remove();
    };
  }, [refresh]);

  return { config, accessibility, battery, protectedApps, refresh };
}
