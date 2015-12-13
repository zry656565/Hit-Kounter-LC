/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

'use strict'

let Pheonix = {

  SERVER: 'http://localhost',
  ACCEPTOR: '/auroth.php',
  id: 0,
  callbacks: {},

  request(options = { api: '' }) {
    let {SERVER, ACCEPTOR, callbacks, jsonp} = this
    options.success = options.success || function(){}
    options.failure = options.failure || function(){}
    if (!options.api) {
      options.failure({
        code: 400,
        message: 'Please set the api name.'
      })
    }
    if (options.api.match(/hk\.page/)) options.domain = location.host
    switch(options.api) {
      case 'hk.page.increment':
      case 'hk.page.get':
        options.url = options.url || location.href
        break
    }
    let callbackName = 'c' + this.id++
    callbacks[callbackName] = function(code, result) {
      if (code == 0) { options.success(result) }
      else { options.failure(code, result) }
    }
    options.callback = 'Pheonix.callbacks.' + callbackName
    jsonp(SERVER + ACCEPTOR, options)
  },

  jsonp(url, args) {
    let head = document.head
      , script = document.createElement("script")
      , first = true
      , value

    for (let key in args) {
      if (args.hasOwnProperty(key)) {
        value = encodeURIComponent(args[key])
        url += first ? ('?' + key + '=' + value) : ('&' + key + '=' + value)
        first = false
      }
    }
    script.src= url
    head.appendChild(script)
  }
}

window.Pheonix = Pheonix
export default Pheonix