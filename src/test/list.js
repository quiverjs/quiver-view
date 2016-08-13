import test from 'tape'

import { asyncTest } from 'quiver-util/tape'
import { ImmutableList } from 'quiver-util/immutable'

import { valueSignal } from 'quiver-signal'
import { subscribeChannel } from 'quiver-signal/method'

import { equalsDom } from '../lib/tape'
import { h, renderSignal, renderListSignal } from '../lib'

test('render signal list test', assert => {
  assert::asyncTest('basic children render', async assert => {
    const [mainSignal, mainSetter] = valueSignal('party')

    const [signal1, setter1] = valueSignal('pasta')
    const [signal2, setter2] = valueSignal('noodle')
    const [signal3] = valueSignal('drink')

    const [listSignal, listSetter] = valueSignal(ImmutableList(
      [signal1, signal2]))

    const renderChild = childSignal =>
      renderSignal(childSignal, value =>
        <div className='child'>{value}</div>)

    const renderMain = (mainValue, childrenDoms) =>
      <div className='main'>
        <h1>{mainValue}</h1>
        <div className='children'>
          {childrenDoms}
        </div>
      </div>

    const domSignal = renderListSignal(mainSignal, listSignal, renderChild, renderMain)

    const expected1 =
      <div className='main'>
        <h1>party</h1>
        <div className='children'>
          <div className='child'>pasta</div>
          <div className='child'>noodle</div>
        </div>
      </div>

    assert::equalsDom(domSignal.currentValue(), expected1)

    const domChannel = domSignal::subscribeChannel()

    setter1.setValue('bolognese')

    const expected2 =
      <div className='main'>
        <h1>party</h1>
        <div className='children'>
          <div className='child'>bolognese</div>
          <div className='child'>noodle</div>
        </div>
      </div>

    assert::equalsDom(await domChannel.nextValue(), expected2)

    listSetter.setValue(ImmutableList([signal3, signal1]))

    const expected3 =
      <div className='main'>
        <h1>party</h1>
        <div className='children'>
          <div className='child'>drink</div>
          <div className='child'>bolognese</div>
        </div>
      </div>

    assert::equalsDom(await domChannel.nextValue(), expected3)

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

    assert::equalsDom(await domChannel.nextValue(), expected4)

    listSetter.setValue(ImmutableList([signal2, signal1, signal3]))

    const expected5 =
      <div className='main'>
        <h1>birthday</h1>
        <div className='children'>
          <div className='child'>hokkien mee</div>
          <div className='child'>bolognese</div>
          <div className='child'>drink</div>
        </div>
      </div>

    assert::equalsDom(await domChannel.nextValue(), expected5)

    assert.end()
  })
})
