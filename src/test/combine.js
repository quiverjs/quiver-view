import test from 'tape'
import { asyncTest } from 'quiver-util/tape'

import { valueSignal } from 'quiver-signal'
import { ImmutableMap } from 'quiver-util/immutable'
import { subscribeChannel } from 'quiver-signal/method'

import { h } from '../lib/hyperscript'
import { equalsDom } from '../lib/assert'
import { renderSignal } from '../lib/render'
import { combineRender } from '../lib/combine'

test('signal render test', assert => {
  assert::asyncTest('combine render test', async assert => {
    const [signal1, setter1] = valueSignal('foo')
    const [signal2, setter2] = valueSignal('bar')
    const [signal3, setter3] = valueSignal('Hello World')

    const domSignal1 = renderSignal(signal1, value =>
      <div className='foo'>
        <h2>Foo Section</h2>
        <p>Foo Value: {value}</p>
      </div>
    )

    const domSignal2 = renderSignal(signal2, value =>
      <div className='bar'>
        <h2>Bar Section</h2>
        <p>Bar Value: {value}</p>
      </div>
    )

    const signalMap = ImmutableMap({
      foo: domSignal1,
      bar: domSignal2
    })

    const mainSignal = combineRender(signal3, signalMap,
      (mainValue, childrenMap) => {
        const fooDom = childrenMap.get('foo')
        const barDom = childrenMap.get('bar')

        return (
          <main>
            { fooDom }
            <div className='main-content'>
              <h1>Main Content</h1>
              <p>{ mainValue }</p>
            </div>
            { barDom }
          </main>
        )
      })

    const dom1 = mainSignal.currentValue()
    const expected1 =
      <main>
        <div className='foo'>
          <h2>Foo Section</h2>
          <p>Foo Value: foo</p>
        </div>
        <div className='main-content'>
          <h1>Main Content</h1>
          <p>Hello World</p>
        </div>
        <div className='bar'>
          <h2>Bar Section</h2>
          <p>Bar Value: bar</p>
        </div>
      </main>

    assert::equalsDom(dom1, expected1)

    const domChannel = mainSignal::subscribeChannel()

    setter1.setValue('Food is delicious!')
    setter2.setValue('Bara bara')
    setter3.setValue('Good luck')

    const dom2 = await domChannel.nextValue()
    const expected2 =
      <main>
        <div className='foo'>
          <h2>Foo Section</h2>
          <p>Foo Value: Food is delicious!</p>
        </div>
        <div className='main-content'>
          <h1>Main Content</h1>
          <p>Hello World</p>
        </div>
        <div className='bar'>
          <h2>Bar Section</h2>
          <p>Bar Value: bar</p>
        </div>
      </main>

    assert::equalsDom(dom2, expected2)

    const dom3 = await domChannel.nextValue()
    const expected3 =
      <main>
        <div className='foo'>
          <h2>Foo Section</h2>
          <p>Foo Value: Food is delicious!</p>
        </div>
        <div className='main-content'>
          <h1>Main Content</h1>
          <p>Hello World</p>
        </div>
        <div className='bar'>
          <h2>Bar Section</h2>
          <p>Bar Value: Bara bara</p>
        </div>
      </main>

    assert::equalsDom(dom3, expected3)

    const dom4 = await domChannel.nextValue()
    const expected4 =
      <main>
        <div className='foo'>
          <h2>Foo Section</h2>
          <p>Foo Value: Food is delicious!</p>
        </div>
        <div className='main-content'>
          <h1>Main Content</h1>
          <p>Good luck</p>
        </div>
        <div className='bar'>
          <h2>Bar Section</h2>
          <p>Bar Value: Bara bara</p>
        </div>
      </main>

    assert::equalsDom(dom4, expected4)

    assert.end()
  })
})
