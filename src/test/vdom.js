import test from 'tape'

import { h } from '../lib'
import { equalsDom } from '../lib/tape'

test('vdom test', assert => {
  assert.test('basic test', async assert => {
    const expected = <p>Hello, <span>World</span></p>

    const dom1 = <p>Hello, <span>{'World'}</span></p>
    assert::equalsDom(dom1, expected)

    const array = [
      'Hello, ',
      <span>World</span>
    ]

    const dom2 = <p>{ array }</p>
    assert::equalsDom(dom2, expected)

    const dom3 = <p>Hello, {null}<span>World{undefined}</span></p>
    assert::equalsDom(dom3, expected)

    assert.end()
  })
})
