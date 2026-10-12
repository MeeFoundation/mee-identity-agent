import { useAtomValue } from 'jotai'
import { Hearts } from 'react-bootstrap-icons'

import { podAtom } from '../../../pods/ginger/model'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import type { ExpPet003Components, ExpPet003ScreenId } from '../model'

const noop = () => {}

type SubScreenTopBarProps = {
  title: string
  // The places above this screen inside Ginger, after Ginger itself.
  trail?: readonly string[]
}

// The top bar of a screen inside Ginger: no tabs, and the breadcrumb leads back up to Ginger.
export const SubScreenTopBar = ({ title, trail = [] }: SubScreenTopBarProps) => {
  const { PodTopBar } = useFlowComponents<ExpPet003Components>()
  const { back } = useFlowNavigation<ExpPet003ScreenId>()
  const pod = useAtomValue(podAtom)

  return (
    <PodTopBar
      avatar={{ src: pod.avatarSrc }}
      breadcrumb={[pod.name, ...trail]}
      breadcrumbIcon={Hearts}
      breadcrumbTrailingChevron={trail.length === 0}
      onBack={back}
      onMenu={noop}
      title={title}
    />
  )
}
