import html from 'vdom-to-html'
import { equalsDom as isEqualDom } from './equal'

export const equalsDom = function(actualVdom, expected, message='should be equal dom') {
  const isSame = isEqualDom(actualVdom, expected)

  this._assert(isSame, {
    message,
    operator: 'equalsDom',
    actual: html(actualVdom),
    expected: html(expected)
  })
}
