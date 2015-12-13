/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

import Pheonix from './pheonix'

Pheonix.request({
  api: 'hk.page.get',
  v: '1.0',
  success(result) { console.log(result); },
  failure(code, err) {}
})

Pheonix.request({
  api: 'hk.page.increment',
  v: '1.0',
  success(result) { console.log(result); },
  failure(code, err) {}
})

Pheonix.request({
  api: 'hk.page.getTop',
  v: '1.0',
  num: 2,
  success(result) { console.log(result); },
  failure(code, err) {}
})

Pheonix.request({
  api: 'hk.page.getByDomain',
  v: '1.0',
  success(result) { console.log(result); },
  failure(code, err) {}
})