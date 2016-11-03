'use strict'

const AV = require('leancloud-storage')
const APP_ID = 'yzbpXQpXf1rWVRfAAM8Durgh-gzGzoHsz'
const APP_KEY = '020bjTvbiVinVQ21YtWAJ9t8'
const INTERVAL = 10 * 60 * 1000;

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

const Site = AV.Object.extend('Site')

setInterval(calc, INTERVAL);

function calc() {
  let counter = {}

  let query = new AV.Query('Page')
  query.each((page) => {
    let d = page.get('domain')
    if (counter[d]) counter[d] += page.get('count')
    else counter[d] = page.get('count')
  }).then(() => {
    console.log('Collect all pages.')
    for (let domain in counter) {
      if (counter.hasOwnProperty(domain)) {
        let siteView = counter[domain]
        let siteQ = new AV.Query('Site')
        siteQ.equalTo('domain', domain)
        siteQ.first().then(site => {
          if (!site) {
            site = new Site()
            site.set('domain', domain)
          }
          site.set('count', siteView).save()
        })
      }
    }
    console.log('Done.');
  })
}
