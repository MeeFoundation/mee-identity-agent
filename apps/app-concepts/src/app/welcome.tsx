import { WelcomeItem, welcomeSlides } from '@/widgets/welcome'

import { Swiper } from '@/shared/ui/Swiper'

export default function Welcome() {
  return <Swiper data={welcomeSlides} renderItem={({ item }) => <WelcomeItem {...item} />} />
}
