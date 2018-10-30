import Intact from 'intact/dist';

const h = Intact.Vdt.miss.h;
const Types = Intact.Vdt.miss.Types;
const VNode = Intact.Vdt.miss.VNode;
const {each, isFunction, isString, isArray, isObject, hasOwn, create, extend, isStringOrNumber} = Intact.utils;

//from react16 2456 行
let hasSymbol = typeof Symbol === 'function' && Symbol.for;
let REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;


class InheritIntactReact extends Intact {
    constructor(props) {
        super(props);
        this.$$ctor = InheritIntactReact.Ctor;
        this.instance = new this.$$ctor(props);
        const ignoreKeys = [
            'constructor',
            'props',
            '_create',
            '_mount',
            '_beforeUpdate',
            '_update',
            '_destory',
            'defaults',
            'template',
            'setState',
            'forceUpdate',
        ];
        const instance = this.instance;
        let keys = Object.getOwnPropertyNames(instance.__proto__);
        keys = keys.concat(Object.getOwnPropertyNames(instance));
        for (let key of keys) {
            if (!ignoreKeys.includes(key)) {
                if (isFunction(instance[key])) {
                    this[key] = instance[key].bind(this);
                } else {
                    this[key] = instance[key];
                }
            }
        }
    }

    _create() {
        this.$$ctor.getDerivedStateFromProps && this.$$ctor.getDerivedStateFromProps();
        this.componentWillMount && this.componentWillMount();
    }

    _mount() {
        this.componentDidMount && this.componentDidMount();
    }

    _beforeUpdate() {
        this.$$ctor.getDerivedStateFromProps && this.$$ctor.getDerivedStateFromProps();
        this.componentWillReceiveProps && this.componentWillReceiveProps();
        this.componentWillUpdate && this.componentWillUpdate();
        this.shouldComponentUpdate && this.shouldComponentUpdate();
    }

    _update() {
        this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate();
        this.componentDidUpdate && this.componentDidUpdate()
    }

    _destory() {
        this.componentWillUnmount && this.componentWillUnmount();

    }

    defaults() {
        return InheritIntactReact.Ctor.props
    }

    template(obj, _Vdt, blocks, $callee) {
        let self = this.data;
        const {children} = conversionChildrenBlocks(self.instance.render.apply(self));
        if (children.length > 1) {
            throw new Error('children must return only one' + children);
        }
        const vNode = children;
        vNode.children = vNode.props.children;
        return vNode
    }

    setState(state, callback) {
        this.state = state;
        this.set({state});
        isFunction(callback) && callback.apply(this);
    }

    forceUpdate(callback) {
        this.update();
        isFunction(callback) && callback.apply(this);
    }
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
            if (isFunction(type) &&
                type.prototype.render &&
                type.prototype.isReactComponent) {
                InheritIntactReact.Ctor = child.type;
                InheritIntactReact.Ctor.props = props;
                type = InheritIntactReact;
            } else if (isFunction(type)) {
                type = (props) => {
                    const _children = child.type(props);
                    const {children} = conversionChildrenBlocks(_children);
                    if (children.length > 1) {
                        throw new Error('children must return only one' + children);
                    }
                    const vNode = children;
                    vNode.children = vNode.props.children;
                    return vNode
                }
            }
            vNode = h(
                type,
                props,
                props.children,
                null,
                child.key,
                child.ref
            );
        }
        if (isObject(vNode.props) && vNode.props.slot) {
            const slotName = (vNode.props.slot === undefined || vNode.props.slot === true) ? 'default' : vNode.props.slot;
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
        newChildren = newChildren[0]
    }
    return {
        children: newChildren,
        _blocks: newBlocks
    };
}


function isEvent(props, key) {
    if (isFunction(props[key]) && /^on[A-Z]/.test(key)) {
        return true
    }
    return false;
}


function conversionProps(props, init) {
    for (let key in props) {
        if (hasOwn.call(props, key)) {
            //兼容 事件类型
            if (isEvent(props, key)) {
                const evEvent = `ev-${key.replace(/^on([A-Z].*)$/, "$1").toLowerCase()}`;
                props[evEvent] = props[key];
                delete props[key];
            }
            //兼容 react 支持obj类型的ref
            if (key === 'ref' && _.isObject(props[key])) {
                props[key] = (i) => {
                    props[key].current = i
                }
            }
            //兼容 children 到 intact 类型
            if (key === 'children' && props['children'] && init !== false) {
                let {children, _blocks} = conversionChildrenBlocks(props['children']);
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
