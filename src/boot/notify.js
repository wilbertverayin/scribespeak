'use strict'

import { Notify } from 'quasar'

const closeBtn = '✖'

/**
 * Usage for notify plugin
 *
 * Add to quasar.conf.js
 *  plugins: ['freedom-notify]
 *
 * @example
 * this.$notify.success('successfully-created')
 */

export default ({ Vue }) => {
  Notify.setDefaults({
    position: 'top-right',
    timeout: 5000,
    textColor: 'white'
  })

  const notifyHandlers = {
    success: (message) => Notify.create({
      color: 'positive',
      message,
      closeBtn
    }),
    error: (message) => Notify.create({
      color: 'negative',
      message,
      closeBtn
    }),
    warning: (message) => Notify.create({
      color: 'warning',
      message,
      closeBtn
    }),
    info: (message) => Notify.create({
      color: 'info',
      message,
      closeBtn
    })
  }

  Object.defineProperties(Vue.prototype, {
    $notify: {
      get () {
        return notifyHandlers
      }
    }
  })
}
