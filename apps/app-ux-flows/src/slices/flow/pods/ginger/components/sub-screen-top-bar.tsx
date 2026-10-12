import { useAtomValue } from 'jotai'
import { Hearts } from 'react-bootstrap-icons'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { type GingerPodComponents, podAtom } from '../model'

const noop = () => {}

type SubScreenTopBarProps = {
  title: string
  // The places above this screen inside Ginger, after Ginger itself.
  trail?: readonly string[]
  // Without it the menu control does nothing.
  onMenu?: () => void
}

// The top bar of a screen inside Ginger: no tabs, and the breadcrumb leads back up to Ginger.
export const SubScreenTopBar = ({ title, trail = [], onMenu = noop }: SubScreenTopBarProps) => {
  const { PodTopBar } = useFlowComponents<GingerPodComponents>()
  const { back } = useFlowNavigation()
  const pod = useAtomValue(podAtom)

  return (
    <PodTopBar
      avatar={{ src: pod.avatarSrc }}
      breadcrumb={[pod.name, ...trail]}
      breadcrumbIcon={Hearts}
      breadcrumbTrailingChevron={trail.length === 0}
      onBack={back}
      onMenu={onMenu}
      title={title}
    />
  )
}
