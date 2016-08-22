import html from 'vdom-to-html'
import { equalsDom as isEqualDom } from './equal'

export const equalsDom = function(actual, expected, message='should be equal dom') {
  const [actualVdom] = actual
  const isSame = isEqualDom(actualVdom, expected)

  this._assert(isSame, {
    message,
    operator: 'equalsDom',
    actual: html(actualVdom),
    expected: html(expected)
  })
}
