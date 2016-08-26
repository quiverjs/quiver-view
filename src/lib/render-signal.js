import { map } from 'quiver-signal/method'
import { assertFunction } from 'quiver-util/assert'

import { assertVdom } from './assert'

// type SPV a = Signal Pair Vdom a
// renderSignal :: Signal a -> (a -> Vdom) -> Signal Pair Vdom a
export const renderSignal = (signal, renderer) => {
  assertFunction(renderer)

  // spva :: Signal Pair Vdom a
  const spva = signal::map(value => {
    const vdom = renderer(value)

    assertVdom(vdom)
    return [vdom, value]
  })

  spva.isQuiverSpva = true

  return spva
}
