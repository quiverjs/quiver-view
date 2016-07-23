import _h from 'virtual-dom/h'

// Concatenate child nodes if they are adjacent strings.
// This is to allow easy comparison of expected and actual
// VDOMs during testing, as it suppress patches that
// just move around text nodes.
const joinStrings = function*(nodes) {
  let lastStringNode = null
  for(const node of nodes) {
    if(typeof(node) === 'string') {
      if(lastStringNode === null) {
        lastStringNode = node
      } else {
        lastStringNode = lastStringNode + node
      }
    } else {
      if(lastStringNode !== null) {
        yield lastStringNode
        lastStringNode = null
      }
      yield node
    }
  }

  if(lastStringNode !== null) {
    yield lastStringNode
  }
}

const flattenArray = arrays =>
  Array.prototype.concat.apply([], arrays)

// Hack to make the transpiled JSX syntax to be
// compatible with virtual-dom's API, which expects
// children elements to be passed as array.
export const h = (element, props, ...children) => {
  const joinedChildren = [...joinStrings(children)]

  return _h(element, props, joinedChildren)
}
