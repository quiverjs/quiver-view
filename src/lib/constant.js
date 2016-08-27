import { constantSignal } from 'quiver-signal'
import { assertVdom } from './assert'

// constantSpva :: Vdom -> Signal Pair Vdom ()
export const constantSpva = vdom => {
  assertVdom(vdom)

  const spva = constantSignal([vdom])
  spva.isQuiverSpva = true

  return spva
}
