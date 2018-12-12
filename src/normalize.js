import Intact from 'intact/dist';
import Wrapper from './Wrapper';
import createElement from './createElement';

const {h, VNode} = Intact.Vdt.miss;
const {isFunction, isArray, isStringOrNumber, set, get} = Intact.utils;

export function normalize(vNode, parentRef) {
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
        return h(
            vNode.type,
            normalizeProps(
                {...vNode.props, parentRef}, 
                {_context: vNode._owner && vNode._owner.stateNode},
                parentRef,
                vNode.key
            ),
            null,
            null,
            vNode.key,
            vNode.ref
        );
    }

    // only wrap the react host element
    return h(Wrapper, {reactVNode: vNode, parentRef});
}

export function normalizeChildren(vNodes, parentRef = {}) {
    if (isArray(vNodes)) {
        return vNodes.map(vNode => normalize(vNode, parentRef));
    }
    return normalize(vNodes, parentRef);
}

export function normalizeProps(props, context, parentRef, key) {
    if (!props) return;

    const _props = {};
    const _blocks = _props._blocks = {};
    let tmp;
    for (let key in props) {
        if (key === 'children') {
            _props.children = normalizeChildren(props.children, parentRef);
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
    if (key != null) {
        _props.key = key;
    }

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
            return normalizeChildren(block.apply(this, args), {instance: this.data});
        }
    } else {
        return function() {
            return normalizeChildren(block, {instance: this.data});
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
