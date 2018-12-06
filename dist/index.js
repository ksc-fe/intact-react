'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var Intact = _interopDefault(require('intact/dist'));

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var h = Intact.Vdt.miss.h;
var Types = Intact.Vdt.miss.Types;
var VNode = Intact.Vdt.miss.VNode;
var _Intact$utils$1 = Intact.utils;
var each = _Intact$utils$1.each;
var isFunction$1 = _Intact$utils$1.isFunction;
var isString = _Intact$utils$1.isString;
var isArray$1 = _Intact$utils$1.isArray;
var isObject$1 = _Intact$utils$1.isObject;
var hasOwn = _Intact$utils$1.hasOwn;
var create$1 = _Intact$utils$1.create;
var extend$1 = _Intact$utils$1.extend;
var isStringOrNumber = _Intact$utils$1.isStringOrNumber;

//from react16 2456 行

var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;

var _createElement = React.createElement;
React.createElement = function createElementWithValidation(type, props, children) {
    var isIntact = type.prototype && type.prototype.$$cid === 'IntactReact';
    var propTypes = type.propTypes;
    if (isIntact && propTypes) {
        type.propTypes = undefined;
    }
    var element = _createElement.apply(this, arguments);
    if (isIntact && propTypes) {
        type.propTypes = propTypes;
    }

    return element;
};

var InheritIntactReact = function (_Intact) {
    inherits(InheritIntactReact, _Intact);

    function InheritIntactReact(props) {
        classCallCheck(this, InheritIntactReact);

        var _this = possibleConstructorReturn(this, _Intact.call(this, props));

        _this.$$ctor = InheritIntactReact.Ctor;
        _this.instance = new _this.$$ctor(props);
        var ignoreKeys = ['constructor', 'props', '_create', '_mount', '_beforeUpdate', '_update', '_destory', 'defaults', 'template', 'setState', 'forceUpdate'];
        var instance = _this.instance;
        var keys = Object.getOwnPropertyNames(instance.__proto__);
        keys = keys.concat(Object.getOwnPropertyNames(instance));
        for (var _iterator = keys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var key = _ref;

            if (!ignoreKeys.includes(key)) {
                if (isFunction$1(instance[key])) {
                    _this[key] = instance[key].bind(_this);
                } else {
                    _this[key] = instance[key];
                }
            }
        }
        return _this;
    }

    InheritIntactReact.prototype._create = function _create() {
        this.$$ctor.getDerivedStateFromProps && this.$$ctor.getDerivedStateFromProps();
        this.componentWillMount && this.componentWillMount();
    };

    InheritIntactReact.prototype._mount = function _mount() {
        this.componentDidMount && this.componentDidMount();
    };

    InheritIntactReact.prototype._beforeUpdate = function _beforeUpdate() {
        this.$$ctor.getDerivedStateFromProps && this.$$ctor.getDerivedStateFromProps();
        this.componentWillReceiveProps && this.componentWillReceiveProps();
        this.componentWillUpdate && this.componentWillUpdate();
        this.shouldComponentUpdate && this.shouldComponentUpdate();
    };

    InheritIntactReact.prototype._update = function _update() {
        this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate();
        this.componentDidUpdate && this.componentDidUpdate();
    };

    InheritIntactReact.prototype._destory = function _destory() {
        this.componentWillUnmount && this.componentWillUnmount();
    };

    InheritIntactReact.prototype.defaults = function defaults$$1() {
        return InheritIntactReact.Ctor.props;
    };

    InheritIntactReact.prototype.template = function template(obj, _Vdt, blocks, $callee) {
        var self = this.data;

        var _conversionChildrenBl = conversionChildrenBlocks(self.instance.render.apply(self)),
            children = _conversionChildrenBl.children;

        if (children.length > 1) {
            throw new Error('children must return only one' + children);
        }
        var vNode = children;
        vNode.children = vNode.props.children;
        return vNode;
    };

    InheritIntactReact.prototype.setState = function setState(state, callback) {
        this.state = state;
        this.set({ state: state });
        isFunction$1(callback) && callback.apply(this);
    };

    InheritIntactReact.prototype.forceUpdate = function forceUpdate(callback) {
        this.update();
        isFunction$1(callback) && callback.apply(this);
    };

    return InheritIntactReact;
}(Intact);

function isReactComponent(type) {
    return isFunction$1(type) && type.prototype.render && type.prototype.isReactComponent && type.prototype.$$cid !== 'IntactReact';
}

function isReactFunctional(type) {
    return isFunction$1(type) && type.prototype.$$cid !== 'IntactReact';
}

function conversionChildrenBlocks(children) {
    if (!children) {
        return {
            children: children,
            _blocks: {}
        };
    }
    if (!isArray$1(children)) {
        children = [children];
    }
    var newChildren = [];
    var newBlocks = {};

    each(children, function (child) {
        if (!child) {
            return;
        }
        var vNode = child;
        if (isStringOrNumber(child)) {
            vNode = new VNode(Types.Text, null, {}, child);
        } else if (isObject$1(child) && child.$$typeof === REACT_ELEMENT_TYPE) {
            var props = conversionProps(extend$1({}, child.attributes, { key: child.key, ref: child.ref }, child.props));
            var type = child.type;
            if (isReactComponent(type)) {
                InheritIntactReact.Ctor = child.type;
                InheritIntactReact.Ctor.props = props;
                type = InheritIntactReact;
            } else if (isReactFunctional(type)) {
                type = function type(props) {
                    var _children = child.type(props);

                    var _conversionChildrenBl2 = conversionChildrenBlocks(_children),
                        children = _conversionChildrenBl2.children;

                    if (children.length > 1) {
                        throw new Error('children must return only one' + children);
                    }
                    var vNode = children;
                    vNode.children = vNode.props.children;
                    return vNode;
                };
            }
            vNode = h(type, props, props.children, null, child.key, child.ref);
        }
        if (isObject$1(vNode.props) && vNode.props.slot) {
            var slotName = vNode.props.slot === undefined || vNode.props.slot === true ? 'default' : vNode.props.slot;
            delete vNode.props.slot;
            newBlocks[slotName] = function (parent) {
                vNode.children = vNode.props.children;
                return vNode;
            };
        } else {
            newChildren.push(vNode);
        }
    });
    if (newChildren.length === 1) {
        newChildren = newChildren[0];
    }
    return {
        children: newChildren,
        _blocks: newBlocks
    };
}

function isEvent(props, key) {
    if (isFunction$1(props[key]) && /^evChanged?-?/.test(key)) {
        return true;
    }
    return false;
}

function isReactEvent(props, key) {
    if (isFunction$1(props[key]) && /^on[A-Z]/.test(key)) {
        return true;
    }
    return false;
}

function conversionProps(props) {
    var _loop = function _loop(key) {
        if (hasOwn.call(props, key)) {
            //兼容 事件类型
            if (isEvent(props, key)) {
                var evEvent = 'ev-' + key.replace(/^evChange(d?)-?(.*)$/, function (text, $1, $2) {
                    if ($2) {
                        return '$change' + $1 + ':' + $2;
                    }
                    return '$change' + $1;
                });
                props[evEvent] = props[key];
                delete props[key];
            }
            if (isReactEvent(props, key)) {
                var _evEvent = 'ev-' + key.replace(/^on([A-Z].*)$/, "$1").toLowerCase();
                props[_evEvent] = props[key];
                delete props[key];
            }
            //兼容 react 支持obj类型的ref
            if (key === 'ref' && isObject$1(props[key])) {
                props[key] = function (i) {
                    props[key].current = i;
                };
            }
            //兼容 children 到 intact 类型
            if (key === 'children' && props['children']) {
                var _conversionChildrenBl3 = conversionChildrenBlocks(props['children']),
                    children = _conversionChildrenBl3.children,
                    _blocks = _conversionChildrenBl3._blocks;

                props['children'] = children;
                props['_blocks'] = _blocks;
            }
        }
    };

    for (var key in props) {
        _loop(key);
    }
    return props;
}

// for webpack alias Intact to IntactReact
var _Intact$utils = Intact.utils;
var get = _Intact$utils.get;
var set = _Intact$utils.set;
var extend = _Intact$utils.extend;
var isObject = _Intact$utils.isObject;
var isArray = _Intact$utils.isArray;
var create = _Intact$utils.create;
var isFunction = _Intact$utils.isFunction;

var IntactReact = function (_Intact) {
    inherits(IntactReact, _Intact);

    IntactReact.functionalWrapper = function functionalWrapper(Wrapper) {
        return function (_IntactReact) {
            inherits(FunctionalClass, _IntactReact);

            function FunctionalClass() {
                classCallCheck(this, FunctionalClass);
                return possibleConstructorReturn(this, _IntactReact.apply(this, arguments));
            }

            FunctionalClass.prototype.template = function template(data) {
                return Wrapper(data.props, true);
            };

            return FunctionalClass;
        }(IntactReact);
    };

    function IntactReact() {
        classCallCheck(this, IntactReact);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var isReactCall = args.length === 2; //react 实例化是会传入两个参数  , 故使用此判断 是否为react 调用实例

        var _this = possibleConstructorReturn(this, _Intact.call.apply(_Intact, [this].concat(args)));

        if (isReactCall) {
            _this.$$innerInstance = undefined;
            _this.props = args[0]; //react 需要验证props 全等 ,蛋疼
            _this.$$wrapDom = null;
            _this.$$props = extend({}, _this.props);
        }
        return _this;
    }

    IntactReact.prototype.componentDidMount = function componentDidMount() {
        var parentElement = this.$$wrapDom.parentElement;
        //重新初始化并创建节点 , 替换已存在节点
        this.$$innerInstance = new this.constructor(conversionProps(this.$$props));
        parentElement.replaceChild(this.$$innerInstance.init(), this.$$wrapDom);
        this.$$innerInstance.mount();
    };

    IntactReact.prototype.componentWillUnmount = function componentWillUnmount() {
        this.$$innerInstance && this.$$innerInstance.destroy();
    };

    IntactReact.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState, snapshot) {
        // 更新实例
        this.$$innerInstance && this.$$innerInstance.set(conversionProps(this.$$props));
    };

    IntactReact.prototype.render = function render() {
        var _this3 = this;

        this.$$props = extend(this.$$props, this.props);
        return React.createElement('i', extend({}, {
            ref: function ref(element) {
                _this3.$$wrapDom = element;
            }
        }), '');
    };

    createClass(IntactReact, [{
        key: '$$cid',
        get: function get() {
            return 'IntactReact';
        }
    }, {
        key: 'isMounted',
        get: function get() {
            return this.mounted;
        }
    }, {
        key: 'isReactComponent',
        get: function get() {
            return {};
        }
    }]);
    return IntactReact;
}(Intact);

module.exports = IntactReact;
