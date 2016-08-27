import test from 'tape'
import { asyncTest } from 'quiver-util/tape'

import { valueSignal } from 'quiver-signal'
import { ImmutableMap } from 'quiver-util/immutable'
import { subscribeChannel } from 'quiver-signal/method'

import { equalsDom } from '../lib/tape'
import { h, renderSignal, renderSmCspvc } from '../lib'

test('render Signal main Container Signal Pair Vdom child', assert => {
  assert::asyncTest('basic renderSmCspvc', async assert => {
    const [signal1, setter1] = valueSignal('foo')
    const [signal2, setter2] = valueSignal('bar')
    const [signal3, setter3] = valueSignal('Hello World')

    // spva1 :: Signal Pair Vdom a
    const spva1 = renderSignal(signal1, value =>
      <div className='foo'>
        <h2>Foo Section</h2>
        <p>Foo Value: {value}</p>
      </div>
    )

    const spva2 = renderSignal(signal2, value =>
      <div className='bar'>
        <h2>Bar Section</h2>
        <p>Bar Value: {value}</p>
      </div>
    )

    // cspva :: Container Signal Pair Vdom a
    const cspva = ImmutableMap({
      foo: spva1,
      bar: spva2
    })

    const mainSpva = renderSmCspvc(signal3, cspva,
      (mainValue, childrenCpvc) => {
        // childrenCpvc :: Container Pair Vdom a
        const [fooDom] = childrenCpvc.get('foo')
        const [barDom] = childrenCpvc.get('bar')

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

    const [dom1] = mainSpva.currentValue()
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

    // cpva :: Channel Pair Vdom a
    const cpva = mainSpva::subscribeChannel()

    setter1.setValue('Food is delicious!')
    setter2.setValue('Bara bara')

    const [dom2] = await cpva.nextValue()
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

    const [dom3] = await cpva.nextValue()
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

    setter3.setValue('Good luck')

    const [dom4] = await cpva.nextValue()
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
