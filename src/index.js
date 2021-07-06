import logMessage from './js/logger'
import './style.css'
import './gui.js'
// Log message to console
logMessage('Its finished!!')

if (module.hot)       // eslint-disable-line no-undef
  module.hot.accept() // eslint-disable-line no-undef

  