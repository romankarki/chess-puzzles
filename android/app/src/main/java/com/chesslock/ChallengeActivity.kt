package com.chesslock

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.Arguments
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import java.lang.ref.WeakReference

/** Full-screen chess challenge shown over blocked apps and after unlocking. */
class ChallengeActivity : ReactActivity() {

  override fun getMainComponentName(): String = "ChessLockChallenge"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    // Never restore a stale React state on recreation.
    super.onCreate(null)
    current = WeakReference(this)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    notifyChanged()
  }

  override fun onResume() {
    super.onResume()
    isVisible = true
  }

  override fun onPause() {
    isVisible = false
    super.onPause()
  }

  override fun onDestroy() {
    if (current?.get() === this) current = null
    super.onDestroy()
  }

  /** Back leaves to the home screen instead of revealing the blocked app. */
  override fun invokeDefaultOnBackPressed() {
    goHome()
  }

  fun goHome() {
    val home =
      Intent(Intent.ACTION_MAIN).apply {
        addCategory(Intent.CATEGORY_HOME)
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
      }
    startActivity(home)
  }

  companion object {
    @Volatile var isVisible = false
    private var current: WeakReference<ChallengeActivity>? = null

    fun get(): ChallengeActivity? = current?.get()

    /** Tells the JS challenge screen that the reason / target app changed. */
    fun notifyChanged() {
      val activity = get() ?: return
      val context = (activity.application as ReactApplication).reactHost?.currentReactContext ?: return
      val map =
        Arguments.createMap().apply {
          putString("reason", BlockerState.reason.id)
          putString("packageName", BlockerState.challengePackage ?: "")
          putString("appLabel", ChessLockModule.labelFor(activity, BlockerState.challengePackage))
        }
      context.emitDeviceEvent("ChessLockChallengeChanged", map)
    }
  }
}
