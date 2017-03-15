Conditionally skip a middleware when a condition is met.

## Install

[![Greenkeeper badge](https://badges.greenkeeper.io/manikandants/express-if.svg)](https://greenkeeper.io/)

	npm i express-if --save

## Usage

With existing middlewares:

```javascript
var expressif = require('express-if');


var static = express.static(__dirname + '/public');
static.if = expressif;

app.use(static.if({ method: 'OPTIONS' }));
```

If you are authoring a middleware you can support if as follow:

```javascript
module.exports = function (middlewareOptions) {
  var mymid = function (req, res, next) {

  };

  mymid.if = require('express-if');

  return mymid;
};
```

## Current options

-  `method` it could be an string or an array of strings. If the request method match the middleware will not run.
-  `path` it could be an string, a regexp or an array of any of those. It also could be an array of object which is url and methods key-pairs. If the request path or path and method match, the middleware will not run. Check [Examples](#examples) for usage.
-  `ext` it could be an string or an array of strings. If the request path ends with one of these extensions the middleware will not run.
-  `custom` it must be a function that accepts `req` and returns `true` / `false`. If the function returns true for the given request, ithe middleware will not run.
-  `useOriginalUrl` it should be `true` or `false`, default is `true`. if false, `path` will match against `req.url` instead of `req.originalUrl`. Please refer to [Express API](http://expressjs.com/4x/api.html#request) for the difference between `req.url` and `req.originalUrl`.


## Examples

Require authentication for every request if the path is index.html.

```javascript
app.use(requiresAuth.if({
  path: [
    '/index.html',
    { url: '/', methods: ['GET', 'PUT']  }
  ]
}))
```

Avoid a fstat for request to routes doesnt end with a given extension.

```javascript
app.use(static.if(function (req) {
  var ext = url.parse(req.originalUrl).pathname.substr(-4);
  return !~['.jpg', '.html', '.css', '.js'].indexOf(ext);
}));
```

## License

MIT 2014 - Manikandan TS
