import React from 'react';
// for webpack alias Intact to IntactReact
import Intact from 'intact/dist';
import {normalizeProps, normalizeChildren} from './normalize'
import functionalWrapper from './functionalWrapper';
import FakePromise from './FakePromise'; 

const {noop, isArray, isObject} = Intact.utils;
const h = Intact.Vdt.miss.h;

class IntactReact extends Intact {
    static functionalWrapper = functionalWrapper;

    static normalize = normalizeChildren;

    static $$cid = 'IntactReact';

    constructor(props, context) {
        // React will pass context to constructor 
        if (context) {
            const parentRef = {};
            const normalizedProps = normalizeProps(props, context, parentRef);
            super(normalizedProps);
            parentRef.instance = this;

            this.promises = context.promises || [];
            this.mountedQueue = context.parent && context.parent.mountedQueue;

            // fake the vNode
            this.vNode = h(this.constructor, normalizedProps);
            this.vNode.children = this;

            // We must keep the props to be undefined, 
            // otherwise React will think it has mutated
            this._props = this.props; 
            delete this.props;
            this._isReact = true;
        } else {
            super(props);
        }
    }

    getChildContext() {
        return {
            parent: this,
            promises: this.promises,
        };
    }

    get(...args) {
        if (this._isReact) {
            const props = this.props;
            this.props = this._props;
            const result = super.get(...args);
            this.props = props;
            return result;
        } else {
            return super.get(...args);
        }
    }

    set(...args) {
        if (this._isReact) {
            const props = this.props;
            this.props = this._props;
            const result = super.set(...args);
            this.props = props;
            return result;
        } else {
            return super.set(...args);
        }
    }

    init(lastVNode, nextVNode) {
        this.__pushGetChildContext(nextVNode);
        const element = super.init(lastVNode, nextVNode);
        this.__popGetChildContext();
        return element;
    }

    update(lastVNode, nextVNode, fromPending) {
        const update = () => {
            this.__pushGetChildContext(nextVNode);
            const element = super.update(lastVNode, nextVNode, fromPending);
            this.__popGetChildContext();
            return element;
        }

        if (!this._isReact) return update();

        const oldTriggerFlag = this._shouldTrigger;
        this.__initMountedQueue();

        const element = update();

        this.__triggerMountedQueue();
        this._shouldTrigger = oldTriggerFlag;

        return element;
    }

    __pushGetChildContext(nextVNode) {
        const parentRef = nextVNode && nextVNode.props.parentRef;
        const parentInstance = parentRef && parentRef.instance;
        if (parentInstance)  {
            const self = this;
            this.__getChildContext = parentInstance.getChildContext;
            parentInstance.getChildContext = function() {
                const context = self.__getChildContext.call(this);
                return {...context, parent: self};
            };
        }

        this.__parentInstance = parentInstance;
    }

    __popGetChildContext() {
        if (this.__parentInstance) {
            this.__parentInstance.getChildContext = this.__getChildContext;
        }
    }

    componentDidMount() {
        const oldTriggerFlag = this._shouldTrigger;
        this.__initMountedQueue();

        // disable intact async component
        this.inited = true;

        // add parentVNode
        this.parentVNode = this.vNode.parentVNode = this.context.parent && this.context.parent.vNode;

        const dom = this.init(null, this.vNode);
        const parentElement = this._placeholder.parentElement;
        parentElement.replaceChild(dom, this._placeholder);
        // persist the placeholder to let parentNode to remove the real dom
        this._placeholder._realElement = dom;
        if (!parentElement._hasRewrite) {
            const removeChild = parentElement.removeChild;
            parentElement.removeChild = function(child) {
                removeChild.call(this, child._realElement || child);
            }
            parentElement._hasRewrite = true;
        }

        // add mount lifecycle method to queue
        this.mountedQueue.push(() => {
            this.mount();
        });

        this.__triggerMountedQueue();
        this._shouldTrigger = oldTriggerFlag;
    }

    componentWillUnmount() {
        this.destroy();
    }

    componentDidUpdate() {
        const oldTriggerFlag = this._shouldTrigger;
        this.__initMountedQueue();

        const vNode = h(
            this.constructor, 
            normalizeProps(
                this.props,
                this.context, 
                {instance: this}
            )
        );
        const lastVNode = this.vNode;
        vNode.children = this;
        this.vNode = vNode;
        this.parentVNode = vNode.parentVNode = this.context.parent && this.context.parent.vNode;

        this.update(lastVNode, vNode);

        this.__triggerMountedQueue();
        this._shouldTrigger = oldTriggerFlag;
    }

    __ref(element) {
        this._placeholder = element;
    }

    render() {
        return React.createElement('i', {
            ref: this.__ref 
        });
    }

    get isMounted() {
        return this.mounted;
    }

    // we should promise that all intact components have been mounted
    __initMountedQueue() {
        this._shouldTrigger = false;
        if (!this.mountedQueue || this.mountedQueue.done) {
            // get from parent
            let tmp;
            if ((tmp = this.context) && (tmp = tmp.parent) && (tmp = tmp.mountedQueue)) {
                if (!tmp.done) {
                    this.mountedQueue = tmp;
                    return;
                }
            }
            this._shouldTrigger = true;
            this._initMountedQueue();
        }
    }

    __triggerMountedQueue() {
        if (this._shouldTrigger) {
            FakePromise.all(this.promises).then(() => {
                this._triggerMountedQueue();
            });
            this._shouldTrigger = false;
        }
    }

    __pushActiveInstance() {
        const o = this._activeReactInstance;
        this._activeReactInstance = activeIntactReactInstance;

    }
}

// for workInProgress.tag detection 
IntactReact.prototype.isReactComponent = {};
// for getting _context in Intact
IntactReact.contextTypes = {
    _context: noop,
    parent: noop,
    promises: noop,
};
IntactReact.childContextTypes = {
    parent: noop,
    promises: noop,
};

export default IntactReact

