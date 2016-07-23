import { ImmutableMap, extract } from 'quiver-util/immutable'
import { h, combineRender } from 'quiver-view'
import { valueSignal } from 'quiver-signal'

import { renderNameForm } from './form'
import { renderGreet } from './greet'
import { renderCounter } from './counter'

export const renderApp = () => {
  const [formDom, nameSignal] = renderNameForm()
  const greetDom = renderGreet(nameSignal)
  const counterDom = renderCounter()

  const childrenSignals = ImmutableMap({
    form: formDom,
    greet: greetDom,
    counter: counterDom
  })

  const [argsSignal] = valueSignal()

  return combineRender(argsSignal, childrenSignals,
    (args, children) => {
      const { form, greet, counter } = children::extract()

      return (
        <div id='app'>
          { greet }
          { form }
          { counter }
        </div>
      )
    })
}
