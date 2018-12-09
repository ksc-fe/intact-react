import Intact from 'intact/dist';
import Wrapper from './Wrapper';
import createElement from './createElement';

const h = Intact.Vdt.miss.h;
const {isFunction, isArray, isStringOrNumber, set, get} = Intact.utils;

export function normalize(vNode) {
    if (vNode == null) return vNode;
    // handle string and number by intact directly
    if (isStringOrNumber(vNode)) return vNode;

    return h(Wrapper, {reactVNode: vNode});
}

export function normalizeChildren(vNodes) {
    if (isArray(vNodes)) {
        return vNodes.map(vNode => normalize(vNode));
    }
    return normalize(vNodes);
}

export function normalizeProps(props, context) {
    if (!props) return;

    const _props = {};
    const _blocks = _props._blocks = {};
    let tmp;
    for (let key in props) {
        if (key === 'children') {
            _props.children = normalizeChildren(props.children);
        } else if ((tmp = getEventName(key))){
            _props[tmp] = props[key];
        } else if (key.substring(0, 2) === 'b-') {
            // is a block
            _blocks[key.substring(2)] = normalizeBlock(props[key]); 
        } else {
            _props[key] = props[key];
        }
    }

    _props._context = normalizeContext(context);

    return _props;
}

export function normalizeContext(context) {
    const _context = context._context;
    return {
        data: {
            get(name) {
                if (name != null) {
                    return get(_context.state, name);
                } else {
                    return _context.state;
                }
            },

            set(name, value) {
                const state = {..._context.state};
                set(state, name, value);
                _context.setState(state);
            }
        }
    }
}

export function normalizeBlock(block) {
    if (isFunction(block)) {
        return function(parent, ...args) {
            return normalizeChildren(block.apply(this, args));
        }
    } else {
        return function() {
            return normalizeChildren(block);
        }
    }
}

export function getEventName(propName) {
    const [first, second, third] = propName;
    let tmp;
    if (first === 'o' && second === 'n') {
        if (third === '$') {
            // e.g. on$change-value
            return `ev-$${propName.substring(3).replace(/\-/g, ':')}`;
        } else if ((tmp = third.charCodeAt(0)) && tmp >= 65 && tmp <= 90) {
            // e.g. onClick
            return `ev-${propName.substring(2).toLowerCase()}`;
        }
    }
}
