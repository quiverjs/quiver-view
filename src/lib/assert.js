import isVNode from 'virtual-dom/vnode/is-vnode'

// A value node can be either vnode, null, undefined, or string
const isValueNode = vdom => {
  if(isVNode(vdom)) return true
  if(vdom === null) return true
  if(vdom === undefined) return true
  if(typeof(vdom) === 'string') return true

  return false
}

export const assertVdoms = vdoms => {
  for(const vdom of vdoms) {
    if(!isValueNode(vdom)) {
      throw new TypeError('object must be virtual dom object')
    }
  }
}

export const assertVdom = vdom => {
  if(isValueNode(vdom)) return

  if(vdom[Symbol.iterator]) {
    assertVdoms(vdom)
  } else {
    throw new TypeError('object must be virtual dom object')
  }
}

// type SPV a = Signal Pair Vdom a
export const assertSpva = spva => {
  if(!spva.isQuiverSpva)
    throw new TypeError('signal must be vdom signal')
}
