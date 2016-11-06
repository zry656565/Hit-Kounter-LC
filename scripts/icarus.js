/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

'use strict'

import Storage from './help/storage.js'
import config from '../lc_config.json'

const cfg = config.prod

let Icarus = {

  APP_ID: cfg.APP_ID,
  APP_KEY: cfg.APP_KEY,

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

    AV.init({
      appId: APP_ID,
      appKey: APP_KEY
    })

    let Page = AV.Object.extend('Page')
      , pageQ = new AV.Query('Page')

    pageQ.equalTo('domain', domain)

    if (options.api.match(/^hk\.page\.get/)) {

      data.pages = data.pages || [{ url: urlWithoutHash }]
      for (let i = 0, n = data.pages.length; i < n; i++) {
        data.pages[i].count = 0
      }

      let handleGetRequest = function(results) {
        switch(options.api) {
          case 'hk.page.get':
            let hashMap = {}
            for (let i = 0, n = results.length; i < n; i++) {
              hashMap[results[i].url] = results[i]
            }
            let result = []
            for (let i = 0, n = data.pages.length; i < n; i++) {
              let page = hashMap[data.pages[i].url]
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
      }

      let cachePages = Storage.get('Icarus.pages');
      if (cachePages) {
        handleGetRequest(cachePages)
      } else {
        pageQ.find().then(function(results) {
          results = results.map(function(val) {
            return val.attributes
          })

          Storage.set('Icarus.pages', results)
          handleGetRequest(results)
        }, onerror)
      }

    } else if (options.api.match(/^hk\.site/)) {
      let siteQ = new AV.Query('Site')
      siteQ.equalTo('domain', domain)
      switch(options.api) {
        case 'hk.site.totalView':
          siteQ.first().then(result => success(result.get('count')))
          break
        default:
          invalidAPI()
          break
      }
    } else {
      switch(options.api) {
        case 'hk.page.increment':
          data.url = data.url || urlWithoutHash
          data.title = data.title || document.title

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

            page = page.attributes
            let cachePages = Storage.get('Icarus.pages')
            if (cachePages) {
              for (var i = 0, n = cachePages.length; i < n; i++) {
                if (cachePages[i].url === page.url) {
                  cachePages[i].count = page.count
                  break
                }
              }
              if (i === n) cachePages.push(page)
              Storage.set('Icarus.pages', cachePages, false)
            }
            success(page)

          }).catch(onerror)
          break
        default:
          invalidAPI()
          break
      }
    }
  },

  clearLocalhost(success, error) {
    let {APP_ID, APP_KEY} = this
    AV.initialize(APP_ID, APP_KEY)

    let pageQ = new AV.Query('Page')

    pageQ.startsWith('domain', 'http://localhost')
    pageQ.destroyAll().then(function() {
      console.log('Clear localhost DONE.')
      success()
    }, error)
  },

  importData(domain, data) {
    let {APP_ID, APP_KEY} = this
    AV.initialize(APP_ID, APP_KEY)

    let Page = AV.Object.extend('Page')
      , pages = []
    for (let i = 0, n = data.length; i < n; i++) {
      let page = new Page()
      page.set('domain', domain)
      page.set('url', data[i].url)
      page.set('title', data[i].title)
      page.set('count', data[i].count)
      pages.push(page.save())
    }

    AV.Promise.when.apply(AV.Promise, pages)
      .try(function() {})
      .catch(function(errors) {
        console.log(errors)
      })
  }
}

window.Icarus = Icarus
export default Icarus