import Intact from 'intact/dist';

const h = Intact.Vdt.miss.h;
const {each, isFunction, isString, isArray, isObject, hasOwn, create, extend} = Intact.utils;

//from react16 2456 行
let hasSymbol = typeof Symbol === 'function' && Symbol.for;
let REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;


function conversionChildrenBlocks(children) {
    if (!children) {
        return {
            children,
            _blocks: {}
        }
    }
    if (!isArray(children)) {
        children = [children]
    }
    let newChildren = []
    let newBlocks = {}
    each(children, (child) => {
        let vNode = child;
        if (isString(child)) {
            vNode = children
        }
        if (isObject(child) && isFunction(child.type) && child.$$typeof === REACT_ELEMENT_TYPE) {
            const type = inherit(child.type, Intact);
            const props = extend({}, child.props);
            vNode = h(
                type,
                conversionProps(props),
                null,
                null,
                child.key,
                child.ref
            );
        }
        if (isObject(child.props) && child.props.slot) {
            newBlocks[child.props.slot] = vNode;
        } else {
            newChildren.push(vNode);
        }
    });
    return {
        children: newChildren,
        _blocks: newBlocks
    };
}

function inherit(o, prototype) {
    let IntactReact = function IntactReact() {
        let _len = arguments.length;
        let args = Array(_len);

        for (let _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        const self = new o(args);

        self.props = self.props || {};
        self.template = function () {
            return [' ']
            // return conversionChildrenBlocks(self.render());
        }

        for (let key in self.state) {
            if (!hasOwn.call(self.state, key)) {
                self.props[key] = self.state[key];
            }
        }

        self.setState = (state, callback) => {
            self.set(state);
            isFunction(callback) && callback.apply(self);
        };

        self.forceUpdate = (callback) => {
            self.update();
            isFunction(callback) && callback.apply(self);
        };

        return prototype.apply(self, args);
    };

    IntactReact.prototype = create(prototype);
    IntactReact.prototype.__proto__ = prototype;
    IntactReact.prototype.constructor = IntactReact;
    for (let key in o) {
        if (!hasOwn.call(IntactReact, key)) {
            IntactReact[key] = o[key];
        }
    }
    return IntactReact
}

function isEvent(props, key) {
    if (isFunction(props[key]) && /^on[A-Z]/.test(key)) {
        return true
    }
    return false;
}


function conversionProps(props) {
    for (let key in props) {
        if (hasOwn.call(props, key)) {
            if (isEvent[props]) {
                props[`ev-${key.substr(2)}`] = props[key];
            }
            let _children = props['children'];
            if (_children) {
                let {children, _blocks} = conversionChildrenBlocks(_children);
                props['children'] = children;
                props['_blocks'] = _blocks;
            }
        }
    }
    return props;
}


export {
    conversionProps
}
