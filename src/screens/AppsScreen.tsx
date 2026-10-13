import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ChessLock, InstalledApp } from '../native/ChessLock';
import { setBlockerConfig, useBlocker } from '../native/useBlocker';
import { Button, Row } from '../components/ui';
import { colors, radius } from '../theme';

/** Common distracting apps, pre-selected by "Block social & video". */
const DISTRACTING = [
  'com.google.android.youtube',
  'com.instagram.android',
  'com.zhiliaoapp.musically',
  'com.ss.android.ugc.trill',
  'com.facebook.katana',
  'com.facebook.lite',
  'com.twitter.android',
  'com.snapchat.android',
  'com.reddit.frontpage',
  'com.pinterest',
  'com.linkedin.android',
  'com.tumblr',
  'com.netflix.mediaclient',
  'com.amazon.avod.thirdpartyclient',
  'com.disney.disneyplus',
  'tv.twitch.android.app',
  'com.discord',
  'org.telegram.messenger',
  'com.facebook.orca',
  'com.instagram.barcelona',
  'com.vanced.android.youtube',
  'app.revanced.android.youtube',
  'com.google.android.apps.youtube.music',
  'com.spotify.music',
  'com.king.candycrushsaga',
  'com.supercell.clashofclans',
  'com.roblox.client',
];

let appsCache: InstalledApp[] | null = null;

export default function AppsScreen() {
  const { config, protectedApps } = useBlocker();
  const [apps, setApps] = useState<InstalledApp[] | null>(appsCache);
  const [query, setQuery] = useState('');

  useEffect(() => {
    ChessLock.getInstalledApps()
      .then(list => {
        appsCache = list;
        setApps(list);
      })
      .catch(() => setApps([]));
  }, []);

  const protectedSet = useMemo(() => {
    const s = new Set<string>(['com.android.settings']);
    if (protectedApps) {
      [protectedApps.dialer, protectedApps.sms, protectedApps.self, ...protectedApps.launchers]
        .filter(Boolean)
        .forEach(p => s.add(p));
    }
    return s;
  }, [protectedApps]);

  const blocked = useMemo(() => new Set(config.blockedPackages), [config.blockedPackages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = (apps ?? []).filter(
      a => !q || a.label.toLowerCase().includes(q) || a.packageName.includes(q),
    );
    // Blocked first, then alphabetical; protected apps last.
    return list.sort((a, b) => {
      const pa = protectedSet.has(a.packageName) ? 2 : blocked.has(a.packageName) ? 0 : 1;
      const pb = protectedSet.has(b.packageName) ? 2 : blocked.has(b.packageName) ? 0 : 1;
      return pa - pb || a.label.localeCompare(b.label);
    });
    // Re-sort only when the list or query changes, not on every toggle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apps, query, protectedSet]);

  const toggle = (pkg: string, on: boolean) => {
    const next = new Set(blocked);
    if (on) {
      next.add(pkg);
    } else {
      next.delete(pkg);
    }
    setBlockerConfig({ blockedPackages: [...next] });
  };

  const blockDistracting = () => {
    const installed = new Set((apps ?? []).map(a => a.packageName));
    const next = new Set(blocked);
    DISTRACTING.filter(p => installed.has(p) && !protectedSet.has(p)).forEach(p => next.add(p));
    setBlockerConfig({ blockedPackages: [...next] });
  };

  const blockAllUser = () => {
    const next = new Set(blocked);
    (apps ?? [])
      .filter(a => !a.isSystem && !protectedSet.has(a.packageName))
      .forEach(a => next.add(a.packageName));
    setBlockerConfig({ blockedPackages: [...next] });
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Blocked apps</Text>
        <Text style={styles.sub}>
          {blocked.size} blocked · opening any of them requires a chess challenge. Phone, Messages,
          Settings and your home screen are always allowed.
        </Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search apps"
          placeholderTextColor={colors.textFaint}
          style={styles.search}
        />
        <Row style={{ gap: 8, marginTop: 10 }}>
          <Button title="Block social & video" small kind="secondary" onPress={blockDistracting} style={{ flex: 1 }} />
          <Button title="Block all installed" small kind="secondary" onPress={blockAllUser} style={{ flex: 1 }} />
        </Row>
        {blocked.size > 0 && (
          <Button
            title="Unblock all"
            small
            kind="ghost"
            onPress={() => setBlockerConfig({ blockedPackages: [] })}
            style={{ marginTop: 8 }}
          />
        )}
      </View>
      {apps === null ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={a => a.packageName}
          contentContainerStyle={{ paddingBottom: 24 }}
          initialNumToRender={20}
          renderItem={({ item }) => {
            const isProtected = protectedSet.has(item.packageName);
            return (
              <View style={styles.item}>
                <Image source={{ uri: `data:image/png;base64,${item.icon}` }} style={styles.icon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.label} numberOfLines={1}>
                    {item.label}
                  </Text>
                  <Text style={styles.pkg} numberOfLines={1}>
                    {isProtected ? 'Always allowed' : item.packageName}
                  </Text>
                </View>
                <Switch
                  value={!isProtected && blocked.has(item.packageName)}
                  disabled={isProtected}
                  onValueChange={v => toggle(item.packageName, v)}
                  trackColor={{ true: colors.accentDim, false: colors.border }}
                  thumbColor={blocked.has(item.packageName) ? colors.accent : '#ccc'}
                />
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  sub: {
    color: colors.textDim,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  search: {
    marginTop: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  pkg: {
    color: colors.textFaint,
    fontSize: 11,
    marginTop: 1,
  },
});
