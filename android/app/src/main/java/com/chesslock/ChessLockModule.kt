package com.chesslock

import android.annotation.SuppressLint
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.net.Uri
import android.os.PowerManager
import android.provider.Settings
import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import java.io.ByteArrayOutputStream
import java.util.concurrent.Executors

class ChessLockModule(reactContext: ReactApplicationContext) : NativeChessLockSpec(reactContext) {

  private val executor = Executors.newSingleThreadExecutor()

  override fun getName(): String = NAME

  override fun getInstalledApps(promise: Promise) {
    executor.execute {
      try {
        val pm = reactApplicationContext.packageManager
        val intent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
        val self = reactApplicationContext.packageName
        val seen = HashSet<String>()
        val list = Arguments.createArray()
        pm.queryIntentActivities(intent, 0)
          .filter { it.activityInfo != null && it.activityInfo.packageName != self }
          .sortedBy { it.loadLabel(pm).toString().lowercase() }
          .forEach { info ->
            val pkg = info.activityInfo.packageName
            if (!seen.add(pkg)) return@forEach
            val appInfo = info.activityInfo.applicationInfo
            val map = Arguments.createMap()
            map.putString("packageName", pkg)
            map.putString("label", info.loadLabel(pm).toString())
            map.putString("icon", encodeIcon(info.loadIcon(pm)))
            map.putBoolean(
              "isSystem",
              (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0 &&
                (appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) == 0,
            )
            list.pushMap(map)
          }
        promise.resolve(list)
      } catch (e: Exception) {
        promise.reject("E_APPS", e)
      }
    }
  }

  private fun encodeIcon(drawable: android.graphics.drawable.Drawable): String {
    val size = 96
    val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(bitmap)
    drawable.setBounds(0, 0, size, size)
    drawable.draw(canvas)
    val out = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)
    bitmap.recycle()
    return Base64.encodeToString(out.toByteArray(), Base64.NO_WRAP)
  }

  override fun getProtectedApps(promise: Promise) {
    val ctx = reactApplicationContext
    val map = Arguments.createMap()
    map.putString("dialer", SystemApps.dialerPackage(ctx) ?: "")
    map.putString("sms", SystemApps.smsPackage(ctx) ?: "")
    map.putArray("launchers", Arguments.fromList(SystemApps.launcherPackages(ctx).toList()))
    map.putString("self", ctx.packageName)
    promise.resolve(map)
  }

  override fun setConfig(config: ReadableMap) {
    val blocked = HashSet<String>()
    config.getArray("blockedPackages")?.let { arr ->
      for (i in 0 until arr.size()) arr.getString(i)?.let { blocked.add(it) }
    }
    BlockerPrefs.save(
      reactApplicationContext,
      BlockerConfig(
        enabled = config.getBoolean("enabled"),
        unlockChallenge = config.getBoolean("unlockChallenge"),
        blockedPackages = blocked,
        graceMinutes = config.getInt("graceMinutes"),
      ),
    )
  }

  override fun getConfig(promise: Promise) {
    val c = BlockerPrefs.load(reactApplicationContext)
    val map = Arguments.createMap()
    map.putBoolean("enabled", c.enabled)
    map.putBoolean("unlockChallenge", c.unlockChallenge)
    map.putArray("blockedPackages", Arguments.fromList(c.blockedPackages.toList()))
    map.putInt("graceMinutes", c.graceMinutes)
    promise.resolve(map)
  }

  override fun isAccessibilityEnabled(promise: Promise) {
    promise.resolve(isServiceEnabled(reactApplicationContext))
  }

  override fun openAccessibilitySettings() {
    startNewTask(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS))
  }

  override fun isIgnoringBatteryOptimizations(promise: Promise) {
    val pm = reactApplicationContext.getSystemService(Context.POWER_SERVICE) as PowerManager
    promise.resolve(pm.isIgnoringBatteryOptimizations(reactApplicationContext.packageName))
  }

  @SuppressLint("BatteryLife")
  override fun requestIgnoreBatteryOptimizations() {
    val intent =
      Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
        .setData(Uri.parse("package:${reactApplicationContext.packageName}"))
    if (!startNewTask(intent)) {
      startNewTask(Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS))
    }
  }

  override fun openAppDetails() {
    startNewTask(
      Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
        .setData(Uri.parse("package:${reactApplicationContext.packageName}"))
    )
  }

  override fun setWeeklyReminder(enabled: Boolean) {
    Reminders.setEnabled(reactApplicationContext, enabled)
  }

  override fun getChallengeInfo(promise: Promise) {
    val map = Arguments.createMap()
    map.putString("reason", BlockerState.reason.id)
    map.putString("packageName", BlockerState.challengePackage ?: "")
    map.putString("appLabel", labelFor(reactApplicationContext, BlockerState.challengePackage))
    promise.resolve(map)
  }

  override fun completeChallenge() {
    BlockerState.onSolved()
    UiThreadUtil.runOnUiThread { ChallengeActivity.get()?.finishAndRemoveTask() }
  }

  override fun goHome() {
    UiThreadUtil.runOnUiThread {
      val activity = ChallengeActivity.get()
      if (activity != null) {
        activity.goHome()
      } else {
        startNewTask(Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME))
      }
    }
  }

  override fun openDialer() {
    startNewTask(Intent(Intent.ACTION_DIAL))
  }

  override fun openMessages() {
    val ctx = reactApplicationContext
    val selector = Intent.makeMainSelectorActivity(Intent.ACTION_MAIN, Intent.CATEGORY_APP_MESSAGING)
    if (startNewTask(selector)) return
    SystemApps.smsPackage(ctx)?.let { pkg ->
      ctx.packageManager.getLaunchIntentForPackage(pkg)?.let { if (startNewTask(it)) return }
    }
    startNewTask(Intent(Intent.ACTION_SENDTO, Uri.parse("smsto:")))
  }

  private fun startNewTask(intent: Intent): Boolean =
    try {
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      reactApplicationContext.startActivity(intent)
      true
    } catch (_: Exception) {
      false
    }

  companion object {
    const val NAME = "ChessLock"

    fun labelFor(context: Context, pkg: String?): String {
      if (pkg.isNullOrEmpty()) return ""
      return try {
        val pm = context.packageManager
        pm.getApplicationLabel(pm.getApplicationInfo(pkg, 0)).toString()
      } catch (_: PackageManager.NameNotFoundException) {
        pkg
      }
    }

    fun isServiceEnabled(context: Context): Boolean {
      val expected = ComponentName(context, AppBlockerService::class.java)
      val enabled =
        Settings.Secure.getString(
          context.contentResolver,
          Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
        ) ?: return false
      return enabled.split(':').any {
        val cn = ComponentName.unflattenFromString(it)
        cn != null && cn == expected
      }
    }
  }
}
