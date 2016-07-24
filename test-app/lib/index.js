import 'babel-polyfill'

import { renderApp } from './app'
import { mountVdom } from 'quiver-view'

const vdomSignal = renderApp()
mountVdom(document.body, vdomSignal)
