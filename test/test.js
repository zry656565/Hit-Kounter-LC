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
        success(result) {
          expect(result.count).to.equal(1)
          done()
        },
        failure(code, err) {}
      })
    })

    it('second visiting', function(done) {
      Icarus.request({
        api: 'hk.page.increment',
        v: '1.0',
        success(result) {
          expect(result.count).to.equal(2)
          done()
        },
        failure(code, err) {}
      })
    })
  })

})