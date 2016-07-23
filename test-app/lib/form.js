import { h, renderSignal } from 'quiver-view'
import { valueSignal } from 'quiver-signal'

export const renderNameForm = () => {
  const [nameSignal, nameSetter] = valueSignal('Guest')

  const onSubmit = (ev) => {
    const input = document.getElementById('name-input')
    nameSetter.setValue(input.value)
  }

  const [form] = valueSignal(
    <div>
      <label for='name-input'>Enter your name:</label>
      <input id='name-input' type='text'></input>
      <button onclick={onSubmit}>Submit</button>
    </div>
  )

  return [form, nameSignal]
}
