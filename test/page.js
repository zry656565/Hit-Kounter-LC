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
    $.log(testcase, result.url, 'count: ' + result.count)
    if (result.count != 1) {
        $.alert('Test for Increment fail: ' + result.url, 'count: ' + result.count)
    }
    tryComplete()
}

/*****
 * Test 1.1 increment
 */
$.jsonp(pageUrl, {
    callback: 'f2',
    type: 'increment',
    domain: 'httpsss://demo.com',
    url: 'httpsss://demo.com/123/',
    title: 'lalala'
})

function f2(result) {
    $.log(testcase, result.url, 'count: ' + result.count)
    if (result.count != 2) {
        $.alert('Test for Increment fail: ' + result.url, 'count: ' + result.count)
    }
    tryComplete()
}

/*****
 * Test 2.0 get
 */
$.jsonp(pageUrl, {
    type: 'increment',
    callback: 'nullFunc',
    domain: 'httpsss://demo.com',
    url: 'httpsss://demo.com/123456/',
    title: 'lalala'
})

$.jsonp(pageUrl, {
    callback: 'f3',
    type: 'get',
    pages: JSON.stringify([
        { domain: "httpsss://demo.com", url: "httpsss://demo.com/123456/" },
        { domain: "httpsss://demo.com", url: "httpsss://demo.com/123/" }
    ])
});

function f3(results) {
    $.log(testcase, 'test for get')
    if (results[0].count != 1) $.alert('Test for Get fail')
    if (results[1].count != 2) $.alert('Test for Get fail')
    tryComplete()
}

/*****
 * Test 3.0 getTop
 */

$.jsonp(pageUrl, {
    callback: 'f4',
    type: 'getTop',
    domain: 'httpsss://demo.com',
    number: '1'
});

function f4(results) {
    $.log(testcase, 'test for get top 1')
    if (results[0].count != 2) $.alert('Test for getTop fail')
    tryComplete()
}

/*****
 * Test 3.1 getTop
 */

$.jsonp(pageUrl, {
    callback: 'f5',
    type: 'getTop',
    domain: 'httpsss://demo.com',
    number: '2'
});

function f5(results) {
    $.log(testcase, 'test for get top 2')
    if (results[0].count != 2) $.alert('Test for getTop fail')
    if (results[1].count != 1) $.alert('Test for getTop fail')
    tryComplete()
}


/*****
 * Test 4.0 getByDomain
 */

$.jsonp(pageUrl, {
    callback: 'f6',
    type: 'getByDomain',
    domain: 'httpsss://demo.com'
});

function f6(results) {
    $.log(testcase, 'test for get by domain')
    if (results[0].count != 2) $.alert('Test for getByDomain fail')
    if (results[1].count != 1) $.alert('Test for getByDomain fail')
    tryComplete()
}