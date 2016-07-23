import diff from 'virtual-dom/diff'

export const equalsDom = (dom1, dom2) => {
  const patches = diff(dom1, dom2)
  const patchKeys = Object.keys(patches)

  if(patchKeys.length === 1 && patches.a) {
    return true
  } else if(patchKeys.length === 0) {
    return true
  }

  return false
}
