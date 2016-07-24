import test from 'tape'

import { asyncTest } from 'quiver-util/tape'
import { valueSignal } from 'quiver-signal'
import { subscribeChannel } from 'quiver-signal/method'

import { equalsDom } from '../lib/tape'
import { h, renderSignal, renderListSignal } from '../lib'

test('signal render test', assert => {
  assert::asyncTest('basic render test', async assert => {
    const [nameSignal, nameSetter] = valueSignal('John')

    const domSignal = renderSignal(nameSignal, name => {
      return <span>Hello, {name}</span>
    })

    const resultDom1 = domSignal.currentValue()
    const expectedDom1 = <span>Hello, John</span>

    assert::equalsDom(resultDom1, expectedDom1,
      'virtual doms should be the same')

    const domChannel = domSignal::subscribeChannel()

    nameSetter.setValue('Smith')
    const resultDom2 = await domChannel.nextValue()
    const expectedDom2 = <span>Hello, Smith</span>

    assert::equalsDom(resultDom2, expectedDom2)

    assert.end()
  })
})
