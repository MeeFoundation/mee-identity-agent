// A stand-in for Telli in Sofia's shared pod: fixed answers to what her notes and Contact info hold.

export type TelliAnswer = {
  key: string
  // `false` when Telli found nothing in the pod.
  fromPod: boolean
}

const answerKey = (id: string) => `pods.people.telli.answers.${id}`

const rules: readonly { pattern: RegExp; id: string }[] = [
  { id: 'piano', pattern: /piano/ },
  { id: 'born', pattern: /born|birthday|how old/ },
  { id: 'fullName', pattern: /last name|surname|full name/ },
]

// Only messages that touch something Telli knows, or ask a question, get an answer.
export const answerFor = (message: string): TelliAnswer | null => {
  const text = message.trim().toLowerCase()
  const rule = rules.find(({ pattern }) => pattern.test(text))
  if (rule) return { fromPod: true, key: answerKey(rule.id) }
  if (text.endsWith('?')) return { fromPod: false, key: answerKey('notFound') }
  return null
}
