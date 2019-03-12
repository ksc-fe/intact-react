import ReactDOM from 'react-dom';
import FakePromise from './FakePromise';
import {noop} from './functionalWrapper';

const ignorePropRegExp = /_ev[A-Z]/;

export const commentNodeValue = ' react-mount-point-unstable ';

// wrap the react element to render it by react self
export default class Wrapper {
    init(lastVNode, nextVNode) {
        // let the component destroy by itself
        this.destroyed = true; 
        // react can use comment node as parent so long as its text like bellow
        const placeholder = this.placeholder = document.createComment(commentNodeValue);
        // we should append the placholder advanced,
        // because when a intact component update itself
        // the _render will update react element sync
        const parentDom = this.parentDom || this.parentVNode && this.parentVNode.dom;
        if (parentDom) {
            parentDom.appendChild(placeholder);
        }
        this._render(nextVNode);
        return placeholder;
    }

    update(lastVNode, nextVNode) {
        this._render(nextVNode);
        return this.placeholder;
    }

    destroy(lastVNode, nextVNode, parentDom) {
        const placeholder = this.placeholder;
        // let react remove it, intact never remove it
        ReactDOM.render(null, placeholder, () => {
            const parentDom = placeholder.parentNode;
            // get parentNode even if it has been removed
            // hack for intact replace child
            Object.defineProperty(placeholder, 'parentNode', {
                value: parentDom
            });
            parentDom.removeChild(placeholder);
        });
        placeholder._unmount = noop;
        if (placeholder._realElement) {
            placeholder._realElement._unmount = noop;
        }
    }

    _render(nextVNode) {
        const vNode = this._addProps(nextVNode);
        const placeholder = this.placeholder;

        let parentComponent = nextVNode.props._parentRef.instance;
        if (parentComponent) {
            if (!parentComponent._reactInternalFiber) {
                // is a firsthand intact component, get its parent instance
                parentComponent = parentComponent.get('_parentRef').instance;
            }
        } else {
            // maybe the property which value is vNodes
            // find the closest IntactReact instance
            let parentVNode = nextVNode.parentVNode;
            while (parentVNode) {
                const children = parentVNode.children;
                if (children && children._reactInternalFiber !== undefined) {
                    parentComponent = children;
                    break;
                }
                parentVNode = parentVNode.parentVNode;
            }
        }
        const promise = new FakePromise(resolve => {
            // the parentComponent should always be valid
            // if (parentComponent && parentComponent._reactInternalFiber !== undefined) {
                ReactDOM.unstable_renderSubtreeIntoContainer(
                    parentComponent,
                    vNode,
                    placeholder,
                    // this.parentDom,
                    function() {
                        // if the parentVNode is a Intact component, it indicates that
                        // the Wrapper node is returned by parent component directly
                        // in this case we must fix the element property of parent component
                        // 3 is textNode
                        const dom = this && this.nodeType === 3 ? this : ReactDOM.findDOMNode(this);
                        placeholder._realElement = dom;
                        resolve();
                    }
                );
            // } else {
                // ReactDOM.render(vNode, this.placeholder, resolve);
            // }
        });
        parentComponent.__promises.push(promise);
    }

    // we can change props in intact, so we should sync the changes
    _addProps(vNode) {
        // for Intact reusing the dom
        this.vdt = {vNode};

        const props = vNode.props;
        // react vNode has been frozen, so we must clone it to change
        let cloneVNode;
        let _props;
        for (let key in props) {
            if (key === 'reactVNode' || key === '_parentRef') continue;
            // ignore _evClick _evMouseEnter property which add in some components temporarily
            if (ignorePropRegExp.test(key)) continue;
            if (!cloneVNode) {
                cloneVNode = {...props.reactVNode};
                _props = cloneVNode.props = {...cloneVNode.props};
            }
            const prop = props[key];
            // is event
            if (key === 'className') {
                const className = _props.className;
                _props.className = className ? className + ' ' + prop : prop;
            } else if (key.substr(0, 3) === 'ev-') {
                _props[eventsMap[key]] = prop;
            } else {
                _props[key] = prop;
            }
        }

        return cloneVNode || props.reactVNode;
    }
}

const eventsMap = {
    'ev-click': 'onClick',
    'ev-mouseenter': 'onMouseEnter',
    'ev-mouseleave': 'onMouseLeave',
};
