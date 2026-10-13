import { useTranslation } from 'react-i18next'

import telliAvatar from '@/shared/ui/icons/telli-avatar.svg'

// The global Telli chat has no pod, so its bar shows Telli itself in the pod chat's top bar style.
export const TelliTopBar = () => {
  const { t } = useTranslation()

  return (
    <header className="rounded-3xl border-white border-b bg-linear-to-b from-brand-100 to-white pt-(--status-bar-h) drop-shadow-topbar">
      <div className="flex items-center gap-3 px-5 pt-2.5 pb-5">
        <img alt="" aria-hidden className="block size-12 shrink-0" height={48} src={telliAvatar} width={48} />
        <h1 className="font-medium text-base text-gray-900">{t('flows.scPet001.telli.title')}</h1>
      </div>
    </header>
  )
}
