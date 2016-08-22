import global from 'global'
import { map } from 'quiver-signal/method'
import { assertFunction } from 'quiver-util/assert'
import { ImmutableMap } from 'quiver-util/immutable'
import { assertSignal, flattenSignal, combineSignals } from 'quiver-signal'

import { renderSignal } from './render'

const CacheMap = global.WeakMap || global.Map

// renderList :: Signal main ->
//     Signal List Signal child ->
//     (Signal child -> Signal VDOM) ->
//     (main -> List VDOM -> VDOM) ->
//     Signal VDOM
export const renderListSignal =
  (mainSignal, signalListSignal, childrenRenderer, parentRenderer) =>
{
  assertSignal(mainSignal)
  assertSignal(signalListSignal)
  assertFunction(childrenRenderer)
  assertFunction(parentRenderer)

  const vdomSignalCache = new CacheMap()

  // vdomSignalListSignal :: Signal List Signal VDOM
  const vdomSignalListSignal = signalListSignal::map(signalList =>
    // signalList :: List Signal child
    signalList.map(childSignal => {
      const cachedVdomSignal = vdomSignalCache.get(childSignal)
      if(cachedVdomSignal) return cachedVdomSignal

      const vdomSignal = childrenRenderer(childSignal)
      vdomSignalCache.set(childSignal, vdomSignal)

      return vdomSignal
    }))

  // vdomListSignal :: Signal List VDOM
  const vdomListSignal = flattenSignal(vdomSignalListSignal)

  const combinedSignals = combineSignals(ImmutableMap({
    main: mainSignal,
    childrenVdoms: vdomListSignal
  }))

  const mainVdomSignal = combinedSignals::map(valueMap => {
    const mainValue = valueMap.get('main')
    const childrenVdomPairs = valueMap.get('childrenVdoms')

    const childrenValues = childrenVdomPairs.map(
      ([vdom, value]) => value)

    const mainVdom = parentRenderer(mainValue, [...childrenVdomPairs])

    const renderValue = ImmutableMap()
      .set('main', mainValue)
      .set('children', childrenValues)

    return [mainVdom, renderValue]
  })

  mainVdomSignal.isVdomSignal = true

  return mainVdomSignal
}
