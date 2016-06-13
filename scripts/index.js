/** @preserve
 * Hit Kounter Help script v0.2.0
 * Home: https://github.com/zry656565/Hit-Kounter
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

'use strict'

import Icarus from './icarus.js'
import DOMReady from './help/ready.js'
import {isEmpty} from './help/utils'

require('../styles/index.less')

let TEMPLATES= {
  TOP_AREA: require('../templates/top-area.jade')
}

let HitKounter = {
  elements: {},
  scan() {
    let e = this.elements
      , pages = document.querySelectorAll('[data-hk-page]')

    e.current = document.querySelectorAll('[data-hk-page=current]')
    e.topArea = document.querySelectorAll('[data-hk-top-pages]')
    e.pages = {}
    for (let i = 0; i < pages.length; ++i) {
      let url = pages[i].attributes['data-hk-page'].value
        , arr = e.pages[url]
      if (url == 'current') { continue }
      if (arr) { arr.push(pages[i]) }
      else { e.pages[url] = [pages[i]] }
    }
  },
  increment() {
    let {elements} = this
    Icarus.request({
      api: 'hk.page.increment',
      v: '1.0',
      success(result) {
        for (let i = 0; i < elements.current.length; ++i) {
          elements.current[i].innerText = result.count
        }
      },
      failure(code, err) { console.log(code, err) }
    })
  },
  getPages() {
    let {elements} = this
    let pages = []

    for (var p in elements.pages) {
      if (elements.pages.hasOwnProperty(p)) {
        pages.push({ url: p })
      }
    }

    Icarus.request({
      api: 'hk.page.get',
      v: '1.0',
      data: { pages: pages },
      success(results) {
        for (let i = 0; i < results.length; ++i) {
          let arr = elements.pages[results[i].url]
          for (let j = 0; j < arr.length; ++j) {
            arr[j].innerText = results[i].count
          }
        }
      },
      failure(code, err) { console.log(code, err) }
    })
  },
  getTop() {
    let {elements} = this
    let topNum = elements.topArea[0].attributes['data-hk-top-pages'].value

    Icarus.request({
      api: 'hk.page.getTop',
      v: '1.0',
      data: { num: topNum },
      success(results) {
        let topAreaDom = TEMPLATES.TOP_AREA({
          pages: results,
          num: topNum
        })
        for (let i = 0; i < elements.topArea.length; ++i) {
          elements.topArea[i].innerHTML = topAreaDom
        }
      },
      failure(code, err) { console.log(code, err) }
    })
  }
}

DOMReady(function() {
  var hk = HitKounter
    , e = hk.elements

  hk.scan()
  hk.increment()
  if (!isEmpty(e.pages)) hk.getPages()
  if (e.topArea.length) hk.getTop()
})

window.HitKounter = HitKounter
export default HitKounter