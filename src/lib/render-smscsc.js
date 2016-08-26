import { renderScsa } from './render-scsa'
import { renderSmScpvc } from './render-smscpvc'

// renderSmScsc ::
//     Signal main ->
//     Signal Container Signal child ->
//     (Signal child -> Signal (Pair Vdom child)) ->
//     (main -> Container Pair Vdom Child -> Vdom) ->
//     Signal Pair Vdom (Pair main (Container child))
export const renderSmScsc =
  (sm, scsc, scRenderer, mCpvcRenderer) =>
{
  // sm :: Signal main
  // scsc :: Signal Container Signal child
  // scRenderer :: Signal child -> Signal Pair Vdom child
  // mCpvcRenderer :: main -> Container Pair Vdom child -> Vdom

  // renderScsca ::
  //     Signal Container Signal a ->
  //     (Signal a -> Signal (Pair Vdom a)) ->
  //     Signal Container Pair Vdom a

  // scpvc :: Signal Container Pair Vdom child
  const scpvc = renderScsa(scsc, scRenderer)

  // renderSmScspvc ::
  //     Signal main ->
  //     Signal Container Pair Vdom child ->
  //     (main -> Container Pair Vdom Child -> Vdom) ->
  //     Signal Pair Vdom (Pair main (Container child))

  // spvPmcc :: Signal Pair Vdom (Pair main (Container child))
  const spvPmcc = renderSmScpvc(sm, scpvc, mCpvcRenderer)

  return spvPmcc
}
