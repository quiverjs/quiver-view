// import { uncurry } from 'quiver-util/function'
import { ImmutableMap } from 'quiver-util/immutable'

import { map } from 'quiver-signal/method'

// renderSignal :: Signal args -> (args -> VDOM) -> Signal VDOM
export const renderSignal = (signal, renderer) =>
  signal::map(renderer)
