// import { uncurry } from 'quiver-util/function'
import { ImmutableMap } from 'quiver-util/immutable'

import { map } from 'quiver-signal/method'
import { combineSignals } from 'quiver-signal'

// viewHandler :: (args -> VDOM) -> Signal args -> Signal VDOM
export const viewHandler = renderer => signal => {
  return signal::map(renderer)
}

export const renderSignal = (renderer, signal) =>
  signalHandler(renderer)(signal)

// combineRender :: (Map VDOM -> args -> VDOM) ->
//   Map Signal VDOM -> Signal args -> Signal VDOM
export const combineRender = (mainRenderer, childrenMap) => {
  const combinedVdomSignal = combineSignals(childrenMap)

  return mainSignal => {
    const combinedSignalMap = ImmutableMap()
      .set('vdomMap', combinedVdomSignal)
      .set('args', mainSignal)

    const combinedSignal = combineSignals(combinedSignalMap)

    return combinedSignal::map(valueMap => {
      const vdomMap = valueMap.get('vdomMap')
      const args = valueMap.get('args')

      return mainRenderer(vdomMap, args)
    })
  }
}
