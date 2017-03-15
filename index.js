'use strict';

var URL = require('url');

const isUrlMatch = (path, url) => {
  var ret = (typeof path === 'string' && path === url) || (path instanceof RegExp && !!path.exec(url));
  if (path instanceof RegExp) {
    path.lastIndex = 0;
  }

  if (path && path.url) {
    ret = isUrlMatch(path.url, url);
  }
  return ret;
};

const isMethodMatch = (methods, method) => {
  if (!methods) {
    return true;
  }

  methods = Array.isArray(methods) ? methods : [methods];

  return !!~methods.indexOf(method);
};

module.exports = function(options) {
  var parent = this;

  var opts = (typeof options === 'function') ? {custom: options} : options;

  opts.useOriginalUrl = (typeof opts.useOriginalUrl === 'undefined') ? true : opts.useOriginalUrl;

  return function (req, res, next) {
    var url = URL.parse((opts.useOriginalUrl ? req.originalUrl : req.url) || req.url || '', true);
    var skip = false;

    if (opts.custom) {
      skip = skip || opts.custom(req);
    }

    var paths = !opts.path || Array.isArray(opts.path) ?
                opts.path : [opts.path];

    if (paths) {
      skip = skip || paths.some(function (path) {
        return isUrlMatch(path, url.pathname) && isMethodMatch(path.methods, req.method);
      });
    }

    var exts = (!opts.ext || Array.isArray(opts.ext)) ?
               opts.ext : [opts.ext];

    if (exts) {
      skip = skip || exts.some(function (ext) {
        return url.pathname.substr(ext.length * -1) === ext;
      });
    }

    var methods = (!opts.method || Array.isArray(opts.method)) ?
                  opts.method : [opts.method];
    if (methods) {
      skip = skip || !!~methods.indexOf(req.method);
    }
    
    if (!skip) {
      return next();
    }

    parent(req, res, next);
  };
};
