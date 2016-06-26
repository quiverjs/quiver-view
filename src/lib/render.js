import { map } from 'quiver-signal/method'

export const renderSignal = (argsSignal, renderer) => {
  return argsSignal::map(renderer)
}
