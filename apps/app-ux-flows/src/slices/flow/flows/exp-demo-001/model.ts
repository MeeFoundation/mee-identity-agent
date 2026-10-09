import type { GingerPodComponents, MedicationRecord, Pod } from '../../pods/ginger/model'

export type ExpDemo001ScreenId = 'ginger-info' | 'medication-added'

export type ExpDemo001Components = GingerPodComponents

export type ExpDemo001Events = {
  medication_form_added: { method: 'empty_state' }
}

export type ExpDemo001InitialState = {
  pod?: Pod
  medication?: MedicationRecord
}
