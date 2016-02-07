/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

var expect = chai.expect
  , clearDone;

describe('Icarus', function() {

  this.timeout(500)

  before(function(done) {
    Icarus.jsonp('/test/clear.php?current=' + encodeURIComponent(location.host)
        + '&t=' + Date.now() + '|' + Math.floor(Math.random() * 10000)
        + '&callback=clearDone')
    clearDone = done
  })

  describe('hk.page.increment', function() {
    it('first visiting', function(done) {
      Icarus.request({
        api: 'hk.page.increment',
        v: '1.0',
        success: function(result) {
          expect(result.count).to.equal(1)
          done()
        },
        failure: function(code, err) { console.log(code, err) }
      })
    })

    it('second visiting', function(done) {
      Icarus.request({
        api: 'hk.page.increment',
        v: '1.0',
        success: function(result) {
          expect(result.count).to.equal(2)
          done()
        },
        failure: function(code, err) { console.log(code, err) }
      })
    })
  })

  describe('hk.page.get', function() {
    it('get current page', function(done) {
      Icarus.request({
        api: 'hk.page.get',
        v: '1.0',
        success: function(result) {
          expect(result[0].count).to.equal(2)
          done()
        },
        failure: function(code, err) { console.log(code, err) }
      })
    })
  })

  describe('hk.page.getTop', function() {
    it('get top 1', function(done) {
      Icarus.request({
        api: 'hk.page.getTop',
        v: '1.0',
        num: 1,
        success: function(result) {
          expect(result[0].count).to.equal(2)
          done()
        },
        failure: function(code, err) { console.log(code, err) }
      })
    })
  })

  describe('hk.page.getByDomain', function() {
    it('default', function(done) {
      Icarus.request({
        api: 'hk.page.getByDomain',
        v: '1.0',
        num: 1,
        success: function(result) {
          expect(result[0].count).to.equal(2)
          done()
        },
        failure: function(code, err) { console.log(code, err) }
      })
    })
  })

})