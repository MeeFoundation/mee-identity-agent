import type { IntroMode } from '../model'
import { IntroSceneScreen } from './intro-screen'
import { ExistingDeviceScreen, RestoreScreen, TelliHandoffScreen } from './stand-in-screen'

// Each flow calls this once at module level, so its screen components keep their identity and the four beats share one
// mounted scene.
export const createIntroScreens = ({ mode }: { mode: IntroMode }) => ({
  ExistingDeviceScreen,
  IntroScreen: () => <IntroSceneScreen mode={mode} />,
  RestoreScreen,
  TelliHandoffScreen,
})
