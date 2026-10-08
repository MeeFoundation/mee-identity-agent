import { describe, expect, expectTypeOf, it } from 'vitest'

import { defineFlow } from '../../runtime/define-flow'
import { useFlowNavigation } from '../../runtime/flow-context'
import { addMedicationFlow } from './flow'
import {
  type AddMedicationComponents,
  type AddMedicationInitialState,
  type AddMedicationScreenId,
  gingerFixture,
  type Medication,
  medicationsAtom,
  type Pet,
  petAtom,
  type QuickActionProps,
  showMedicationHintAtom,
} from './model'
import { HomeScreen } from './screens/home-screen'

const otherPet: Pet = { ageYears: 2, id: 'pepper', name: 'Pepper', species: 'Dog' }
const medication: Medication = { dosage: '5 mg', id: 'm1', name: 'Apoquel', withFood: true }

const useTypeContracts = () => {
  const navigation = useFlowNavigation<AddMedicationScreenId>()
  navigation.goToScreen('home')
  // @ts-expect-error undeclared screen id
  navigation.goToScreen('does-not-exist')

  const untypedNavigation = useFlowNavigation()
  // @ts-expect-error screen ids are uncallable without the flow's screen-id type argument
  untypedNavigation.goToScreen('home')

  defineFlow<AddMedicationScreenId, AddMedicationComponents, AddMedicationInitialState>({
    ...addMedicationFlow,
    // @ts-expect-error initial screen must be a declared screen
    initialScreen: 'does-not-exist',
  })

  defineFlow<AddMedicationScreenId, AddMedicationComponents, AddMedicationInitialState>({
    ...addMedicationFlow,
    // @ts-expect-error every declared screen must be implemented
    screens: { home: HomeScreen },
  })

  defineFlow<AddMedicationScreenId, AddMedicationComponents, AddMedicationInitialState>({
    ...addMedicationFlow,
    variants: {
      incompatibleComponent: {
        components: {
          // @ts-expect-error a replacement cannot require props the base component does not receive
          QuickAction: (_props: QuickActionProps & { badge: number }) => null,
        },
        nameKey: 'incompatible-component',
      },
      undeclaredScreen: {
        nameKey: 'undeclared-screen',
        screens: {
          // @ts-expect-error a variant cannot override a screen its flow does not declare
          'does-not-exist': HomeScreen,
        },
      },
      wrongInitialState: {
        initialState: {
          // @ts-expect-error variant initial state uses the flow's typed initial-state shape
          showMedicationHint: 'yes',
        },
        nameKey: 'wrong-initial-state',
      },
    },
  })
}

describe('add-medication flow store', () => {
  it('starts from fixture values without initial state', () => {
    const store = addMedicationFlow.createStore()

    expect(store.get(petAtom)).toEqual(gingerFixture)
    expect(store.get(medicationsAtom)).toEqual([])
    expect(store.get(showMedicationHintAtom)).toBe(false)
  })

  it('turns on the medication hint flag when supplied', () => {
    const store = addMedicationFlow.createStore({ showMedicationHint: true })

    expect(store.get(showMedicationHintAtom)).toBe(true)
    expect(store.get(petAtom)).toEqual(gingerFixture)
  })

  it('overrides only the supplied initial-state fields', () => {
    const store = addMedicationFlow.createStore({ pet: otherPet })

    expect(store.get(petAtom)).toEqual(otherPet)
    expect(store.get(medicationsAtom)).toEqual([])
  })

  it('isolates stores created from the same flow', () => {
    const first = addMedicationFlow.createStore()
    const second = addMedicationFlow.createStore()

    first.set(medicationsAtom, [medication])

    expect(first.get(medicationsAtom)).toEqual([medication])
    expect(second.get(medicationsAtom)).toEqual([])
  })

  it('returns the initial values again from a fresh store after writes', () => {
    const initialState: AddMedicationInitialState = { pet: otherPet }
    const store = addMedicationFlow.createStore(initialState)
    store.set(petAtom, gingerFixture)
    store.set(medicationsAtom, [medication])

    const restarted = addMedicationFlow.createStore(initialState)

    expect(restarted.get(petAtom)).toEqual(otherPet)
    expect(restarted.get(medicationsAtom)).toEqual([])
  })

  it('declares type contracts checked by tsc', () => {
    expectTypeOf(useTypeContracts).toBeFunction()
  })
})
