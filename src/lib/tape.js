import html from 'vdom-to-html'
import { equalsDom as isEqualDom } from './equal'

export const equalsDom = function(actual, expected, message='should be equal dom') {
  const isSame = isEqualDom(actual, expected)

  this._assert(isSame, {
    message,
    operator: 'equalsDom',
    actual: html(actual),
    expected: html(expected)
  })
}
