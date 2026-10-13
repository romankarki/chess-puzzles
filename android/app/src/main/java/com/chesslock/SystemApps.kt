package com.chesslock

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.provider.Telephony
import android.telecom.TelecomManager
import android.view.inputmethod.InputMethodManager

/** Apps that must never be blocked: phone, messaging, home screen and ChessLock itself. */
object SystemApps {

  fun dialerPackage(context: Context): String? =
    try {
      (context.getSystemService(Context.TELECOM_SERVICE) as? TelecomManager)?.defaultDialerPackage
    } catch (_: Exception) {
      null
    }

  fun smsPackage(context: Context): String? =
    try {
      Telephony.Sms.getDefaultSmsPackage(context)
    } catch (_: Exception) {
      null
    }

  fun launcherPackages(context: Context): Set<String> {
    val intent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME)
    return context.packageManager
      .queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY)
      .mapNotNull { it.activityInfo?.packageName }
      .toSet()
  }

  private fun inputMethodPackages(context: Context): Set<String> {
    val imm = context.getSystemService(Context.INPUT_METHOD_SERVICE) as? InputMethodManager
    return imm?.enabledInputMethodList?.map { it.packageName }?.toSet() ?: emptySet()
  }

  /** Packages that are never blocked and never count as "opening an app". */
  fun protectedPackages(context: Context): Set<String> {
    val set = HashSet<String>()
    dialerPackage(context)?.let { set.add(it) }
    smsPackage(context)?.let { set.add(it) }
    set.addAll(
      listOf(
        context.packageName,
        "com.android.dialer",
        "com.google.android.dialer",
        "com.android.server.telecom",
        "com.android.incallui",
        "com.android.phone",
        "com.android.mms",
        "com.google.android.apps.messaging",
        "com.android.emergency",
        "com.android.settings",
      ),
    )
    return set
  }

  /**
   * Windows from these packages appear on top of other apps for a moment (shade,
   * keyboard, share sheet, permission prompts). They must not end the current app session.
   */
  fun transientPackages(context: Context): Set<String> {
    val set = HashSet<String>()
    set.addAll(inputMethodPackages(context))
    set.addAll(
      listOf(
        context.packageName,
        "android",
        "com.android.systemui",
        "com.android.intentresolver",
        "com.android.permissioncontroller",
        "com.google.android.permissioncontroller",
        "com.google.android.inputmethod.latin",
        "com.samsung.android.honeyboard",
        "com.asus.ime",
      ),
    )
    return set
  }
}
