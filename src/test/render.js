import test from 'tape'

import html from 'vdom-to-html'

import { ImmutableMap } from 'quiver-util/immutable'
import { asyncTest } from 'quiver-util/tape'
import { valueSignal } from 'quiver-signal'

import { h } from '../lib/hyperscript'
import { equalsDom } from '../lib/assert'
import { viewHandler } from '../lib/render'

test('signal render test', assert => {
  assert::asyncTest('basic render test', async assert => {
    const greetHandler = viewHandler(name => {
      return <span>Hello, {name}</span>
    })

    const [argsSignal, argsSetter] = valueSignal('John')

    const VdomSignal = greetHandler(argsSignal)

    const resultDom1 = VdomSignal.currentValue()
    const expectedDom1 = <span>Hello, John</span>

    assert::equalsDom(resultDom1, expectedDom1,
      'virtual doms should be the same')

    assert.end()
  })
})
