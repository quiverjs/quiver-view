import { combineSignals } from 'quiver-signal'
import { ImmutableMap } from 'quiver-util/immutable'

import { renderSignal } from './render'

// combineRender :: Signal args -> Map Signal VDOM ->
//     (args -> Map VDOM -> VDOM) -> Signal VDOM
export const combineRender = (mainSignal, childrenSignalMap, renderer) => {
  const combinedVdomSignal = combineSignals(childrenSignalMap)

  const combinedSignals = combineSignals(ImmutableMap()
    .set('args', mainSignal)
    .set('vdomMap', combinedVdomSignal))

  return renderSignal(combinedSignals, valueMap => {
    const args = valueMap.get('args')
    const vdomMap = valueMap.get('vdomMap')

    return renderer(args, vdomMap)
  })
}
