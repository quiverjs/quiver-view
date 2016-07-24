import { combineSignals } from 'quiver-signal'
import { isImmutableMap } from 'quiver-util/immutable'

import { renderSignal } from './render'

const $main = Symbol('@main')

// combineRender :: Signal args -> Map Signal VDOM ->
//     (args -> Map VDOM -> VDOM) -> Signal VDOM
export const combineRender = (mainSignal, childrenSignalMap, renderer) => {
  if(!isImmutableMap(childrenSignalMap))
    throw new TypeError('childrenSignalMap must be immutable Map')

  const combinedSignalMap = childrenSignalMap.set($main, mainSignal)

  const combinedSignals = combineSignals(combinedSignalMap)

  return renderSignal(combinedSignals, valueMap => {
    const mainValue = valueMap.get($main)
    const vdomMap = valueMap.delete($main)

    return renderer(mainValue, vdomMap)
  })
}
