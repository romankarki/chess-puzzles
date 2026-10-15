package com.chesslock

import android.content.Context
import android.content.SharedPreferences

/** Blocker configuration, written by the JS settings screen and read by the service. */
data class BlockerConfig(
  val enabled: Boolean,
  val unlockChallenge: Boolean,
  val blockedPackages: Set<String>,
  val graceMinutes: Int,
)

object BlockerPrefs {
  private const val FILE = "chesslock_blocker"
  private const val KEY_ENABLED = "enabled"
  // Renamed from "unlockChallenge" when the default changed to off, so installs that
  // never touched the setting pick up the new default.
  private const val KEY_UNLOCK = "unlockPuzzle"
  private const val KEY_BLOCKED = "blockedPackages"
  private const val KEY_GRACE = "graceMinutes"

  fun prefs(context: Context): SharedPreferences =
    context.applicationContext.getSharedPreferences(FILE, Context.MODE_PRIVATE)

  fun load(context: Context): BlockerConfig {
    val p = prefs(context)
    return BlockerConfig(
      enabled = p.getBoolean(KEY_ENABLED, false),
      unlockChallenge = p.getBoolean(KEY_UNLOCK, false),
      blockedPackages = p.getStringSet(KEY_BLOCKED, emptySet())?.toSet() ?: emptySet(),
      graceMinutes = p.getInt(KEY_GRACE, 0),
    )
  }

  fun save(context: Context, config: BlockerConfig) {
    prefs(context)
      .edit()
      .putBoolean(KEY_ENABLED, config.enabled)
      .putBoolean(KEY_UNLOCK, config.unlockChallenge)
      .putStringSet(KEY_BLOCKED, HashSet(config.blockedPackages))
      .putInt(KEY_GRACE, config.graceMinutes)
      .apply()
  }
}
