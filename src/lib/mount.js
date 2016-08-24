import patchDom from 'virtual-dom/patch'
import createElement from 'virtual-dom/create-element'
import { subscribeGenerator } from 'quiver-signal/method'

import { renderTickSignal } from './tick'
import { sampleSignal } from './sample'
import { patchSignal } from './patch'

export const mountVdom = async (container, vdomSignal) => {
  const tickSignal = renderTickSignal()
  const sampledSignal = sampleSignal(tickSignal, vdomSignal)

  const patchedSignal = patchSignal(sampledSignal)

  let [currentVdom] = patchedSignal.currentValue()

  let currentDom = createElement(currentVdom)
  container.appendChild(currentDom)

  patchedSignal::subscribeGenerator(function*() {
    while(true) {
      try {
        const [, patch] = yield
        currentDom = patchDom(currentDom, patch)

      } catch(err) {
        Promise.reject(err)
      }
    }
  })
}
