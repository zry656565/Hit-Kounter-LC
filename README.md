# Hit Kounter

Hit Kounter is a simple blog-aware page hit counter.

- [Icarus: APIs](#icarus-apis)
    - [hk.page.increment](#hkpageincrement)
    - [hk.page.get](#hkpageget)
    - [hk.page.getTop](#hkpagegettop)
    - [hk.page.getByDomain](#hkpagegetbydomain)

## Icarus: APIs

### hk.page.increment

When someone visit your website, increase the count of a visited page.
If no parameter is passed, Icarus will request with the title of current page by default.

| Parameter | Requirement | Description |
| ------ | --- | --- |
| title  | optional | page title |

#### Usage Sample

```javascript
Icarus.request({
  api: 'hk.page.increment',
  v: '1.0',
  title: 'Test Page', // optional
  success(result) {
    console.log(result.domain, result.url, result.count);
  },
  failure(code, err) {
    console.log(code, err);
  }
});
```

#### Response Sample

```javascript
{
    "domain": "http://jerryzou.com",
    "url": "http://jerryzou.com/posts/aboutNormalizeCss/",
    "count": 2443,
    "title": "About Normalize.css"
}
```

### hk.page.get

Get the count of several pages.
If no parameter is passed, Icarus will request with the url of current page by default.

| Parameter | Requirement | Description |
| ------ | --- | --- |
| domain | optional | domain of your site |
| pages | optional | an array contains the urls of several pages |


#### Usage Sample

```javascript
Icarus.request({
  api: 'hk.page.get',
  v: '1.0',
  pages: [
    { url: 'http://test.com' },
  ],
  success(result) {
    for (var i = 0; i < result.length; i++) {
      console.log(result.domain, result.url, result.count);
    }
  },
  failure(code, err) {
    console.log(code, err);
  }
});
```


#### Response Sample

```javascript
[
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
]
```

### hk.page.getTop

Get the pages which have been mostly visited.

| Parameter | Requirement | Description |
| ------ | --- | --- |
| domain | optional | domain of your site |
| num | **Required** | get top `<num>` pages  |

#### Usage Sample

```javascript
Icarus.request({
  api: 'hk.page.getTop',
  v: '1.0',
  num: 5,
  success(result) {
    for (var i = 0; i < result.length; i++) {
      console.log(result.domain, result.url, result.count);
    }
  },
  failure(code, err) {
    console.log(code, err);
  }
});
```

#### Response Sample

```javascript
[
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
]
```

### hk.page.getByDomain

Get all pages under the given domain.

| Argument | Requirement | Description |
| ------ | --- | --- |
| domain | optional | domain of your site |

#### Usage Sample

```javascript
Icarus.request({
  api: 'hk.page.getByDomain',
  v: '1.0',
  success(result) {
    for (var i = 0; i < result.length; i++) {
      console.log(result.domain, result.url, result.count);
    }
  },
  failure(code, err) {
    console.log(code, err);
  }
});
```

#### Response Sample

```javascript
[
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
]
```
