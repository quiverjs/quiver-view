import { map } from 'quiver-signal/method'
import { ImmutableMap } from 'quiver-util/immutable'
import { assertFunction } from 'quiver-util/assert'

import { assertVdom } from './assert'

// renderSignal :: Signal args -> (args -> VDOM) -> Signal VDOM
export const renderSignal = (signal, renderer) => {
  return signal::map(value => {
    const vdom = renderer(value)

    assertVdom(vdom)
    return vdom
  })
}
