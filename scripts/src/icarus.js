/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

'use strict'

import utils from './utils.js'

let Icarus = {

  LOCAL_SERVER: 'http://localhost:8080',
  SAE_SERVER: 'http://hitk.applinzi.com',
  ACCEPTOR: '/handler.php',
  uid: 0,
  callbacks: {},

  request(options = { api: '' }) {
    let {LOCAL_SERVER, SAE_SERVER, ACCEPTOR, callbacks, jsonp} = this
    options.success = options.success || function(){}
    options.failure = options.failure || function(){}
    if (!options.api) {
      options.failure(400, {
        code: 400,
        message: 'Please set the api name.'
      })
    }
    // add param `domain` for all APIs like `hk.page.*`
    if (options.api.match(/hk\.page/)) options.domain = location.origin
    let urlWithoutHash = location.href.replace(/#.*$/, '').replace(/\?.*$/, '')
    switch(options.api) {
      case 'hk.page.increment':
        options.url = urlWithoutHash
        options.title = options.title || document.title
        break
      case 'hk.page.get':
        options.pages = options.pages || [{ url: urlWithoutHash, title: document.title }]
        options.pages = JSON.stringify(options.pages)
        break
    }
    let callbackName = 'c' + this.uid++
    callbacks[callbackName] = function(code, result) {
      if (code == 0) { options.success(result) }
      else { options.failure(code, result) }
    }
    options.callback = 'Icarus.callbacks.' + callbackName
    let server = utils.urlParams['env'] == 'local' ? LOCAL_SERVER : SAE_SERVER
    jsonp(server + ACCEPTOR, options)
  },

  jsonp(url, args = {}) {
    let head = document.head
      , script = document.createElement("script")
      , first = true
      , value

    for (let key in args) {
      if (args.hasOwnProperty(key) && typeof args[key] != 'function') {
        value = encodeURIComponent(args[key])
        url += first ? ('?' + key + '=' + value) : ('&' + key + '=' + value)
        first = false
      }
    }
    if (url.length > 1024) {
      options.failure(401, {
        code: 401,
        message: 'The length of request is too long (>1024) to be handled with.'
      })
      return
    }
    script.src= url
    head.appendChild(script)
  }
}

window.Icarus = Icarus
export default Icarus