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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _index = __webpack_require__(/*! ./src/index.js */ \"./src/index.js\");\n\nObject.defineProperty(exports, 'default', {\n  enumerable: true,\n  get: function get() {\n    return _interopRequireDefault(_index).default;\n  }\n});\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nmodule.exports = exports.default;\n\n//# sourceURL=webpack://Intact/./index.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(/*! react */ \"react\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _dist = __webpack_require__(/*! intact/dist */ \"intact/dist\");\n\nvar _dist2 = _interopRequireDefault(_dist);\n\nvar _util = __webpack_require__(/*! ./util */ \"./src/util.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n// for webpack alias Intact to IntactReact\n\n\nvar _Intact$utils = _dist2.default.utils,\n    get = _Intact$utils.get,\n    set = _Intact$utils.set,\n    extend = _Intact$utils.extend,\n    isObject = _Intact$utils.isObject,\n    isArray = _Intact$utils.isArray,\n    create = _Intact$utils.create,\n    isFunction = _Intact$utils.isFunction;\n\n\nvar _createElement = _react2.default.createElement;\n_react2.default.createElement = function createElementWithValidation(type, props, children) {\n    var isIntact = isObject(type.prototype) && type.prototype.$$cid === 'IntactReact';\n    var propTypes = type.propTypes;\n    if (isIntact) {\n        delete type.propTypes;\n    }\n    var element = _createElement.call(this, type, props, children);\n    if (isIntact && propTypes) {\n        type.propTypes = propTypes;\n    }\n    return element;\n};\n\nvar IntactReact = function (_Intact) {\n    _inherits(IntactReact, _Intact);\n\n    function IntactReact() {\n        var _ref;\n\n        _classCallCheck(this, IntactReact);\n\n        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n            args[_key] = arguments[_key];\n        }\n\n        var isReactCall = args.length === 2; //react 实例化是会传入两个参数  , 故使用此判断 是否为react 调用实例\n\n        var _this = _possibleConstructorReturn(this, (_ref = IntactReact.__proto__ || Object.getPrototypeOf(IntactReact)).call.apply(_ref, [this].concat(args)));\n\n        if (isReactCall) {\n            _this.$$innerInstance = undefined;\n            _this.props = args[0]; //react 需要验证props 全等 ,蛋疼\n            _this.$$wrapDom = null;\n            _this.$$props = extend({}, _this.props);\n        }\n        return _this;\n    }\n\n    _createClass(IntactReact, [{\n        key: 'componentDidMount',\n        value: function componentDidMount() {\n            var parentElement = this.$$wrapDom.parentElement;\n            //重新初始化并创建节点 , 替换已存在节点\n            this.$$innerInstance = new this.constructor((0, _util.conversionProps)(this.$$props));\n            parentElement.replaceChild(this.$$innerInstance.init(), this.$$wrapDom);\n        }\n    }, {\n        key: 'componentWillUnmount',\n        value: function componentWillUnmount() {\n            this.$$innerInstance && this.$$innerInstance.destroy();\n        }\n    }, {\n        key: 'componentDidUpdate',\n        value: function componentDidUpdate(prevProps, prevState, snapshot) {\n            // 更新实例\n            this.$$innerInstance && this.$$innerInstance.set((0, _util.conversionProps)(this.$$props));\n        }\n    }, {\n        key: 'render',\n        value: function render() {\n            var _this2 = this;\n\n            this.$$props = extend(this.$$props, this.props);\n            return _react2.default.createElement('i', extend({}, {\n                ref: function ref(element) {\n                    _this2.$$wrapDom = element;\n                }\n            }), '');\n        }\n    }, {\n        key: '$$cid',\n        get: function get() {\n            return 'IntactReact';\n        }\n    }, {\n        key: 'isMounted',\n        get: function get() {\n            return this.mounted;\n        }\n    }, {\n        key: 'isReactComponent',\n        get: function get() {\n            return {};\n        }\n    }]);\n\n    return IntactReact;\n}(_dist2.default);\n\nexports.default = IntactReact;\nmodule.exports = exports.default;\n\n//# sourceURL=webpack://Intact/./src/index.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.conversionProps = undefined;\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _dist = __webpack_require__(/*! intact/dist */ \"intact/dist\");\n\nvar _dist2 = _interopRequireDefault(_dist);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar h = _dist2.default.Vdt.miss.h;\nvar Types = _dist2.default.Vdt.miss.Types;\nvar VNode = _dist2.default.Vdt.miss.VNode;\nvar _Intact$utils = _dist2.default.utils,\n    each = _Intact$utils.each,\n    isFunction = _Intact$utils.isFunction,\n    isString = _Intact$utils.isString,\n    isArray = _Intact$utils.isArray,\n    isObject = _Intact$utils.isObject,\n    hasOwn = _Intact$utils.hasOwn,\n    create = _Intact$utils.create,\n    extend = _Intact$utils.extend,\n    isStringOrNumber = _Intact$utils.isStringOrNumber;\n\n//from react16 2456 行\n\nvar hasSymbol = typeof Symbol === 'function' && Symbol.for;\nvar REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;\n\nvar InheritIntactReact = function (_Intact) {\n    _inherits(InheritIntactReact, _Intact);\n\n    function InheritIntactReact(props) {\n        _classCallCheck(this, InheritIntactReact);\n\n        var _this = _possibleConstructorReturn(this, (InheritIntactReact.__proto__ || Object.getPrototypeOf(InheritIntactReact)).call(this, props));\n\n        _this.$$ctor = InheritIntactReact.Ctor;\n        _this.instance = new _this.$$ctor(props);\n        var ignoreKeys = ['constructor', 'props', '_create', '_mount', '_beforeUpdate', '_update', '_destory', 'defaults', 'template', 'setState', 'forceUpdate'];\n        var instance = _this.instance;\n        var keys = Object.getOwnPropertyNames(instance.__proto__);\n        keys = keys.concat(Object.getOwnPropertyNames(instance));\n        var _iteratorNormalCompletion = true;\n        var _didIteratorError = false;\n        var _iteratorError = undefined;\n\n        try {\n            for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n                var key = _step.value;\n\n                if (!ignoreKeys.includes(key)) {\n                    if (isFunction(instance[key])) {\n                        _this[key] = instance[key].bind(_this);\n                    } else {\n                        _this[key] = instance[key];\n                    }\n                }\n            }\n        } catch (err) {\n            _didIteratorError = true;\n            _iteratorError = err;\n        } finally {\n            try {\n                if (!_iteratorNormalCompletion && _iterator.return) {\n                    _iterator.return();\n                }\n            } finally {\n                if (_didIteratorError) {\n                    throw _iteratorError;\n                }\n            }\n        }\n\n        return _this;\n    }\n\n    _createClass(InheritIntactReact, [{\n        key: '_create',\n        value: function _create() {\n            this.$$ctor.getDerivedStateFromProps && this.$$ctor.getDerivedStateFromProps();\n            this.componentWillMount && this.componentWillMount();\n        }\n    }, {\n        key: '_mount',\n        value: function _mount() {\n            this.componentDidMount && this.componentDidMount();\n        }\n    }, {\n        key: '_beforeUpdate',\n        value: function _beforeUpdate() {\n            this.$$ctor.getDerivedStateFromProps && this.$$ctor.getDerivedStateFromProps();\n            this.componentWillReceiveProps && this.componentWillReceiveProps();\n            this.componentWillUpdate && this.componentWillUpdate();\n            this.shouldComponentUpdate && this.shouldComponentUpdate();\n        }\n    }, {\n        key: '_update',\n        value: function _update() {\n            this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate();\n            this.componentDidUpdate && this.componentDidUpdate();\n        }\n    }, {\n        key: '_destory',\n        value: function _destory() {\n            this.componentWillUnmount && this.componentWillUnmount();\n        }\n    }, {\n        key: 'defaults',\n        value: function defaults() {\n            return InheritIntactReact.Ctor.props;\n        }\n    }, {\n        key: 'template',\n        value: function template(obj, _Vdt, blocks, $callee) {\n            var self = this.data;\n\n            var _conversionChildrenBl = conversionChildrenBlocks(self.instance.render.apply(self)),\n                children = _conversionChildrenBl.children;\n\n            if (children.length > 1) {\n                throw new Error('children must return only one' + children);\n            }\n            var vNode = children;\n            vNode.children = vNode.props.children;\n            return vNode;\n        }\n    }, {\n        key: 'setState',\n        value: function setState(state, callback) {\n            this.state = state;\n            this.set({ state: state });\n            isFunction(callback) && callback.apply(this);\n        }\n    }, {\n        key: 'forceUpdate',\n        value: function forceUpdate(callback) {\n            this.update();\n            isFunction(callback) && callback.apply(this);\n        }\n    }]);\n\n    return InheritIntactReact;\n}(_dist2.default);\n\nfunction conversionChildrenBlocks(children) {\n    if (!children) {\n        return {\n            children: children,\n            _blocks: {}\n        };\n    }\n    if (!isArray(children)) {\n        children = [children];\n    }\n    var newChildren = [];\n    var newBlocks = {};\n\n    each(children, function (child) {\n        if (!child) {\n            return;\n        }\n        var vNode = child;\n        if (isStringOrNumber(child)) {\n            vNode = new VNode(Types.Text, null, {}, child);\n        } else if (isObject(child) && child.$$typeof === REACT_ELEMENT_TYPE) {\n            var props = conversionProps(extend({}, child.attributes, child.props));\n            var type = child.type;\n            if (isFunction(type) && type.prototype.render && type.prototype.isReactComponent) {\n                InheritIntactReact.Ctor = child.type;\n                InheritIntactReact.Ctor.props = props;\n                type = InheritIntactReact;\n            } else if (isFunction(type)) {\n                type = function type(props) {\n                    var _children = child.type(props);\n\n                    var _conversionChildrenBl2 = conversionChildrenBlocks(_children),\n                        children = _conversionChildrenBl2.children;\n\n                    if (children.length > 1) {\n                        throw new Error('children must return only one' + children);\n                    }\n                    var vNode = children;\n                    vNode.children = vNode.props.children;\n                    return vNode;\n                };\n            }\n            vNode = h(type, props, props.children, null, child.key, child.ref);\n        }\n        if (isObject(vNode.props) && vNode.props.slot) {\n            var slotName = vNode.props.slot === undefined || vNode.props.slot === true ? 'default' : vNode.props.slot;\n            delete vNode.props.slot;\n            newBlocks[slotName] = function (parent) {\n                vNode.children = vNode.props.children;\n                return vNode;\n            };\n        } else {\n            newChildren.push(vNode);\n        }\n    });\n    if (newChildren.length === 1) {\n        newChildren = newChildren[0];\n    }\n    return {\n        children: newChildren,\n        _blocks: newBlocks\n    };\n}\n\nfunction isEvent(props, key) {\n    if (isFunction(props[key]) && /^on[A-Z]/.test(key)) {\n        return true;\n    }\n    return false;\n}\n\nfunction conversionProps(props, init) {\n    var _loop = function _loop(key) {\n        if (hasOwn.call(props, key)) {\n            //兼容 事件类型\n            if (isEvent(props, key)) {\n                var evEvent = 'ev-' + key.replace(/^on([A-Z].*)$/, \"$1\").toLowerCase();\n                props[evEvent] = props[key];\n                delete props[key];\n            }\n            //兼容 react 支持obj类型的ref\n            if (key === 'ref' && _.isObject(props[key])) {\n                props[key] = function (i) {\n                    props[key].current = i;\n                };\n            }\n            //兼容 children 到 intact 类型\n            if (key === 'children' && props['children'] && init !== false) {\n                var _conversionChildrenBl3 = conversionChildrenBlocks(props['children']),\n                    children = _conversionChildrenBl3.children,\n                    _blocks = _conversionChildrenBl3._blocks;\n\n                props['children'] = children;\n                props['_blocks'] = _blocks;\n            }\n        }\n    };\n\n    for (var key in props) {\n        _loop(key);\n    }\n    return props;\n}\n\nexports.conversionProps = conversionProps;\n\n//# sourceURL=webpack://Intact/./src/util.js?");

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