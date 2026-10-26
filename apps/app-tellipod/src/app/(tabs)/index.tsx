import { useAppChrome } from '@/shared/chrome'
import { HomePods } from '@/widgets/home-pods'

export default function HomeScreen() {
  useAppChrome({ header: 'home' })

  return <HomePods />
}
