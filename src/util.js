import Intact from 'intact/dist';

const h = Intact.Vdt.miss.h;
const Types = Intact.Vdt.miss.Types;
const VNode = Intact.Vdt.miss.VNode;
const {each, isFunction, isString, isArray, isObject, hasOwn, create, extend, isStringOrNumber} = Intact.utils;

//from react16 2456 行
let hasSymbol = typeof Symbol === 'function' && Symbol.for;
let REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;


function unfreeze(o) {
    let u = extend({}, o);
    u.__proto__ = o.__proto__;
    u.constructor = o.constructor;
    return u
}

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
        if (!child) {
            return
        }
        let vNode = child;
        if (isStringOrNumber(child)) {
            vNode = new VNode(Types.Text, null, {}, child);
        } else if (isObject(child) && child.$$typeof === REACT_ELEMENT_TYPE) {
            let props = conversionProps(extend({}, child.attributes, child.props));
            let type = child.type;
            if (isFunction(child.type) &&
                child.type.prototype.$$cid !== 'IntactReact') {
                type = conversionIntact(child.type, props);
            }
            vNode = h(
                type,
                props,
                null,
                null,
                child.key,
                child.ref
            );
        }
        if (isObject(vNode.props) && vNode.props.slot) {
            const slotName = vNode.props.slot || 'default';
            newBlocks[slotName] = vNode;
        } else {
            newChildren.push(vNode);
        }
    });
    if (newChildren.length === 1) {
        newChildren = newChildren[0]
    }
    return {
        children: newChildren,
        _blocks: newBlocks
    };
}

function conversionIntact(ctor, props) {
    const instance = new ctor(props);

    class InheritIntactReact extends Intact {
        constructor(props) {
            super(props);
            for (let key in instance) {
                if (hasOwn.call(instance, key) &&
                    key !== 'props'
                ) {
                    if (isFunction(instance[key])) {
                        this[key] = instance[key].bind(this);
                    } else {
                        this[key] = instance[key];
                    }
                }
            }
            this.on('$mounted', () => {
                this.componentDidMount && this.componentDidMount();
            });
            this.on('$destroyed', () => {
                this.componentWillUnmount && this.componentWillUnmount();
            });
        }

        _update() {
            this.props = conversionProps(extend({}, props, {state: instance.state}));
            this.shouldComponentUpdate && this.shouldComponentUpdate();
            this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate();
            this.componentDidUpdate && this.componentDidUpdate()
        }

        defaults() {
            return conversionProps(extend({}, props, {state: instance.state}))
        }

        template(obj, _Vdt, blocks, $callee) {
            let self = this.data;
            const {children} = conversionChildrenBlocks(instance.render.apply(self));
            if (children.length > 1) {
                throw new Error('children must return only one' + children);
            }
            const vNode = children;
            vNode.children = vNode.props.children;
            return vNode
        }

        setState(state, callback) {
            this.set({state});
            this.state = state;
            console.log(this.state, '++===');
            this.vNode = this.vdt.template();
            this.update();
            isFunction(callback) && callback.apply(this);
        }

        forceUpdate(callback) {
            this.update();
            isFunction(callback) && callback.apply(this);
        }
    }

    return InheritIntactReact;
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
            if (isEvent(props, key)) {
                props[`ev-${key.substr(2, 1).toLowerCase()}${key.substr(3)}`] = props[key];
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
    conversionProps,
    unfreeze
}
