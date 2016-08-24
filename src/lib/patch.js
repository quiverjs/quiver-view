import diff from 'virtual-dom/diff'
import { createSignal, safeValue } from 'quiver-signal'
import { subscribeGenerator } from 'quiver-signal/method'
import { assertVdomSignal } from './assert'

export const patchSignal = vdomSignal => {
  const [ initialError, [initialVdom] ] = vdomSignal::safeValue()
  const [resultSignal, setter] = createSignal({
    initialError,
    initialValue: [initialVdom, {}]
  })

  vdomSignal::subscribeGenerator(function*() {
    let currentVdom = initialVdom

    while(true) {
      try {
        const [vdom] = yield
        const patch = diff(currentVdom, vdom)
        currentVdom = vdom
        setter.setValue([vdom, patch])

      } catch(err) {
        setter.setError(err)
      }
    }
  })

  return resultSignal
}
