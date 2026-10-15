import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius } from '../theme';

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  title,
  onPress,
  kind = 'primary',
  small,
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary' | 'ghost' | 'danger';
  small?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const bg =
    kind === 'primary'
      ? colors.accent
      : kind === 'danger'
      ? colors.danger
      : kind === 'secondary'
      ? colors.surfaceAlt
      : 'transparent';
  const fg = kind === 'primary' || kind === 'danger' ? colors.onAccent : colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
      style={({ pressed }) => [
        styles.btn,
        small && styles.btnSmall,
        { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        kind === 'ghost' && styles.btnGhost,
        style,
      ]}>
      <Text style={[styles.btnText, small && styles.btnTextSmall, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Pill({
  text,
  color = colors.accent,
  style,
}: {
  text: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.pill, { borderColor: color }, style]}>
      <Text style={[styles.pillText, { color }]}>{text}</Text>
    </View>
  );
}

export function SectionTitle({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.section, style]}>{children}</Text>;
}

export function Row({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.row, style]}>{children}</View>;
}

export function Divider() {
  return <View style={styles.divider} />;
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.segment}>
      {options.map(o => {
        const active = o.value === value;
        return (
          <Pressable
            key={String(o.value)}
            onPress={() => onChange(o.value)}
            style={[styles.segmentItem, active && styles.segmentActive]}>
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ToggleRow({
  title,
  detail,
  value,
  onChange,
  disabled,
}: {
  title: string;
  detail?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Row style={styles.toggleRow}>
      <View style={styles.flex}>
        <Text style={styles.toggleTitle}>{title}</Text>
        {detail ? <Text style={styles.toggleDetail}>{detail}</Text> : null}
      </View>
      <Switch
        value={value}
        disabled={disabled}
        onValueChange={onChange}
        trackColor={{ true: '#F3B0B7', false: colors.border }}
        thumbColor={value ? colors.accent : '#FFFFFF'}
      />
    </Row>
  );
}

export interface SelectOption<T> {
  value: T;
  label: string;
  detail?: string;
  /** Options with the same group are listed under one heading (keep them adjacent). */
  group?: string;
}

/** A dropdown: a field that opens a bottom sheet with the options. */
export function Select<T extends string | number>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Choose…',
  style,
}: {
  label?: string;
  value: T | null;
  options: SelectOption<T>[];
  onChange: (v: T) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value);
  const grouped = options.some(o => o.group);
  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
        style={[styles.select, style]}>
        <View style={styles.flex}>
          {label ? <Text style={styles.selectLabel}>{label}</Text> : null}
          <Text style={[styles.selectValue, !current && { color: colors.textFaint }]} numberOfLines={1}>
            {current?.label ?? placeholder}
          </Text>
        </View>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {label ? <Text style={styles.sheetTitle}>{label}</Text> : null}
          <FlatList
            data={options}
            keyExtractor={o => String(o.value)}
            initialNumToRender={16}
            renderItem={({ item, index }) => {
              const active = item.value === value;
              const heading = grouped && (index === 0 || options[index - 1].group !== item.group);
              return (
                <>
                  {heading ? <Text style={styles.groupTitle}>{item.group}</Text> : null}
                  <Pressable
                    onPress={() => {
                      setOpen(false);
                      if (!active) {
                        onChange(item.value);
                      }
                    }}
                    android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                    style={[styles.option, active && styles.optionActive]}>
                    <View style={styles.flex}>
                      <Text style={[styles.optionText, active && styles.optionTextActive]}>{item.label}</Text>
                      {item.detail ? <Text style={styles.optionDetail}>{item.detail}</Text> : null}
                    </View>
                    {active ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                </>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  btn: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  btnSmall: {
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  btnTextSmall: {
    fontSize: 14,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  section: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 22,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 3,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  segmentActive: {
    backgroundColor: colors.accent,
  },
  segmentText: {
    color: colors.textDim,
    fontWeight: '700',
    fontSize: 14,
  },
  segmentTextActive: {
    color: colors.onAccent,
  },
  toggleRow: {
    gap: 12,
  },
  toggleTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  toggleDetail: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  selectLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  selectValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  chevron: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '72%',
    paddingBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  sheetTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  groupTitle: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  optionActive: {
    backgroundColor: colors.accentDim,
  },
  optionText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  optionTextActive: {
    color: colors.accent,
  },
  optionDetail: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  check: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
  },
});
