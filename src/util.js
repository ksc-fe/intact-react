import Intact from 'intact/dist';

const h = Intact.Vdt.miss.h;
const {each, isFunction, isString, isArray, isObject, hasOwn, create, extend} = Intact.utils;

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
        if (isString(child)) {
            vNode = child
        } else if (isObject(child) &&
            child.$$typeof === REACT_ELEMENT_TYPE &&
            isFunction(child.type)
        ) {

            const props = extend({}, child.props);
            let type = child.type;
            if (child.type.prototype.$$cid !== 'IntactReact') {
                type = conversionIntact(child.type, props);
            }

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
            const slotName = child.props.slot || 'default';
            newBlocks[slotName] = vNode;
        } else {
            newChildren.push(vNode);
        }
    });
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
                    this[key] = instance[key];
                }
            }
            this.on('$mounted', () => {
                this.componentDidMount && this.componentDidMount();
            });
            this.on('$destroyed', () => {
                this.componentWillUnmount && this.componentWillUnmount();
            });
            this._update = () => {
                this.shouldComponentUpdate && this.shouldComponentUpdate();
                this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate();
                this.componentDidUpdate && this.componentDidUpdate()
            }
        }

        defaults() {
            return conversionProps(extend({}, props, instance.state))
        }

        static template = Intact.Vdt.compile('<!--{self.children}-->')

        setState(state, callback) {
            this.set(state);
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
    conversionProps,
    unfreeze
}
