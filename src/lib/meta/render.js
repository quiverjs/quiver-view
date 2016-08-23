import { map } from 'quiver-signal/method'
import { assertFunction } from 'quiver-util/assert'

export const metaRenderSignal = (typeClassInstance) => {
  const {
    assertVdom,
    typeTag
  } = typeClassInstance

  // renderSignal :: Signal args -> (args -> VDOM) -> Signal VDOM
  return (signal, renderer) => {
    assertFunction(renderer)

    const vdomSignal = signal::map(value => {
      const vdom = renderer(value)

      assertVdom(vdom)
      return [vdom, value]
    })

    vdomSignal[typeTag] = true

    return vdomSignal
  }
}
