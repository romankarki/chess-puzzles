package com.chesslock

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Shows the weekly reminder, and re-arms it after a reboot (alarms don't survive one). */
class ReminderReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    when (intent.action) {
      Reminders.ACTION_REMIND -> Reminders.show(context)
      Intent.ACTION_BOOT_COMPLETED -> if (Reminders.isEnabled(context)) Reminders.schedule(context)
    }
  }
}
