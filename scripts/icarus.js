/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

'use strict'

import AV from 'leancloud-storage'

import Storage from './help/storage.js'
import lcConfig from '../lc-config.json'

window.AV = AV

let Icarus = {

  init() {
    let config = window.ICARUS_CONFIG;
    if (config) {
      if (!config.appId || !config.appKey || !config.serverURL) {
        console.warning('ICARUS_CONFIG should have three properties: appId,  appKey, serverURL');
        config = null;
      }
    }
    if (!config) {
      config = NODE_ENV === 'production' ? lcConfig.prod : lcConfig.dev;
    }
    this.config = config;
  },

  request(options = { api: '' }) {
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

    AV.init(this.config)

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
          siteQ.first().then(function(result) {
            success(result ? result.get('count'): 0)
          })
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
          pageQ.find().then(function(results) {
            if (results.length <= 0) {
              return (new Page()).save({
                domain: domain,
                url: data.url,
                title: data.title,
                count: 0
              });
            } else {
              return Promise.resolve(results[0])
            }

          }).then(function(page) {

            page.increment('count')
            return page.save()

          }).then(function(page) {

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
    AV.init(this.config)

    const USERNAME = 'admin'
    const PASSWORD = 'admin0035'

    AV.User.logIn(USERNAME, PASSWORD).then(function (loginedUser) {
      let pageQ = new AV.Query('Page')

      pageQ.startsWith('domain', 'http://localhost:8899')

      pageQ.destroyAll().then(function() {
        console.log('Clear localhost DONE.')
        success()
      }, error)

    }, function (error) {
      alert(JSON.stringify(error))
    })
  },

  importData(domain, data) {
    AV.init(this.config)

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
      .then(function() {})
      .catch(function(errors) {
        console.log(errors)
      })
  }
}

Icarus.init()

window.Icarus = Icarus
export default Icarus