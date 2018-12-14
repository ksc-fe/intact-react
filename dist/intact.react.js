(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('intact/dist'), require('react-dom')) :
	typeof define === 'function' && define.amd ? define(['react', 'intact/dist', 'react-dom'], factory) :
	(global.Intact = factory(global.React,global.Intact,global.ReactDOM));
}(this, (function (React,Intact,ReactDOM) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;
Intact = Intact && Intact.hasOwnProperty('default') ? Intact['default'] : Intact;
ReactDOM = ReactDOM && ReactDOM.hasOwnProperty('default') ? ReactDOM['default'] : ReactDOM;

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







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



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

// make sure all mount/update lifecycle methods of children have completed
var FakePromise = function () {
    function FakePromise(callback) {
        var _this = this;

        classCallCheck(this, FakePromise);

        this.resolved = false;
        this.callbacks = [];
        callback.call(this, function () {
            return _this.resolve();
        });
    }

    FakePromise.prototype.resolve = function resolve() {
        this.resolved = true;
        var cb = void 0;
        while (cb = this.callbacks.shift()) {
            cb();
        }
    };

    FakePromise.prototype.then = function then(cb) {
        this.callbacks.push(cb);
        if (this.resolved) {
            this.resolve();
        }
    };

    return FakePromise;
}();

FakePromise.all = function (promises) {
    var resolvedCount = 0;
    var callback = void 0;
    var resolved = false;
    var done = false;

    promises.forEach(function (p) {
        return p.then(then);
    });

    if (promises._hasRewrite) {
        console.error('promises has not been done');
    }
    var push = promises.push;
    promises.push = function (p) {
        p.then(then);
        push.call(promises, p);
    };
    promises._hasRewrite = true;

    function _cb() {
        // clear array
        promises.length = 0;
        promises.push = push;
        promises._hasRewrite = false;
        callback();
    }

    function then() {
        resolvedCount++;
        if (promises.length === resolvedCount) {
            resolved = true;
            if (done) {
                return console.error('promise has done');
            }
            if (callback) {
                done = true;
                _cb();
            }
        }
    }

    return {
        then: function then(cb) {
            callback = cb;
            if (!promises.length || resolved) {
                _cb();
            }
        }
    };
};

var ignorePropRegExp = /_ev[A-Z]/;

// wrap the react element to render it by react self

var Wrapper = function () {
    function Wrapper() {
        classCallCheck(this, Wrapper);
    }

    Wrapper.prototype.init = function init(lastVNode, nextVNode) {
        // let the component destroy by itself
        this.destroyed = true;
        // react can use comment node as parent so long as its text like bellow
        this.placeholder = document.createComment(' react-mount-point-unstable ');
        this._render(nextVNode);

        return this.placeholder;
    };

    Wrapper.prototype.update = function update(lastVNode, nextVNode) {
        this._render(nextVNode);

        return this.placeholder;
    };

    Wrapper.prototype.destroy = function destroy() {
        // remove the placeholder after react has unmount it
        var placeholder = this.placeholder;
        placeholder._unmount = function () {
            ReactDOM.render(null, placeholder, function () {
                placeholder.parentNode.removeChild(placeholder);
            });
        };
    };

    Wrapper.prototype._render = function _render(nextVNode) {
        var _this = this;

        var vNode = this._addProps(nextVNode);

        var parentComponent = nextVNode.props.parentRef.instance;
        if (parentComponent) {
            if (!parentComponent._reactInternalFiber) {
                // is a firsthand intact component, get its parent instance
                parentComponent = parentComponent.get('parentRef').instance;
            }
        } else {
            // maybe the property which value is vNodes
            // find the closest IntactReact instance
            var parentVNode = nextVNode.parentVNode;
            while (parentVNode) {
                var children = parentVNode.children;
                if (children && children._reactInternalFiber !== undefined) {
                    parentComponent = children;
                    break;
                }
                parentVNode = parentVNode.parentVNode;
            }
        }
        var promise = new FakePromise(function (resolve) {
            // the parentComponent should always be valid
            // if (parentComponent && parentComponent._reactInternalFiber !== undefined) {
            ReactDOM.unstable_renderSubtreeIntoContainer(parentComponent, vNode, _this.placeholder, function () {
                // if the parentVNode is a Intact component, it indicates that
                // the Wrapper node is returned by parent component directly
                // in this case we must fix the element property of parent component
                var dom = ReactDOM.findDOMNode(this);
                var parentVNode = nextVNode.parentVNode;
                while (parentVNode && parentVNode.tag && parentVNode.tag.$$cid === 'IntactReact') {
                    parentVNode.children.element = dom;
                    parentVNode = parentVNode.parentVNode;
                }
                resolve();
            });
            // } else {
            // ReactDOM.render(vNode, this.placeholder, resolve);
            // }
        });
        parentComponent.promises.push(promise);
    };

    // we can change props in intact, so we should sync the changes


    Wrapper.prototype._addProps = function _addProps(vNode) {
        // for Intact reusing the dom
        this.vdt = { vNode: vNode };

        var props = vNode.props;
        // react vNode has been frozen, so we must clone it to change
        var cloneVNode = void 0;
        var _props = void 0;
        for (var key in props) {
            if (key === 'reactVNode' || key === 'parentRef') continue;
            // ignore _evClick _evMouseEnter property which add in some components temporarily
            if (ignorePropRegExp.test(key)) continue;
            if (!cloneVNode) {
                cloneVNode = _extends({}, props.reactVNode);
                _props = cloneVNode.props = _extends({}, cloneVNode.props);
            }
            var prop = props[key];
            // is event
            if (key.substr(0, 3) === 'ev-') {
                _props[eventsMap[key]] = prop;
            } else {
                _props[key] = prop;
            }
        }

        return cloneVNode || props.reactVNode;
    };

    return Wrapper;
}();

var eventsMap = {
    'ev-click': 'onClick',
    'ev-mouseenter': 'onMouseEnter',
    'ev-mouseleave': 'onMouseLeave'
};

// let React don't validate Intact component's props
var _createElement = React.createElement;
function createElement(type, props, children) {
    var isIntact = type.$$cid === 'IntactReact';
    var propTypes = type.propTypes;
    if (isIntact && propTypes) {
        type.propTypes = undefined;
    }
    var element = _createElement.apply(this, arguments);
    if (isIntact && propTypes) {
        type.propTypes = propTypes;
    }

    return element;
}

React.createElement = createElement;

// let findDOMNode to get the element of intact component
var _findDOMNode = ReactDOM.findDOMNode;
ReactDOM.findDOMNode = function (component) {
    if (component instanceof IntactReact) {
        return component.element;
    }

    return _findDOMNode.call(ReactDOM, component);
};

var _Intact$Vdt$miss = Intact.Vdt.miss;
var h$1 = _Intact$Vdt$miss.h;
var VNode = _Intact$Vdt$miss.VNode;
var _Intact$utils$1 = Intact.utils;
var isFunction = _Intact$utils$1.isFunction;
var isObject$1 = _Intact$utils$1.isObject;
var isArray$1 = _Intact$utils$1.isArray;
var isStringOrNumber = _Intact$utils$1.isStringOrNumber;
var _set = _Intact$utils$1.set;
var _get = _Intact$utils$1.get;


function normalize(vNode, parentRef) {
    if (vNode == null) return vNode;
    // handle string and number by intact directly
    if (isStringOrNumber(vNode)) return vNode;
    // maybe return by functional component
    if (vNode instanceof VNode) {
        // update parentRef
        if (vNode.tag === Wrapper) {
            vNode.props.parentRef = parentRef;
        }
        return vNode;
    }
    // normalizde the firsthand intact component to let intact access its children
    if (vNode.type && vNode.type.$$cid === 'IntactReact') {
        return h$1(vNode.type, normalizeProps(_extends({}, vNode.props, { parentRef: parentRef }), { _context: vNode._owner && vNode._owner.stateNode }, parentRef, vNode.key), null, null, vNode.key, normalizeRef(vNode.ref));
    }

    // only wrap the react host element
    return h$1(Wrapper, { reactVNode: vNode, parentRef: parentRef });
}

function normalizeChildren(vNodes) {
    var parentRef = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (isArray$1(vNodes)) {
        return vNodes.map(function (vNode) {
            return normalize(vNode, parentRef);
        });
    }
    return normalize(vNodes, parentRef);
}

function normalizeProps(props, context, parentRef, key) {
    if (!props) return;

    var _props = {};
    var _blocks = _props._blocks = {};
    var tmp = void 0;
    for (var _key in props) {
        if (_key === 'children') {
            _props.children = normalizeChildren(props.children, parentRef);
        } else if (tmp = getEventName(_key)) {
            _props[tmp] = props[_key];
        } else if (_key.substring(0, 2) === 'b-') {
            // is a block
            _blocks[_key.substring(2)] = normalizeBlock(props[_key]);
        } else {
            _props[_key] = props[_key];
        }
    }

    _props._context = normalizeContext(context);
    if (key != null) {
        _props.key = key;
    }

    return _props;
}

function normalizeRef(ref) {
    return isObject$1(ref) ? function (i) {
        ref.current = i;
    } : ref;
}

function normalizeContext(context) {
    var _context = context._context;
    return {
        data: {
            get: function get$$1(name) {
                if (name != null) {
                    return _get(_context.state || {}, name);
                } else {
                    return _context.state || {};
                }
            },
            set: function set$$1(name, value) {
                var state = _extends({}, _context.state);
                _set(state, name, value);
                _context.setState(state);
            }
        }
    };
}

function normalizeBlock(block) {
    if (isFunction(block)) {
        return function (parent) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key2 = 1; _key2 < _len; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            return normalizeChildren(block.apply(this, args), { instance: this.data });
        };
    } else {
        return function () {
            return normalizeChildren(block, { instance: this.data });
        };
    }
}

function getEventName(propName) {
    var first = propName[0],
        second = propName[1],
        third = propName[2];

    var tmp = void 0;
    if (first === 'o' && second === 'n') {
        if (third === '$') {
            // e.g. on$change-value
            return 'ev-$' + propName.substring(3).replace(/\-/g, ':');
        } else if ((tmp = third.charCodeAt(0)) && tmp >= 65 && tmp <= 90) {
            // e.g. onClick
            return 'ev-' + propName.substring(2).toLowerCase();
        }
    }
}

var _Intact$utils$2 = Intact.utils;
var isStringOrNumber$1 = _Intact$utils$2.isStringOrNumber;
var isArray$2 = _Intact$utils$2.isArray;
var noop$1 = _Intact$utils$2.noop;

// wrap the functional component of intact

function functionalWrapper(Component) {
    function Ctor(props, context) {
        if (context) {
            // invoked by React
            var vNodes = Component(normalizeProps(props, context, {}), true);
            if (isArray$2(vNodes)) {
                return vNodes.map(function (vNode) {
                    return normalizeIntactVNodeToReactVNode(vNode);
                });
            }
            return normalizeIntactVNodeToReactVNode(vNodes);
        } else {
            // invoked by Intact
            return Component(props);
        }
    }

    Ctor.contextTypes = {
        _context: noop$1
    };

    return Ctor;
}

function normalizeIntactVNodeToReactVNode(vNode) {
    if (isStringOrNumber$1(vNode)) {
        return vNode;
    } else if (vNode) {
        return createElement(vNode.tag, vNode.props, vNode.props.children || vNode.children);
    }
}

// for webpack alias Intact to IntactReact
var _Intact$utils = Intact.utils;
var noop = _Intact$utils.noop;
var isArray = _Intact$utils.isArray;
var isObject = _Intact$utils.isObject;

var h = Intact.Vdt.miss.h;

var IntactReact = function (_Intact) {
    inherits(IntactReact, _Intact);

    function IntactReact(props, context) {
        classCallCheck(this, IntactReact);

        // React will pass context to constructor 
        if (context) {
            var parentRef = {};
            var normalizedProps = normalizeProps(props, context, parentRef);

            var _this = possibleConstructorReturn(this, _Intact.call(this, normalizedProps));

            parentRef.instance = _this;

            _this.promises = context.promises || [];
            _this.mountedQueue = context.parent && context.parent.mountedQueue;

            // fake the vNode
            _this.vNode = h(_this.constructor, normalizedProps);
            _this.vNode.children = _this;

            // We must keep the props to be undefined, 
            // otherwise React will think it has mutated
            _this._props = _this.props;
            delete _this.props;
            _this._isReact = true;
        } else {
            var _this = possibleConstructorReturn(this, _Intact.call(this, props));
        }
        return possibleConstructorReturn(_this);
    }

    IntactReact.prototype.getChildContext = function getChildContext() {
        return {
            parent: this,
            promises: this.promises
        };
    };

    IntactReact.prototype.get = function get$$1() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        if (this._isReact) {
            var _Intact$prototype$get;

            var props = this.props;
            this.props = this._props;
            var result = (_Intact$prototype$get = _Intact.prototype.get).call.apply(_Intact$prototype$get, [this].concat(args));
            this.props = props;
            return result;
        } else {
            var _Intact$prototype$get2;

            return (_Intact$prototype$get2 = _Intact.prototype.get).call.apply(_Intact$prototype$get2, [this].concat(args));
        }
    };

    IntactReact.prototype.set = function set$$1() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        if (this._isReact) {
            var _Intact$prototype$set;

            var props = this.props;
            this.props = this._props;
            var result = (_Intact$prototype$set = _Intact.prototype.set).call.apply(_Intact$prototype$set, [this].concat(args));
            this.props = props;
            return result;
        } else {
            var _Intact$prototype$set2;

            return (_Intact$prototype$set2 = _Intact.prototype.set).call.apply(_Intact$prototype$set2, [this].concat(args));
        }
    };

    IntactReact.prototype.init = function init(lastVNode, nextVNode) {
        this.__pushGetChildContext(nextVNode);
        var element = _Intact.prototype.init.call(this, lastVNode, nextVNode);
        this.__popGetChildContext();
        return element;
    };

    IntactReact.prototype.update = function update(lastVNode, nextVNode, fromPending) {
        var _this2 = this;

        var update = function update() {
            _this2.__pushGetChildContext(nextVNode);
            var element = _Intact.prototype.update.call(_this2, lastVNode, nextVNode, fromPending);
            _this2.__popGetChildContext();
            return element;
        };

        if (!this._isReact) return update();

        this.__initMountedQueue();

        var element = update();

        this.__triggerMountedQueue();

        return element;
    };

    IntactReact.prototype.__pushGetChildContext = function __pushGetChildContext(nextVNode) {
        var parentRef = nextVNode && nextVNode.props.parentRef;
        var parentInstance = parentRef && parentRef.instance;
        if (parentInstance) {
            var self = this;
            this.__getChildContext = parentInstance.getChildContext;
            parentInstance.getChildContext = function () {
                var context = self.__getChildContext.call(this);
                return _extends({}, context, { parent: self });
            };
        }

        this.__parentInstance = parentInstance;
    };

    IntactReact.prototype.__popGetChildContext = function __popGetChildContext() {
        if (this.__parentInstance) {
            this.__parentInstance.getChildContext = this.__getChildContext;
        }
    };

    IntactReact.prototype.componentDidMount = function componentDidMount() {
        var _this3 = this;

        this.__initMountedQueue();

        // disable intact async component
        this.inited = true;

        // add parentVNode
        this.parentVNode = this.vNode.parentVNode = this.context.parent && this.context.parent.vNode;

        var dom = this.init(null, this.vNode);
        var parentElement = this._placeholder.parentElement;
        parentElement.replaceChild(dom, this._placeholder);
        // persist the placeholder to let parentNode to remove the real dom
        this._placeholder._realElement = dom;
        if (!parentElement._hasRewrite) {
            var removeChild = parentElement.removeChild;
            parentElement.removeChild = function (child) {
                removeChild.call(this, child._realElement || child);
            };
            parentElement._hasRewrite = true;
        }

        // add mount lifecycle method to queue
        this.mountedQueue.push(function () {
            _this3.mount();
        });

        this.__triggerMountedQueue();
    };

    IntactReact.prototype.componentWillUnmount = function componentWillUnmount() {
        this.destroy();
    };

    IntactReact.prototype.componentDidUpdate = function componentDidUpdate() {
        this.__initMountedQueue();

        var vNode = h(this.constructor, normalizeProps(this.props, this.context, { instance: this }));
        var lastVNode = this.vNode;
        vNode.children = this;
        this.vNode = vNode;
        this.parentVNode = vNode.parentVNode = this.context.parent && this.context.parent.vNode;

        this.update(lastVNode, vNode);

        this.__triggerMountedQueue();
    };

    IntactReact.prototype.__ref = function __ref(element) {
        this._placeholder = element;
    };

    IntactReact.prototype.render = function render() {
        return React.createElement('i', {
            ref: this.__ref
        });
    };

    // we should promise that all intact components have been mounted
    IntactReact.prototype.__initMountedQueue = function __initMountedQueue() {
        this.__oldTriggerFlag = this._shouldTrigger;
        this._shouldTrigger = false;
        if (!this.mountedQueue || this.mountedQueue.done) {
            // get from parent
            var tmp = void 0;
            if ((tmp = this.context) && (tmp = tmp.parent) && (tmp = tmp.mountedQueue)) {
                if (!tmp.done) {
                    this.mountedQueue = tmp;
                    return;
                }
            }
            this._shouldTrigger = true;
            this._initMountedQueue();
        }
    };

    IntactReact.prototype.__triggerMountedQueue = function __triggerMountedQueue() {
        var _this4 = this;

        if (this._shouldTrigger) {
            FakePromise.all(this.promises).then(function () {
                _this4._triggerMountedQueue();
            });
        }
        this._shouldTrigger = this.__oldTriggerFlag;
    };

    createClass(IntactReact, [{
        key: 'isMounted',
        get: function get$$1() {
            return this.mounted;
        }
    }]);
    return IntactReact;
}(Intact);

// for workInProgress.tag detection 


IntactReact.functionalWrapper = functionalWrapper;
IntactReact.normalize = normalizeChildren;
IntactReact.$$cid = 'IntactReact';
IntactReact.prototype.isReactComponent = {};
// for getting _context in Intact
IntactReact.contextTypes = {
    _context: noop,
    parent: noop,
    promises: noop
};
IntactReact.childContextTypes = {
    parent: noop,
    promises: noop
};

return IntactReact;

})));
