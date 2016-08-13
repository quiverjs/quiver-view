import window from 'global/window'

import { timeout } from 'quiver-util/promise'
import { unitEventSignal } from 'quiver-signal'

const promisify = fn =>
  () => new Promise(resolve => fn(resolve))

const nextFrameTimeout = () => timeout(30)

const timerFunction = () => {
  if(window.requestAnimationFrame) {
    return promisify(window.requestAnimationFrame)
  } else {
    return nextFrameTimeout
  }
}

export const renderTickSignal = () => {
  const timer = timerFunction()

  const [signal, eventHandler] = unitEventSignal()

  ;(async () => {
    while(true) {
      await timer()
      eventHandler()
    }
  })()

  return signal
}
