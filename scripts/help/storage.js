/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

import utils from './utils'

let Storage = {
  EXPIRE_TIME: 300,  // 5 minutes

  isSupported: (function() {
    if (utils.urlParams['storage'] === 'false') return false
    return !!localStorage
  }()),

  has(key) {
    if (!this.isSupported) return false
    let createdTime = localStorage[`${key}__created_time`]
    return createdTime && parseFloat(createdTime) < Date.now() + this.EXPIRE_TIME * 1000
  },

  get(key) {
    if (!this.isSupported) return false
    return this.has(key) ? JSON.parse(localStorage[key]) : undefined
  },

  set(key, val) {
    if (!this.isSupported) return false
    localStorage[key] = JSON.stringify(val)
    localStorage[`${key}__created_time`] = Date.now()
  },

  remove(key) {
    if (!this.isSupported) return false
    return localStorage.removeItem(key)
  },

  clear() {
    if (!this.isSupported) return false
    return localStorage.clear()
  }
}

export default Storage