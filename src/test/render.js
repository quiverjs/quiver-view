import test from 'tape'

import diff from 'virtual-dom/diff'
import html from 'vdom-to-html'

import { ImmutableMap } from 'quiver-util/immutable'
import { asyncTest } from 'quiver-util/tape'
import { valueSignal } from 'quiver-signal'

import { h } from '../lib/hyperscript'
import { viewHandler } from '../lib/render'

test('signal render test', assert => {
  assert::asyncTest('basic render test', async assert => {
    const greetHandler = viewHandler(name => {
      return <span>Hello, {name}</span>
    })

    const [argsSignal, argsSetter] = valueSignal('John')

    const VdomSignal = greetHandler(argsSignal)

    const resultDom1 = VdomSignal.currentValue()
    const expectedDom1 = <span>Hello, {'John'}</span>

    const patches = diff(expectedDom1, resultDom1)
    console.log('result:', html(resultDom1))
    console.log('expected:', html(expectedDom1))
    console.log('dom diff:', patches)

    assert.end()
  })
})
