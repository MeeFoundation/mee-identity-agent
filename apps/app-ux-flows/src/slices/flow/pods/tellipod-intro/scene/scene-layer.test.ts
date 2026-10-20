import { describe, expect, it } from 'vitest'

import { doorLeaf, doorTheta } from './door'
import { lineD, lineT } from './paula-line'
import { paulaOpacity } from './paula-phone'

// Expected values were computed by running the prototype's own scene modules.
describe('SC-ONB-001 scene builders', () => {
  it('draws the door leaf like the prototype', () => {
    expect(doorLeaf(0).d).toBe('M290.80683397999996,186.15L304.923048,194L304.923048,164L290.80683397999996,156.15Z')
    expect(doorLeaf(35).d).toBe(
      'M290.80683397999996,186.15L294.4694370255152,197.1418278451203L294.4694370255152,167.1418278451203L290.80683397999996,156.15Z',
    )
    expect(doorLeaf(70).d).toBe(
      'M290.80683397999996,186.15L282.7850488582161,196.25370211289263L282.7850488582161,166.25370211289263L290.80683397999996,156.15Z',
    )
    expect(doorLeaf(35).fill).toBe('#3f656d')
  })

  it('opens the door for Telli and closes it behind', () => {
    expect(doorTheta(1000)).toBe(0)
    expect(doorTheta(1500)).toBe(70)
    expect(doorTheta(2300)).toBe(0)
  })

  it('draws the line to Paula like the prototype', () => {
    expect(lineD(-230, 0.5)).toBe('M297.99,160Q320.54,75 346.09,44')
    expect(lineD(-440, 1)).toBe('M297.99,160Q434.02,-115 582.05,-69')
    expect(lineT(1.4, 2000)).toBe(0)
    expect(lineT(2, 1100)).toBe(1)
  })

  it('shows Paula’s phone only around beat 3', () => {
    expect(paulaOpacity(1)).toBe(0)
    expect(paulaOpacity(2)).toBe(1)
    expect(paulaOpacity(3)).toBe(0)
  })
})
