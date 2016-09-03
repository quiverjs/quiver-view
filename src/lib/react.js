import React from 'react'
import { ImmutableMap } from 'quiver-util/immutable'
import { listen } from 'quiver-signal/method'

const SpvaElement = React.createClass({
  getState() {
    return this.state.state
  },

  updateState(newState) {
    this.setState({ state: newState })
  },

  getInitialState() {
    try {
      const [vdom] = this.props.spva.currentValue()
      return {
        state: ImmutableMap({ vdom })
      }
    } catch(err) {
      Promise.reject(err)
      return {
        state: ImmutableMap()
      }
    }
  },

  render() {
    return this.getState().get('vdom')
  },

  componentDidMount() {
    const unsubscribe = this.props.spva::listen(
      pva => {
        const [vdom] = pva
        const state = this.getState()
        const newState = state.set('vdom', vdom)
        this.updateState(newState)
      })

    const state = this.getState()
    const newState = state.set('unsubscribe')
    this.updateState(newState)
  },

  componentWillUnmount() {
    const state = this.getState()
    const unsubscribe = state.get('unsubscribe')
    if(!unsubscribe) return

    unsubscribe()
    const newState = state.delete('unsubscribe')
    this.updateState(newState)
  }
})

// spvaToReactElement :: Signal Pair Vdom a -> ReactElement
export const spvaToReactElement = spva =>
  React.createElement(SpvaElement, { spva })
