import test from 'tape'

import { asyncTest } from 'quiver-util/tape'
import { valueSignal } from 'quiver-signal'
import { subscribeChannel } from 'quiver-signal/method'

import { equalsDom } from '../lib/tape'
import { h, renderSignal } from '../lib'

test('signal render test', assert => {
  assert::asyncTest('basic render test', async assert => {
    const [nameSignal, nameSetter] = valueSignal('John')

    // spva :: Signal Pair Vdom a
    const spva = renderSignal(nameSignal, name => {
      return <span>Hello, {name}</span>
    })

    const [dom1] = spva.currentValue()
    const expectedDom1 = <span>Hello, John</span>

    assert::equalsDom(dom1, expectedDom1,
      'virtual doms should be the same')

    // cpva :: Channel Pair Vdom a
    const cpva = spva::subscribeChannel()

    nameSetter.setValue('Smith')
    const [dom2] = await cpva.nextValue()
    const expectedDom2 = <span>Hello, Smith</span>

    assert::equalsDom(dom2, expectedDom2)

    assert.end()
  })
})
