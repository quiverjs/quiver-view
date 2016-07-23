import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import createElement from 'virtual-dom/create-element'

import { subscribeGenerator } from 'quiver-signal/method'

export const mountVdom = (container, vdomSignal) => {
  const initialVdom = vdomSignal.currentValue()
  const dom = createElement(initialVdom)

  container.appendChild(dom)

  vdomSignal::subscribeGenerator(function*() {
    let currentDom = dom
    let currentVdom = initialVdom

    while(true) {
      try {
        const vdom = yield

        const patches = diff(currentVdom, vdom)
        currentDom = patch(currentDom, patches)
        currentVdom = vdom

      } catch(err) {
        console.error(err)
      }
    }
  })
}
