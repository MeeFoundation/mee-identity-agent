import { useAtomValue, useSetAtom } from 'jotai'
import { type ChangeEvent, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { choosePodImageAtom, podImageAtom } from '../model'

// After "Profile image (Optional)" in the New Pod sheet: the link opens the device's picker, limited to images.
export const PodImageField = () => {
  const { t } = useTranslation()
  const image = useAtomValue(podImageAtom)
  const chooseImage = useSetAtom(choosePodImageAtom)
  const inputRef = useRef<HTMLInputElement>(null)
  const labelId = useId()

  // A cancelled picker fires no change, so nothing is replaced.
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) chooseImage(URL.createObjectURL(file))
    event.target.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="px-0.5 text-base text-gray-800 leading-4" id={labelId}>
        {t('flows.scPet001.newPod.image')}
        <span className="opacity-75"> {t('flows.scPet001.newPod.optional')}</span>
      </span>
      <div className="flex h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white py-3 pr-1 pl-1.5">
        {image ? (
          <img alt="" className="size-8 shrink-0 rounded-md object-cover" height={32} src={image} width={32} />
        ) : (
          <span aria-hidden className="size-8 shrink-0 rounded-md bg-brand-100" />
        )}
        <span className="min-w-0 flex-1 truncate text-base text-gray-500">
          {image ? t('flows.scPet001.newPod.imageChosen') : t('flows.scPet001.newPod.imagePlaceholder')}
        </span>
        <button
          aria-describedby={labelId}
          className="shrink-0 cursor-pointer rounded-lg px-2 text-base text-brand-700 outline-none transition-colors hover:text-brand-800 focus-visible:ring-3 focus-visible:ring-ring"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          {image ? t('flows.scPet001.newPod.changeImage') : t('flows.scPet001.newPod.selectImage')}
        </button>
        <input accept="image/*" className="hidden" onChange={onChange} ref={inputRef} tabIndex={-1} type="file" />
      </div>
    </div>
  )
}
