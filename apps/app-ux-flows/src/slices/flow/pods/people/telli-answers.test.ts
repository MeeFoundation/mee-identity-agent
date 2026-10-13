import { describe, expect, it } from 'vitest'

import { answerFor } from './telli-answers'

const key = (id: string) => `pods.people.telli.answers.${id}`

describe('answerFor', () => {
  it('answers from the notes about piano', () => {
    expect(answerFor('When does Sofia have piano?')).toEqual({ fromPod: true, key: key('piano') })
  })

  it('answers from Contact info about her birthday and her name', () => {
    expect(answerFor('When was she born?')).toEqual({ fromPod: true, key: key('born') })
    expect(answerFor("When is Sofia's birthday")).toEqual({ fromPod: true, key: key('born') })
    expect(answerFor('How old is she?')).toEqual({ fromPod: true, key: key('born') })
    expect(answerFor("What's her last name?")).toEqual({ fromPod: true, key: key('fullName') })
    expect(answerFor('surname')).toEqual({ fromPod: true, key: key('fullName') })
    expect(answerFor('Full name please')).toEqual({ fromPod: true, key: key('fullName') })
  })

  it('ignores case', () => {
    expect(answerFor('PIANO DAY?')).toEqual({ fromPod: true, key: key('piano') })
  })

  it('applies the first matching rule', () => {
    expect(answerFor('Was she born before piano started?')).toEqual({ fromPod: true, key: key('piano') })
  })

  it("says it couldn't find other questions", () => {
    expect(answerFor("What's her favourite food?")).toEqual({ fromPod: false, key: key('notFound') })
  })

  it('stays out of messages that are not questions', () => {
    expect(answerFor('Thanks!')).toBeNull()
    expect(answerFor('   ')).toBeNull()
  })
})
