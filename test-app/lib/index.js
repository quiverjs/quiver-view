import 'babel-polyfill'

import { renderApp } from './app'
import { mountVdom } from './mount'

const vdomSignal = renderApp()
mountVdom(document.body, vdomSignal)
