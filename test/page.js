$.log('page.js Loaded, Testing...')

var root = location.href.replace(/\/[^/]*\/[^/]*$/, '/'),
    pageUrl = root + 'page.php',
    clearUrl = root + 'test/clear.php'
// clear the data for test
$.jsonp(clearUrl)

var testcase = 0,
    TARGET_COUNT = 6

function tryComplete() {
    if (++testcase >= TARGET_COUNT) {
        // clear the data for test again
        $.jsonp(clearUrl + '?v=2')
        $.log("Thanks GOD, " + TARGET_COUNT + " Test cases are Done!")
    }
}
function nullFunc() {}

/*****
 * Test 1.0 increment
 */
$.jsonp(pageUrl, {
    callback: 'f1',
    type: 'increment',
    domain: 'httpsss://demo.com',
    url: 'httpsss://demo.com/123/',
    title: 'lalala'
})

function f1(result) {
    $.log(++testcase, result.url, 'count: ' + result.count)
    if (result.count != 1) {
        $.alert('Test for Increment fail: ' + result.url, 'count: ' + result.count)
    }

    /*****
     * Test 1.1 increment
     */
    $.jsonp(pageUrl, {
        callback: 'f11',
        type: 'increment',
        domain: 'httpsss://demo.com',
        url: 'httpsss://demo.com/123/',
        title: 'lalala'
    })
}

function f11(result) {
    $.log(++testcase, result.url, 'count: ' + result.count)
    if (result.count != 2) {
        $.alert('Test for Increment fail: ' + result.url, 'count: ' + result.count)
    }

    /*****
     * Test 1.2 increment
     */
    $.jsonp(pageUrl, {
        type: 'increment',
        callback: 'f12',
        domain: 'httpsss://demo.com',
        url: 'httpsss://demo.com/123456/',
        title: 'lalala'
    })
}

function f12(result) {
    /*****
     * Test 2.0 get
     */
    $.jsonp(pageUrl, {
        callback: 'f2',
        type: 'get',
        pages: JSON.stringify([
            { domain: "httpsss://demo.com", url: "httpsss://demo.com/123456/" },
            { domain: "httpsss://demo.com", url: "httpsss://demo.com/123/" }
        ])
    });
}

function f2(results) {
    $.log(++testcase, 'test for getTop')
    if (results[0].count != 1) $.alert('Test for Get fail')
    if (results[1].count != 2) $.alert('Test for Get fail')

    /*****
     * Test 3.0 getTop
     */

    $.jsonp(pageUrl, {
        callback: 'f3',
        type: 'getTop',
        domain: 'httpsss://demo.com',
        number: '1'
    });
}

function f3(results) {
    $.log(++testcase, 'test for getTop 1')
    if (results[0].count != 2) $.alert('Test for getTop fail')

    /*****
     * Test 3.1 getTop
     */

    $.jsonp(pageUrl, {
        callback: 'f31',
        type: 'getTop',
        domain: 'httpsss://demo.com',
        number: '2'
    });
}

function f31(results) {
    $.log(++testcase, 'test for getTop 2')
    if (results[0].count != 2) $.alert('Test for getTop fail')
    if (results[1].count != 1) $.alert('Test for getTop fail')

    /*****
     * Test 4.0 getByDomain
     */
    $.jsonp(pageUrl, {
        callback: 'f4',
        type: 'getByDomain',
        domain: 'httpsss://demo.com'
    });
}

function f4(results) {
    $.log(++testcase, 'test for get by domain')
    if (results[0].count != 2) $.alert('Test for getByDomain fail')
    if (results[1].count != 1) $.alert('Test for getByDomain fail')
    tryComplete()
}