import global from 'global'
import { map } from 'quiver-signal/method'
import { assertFunction } from 'quiver-util/assert'
import { assertSignal, flattenScsa } from 'quiver-signal'

const CacheMap = global.WeakMap || global.Map

// renderScsca ::
//     Signal Container Signal a ->
//     (Signal a -> Signal (Pair Vdom a)) ->
//     Signal Container Pair Vdom a
export const renderScsa = (scsa, signalRenderer) => {
  // scsa :: Signal Container Signal a
  // signalRenderer :: Signal a -> Signal (Pair Vdom a)

  assertSignal(scsa)
  assertFunction(signalRenderer)

  // spvaCache :: Map Signal Pair Vdom a
  const spvaCache = new CacheMap()

  // scspva :: Signal Container Signal Pair Vdom child
  const scspva = scsa::map(csa =>
    // csa :: Container Signal a

    csa.map(signal => {
      // signal :: Signal a

      // cachedSpva :: Signal Pair Vdom a
      const cachedSpva = spvaCache.get(signal)
      if(cachedSpva) return cachedSpva

      // spva :: Signal Pair Vdom a
      const spva = signalRenderer(signal)
      spvaCache.set(signal, spva)

      return spva
    }))

  // scpva :: Signal Container Pair Vdom a
  // flattenScsa :: Signal Container Signal a -> Signal Container a
  const scpva = flattenScsa(scspva)

  return scpva
}
