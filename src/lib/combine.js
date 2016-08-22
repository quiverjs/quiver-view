import { map } from 'quiver-signal/method'
import { assertSignal, combineSignals } from 'quiver-signal'
import { ImmutableMap, isImmutableMap } from 'quiver-util/immutable'

import { assertVdomSignal } from './assert'
import { renderSignal } from './render'

const $main = Symbol('@main')

// combineRender :: Signal args -> Map Signal VDOM ->
//     (args -> Map VDOM -> VDOM) -> Signal VDOM
export const combineRender = (mainSignal, childrenSignalMap, renderer) => {
  assertSignal(mainSignal)
  for(const childrenSignal of childrenSignalMap.values()) {
    assertVdomSignal(childrenSignal)
  }

  if(!isImmutableMap(childrenSignalMap))
    throw new TypeError('childrenSignalMap must be immutable Map')

  const combinedSignalMap = childrenSignalMap.set($main, mainSignal)

  const combinedSignals = combineSignals(combinedSignalMap)

  const combinedVdomSignal = combinedSignals::map(valueMap => {
    const mainValue = valueMap.get($main)
    const vdomPairsMap = valueMap.delete($main)
    const childValues = vdomPairsMap.map(([vdom, value]) => value)

    const mainVdom = renderer(mainValue, vdomPairsMap)

    const renderValue = ImmutableMap()
      .set('main', mainValue)
      .set('children', childValues)

    return [mainVdom, renderValue]
  })

  combinedVdomSignal.isVdomSignal = true

  return combinedVdomSignal
}
