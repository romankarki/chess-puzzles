import { PermissionsAndroid, Platform } from 'react-native';
import { ChessLock } from './ChessLock';
import { updateSettings } from '../storage/store';

/**
 * Turns the Monday-morning "pick this week's focus" notification on or off.
 * Android 13+ needs the notification permission first; if it is refused the
 * setting stays off.
 */
export async function setMondayReminder(on: boolean): Promise<boolean> {
  if (on && Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        on = false;
      }
    } catch {
      on = false;
    }
  }
  updateSettings({ mondayReminder: on });
  try {
    ChessLock.setWeeklyReminder(on);
  } catch {}
  return on;
}
