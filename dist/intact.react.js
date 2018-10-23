(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("intact/dist"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["intact/dist", "react"], factory);
	else if(typeof exports === 'object')
		exports["Intact"] = factory(require("intact/dist"), require("react"));
	else
		root["Intact"] = factory(root["Intact"], root["React"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_intact_dist__, __WEBPACK_EXTERNAL_MODULE_react__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/index.js */ \"./src/index.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _src_index_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n\n\n//# sourceURL=webpack://Intact/./index.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return IntactReact; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var intact_dist__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! intact/dist */ \"intact/dist\");\n/* harmony import */ var intact_dist__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(intact_dist__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ \"./src/util.js\");\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\n\n// for webpack alias Intact to IntactReact\n\n\n\nvar IntactReact = function (_Intact) {\n    _inherits(IntactReact, _Intact);\n\n    function IntactReact() {\n        _classCallCheck(this, IntactReact);\n\n        var _this = _possibleConstructorReturn(this, (IntactReact.__proto__ || Object.getPrototypeOf(IntactReact)).apply(this, arguments));\n\n        var props = _this.props;\n        // 兼容react实例属性开始\n        _this.props = props;\n        _this.context = {};\n        _this.refs = {};\n        _this.updater = {};\n        _this.state = _this.props;\n        // 兼容react实例属性结束\n\n        return _this;\n    }\n\n    //兼容react生成生命周期开始\n    /*\n    * 生命周期详解\n    * 初始化\n    * constructor()\n    * static getDerivedStateFromProps()\n    * render()\n    * componentDidMount()\n    * 更新\n    * static getDerivedStateFromProps()\n    * shouldComponentUpdate()\n    * render()\n    * getSnapshotBeforeUpdate()\n    * componentDidUpdate()\n    * 卸载\n    * componentWillUnmount()\n    * 渲染中出现错误\n    * componentDidCatch()\n    *\n    * */\n\n\n    _createClass(IntactReact, [{\n        key: 'render',\n        value: function render() {}\n    }, {\n        key: 'componentDidMount',\n        value: function componentDidMount() {}\n    }, {\n        key: 'shouldComponentUpdate',\n        value: function shouldComponentUpdate() {}\n    }, {\n        key: 'getSnapshotBeforeUpdate',\n        value: function getSnapshotBeforeUpdate() {}\n    }, {\n        key: 'componentDidUpdate',\n        value: function componentDidUpdate(prevProps, prevState, snapshot) {}\n    }, {\n        key: 'componentWillUnmount',\n        value: function componentWillUnmount() {}\n    }, {\n        key: 'componentDidCatch',\n        value: function componentDidCatch() {}\n\n        //兼容react生成生命周期结束\n\n    }, {\n        key: 'forceUpdate',\n\n\n        //兼容react实例方法开始\n        value: function forceUpdate(callback) {}\n    }, {\n        key: 'setState',\n        value: function setState(partialState, callback) {\n            this.set(partialState);\n            callback();\n        }\n\n        //兼容react实例方法结束\n\n    }, {\n        key: 'isMounted',\n        get: function get() {\n            return this.mounted;\n        }\n    }, {\n        key: 'isReactComponent',\n        get: function get() {\n            return {};\n        }\n    }], [{\n        key: 'getDerivedStateFromProps',\n        value: function getDerivedStateFromProps() {}\n    }, {\n        key: 'defaultProps',\n        value: function defaultProps() {\n            return this.defaults ? Object(_util__WEBPACK_IMPORTED_MODULE_2__[\"isFunction\"])(this.defaults) ? this.defaults() : this.defaults : {};\n        }\n    }]);\n\n    return IntactReact;\n}(intact_dist__WEBPACK_IMPORTED_MODULE_1___default.a);\n\n\n\n//# sourceURL=webpack://Intact/./src/index.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! exports provided: isFunction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isFunction\", function() { return isFunction; });\nvar isFunction = function isFunction(functionToCheck) {\n    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';\n};\n\n\n//# sourceURL=webpack://Intact/./src/util.js?");

/***/ }),

/***/ "intact/dist":
/*!*********************************************************************************************************!*\
  !*** external {"commonjs":"intact/dist","commonjs2":"intact/dist","amd":"intact/dist","root":"Intact"} ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_intact_dist__;\n\n//# sourceURL=webpack://Intact/external_%7B%22commonjs%22:%22intact/dist%22,%22commonjs2%22:%22intact/dist%22,%22amd%22:%22intact/dist%22,%22root%22:%22Intact%22%7D?");

/***/ }),

/***/ "react":
/*!**************************************************************************************!*\
  !*** external {"commonjs":"react","commonjs2":"react","amd":"react","root":"React"} ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_react__;\n\n//# sourceURL=webpack://Intact/external_%7B%22commonjs%22:%22react%22,%22commonjs2%22:%22react%22,%22amd%22:%22react%22,%22root%22:%22React%22%7D?");

/***/ })

/******/ });
});