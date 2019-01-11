import ReactDOM from 'react-dom';
import FakePromise from './FakePromise';
import {noop} from './functionalWrapper';

const ignorePropRegExp = /_ev[A-Z]/;

// wrap the react element to render it by react self
export default class Wrapper {
    init(lastVNode, nextVNode) {
        // let the component destroy by itself
        this.destroyed = true; 
        // react can use comment node as parent so long as its text like bellow
        this.placeholder = document.createComment(' react-mount-point-unstable ');
        // we should append the placholder advanced,
        // because when a intact component update itself
        // the _render will update react element sync
        if (this.parentDom) {
            this.parentDom.appendChild(this.placeholder);
        }
        // if the _render is sync, return the result directly
        return this._render(nextVNode) || this.placeholder;
    }

    update(lastVNode, nextVNode) {
        return this._render(nextVNode) || this.placeholder;
    }

    destroy(lastVNode, nextVNode, parentDom) {
        const placeholder = this.placeholder;
        // let react remove it, intact never remove it
        ReactDOM.render(null, placeholder, () => {
            placeholder.parentNode.removeChild(placeholder);
        });
        placeholder._unmount = noop;
    }

    _render(nextVNode) {
        const vNode = this._addProps(nextVNode);

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
        let dom;
        const promise = new FakePromise(resolve => {
            // the parentComponent should always be valid
            // if (parentComponent && parentComponent._reactInternalFiber !== undefined) {
                ReactDOM.unstable_renderSubtreeIntoContainer(
                    parentComponent,
                    vNode,
                    this.placeholder,
                    // this.parentDom,
                    function() {
                        // if the parentVNode is a Intact component, it indicates that
                        // the Wrapper node is returned by parent component directly
                        // in this case we must fix the element property of parent component
                        // 3 is textNode
                        dom = this && this.nodeType === 3 ? this : ReactDOM.findDOMNode(this);
                        let parentVNode = nextVNode.parentVNode;
                        while (parentVNode && parentVNode.tag && parentVNode.tag.$$cid === 'IntactReact') {
                            parentVNode.children.element = dom;
                            parentVNode = parentVNode.parentVNode;
                        }
                        resolve();
                    }
                );
            // } else {
                // ReactDOM.render(vNode, this.placeholder, resolve);
            // }
        });
        parentComponent.__promises.push(promise);

        // if (dom) debugger;
        return dom;
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
            if (key.substr(0, 3) === 'ev-') {
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
