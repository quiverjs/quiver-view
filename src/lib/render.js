import { assertVdom } from './assert'

import { metaRenderSignal } from './meta/render'

export const renderSignal = metaRenderSignal({
  assertVdom,
  typeTag: 'isVdomSignal'
})
