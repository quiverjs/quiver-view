import html from 'vdom-to-html'
import diff from 'virtual-dom/diff'

export const equalsDom = function(actual, expected, message='should be equal dom') {
  const patches = diff(expected, actual)
  const patchKeys = Object.keys(patches)

  let isSame = false

  if(patchKeys.length === 1 && patches.a) {
    isSame = true
  } else if(patchKeys.length === 0) {
    isSame = true
  }

  this._assert(isSame, {
    message,
    operator: 'equalsDom',
    actual: html(actual),
    expected: html(expected)
  })
}
