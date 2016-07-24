import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import createElement from 'virtual-dom/create-element'

import process from 'process'
import window from 'global/window'

const promisify = fn =>
  () => new Promise(resolve => fn(resolve))

const nextTick = promisify(window.requestAnimationFrame || process.nextTick)

export const mountVdom = async (container, vdomSignal) => {
  let currentVdom = vdomSignal.currentValue()
  let currentDom = createElement(currentVdom)

  container.appendChild(currentDom)

  while(true) {
    await Promise.all([nextTick(), vdomSignal.waitNext()])

    try {
      const vdom = vdomSignal.currentValue()

      const patches = diff(currentVdom, vdom)
      currentDom = patch(currentDom, patches)
      currentVdom = vdom

    } catch(err) {
      console.error(err)
    }
  }
}
