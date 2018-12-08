import React from 'react';
// for webpack alias Intact to IntactReact
import Intact from 'intact/dist';
import {normalizeProps, functionalWrapper} from './util'

const {noop} = Intact.utils;

class IntactReact extends Intact {
    static functionalWrapper = functionalWrapper;

    static $$cid = 'IntactReact';

    constructor(props, context) {
        // React will pass context to constructor 
        if (context) {
            const normalizedProps = normalizeProps(props, context);
            super(normalizedProps);
            // fake the vNode
            this.vNode = {props: normalizedProps};
            // We must keep the props to be undefined, 
            // otherwise React will think it has mutated
            this._props = this.props; 
            delete this.props;
            this._isReact = true;
        } else {
            super(props);
        }
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

    componentDidMount() {
        // disable intact async component
        this.inited = true;
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
        this.mount();
    }

    componentWillUnmount() {
        this.destroy();
    }

    componentDidUpdate() {
        const vNode = {
            props: normalizeProps(this.props, this.context)
        };
        const lastVNode = this.vNode;
        this.vNode = vNode;

        this.update(lastVNode, vNode);
    }

    render() {
        return React.createElement('i', {
            ref: (element) => {
                this._placeholder = element
            }
        });
    }

    get isMounted() {
        return this.mounted;
    }
}

// for workInProgress.tag detection 
IntactReact.prototype.isReactComponent = {};
// for getting _context in Intact
IntactReact.contextTypes = {
    _context: noop
};

export default IntactReact

