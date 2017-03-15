'use strict';

var expressif = require('..');
var assert = require('chai').assert;
var noop = function(){};

function testMiddleware (req, res, next) {
  req.called = true;
}

testMiddleware.if = expressif;

describe('express-if', function () {

  describe('with PATH(with method) exception', function () {
    var mid = testMiddleware.if({
      path: [
        {
          url: '/test',
          methods: ['POST', 'GET']
        },
        {
          url: '/bar',
          methods: ['PUT']
        },
        '/foo'
      ]
    });

    it('should call the middleware when path and method match', function () {
      var req = {
        originalUrl: '/test?das=123',
        method: 'POST'
      };

      mid(req, {}, noop);
      assert.isOk(req.called);


      req = {
        originalUrl: '/test?test=123',
        method: 'GET'
      };

      mid(req, {}, noop);
      assert.isOk(req.called);

      req = {
        originalUrl: '/bar?test=123',
        method: 'PUT'
      };

      mid(req, {}, noop);
      assert.isOk(req.called);

      req = {
        originalUrl: '/foo',
        method: 'PUT'
      };

      mid(req, {}, noop);
      assert.isOk(req.called);
    });
    it('should not call the middleware when path or method mismatch', function () {
      var req = {
        originalUrl: '/test?test=123',
        method: 'PUT'
      };

      mid(req, {}, noop);
      assert.isNotOk(req.called);

      req = {
        originalUrl: '/if?test=123',
        method: 'PUT'
      };

      mid(req, {}, noop);
      assert.isNotOk(req.called);
    });
  });

  describe('with PATH exception', function () {
    var mid = testMiddleware.if({
      path: ['/test', '/fobo']
    });

    it('should call the middleware when one of the path match', function () {
      var req = {
        originalUrl: '/test?das=123'
      };

      mid(req, {}, noop);

      assert.isOk(req.called);

      req = {
        originalUrl: '/fobo?test=123'
      };

      mid(req, {}, noop);

      assert.isOk(req.called);
    });

    it('should not call the middleware when the path doesnt match', function () {
      var req = {
        originalUrl: '/foobar/test=123'
      };

      mid(req, {}, noop);

      assert.isNotOk(req.called);
    });
  });

  describe('with PATH (regex) exception', function () {
    var mid = testMiddleware.if({
      path: ['/test', /ag$/ig]
    });

    it('should call the middleware when the regex match', function () {
      var req = {
        originalUrl: '/foboag?test=123'
      };

      var req2 = {
        originalUrl: '/foboag?test=456'
      };

      mid(req, {}, noop);
      mid(req2, {}, noop);

      assert.isOk(req.called);
      assert.isOk(req2.called);
    });

  });

  describe('with PATH (useOriginalUrl) exception', function () {
    var mid = testMiddleware.if({
      path: ['/test', '/fobo'],
      useOriginalUrl: false
    });

    it('should call the middleware when one of the path match '+
        'req.url instead of req.originalUrl', function () {
      var req = {
        originalUrl: '/orig/test?das=123',
        url: '/test?das=123'
      };

      mid(req, {}, noop);

      assert.isOk(req.called);

      req = {
        originalUrl: '/orig/fobo?test=123',
        url: '/fobo?test=123'
      };

      mid(req, {}, noop);

      assert.isOk(req.called);
    });

    it('should not call the middleware when the path doesnt match '+
        'req.url even if path matches req.originalUrl', function () {
      var req = {
        originalUrl: '/test/test=123',
        url: '/foobar/test=123'
      };

      mid(req, {}, noop);

      assert.isNotOk(req.called);
    });
  });

  describe('with EXT exception', function () {
    var mid = testMiddleware.if({
      ext: ['jpg', 'html', 'txt']
    });

    it('should call the middleware when the ext match', function () {
      var req = {
        originalUrl: '/foo.html?das=123'
      };

      mid(req, {}, noop);

      assert.isOk(req.called);
    });

    it('should not call the middleware when the ext doesnt match', function () {
      var req = {
        originalUrl: '/foobar/test=123'
      };

      mid(req, {}, noop);

      assert.isNotOk(req.called);
    });
  });

  describe('with METHOD exception', function () {
    var mid = testMiddleware.if({
      method: ['OPTIONS', 'DELETE']
    });

    it('should call the middleware when the method match', function () {
      var req = {
        originalUrl: '/foo.html?das=123',
        method: 'OPTIONS'
      };

      mid(req, {}, noop);

      assert.isOk(req.called);
    });

    it('should not call the middleware when the method doesnt match', function () {
      var req = {
        originalUrl: '/foobar/test=123',
        method: 'PUT'
      };

      mid(req, {}, noop);

      assert.isNotOk(req.called);
    });
  });

  describe('with custom exception', function () {
    var mid = testMiddleware.if(function (req) {
      return req.baba;
    });

    it('should call the middleware when the custom rule match', function () {
      var req = {
        baba: true
      };

      mid(req, {}, noop);

      assert.isOk(req.called);
    });

    it('should not call the middleware when the custom rule doesnt match', function () {
      var req = {
        baba: false
      };

      mid(req, {}, noop);

      assert.isNotOk(req.called);
    });
  });

  describe('without originalUrl', function () {
    var mid = testMiddleware.if({
      path: ['/test']
    });

    it('should call the middleware when one of the path match', function () {
      var req = {
        url: '/test?das=123'
      };

      mid(req, {}, noop);

      assert.isOk(req.called);
    });

    it('should not call the middleware when the path doesnt match', function () {
      var req = {
        url: '/foobar/test=123'
      };

      mid(req, {}, noop);

      assert.isNotOk(req.called);
    });
  });

});
