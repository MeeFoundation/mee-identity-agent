import { ChevronRight, FileMedical, FolderPlus, type Icon, PersonVcard } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

const rowClassName =
  'flex w-full cursor-pointer items-center gap-2 py-2 pr-4 pl-2 text-left outline-none transition-colors hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset'

type FormLinkProps = {
  icon: Icon
  label: string
  onClick: () => void
}

const FormLink = ({ icon: FormIcon, label, onClick }: FormLinkProps) => (
  <button className={rowClassName} onClick={onClick} type="button">
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
      <FormIcon aria-hidden className="text-brand-500" size={18} />
    </span>
    <span className="min-w-0 flex-1 font-medium text-base text-gray-900">{label}</span>
    <ChevronRight aria-hidden className="shrink-0 text-gray-700" size={16} />
  </button>
)

type SofiaFormsCardProps = {
  onOpenContactInfo: () => void
  onOpenMedical: () => void
  // Without it the card has no "Create form" action, as for someone who may only view the pod.
  onCreateForm?: () => void
}

// The forms in Sofia's pod: Contact info and Medical.
export const SofiaFormsCard = ({ onOpenContactInfo, onOpenMedical, onCreateForm }: SofiaFormsCardProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col overflow-clip rounded-2xl bg-white shadow-card">
      <div className="flex flex-col divide-y divide-gray-200">
        <FormLink icon={PersonVcard} label={t('pods.people.contactInfo.title')} onClick={onOpenContactInfo} />
        <FormLink icon={FileMedical} label={t('pods.people.forms.medical')} onClick={onOpenMedical} />
      </div>
      {onCreateForm && (
        <button
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 border-gray-200 border-t font-medium text-base text-gray-700 outline-none transition-colors hover:bg-gray-50 hover:text-gray-800 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
          onClick={onCreateForm}
          type="button"
        >
          <FolderPlus aria-hidden size={22} />
          {t('pods.people.forms.createForm')}
        </button>
      )}
    </div>
  )
}
