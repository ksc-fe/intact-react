import ReactDOM from 'react-dom';
import FakePromise from './FakePromise';

// wrap the react element to render it by react self
export default class Wrapper {
    init(lastVNode, nextVNode) {
        // let the component destroy by itself
        this.destroyed = true; 
        // react can use comment node as parent so long as its text like bellow
        this.placeholder = document.createComment(' react-mount-point-unstable ');
        this._render(nextVNode);

        return this.placeholder;
    }

    update(lastVNode, nextVNode) {
        this._render(nextVNode);

        return this.placeholder;
    }

    destroy() {
        // remove the placeholder after react has unmount it
        const placeholder = this.placeholder;
        placeholder._unmount = () => {
            ReactDOM.render(null, placeholder, () => {
                placeholder.parentNode.removeChild(placeholder);
            });
        }
    }

    _render(nextVNode) {
        const vNode = this._addProps(nextVNode);

        let parentComponent = nextVNode.props.parentRef.instance;
        if (parentComponent) {
            if (!parentComponent._reactInternalFiber) {
                // is a firsthand intact component, get its parent instance
                parentComponent = parentComponent.get('parentRef').instance;
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
            if (parentComponent && parentComponent._reactInternalFiber !== undefined) {
                ReactDOM.unstable_renderSubtreeIntoContainer(
                    parentComponent,
                    vNode,
                    this.placeholder,
                    resolve
                );
            } else {
                ReactDOM.render(vNode, this.placeholder, resolve);
            }
        });
        parentComponent.promises.push(promise);
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
            if (key === 'reactVNode' || key === 'parentRef') continue;
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
