import { map } from 'quiver-signal/method'
import { assertFunction } from 'quiver-util/assert'
import { ImmutableMap } from 'quiver-util/immutable'
import { assertSignal, flattenCsa } from 'quiver-signal'

// renderSmScspvc ::
//     Signal main ->
//     Signal Container Pair Vdom child ->
//     (main -> Container Pair Vdom Child -> Vdom) ->
//     Signal Pair Vdom (Pair main (Container child))
export const renderSmScpvc = (sm, scpvc, mCpvcRenderer) => {
  // sm :: Signal main
  // scpvc :: Signal Container Pair Vdom child
  // mCpvcRenderer :: main -> Container Pair Vdom child -> Vdom

  assertSignal(sm)
  assertFunction(mCpvcRenderer)

  // pSmScpvc :: Pair (Signal main) (Signal Container Pair Vdom child)
  const pSmScpvc = ImmutableMap()
    .set('main', sm)
    .set('cpvc', scpvc)

  // flattenCsa :: Container Signal a -> Signal Container a
  // spmCpvc :: Signal Pair main (Container Pair Vdom child)
  const spmCpvc = flattenCsa(pSmScpvc)

  // spvPmcc :: Signal Pair Vdom (Pair main (Container child))
  const spvPmcc = spmCpvc::map(pmCpvc => {
    // pmCpvc :: Pair main (Container Pair Vdom child)

    // main :: main
    const main = pmCpvc.get('main')

    // cpvc :: Container Pair Vdom child
    const cpvc = pmCpvc.get('cpvc')

    // mainVdom :: Vdom
    const mainVdom = mCpvcRenderer(main, cpvc)

    // cc :: Container child
    const cc = cpvc.map(
      ([vdom, value]) => value)

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
