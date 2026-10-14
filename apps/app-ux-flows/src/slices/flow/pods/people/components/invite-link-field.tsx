import { useEffect, useState } from 'react'
import { Check2, Copy } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

const COPIED_MS = 1500

// Best effort: a blocked clipboard must never stop the flow.
export const copyToClipboard = (text: string) => {
  navigator.clipboard?.writeText(text).catch(() => {})
}

type InviteLinkFieldProps = {
  link: string
  // `text` shows the control as a "copy invite link" text button, after the Figma "Pod created" sheet.
  copyLabel?: 'icon' | 'text'
}

export const InviteLinkField = ({ link, copyLabel = 'icon' }: InviteLinkFieldProps) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = () => {
    copyToClipboard(link)
    setCopied(true)
  }

  return (
    <div className="flex h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white pr-1.5 pl-3">
      <span className="min-w-0 flex-1 truncate text-base text-gray-900">{link}</span>
      {copyLabel === 'icon' ? (
        <button
          aria-label={copied ? t('pods.people.sharing.linkCopied') : t('pods.people.sharing.copyLink')}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-700 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-3 focus-visible:ring-ring"
          onClick={copy}
          type="button"
        >
          {copied ? <Check2 aria-hidden className="text-success-700" size={20} /> : <Copy aria-hidden size={18} />}
        </button>
      ) : (
        <button
          aria-label={copied ? t('pods.people.sharing.linkCopied') : undefined}
          className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 font-semibold text-base text-brand-700 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-3 focus-visible:ring-ring"
          onClick={copy}
          type="button"
        >
          {copied ? (
            <>
              <Check2 aria-hidden className="text-success-700" size={20} />
              {t('pods.people.sharing.copied')}
            </>
          ) : (
            t('pods.people.sharing.copyInviteLink')
          )}
        </button>
      )}
    </div>
  )
}
