/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

'use strict'

import utils from './utils.js'

let Icarus = {

  APP_ID: 'yzbpXQpXf1rWVRfAAM8Durgh-gzGzoHsz',
  APP_KEY: '020bjTvbiVinVQ21YtWAJ9t8',

  request(options = { api: '' }) {
    let {APP_ID, APP_KEY} = this
    let {success, failure, data} = options
    success = success || function(){}
    failure = failure || function(){}
    data = data || {}

    function onerror(error) {
      failure(error.code, error)
    }

    function invalidAPI() {
      failure(401, {
        code: 401,
        message: 'Unsupported API.'
      })
    }

    if (!options.api) {
      failure(400, {
        code: 400,
        message: 'Please set the api name.'
      })
    }

    let urlWithoutHash = location.href.replace(/#.*$/, '').replace(/\?.*$/, '')
      , domain = location.origin || `${location.protocol}//${location.host}`

    AV.initialize(APP_ID, APP_KEY)
    let Page = AV.Object.extend('Page')
      , pageQ = new AV.Query('Page')

    if (options.api.match(/^hk\.page\.get/)) {

      data.pages = data.pages || [{ url: urlWithoutHash }]
      for (let i = 0, n = data.pages.length; i < n; i++) {
        data.pages[i].count = 0
      }

      pageQ.equalTo('domain', domain)
      pageQ.find().try(function(results) {
        results = results.map(function(val) {
          return val.attributes
        })
        switch(options.api) {
          case 'hk.page.get':
            let hashMap = new Map()
            for (let i = 0, n = results.length; i < n; i++) {
              hashMap.set(results[i].url, results[i])
            }
            let result = []
            for (let i = 0, n = data.pages.length; i < n; i++) {
              let page = hashMap.get(data.pages[i].url)
              if (page) result.push(page)
              else result.push(data.pages[i])
            }
            success(result)
            break
          case 'hk.page.getByDomain':
            success(results)
            break
          case 'hk.page.getTop':
            results.sort(function(a, b) { return b.count - a.count })
            success(results.slice(0, data.num))
            break
          default:
            invalidAPI()
            break
        }
      }).catch(onerror)

    } else {
      switch(options.api) {
        case 'hk.page.increment':
          data.url = data.url || urlWithoutHash
          data.title = data.title || document.title

          pageQ.equalTo('domain', domain)
          pageQ.equalTo('url', data.url)
          pageQ.find().try(function(results) {

            if (results.length <= 0) {
              return (new Page()).save({
                domain: domain,
                url: data.url,
                title: data.title,
                count: 0
              });
            } else {
              return AV.Promise.as(results[0])
            }

          }).try(function(page) {

            page.increment('count')
            return page.save()

          }).try(function(page) {

            success(page.attributes)

          }).catch(onerror)
          break
        default:
          invalidAPI()
          break
      }
    }
  }
}

window.Icarus = Icarus
export default Icarus