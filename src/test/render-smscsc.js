import test from 'tape'

import { asyncTest } from 'quiver-util/tape'
import { ImmutableList } from 'quiver-util/immutable'

import { valueSignal } from 'quiver-signal'
import { subscribeChannel } from 'quiver-signal/method'

import { equalsDom } from '../lib/tape'
import { h, renderSignal, renderSmScsc } from '../lib'

test('render Signal main Signal Container Signal child', assert => {
  assert::asyncTest('basic renderSmScsc', async assert => {
    const [mainSignal, mainSetter] = valueSignal('party')

    const [signal1, setter1] = valueSignal('pasta')
    const [signal2, setter2] = valueSignal('noodle')
    const [signal3] = valueSignal('drink')

    // slsc :: Signal List Signal child
    const [slsc, slscSetter] = valueSignal(
      ImmutableList([signal1, signal2]))

    const renderChildSignal = childSignal =>
      renderSignal(childSignal, value =>
        <div className='child'>{value}</div>)

    const renderMain = (mainValue, lpvc) => {
      // clpc :: List Pair Vdom child

      const childrenVdoms = [...lpvc.values()]
        .map(([vdom]) => vdom)

      return (
        <div className='main'>
          <h1>{mainValue}</h1>
          <div className='children'>
            {childrenVdoms}
          </div>
        </div>
      )
    }

    // spva :: Signal Pair Vdom a
    const spva = renderSmScsc(mainSignal, slsc, renderChildSignal, renderMain)

    const expected1 =
      <div className='main'>
        <h1>party</h1>
        <div className='children'>
          <div className='child'>pasta</div>
          <div className='child'>noodle</div>
        </div>
      </div>

    const [dom1] = spva.currentValue()
    assert::equalsDom(dom1, expected1)

    // cpva :: Channel Pair Vdom a
    const cpva = spva::subscribeChannel()

    setter1.setValue('bolognese')

    const expected2 =
      <div className='main'>
        <h1>party</h1>
        <div className='children'>
          <div className='child'>bolognese</div>
          <div className='child'>noodle</div>
        </div>
      </div>

    const [dom2] = await cpva.nextValue()
    assert::equalsDom(dom2, expected2)

    slscSetter.setValue(ImmutableList([signal3, signal1]))

    const expected3 =
      <div className='main'>
        <h1>party</h1>
        <div className='children'>
          <div className='child'>drink</div>
          <div className='child'>bolognese</div>
        </div>
      </div>

    const [dom3] = await cpva.nextValue()
    assert::equalsDom(dom3, expected3)

    setter2.setValue('hokkien mee')
    mainSetter.setValue('birthday')

    const expected4 =
      <div className='main'>
        <h1>birthday</h1>
        <div className='children'>
          <div className='child'>drink</div>
          <div className='child'>bolognese</div>
        </div>
      </div>

    const [dom4] = await cpva.nextValue()
    assert::equalsDom(dom4, expected4)

    slscSetter.setValue(ImmutableList([signal2, signal1, signal3]))

    const expected5 =
      <div className='main'>
        <h1>birthday</h1>
        <div className='children'>
          <div className='child'>hokkien mee</div>
          <div className='child'>bolognese</div>
          <div className='child'>drink</div>
        </div>
      </div>

    const [dom5] = await cpva.nextValue()
    assert::equalsDom(dom5, expected5)

    assert.end()
  })
})
