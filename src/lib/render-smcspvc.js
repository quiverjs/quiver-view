import { map } from 'quiver-signal/method'
import { assertSignal, flattenCsa } from 'quiver-signal'
import { ImmutableMap, isImmutableMap } from 'quiver-util/immutable'

const $main = Symbol('@main')

// renderSmCspvc ::
//     Signal main ->
//     Container Signal Pair Vdom child ->
//     (main -> Container Pair Vdom child -> Vdom) ->
//     Signal Pair Vdom (Pair main (Container child))
export const renderSmCspvc = (mainSignal, cspvc, mCpvcRenderer) => {
  // mainSignal :: Signal main
  // cspvc :: Container Signal Pair Vdom child
  // mCpvcRenderer :: main -> Container Pair Vdom child -> Vdom
  assertSignal(mainSignal)

  if(!isImmutableMap(cspvc))
    throw new TypeError('cspvc must be immutable Map')

  // pSmCspvc :: Pair (Signal main) (Container Signal Pair Vdom child)
  const pSmCspvc = cspvc.set($main, mainSignal)

  // flattenCsa :: Container Signal a -> Signal Container a
  // spmCpvc :: Signal Pair main (Container Pair Vdom child)
  const spmCpvc = flattenCsa(pSmCspvc)

  // spvPmcc :: Signal Pair Vdom (Pair main (Container child))
  const spvPmcc = spmCpvc::map(pmCpvc => {
    // pmCpvc :: Pair main (Container Pair Vdom child)

    // main :: main
    const main = pmCpvc.get($main)

    // cpvc :: Container Pair Vdom child
    const cpvc = pmCpvc.delete($main)

    // mainVdom :: Vdom
    const mainVdom = mCpvcRenderer(main, cpvc)

    // cc :: Container child
    const cc = cpvc.map(([vdom, value]) => value)

    // pmcc :: Pair main (Container child)
    const pmcc = ImmutableMap()
      .set('main', main)
      .set('children', cc)

    // pvPmcc :: Pair Vdom (Pair main (Container child))
    const pvPmcc = [mainVdom, pmcc]

    return pvPmcc
  })

  spvPmcc.isQuiverSpva = true

  return spvPmcc
}
