import { createSignal, safeValue } from 'quiver-signal'

export const sampleSignal = (tickSignal, targetSignal) => {
  const [initialError, initialValue] = targetSignal::safeValue()
  const [resultSignal, setter] = createSignal({ initialValue, initialError })

  ;(async () => {
    while(true) {
      try {
        await Promise.all([targetSignal.waitNext(), tickSignal.waitNext()])
        const value = targetSignal.currentValue()
        setter.setValue(value)
      } catch(err) {
        setter.setError(err)
      }
    }
  })()

  return resultSignal
}
