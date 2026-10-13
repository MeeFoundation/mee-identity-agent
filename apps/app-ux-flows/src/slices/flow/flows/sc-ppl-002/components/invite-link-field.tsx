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
}

export const InviteLinkField = ({ link }: InviteLinkFieldProps) => {
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
      <button
        aria-label={copied ? t('flows.scPpl002.share.copied') : t('flows.scPpl002.share.copyLink')}
        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-700 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-3 focus-visible:ring-ring"
        onClick={copy}
        type="button"
      >
        {copied ? <Check2 aria-hidden className="text-success-700" size={20} /> : <Copy aria-hidden size={18} />}
      </button>
    </div>
  )
}
