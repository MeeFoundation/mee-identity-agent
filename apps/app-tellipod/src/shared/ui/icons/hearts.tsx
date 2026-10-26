import Svg, { Path } from 'react-native-svg'

import type { IconProps } from './types'

const PATH =
  'M4.31484 0.420851C5.73847 -1.04127 9.29534 1.5181 4.31484 4.80898C-0.665658 1.51898 2.89209 -1.04127 4.31484 0.420851ZM10.2998 1.9906C11.2483 1.01585 13.6205 2.7221 10.2998 4.91573C6.97922 2.7221 9.35134 1.01585 10.2998 1.9906ZM6.86022 6.68673C9.23147 4.24898 15.1605 8.51548 6.86022 14C-1.44091 8.51548 4.48897 4.24898 6.86022 6.68673Z'

export const HeartsIcon = ({ color = '#3b5b63', size = 14 }: IconProps) => (
  <Svg fill="none" height={size} viewBox="0 0 14 14" width={size}>
    <Path clipRule="evenodd" d={PATH} fill={color} fillRule="evenodd" />
  </Svg>
)
