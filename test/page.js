$.log('page.js Loaded, Testing...')

var root = location.href.replace(/\/[^/]*\/[^/]*$/, '/')
// clear the data for test
$.jsonp(root + 'test/clear.php')

// Test 1.0 increment
$.jsonp(root + 'page.php', {
    callback: 'func',
    type: 'increment',
    domain: 'httpsss://demo.com',
    url: 'httpsss://demo.com/123/',
    title: 'lalala'
})

function func(result) {
    $.log(result.url, 'count: ' + result.count)
    if (result.count != 1) {
        $.alert('Test for Increment fail: ' + result.url, 'count: ' + result.count)
    }
}


