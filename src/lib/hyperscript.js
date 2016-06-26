import _h from 'virtual-dom/h'

// Hack to make the transpiled JSX syntax to be
// compatible with virtual-dom's API, which expects
// children elements to be passed as array.
export const h = (element, props, ...children) =>
  _h(element, props, children)
