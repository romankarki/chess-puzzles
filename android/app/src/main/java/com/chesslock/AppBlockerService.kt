package com.chesslock

import android.accessibilityservice.AccessibilityService
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.SharedPreferences
import android.media.AudioManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import com.facebook.react.ReactApplication

/**
 * Watches which app comes to the foreground and shows [ChallengeActivity] when a blocked
 * app is opened or the phone is unlocked.
 *
 * Session rules:
 *  - Solving a challenge for an app allows it until you leave it (plus the grace period).
 *  - Unlocking the phone requires a challenge; until it is solved, every app except
 *    phone, messages, the home screen and Settings re-opens the challenge.
 *  - Locking the screen ends every session.
 */
class AppBlockerService : AccessibilityService() {

  private val handler = Handler(Looper.getMainLooper())
  private var config: BlockerConfig = BlockerConfig(false, true, emptySet(), 0)
  private var protected: Set<String> = emptySet()
  private var transient: Set<String> = emptySet()
  private var launchers: Set<String> = emptySet()

  private val prefsListener =
    SharedPreferences.OnSharedPreferenceChangeListener { _, _ -> reloadConfig() }

  private val screenReceiver =
    object : BroadcastReceiver() {
      override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
          Intent.ACTION_SCREEN_OFF -> BlockerState.onScreenOff()
          Intent.ACTION_USER_PRESENT -> onUnlocked()
        }
      }
    }

  override fun onServiceConnected() {
    super.onServiceConnected()
    instance = this
    reloadConfig()
    BlockerPrefs.prefs(this).registerOnSharedPreferenceChangeListener(prefsListener)
    val filter =
      IntentFilter().apply {
        addAction(Intent.ACTION_SCREEN_OFF)
        addAction(Intent.ACTION_USER_PRESENT)
      }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      registerReceiver(screenReceiver, filter, Context.RECEIVER_EXPORTED)
    } else {
      @Suppress("UnspecifiedRegisterReceiverFlag") registerReceiver(screenReceiver, filter)
    }
    // Warm up React Native so the first challenge appears instantly.
    handler.post {
      try {
        (application as ReactApplication).reactHost?.start()
      } catch (e: Exception) {
        Log.w(TAG, "Could not prewarm React Native", e)
      }
    }
  }

  private fun reloadConfig() {
    config = BlockerPrefs.load(this)
    protected = SystemApps.protectedPackages(this)
    transient = SystemApps.transientPackages(this)
    launchers = SystemApps.launcherPackages(this)
  }

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    if (event?.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return
    val pkg = event.packageName?.toString() ?: return
    if (pkg in transient) return
    onForeground(pkg)
  }

  private fun onForeground(pkg: String) {
    val now = SystemClock.elapsedRealtime()
    BlockerState.switchForeground(pkg, now, config.graceMinutes)
    if (!config.enabled) return
    if (pkg in protected || pkg in launchers) return

    val blocked = pkg in config.blockedPackages
    if (BlockerState.unlockPending) {
      launchChallenge(ChallengeReason.UNLOCK, pkg)
      return
    }
    if (blocked && !BlockerState.isAllowed(pkg, now)) {
      launchChallenge(ChallengeReason.APP, pkg)
    }
  }

  private fun onUnlocked() {
    if (!config.enabled || !config.unlockChallenge || isInCall()) return
    BlockerState.unlockPending = true
    val fg = BlockerState.foreground
    launchChallenge(
      ChallengeReason.UNLOCK,
      if (fg != null && fg !in launchers && fg !in protected) fg else null,
    )
  }

  /** Never interrupt a phone or VoIP call with an unlock challenge. */
  private fun isInCall(): Boolean {
    val audio = getSystemService(Context.AUDIO_SERVICE) as? AudioManager ?: return false
    return audio.mode == AudioManager.MODE_IN_CALL ||
      audio.mode == AudioManager.MODE_IN_COMMUNICATION ||
      audio.mode == AudioManager.MODE_RINGTONE
  }

  private fun launchChallenge(reason: ChallengeReason, pkg: String?) {
    val now = SystemClock.elapsedRealtime()
    BlockerState.setChallenge(reason, pkg)
    if (ChallengeActivity.isVisible && now - BlockerState.lastLaunchAt < 1500) {
      ChallengeActivity.notifyChanged()
      return
    }
    BlockerState.lastLaunchAt = now
    val intent =
      Intent(this, ChallengeActivity::class.java).apply {
        addFlags(
          Intent.FLAG_ACTIVITY_NEW_TASK or
            Intent.FLAG_ACTIVITY_NO_ANIMATION or
            Intent.FLAG_ACTIVITY_REORDER_TO_FRONT,
        )
      }
    try {
      startActivity(intent)
    } catch (e: Exception) {
      Log.e(TAG, "Could not show challenge", e)
    }
  }

  override fun onInterrupt() {}

  override fun onDestroy() {
    instance = null
    try {
      unregisterReceiver(screenReceiver)
    } catch (_: Exception) {}
    BlockerPrefs.prefs(this).unregisterOnSharedPreferenceChangeListener(prefsListener)
    super.onDestroy()
  }

  companion object {
    private const val TAG = "ChessLock"
    @Volatile var instance: AppBlockerService? = null
  }
}

enum class ChallengeReason(val id: String) {
  NONE("none"),
  UNLOCK("unlock"),
  APP("app"),
}

/** In-memory session state shared by the service, the challenge activity and the JS module. */
object BlockerState {
  /** Package -> elapsedRealtime until which it may be used. Long.MAX_VALUE = while it stays open. */
  private val allowances = HashMap<String, Long>()

  /** Leaving an app and returning within this window never counts as re-opening it. */
  private const val SWITCH_TOLERANCE_MS = 5_000L

  @Volatile var foreground: String? = null
  @Volatile var unlockPending = false
  @Volatile var reason = ChallengeReason.NONE
  @Volatile var challengePackage: String? = null
  @Volatile var lastLaunchAt = 0L

  @Synchronized
  fun switchForeground(pkg: String, now: Long, graceMinutes: Int) {
    val prev = foreground
    if (prev != null && prev != pkg && allowances[prev] == Long.MAX_VALUE) {
      allowances[prev] = now + SWITCH_TOLERANCE_MS + graceMinutes * 60_000L
    }
    foreground = pkg
  }

  @Synchronized
  fun isAllowed(pkg: String, now: Long): Boolean {
    val until = allowances[pkg] ?: return false
    if (until == Long.MAX_VALUE || now < until) {
      allowances[pkg] = Long.MAX_VALUE
      return true
    }
    allowances.remove(pkg)
    return false
  }

  @Synchronized
  fun setChallenge(r: ChallengeReason, pkg: String?) {
    // An unlock challenge takes priority; it also covers the app underneath.
    if (reason == ChallengeReason.UNLOCK && r == ChallengeReason.APP && unlockPending) {
      challengePackage = pkg ?: challengePackage
      return
    }
    reason = r
    challengePackage = pkg
  }

  @Synchronized
  fun onSolved() {
    unlockPending = false
    challengePackage?.let { allowances[it] = Long.MAX_VALUE }
    reason = ChallengeReason.NONE
    challengePackage = null
  }

  @Synchronized
  fun onScreenOff() {
    allowances.clear()
    foreground = null
  }
}
