import global from 'global'
import { map } from 'quiver-signal/method'
import { ImmutableMap } from 'quiver-util/immutable'
import { flattenSignal, combineSignals } from 'quiver-signal'

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

  return renderSignal(combinedSignals, valueMap => {
    const mainValue = valueMap.get('main')
    const childrenVdoms = [...valueMap.get('childrenVdoms')]

    return parentRenderer(mainValue, childrenVdoms)
  })
}
