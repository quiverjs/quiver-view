import { h, renderSignal } from 'quiver-view'
import { eventSignal } from 'quiver-signal'
import { foldp } from 'quiver-signal/method'

export const renderCounter = () => {
  const [clickSignal, clickHandler] = eventSignal()

  const counterSignal = clickSignal::foldp(
    (count, action) => {
      if(action === 'increment') {
        return count+1
      } else if(action === 'decrement') {
        return count-1
      } else {
        return count
      }
    }, 0)

  const incrementClicked = () => clickHandler('increment')
  const decrementClicked = () => clickHandler('decrement')

  return renderSignal(counterSignal, count =>
    <div>
      <p>Counter Value: <span>{count}</span></p>
      <button onclick={incrementClicked}>Increment</button>
      <button onclick={decrementClicked}>Decrement</button>
    </div>
  )
}
