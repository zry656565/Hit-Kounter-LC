# Jerry Analytics
Jerry Analytics is a simple data collector for visit statistics.

- [Prepare: JSONP Module](#prepare-jsonp-module)
- [Usage Sample](#usage-sample)
- [API](#api)

## Prepare: JSONP Module

Create a module for sending jsonp

```
var jsonp = function(url, args) {
    var head = document.head,
        script = document.createElement("script"),
        first = true,
        value;
    
    for (var key in args) {
        if (args.hasOwnProperty(key)) {
            value = encodeURIComponent(args[key]);
            url += first ? ('?' + key + '=' + value) : ('&' + key + '=' + value);
            first = false;
        }
    }
    script.src= url;
    head.appendChild(script);
}
```

## Usage Sample

Send `JSONP` requests to `http://analytics1.sinaapp.com/page.php`

### 1. Increase the count of a visited page

```
jsonp('http://analytics1.sinaapp.com/page.php', {
    callback: 'func',
    type: 'increment',
    domain: 'http://jerryzou.com',
    url: 'http://jerryzou.com/posts/aboutNormalizeCss/',
    title: 'About Normalize.css'
});

//callback
function func(result) {
    console.log(result.url, result.count);
}
```

### 2. Get the count of several pages

```
jsonp('http://analytics1.sinaapp.com/page.php', {
    callback: 'func',
    type: 'get',
    pages: JSON.stringify([
        { domain: "http://jerryzou.com", url: "http://jerryzou.com/posts/aboutNormalizeCss/" },
        { domain: "http://jerryzou.com", url: "http://jerryzou.com/about/" },
    ])
});

//callback
function func(result) {
	for (var i = 0; i < result.length; i++) {
	    console.log(result[i].url, result[i].count);
	}
}
```

### 3. Get the pages which have been mostly visited

```
jsonp('http://analytics1.sinaapp.com/page.php', {
    callback: 'func',
    type: 'getTop',
    domain: 'http://jerryzou.com',
    number: '5'
});

//callback
function func(result) {
	for (var i = 0; i < result.length; i++) {
	    console.log(result[i].title, result[i].count);
	}
}
```

### 4. Get all pages under the given domain

```
jsonp('http://analytics1.sinaapp.com/page.php', {
    callback: 'func',
    type: 'getByDomain',
    domain: 'http://jerryzou.com'
});

//callback
function func(result) {
	for (var i = 0; i < result.length; i++) {
	    console.log(result[i].title, result[i].count);
	}
}
```

## API

##1. increment

When someone visit your website, increase the count of a visited page.

| Argument | Value | Explanation |
| ------ | --- | --- |
| type | increment | - |
| callback | jsonp_callback | The callback will be called when the jsonp request returns. |
| domain | http://a.com | domain of your site |
| url | http://a.com/page/ | url of current page |

####API

```
page.php?type=increment
```

####Request Sample

```
http://analytics1.sinaapp.com/page.php?callback=jsonp_callback&type=increment&domain=http%3A%2F%2Fjerryzou.com&url=http%3A%2F%2Fjerryzou.com%2Fposts%2FaboutNormalizeCss%2F&title=About%20Normalize.css
```

####Response Sample

```
jsonp_callback({
    "domain": "http://jerryzou.com",
    "url": "http://jerryzou.com/posts/aboutNormalizeCss/",
    "count": 2443,
    "title": "About Normalize.css"
});
```

##2. get

Get the count of several pages.

| Argument | Value | Explanation |
| ------ | --- | --- |
| type | get | - |
| callback | jsonp_callback | The callback will be called when the jsonp request returns. |
| pages | (see the [sample below](#2-get-the-count-of-several-pages)) | an array contains the domains and urls of several pages |


####API

```
page.php?type=get
```

####Request Sample

```
http://analytics1.sinaapp.com/page.php?callback=jsonp_callback&type=get&pages=%5B%7B%22domain%22%3A%22http%3A%2F%2Fjerryzou.com%22%2C%22url%22%3A%22http%3A%2F%2Fjerryzou.com%2Fposts%2FaboutNormalizeCss%2F%22%7D%2C%7B%22domain%22%3A%22http%3A%2F%2Fjerryzou.com%22%2C%22url%22%3A%22http%3A%2F%2Fjerryzou.com%2Fabout%2F%22%7D%5D
```

**Notice**: The length of the url of jsonp request should be limited to **1024**, because the request method that jsonp uses is `GET`.

####Response Sample

```
jsonp_callback([
    {
        "domain": "http://jerryzou.com",
        "url": "http://jerryzou.com/posts/aboutNormalizeCss/",
        "title": "About Normalize.css",
        "count": 2443
    }, {
        "domain": "http://jerryzou.com",
        "url": "http://jerryzou.com/about/",
        "title": "About Me",
        "count": 0
    }
]);
```

##3. getTop

Get the pages which have been mostly visited.

| Argument | Value | Explanation |
| ------ | --- | --- |
| type | getTop | - |
| callback | jsonp_callback | The callback will be called when the jsonp request returns. |
| domain | http://a.com | domain of your site |
| number | 5 | get top 5 pages  |

####API

```
page.php?type=getTop
```

####Request Sample

```
http://analytics1.sinaapp.com/page.php?callback=jsonp_callback&type=getTop&domain=http%3A%2F%2Fjerryzou.com&number=5
```

####Response Sample

```
jsonp_callback([
    {
        "url": "http://jerryzou.com/posts/aboutNormalizeCss/",
        "title": "",
        "count": 2443
    }, {
        "url": "http://jerryzou.com/posts/shadowsocks-with-digitalocean/",
        "title": "",
        "count": 1123
    }, {
        "url": "http://jerryzou.com/posts/sjtuBusFeedback/",
        "title": "",
        "count": 488
    }, {
        "url": "http://jerryzou.com/posts/bulkUploadToUPYUN/",
        "title": "",
        "count": 437
    }, {
        "url": "http://jerryzou.com/posts/usePygments/",
        "title": "",
        "count": 274
    }
]);
```

##4. getByDomain

Get all pages under the given domain.

| Argument | Value | Explanation |
| ------ | --- | --- |
| type | getByDomain | - |
| callback | jsonp_callback | The callback will be called when the jsonp request returns. |
| domain | http://a.com | domain of your site |

####API

```
page.php?type=getByDomain
```

####Request Sample

```
http://analytics1.sinaapp.com/page.php?callback=jsonp_callback&type=getByDomain&domain=http%3A%2F%2Fjerryzou.com
```

####Response Sample

```
jsonp_callback([
    {
        "url": "http://jerryzou.com/posts/aboutNormalizeCss/",
        "title": "",
        "count": 2443
    }, {
        "url": "http://jerryzou.com/posts/shadowsocks-with-digitalocean/",
        "title": "",
        "count": 1123
    }, {
        "url": "http://jerryzou.com/posts/sjtuBusFeedback/",
        "title": "",
        "count": 488
    }, {
        "url": "http://jerryzou.com/posts/bulkUploadToUPYUN/",
        "title": "",
        "count": 437
    }, {
        "url": "http://jerryzou.com/posts/usePygments/",
        "title": "",
        "count": 274
    },
    ...
]);
```
