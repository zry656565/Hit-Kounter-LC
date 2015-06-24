# Jerry Analytics
Jerry Analytics is a simple data collector for visit statistics.

## Usage Sample

Send `JSONP` requests to `http://analytics1.sinaapp.com/page.php`

### Increase the count of a visited page

```
var url = 'http://analytics1.sinaapp.com/page.php'
            + '?type=increment'
            + '&callback=func'
            + '&domain=' + encodeURIComponent("http://jerryzou.com")
            + '&url=' + encodeURIComponent("http://jerryzou.com/posts/aboutNormalizeCss/");

var head = document.getElementsByTagName('head')[0]; 
var jsonp = document.createElement("script"); 
jsonp.src= url; 
head.appendChild(jsonp);

function func(result) {
    console.log(result.count);
}
```

### Get the count of several pages


```
var pages = [
    { domain: "http://jerryzou.com", url: "http://jerryzou.com/posts/aboutNormalizeCss/" },
    { domain: "http://jerryzou.com", url: "http://jerryzou.com/about/" },
];
var url = 'http://analytics1.sinaapp.com/page.php';
           + '?type=get';
           + '&callback=func'
           + '&pages=' + encodeURIComponent(JSON.stringify(pages));

var head = document.getElementsByTagName('head')[0]; 
var jsonp = document.createElement("script"); 
jsonp.src= url;
head.appendChild(jsonp);

function func(result) {
	for (var i = 0; i < result.length; i++) {
	    console.log(result[i].count);
	}
}
```

## API

###1. `page.php?type=increment`

When someone visit your website, increase the count of a visited page.

| Argument | Value | Explanation |
| ------ | --- | --- |
| type | increment | - |
| callback | jsonp_callback | The callback will be called when the jsonp request returns. |
| domain | http%3A%2F%2Fwww.a.com | domain of your site |
| url | http%3A%2F%2Fwww.a.com%2Fpage%2F | url of current page |

####Response

```
jsonp_callback({
    "domain": "http%3A%2F%2Fwww.a.com",
    "url": "http%3A%2F%2Fwww.a.com%2Fpage%2F",
    "count": 100
});
```

###2. `page.php?type=get`

Get the count of several pages.

| Argument | Value | Explanation |
| ------ | --- | --- |
| type | get | - |
| callback | jsonp_callback | The callback will be called when the jsonp request returns. |
| pages | [] | an array contains the domains and urls of several pages |

####sample of `pages`

```
var pages = [
    { 
        domain: "http://jerryzou.com",
        url: "http://jerryzou.com/posts/aboutNormalizeCss/",
        //You can add some additional variables, and the response will carry them
        name: "About Normalize.css"
    },
    {
        domain: "http://jerryzou.com",
        url: "http://jerryzou.com/about/",
        name: "About Me"
    },
];

//Don't forget encode `pages`;
url += encodeURIComponent(pages);
```

**Notice**: The length of the url of jsonp request should be limited to **1024**, because the request method that jsonp uses is `GET`.

####Response

```
jsonp_callback([
	{ 
        domain: "http://jerryzou.com",
        url: "http://jerryzou.com/posts/aboutNormalizeCss/",
        name: "About Normalize.css",
        count: 150
    },
    {
        domain: "http://jerryzou.com",
        url: "http://jerryzou.com/about/",
        name: "About Me",
        count: 100
    },
]);
```