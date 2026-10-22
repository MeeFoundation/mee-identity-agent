import type { FC, ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

import { PanelBody, type PanelFooter, PanelFooterAction, PanelSurface } from './PanelParts'

export type { PanelFooter } from './PanelParts'

export type PanelProps = {
  children?: ReactNode
  footer?: PanelFooter
  gap?: number
  style?: StyleProp<ViewStyle>
  testID?: string
}

export const Panel: FC<PanelProps> = ({ children, footer, gap, style, testID }) => (
  <PanelSurface style={style} testID={testID}>
    <PanelBody gap={gap} testID={testID ? `${testID}-body` : undefined}>
      {children}
    </PanelBody>
    {footer ? <PanelFooterAction footer={footer} testID={testID ? `${testID}-footer` : undefined} /> : null}
  </PanelSurface>
)
