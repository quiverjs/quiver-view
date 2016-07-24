import { h, renderSignal } from 'quiver-view'
import { constantSignal, valueSignal } from 'quiver-signal'

export const renderNameForm = () => {
  const initialName = 'Guest'
  const [nameSignal, nameSetter] = valueSignal(initialName)

  const onChange = (ev) => {
    const newName = ev.target.value
    nameSetter.setValue(newName)
  }

  const form = constantSignal(
    <div>
      <label for='name-input'>Enter your name:</label>
      <input id='name-input' type='text' value={initialName} oninput={onChange}></input>
    </div>
  )

  return [form, nameSignal]
}
