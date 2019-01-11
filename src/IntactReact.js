import React from 'react';
// for webpack alias Intact to IntactReact
import Intact from 'intact/dist';
import {normalizeProps, normalizeChildren} from './normalize'
import functionalWrapper, {noop, isArray} from './functionalWrapper';
import FakePromise from './FakePromise'; 

const {isObject, extend} = Intact.utils;
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

            this.__promises = context.__promises || [];
            this.mountedQueue = context.__parent && context.__parent.mountedQueue;

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
            __parent: this,
            __promises: this.__promises,
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
        // react has changed the refs, so we reset it back
        this.refs = this.vdt.widgets || {};
        this.__pushGetChildContext(nextVNode);
        const element = super.init(lastVNode, nextVNode);
        this.__popGetChildContext();
        return element;
    }

    update(lastVNode, nextVNode, fromPending) {
        const update = () => {
            if (this._updateCount === 0) {
                this.__pushGetChildContext(nextVNode || this.vNode);
            }
            const element = super.update(lastVNode, nextVNode, fromPending);
            if (this._updateCount === 0) {
                this.__popGetChildContext();
            }
            return element;
        }

        if (!this._isReact) return update();

        this.__initMountedQueue();

        const element = update();

        this.__triggerMountedQueue();

        return element;
    }

    __pushGetChildContext(nextVNode) {
        const parentRef = nextVNode && nextVNode.props._parentRef;
        const parentInstance = parentRef && parentRef.instance;
        if (parentInstance)  {
            const self = this;
            this.__getChildContext = parentInstance.getChildContext;
            parentInstance.getChildContext = function() {
                const context = self.__getChildContext.call(this);
                return {...context, __parent: self};
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
        this.__initMountedQueue();

        // disable intact async component
        this.inited = true;

        // add parentVNode
        this.parentVNode = this.vNode.parentVNode = this.context.__parent && this.context.__parent.vNode;

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
    }

    componentWillUnmount() {
        this.destroy();
    }

    componentDidUpdate() {
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
        this.parentVNode = vNode.parentVNode = this.context.__parent && this.context.__parent.vNode;

        this.update(lastVNode, vNode);

        this.__triggerMountedQueue();
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
        this.__oldTriggerFlag = this._shouldTrigger;
        this._shouldTrigger = false;
        if (!this.mountedQueue || this.mountedQueue.done) {
            // get from parent
            let tmp;
            if ((tmp = this.context) && (tmp = tmp.__parent) && (tmp = tmp.mountedQueue)) {
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
            FakePromise.all(this.__promises).then(() => {
                this._triggerMountedQueue();
            });
        }
        this._shouldTrigger = this.__oldTriggerFlag;
    }
}

// for workInProgress.tag detection 
IntactReact.prototype.isReactComponent = {};
// for getting _context in Intact
IntactReact.contextTypes = {
    _context: noop,
    __parent: noop,
    __promises: noop,
};
IntactReact.childContextTypes = {
    __parent: noop,
    __promises: noop,
};

// for compatibility of IE <= 10
if (!Object.setPrototypeOf) {
    extend(IntactReact, Intact);
    // for Intact <= 2.4.4
    if (!IntactReact.template) {
        IntactReact.template = Intact.template;
    }
}

export default IntactReact

