import { describe, expect, it } from 'vitest'

import { answerFor } from './telli-answers'

const key = (id: string) => `pods.ginger.telli.answers.${id}`

describe('answerFor', () => {
  it('answers questions about feeding from Care & Feeding', () => {
    expect(answerFor('How much does Ginger eat at dinner?')).toEqual({ fromPod: true, key: key('feeding') })
    expect(answerFor('When do I feed her')).toEqual({ fromPod: true, key: key('feeding') })
    expect(answerFor('WHAT FOOD?')).toEqual({ fromPod: true, key: key('feeding') })
    expect(answerFor('Has she eaten her meals?')).toEqual({ fromPod: true, key: key('feeding') })
  })

  it('does not take a word that only contains a feeding word for one', () => {
    expect(answerFor('Great, thanks!')).toBeNull()
    expect(answerFor('Is the weather ok for her?')).toEqual({ fromPod: false, key: key('notFound') })
    expect(answerFor('Can she have a treat?')).toEqual({ fromPod: false, key: key('notFound') })
  })

  it("says it couldn't find other questions", () => {
    expect(answerFor('Does Ginger like toys?')).toEqual({ fromPod: false, key: key('notFound') })
  })

  it('does not answer a statement', () => {
    expect(answerFor('Thanks!')).toBeNull()
  })
})
