/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _icarus = __webpack_require__(1);

	var _icarus2 = _interopRequireDefault(_icarus);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Author: Jerry Zou
	 * Email: jerry.zry@outlook.com
	 */

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Icarus = {

	  SERVER: 'http://localhost:8080',
	  ACCEPTOR: '/handler.php',
	  uid: 0,
	  callbacks: {},

	  request: function request() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? { api: '' } : arguments[0];
	    var SERVER = this.SERVER;
	    var ACCEPTOR = this.ACCEPTOR;
	    var callbacks = this.callbacks;
	    var jsonp = this.jsonp;

	    options.success = options.success || function () {};
	    options.failure = options.failure || function () {};
	    if (!options.api) {
	      options.failure({
	        code: 400,
	        message: 'Please set the api name.'
	      });
	    }
	    // add param `domain` for all APIs like `hk.page.*`
	    if (options.api.match(/hk\.page/)) options.domain = location.host;
	    switch (options.api) {
	      case 'hk.page.increment':
	        options.url = options.url || location.href;
	        options.title = options.title || document.title;
	        break;
	      case 'hk.page.get':
	        options.pages = options.pages || [{ url: location.href, title: document.title }];
	        options.pages = JSON.stringify(options.pages);
	        break;
	    }
	    var callbackName = 'c' + this.uid++;
	    callbacks[callbackName] = function (code, result) {
	      if (code == 0) {
	        options.success(result);
	      } else {
	        options.failure(code, result);
	      }
	    };
	    options.callback = 'Icarus.callbacks.' + callbackName;
	    jsonp(SERVER + ACCEPTOR, options);
	  },
	  jsonp: function jsonp(url) {
	    var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var head = document.head,
	        script = document.createElement("script"),
	        first = true,
	        value = undefined;

	    for (var key in args) {
	      if (args.hasOwnProperty(key) && typeof args[key] != 'function') {
	        value = encodeURIComponent(args[key]);
	        url += first ? '?' + key + '=' + value : '&' + key + '=' + value;
	        first = false;
	      }
	    }
	    script.src = url;
	    head.appendChild(script);
	  }
	};

	window.Icarus = Icarus;
	exports.default = Icarus;

/***/ }
/******/ ]);