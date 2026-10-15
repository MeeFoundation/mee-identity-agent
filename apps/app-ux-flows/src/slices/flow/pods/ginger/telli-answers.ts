// A stand-in for Telli in Ginger's pod: fixed answers to what her Care & Feeding instructions hold.

export type TelliAnswer = {
  key: string
  // `false` when Telli found nothing in the pod.
  fromPod: boolean
}

const answerKey = (id: string) => `pods.ginger.telli.answers.${id}`

// Whole words only, so “great” or “weather” don't count as “eat”.
const feedingPattern = /\b(feed(s|ing)?|fed|food|eats?|eating|eaten|meals?|breakfast|dinner)\b|\bhow much\b/

// Only messages about feeding, or other questions, get an answer.
export const answerFor = (message: string): TelliAnswer | null => {
  const text = message.trim().toLowerCase()
  if (feedingPattern.test(text)) return { fromPod: true, key: answerKey('feeding') }
  if (text.endsWith('?')) return { fromPod: false, key: answerKey('notFound') }
  return null
}
