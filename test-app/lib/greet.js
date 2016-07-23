import { h, renderSignal } from 'quiver-view'

export const renderGreet = nameSignal =>
  renderSignal(nameSignal, name =>
    <h2>
      Hello, <span className='name'>{name}</span>
    </h2>
  )
