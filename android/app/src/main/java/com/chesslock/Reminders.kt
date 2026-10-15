package com.chesslock

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import java.util.Calendar

/** Weekly "pick this week's focus" notification, every Monday at 9:00. */
object Reminders {
  const val ACTION_REMIND = "com.chesslock.REMIND"
  private const val CHANNEL = "weekly"
  private const val NOTIFICATION_ID = 7
  private const val REQUEST = 1001
  private const val KEY_ENABLED = "weeklyReminder"
  private const val HOUR = 9

  fun isEnabled(context: Context): Boolean =
    BlockerPrefs.prefs(context).getBoolean(KEY_ENABLED, false)

  fun setEnabled(context: Context, enabled: Boolean) {
    BlockerPrefs.prefs(context).edit().putBoolean(KEY_ENABLED, enabled).apply()
    if (enabled) schedule(context) else cancel(context)
  }

  fun schedule(context: Context) {
    val alarms = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    alarms.setInexactRepeating(
      AlarmManager.RTC_WAKEUP,
      nextMondayMorning(),
      AlarmManager.INTERVAL_DAY * 7,
      alarmIntent(context),
    )
  }

  private fun cancel(context: Context) {
    val alarms = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    alarms.cancel(alarmIntent(context))
  }

  private fun alarmIntent(context: Context): PendingIntent =
    PendingIntent.getBroadcast(
      context,
      REQUEST,
      Intent(context, ReminderReceiver::class.java).setAction(ACTION_REMIND),
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

  private fun nextMondayMorning(): Long {
    val cal = Calendar.getInstance()
    cal.set(Calendar.HOUR_OF_DAY, HOUR)
    cal.set(Calendar.MINUTE, 0)
    cal.set(Calendar.SECOND, 0)
    cal.set(Calendar.MILLISECOND, 0)
    val daysUntilMonday = (Calendar.MONDAY - cal.get(Calendar.DAY_OF_WEEK) + 7) % 7
    cal.add(Calendar.DAY_OF_YEAR, daysUntilMonday)
    if (cal.timeInMillis <= System.currentTimeMillis()) cal.add(Calendar.DAY_OF_YEAR, 7)
    return cal.timeInMillis
  }

  fun show(context: Context) {
    val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      manager.createNotificationChannel(
        NotificationChannel(CHANNEL, context.getString(R.string.reminder_channel), NotificationManager.IMPORTANCE_DEFAULT),
      )
    }
    val open =
      PendingIntent.getActivity(
        context,
        0,
        Intent(context, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
      )
    val notification =
      NotificationCompat.Builder(context, CHANNEL)
        .setSmallIcon(R.drawable.ic_notification)
        .setContentTitle(context.getString(R.string.reminder_title))
        .setContentText(context.getString(R.string.reminder_text))
        .setContentIntent(open)
        .setAutoCancel(true)
        .build()
    try {
      NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, notification)
    } catch (_: SecurityException) {
      // Notification permission was revoked; nothing to show.
    }
  }
}
