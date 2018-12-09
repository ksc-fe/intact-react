import ReactDOM from 'react-dom';
import FakePromise, {promises} from './FakePromise';

// wrap the react element to render it by react self
export default class Wrapper {
    init(lastVNode, nextVNode) {
        // let the component destroy by itself
        this.destroyed = true; 
        const vNode = this._addProps(nextVNode);

        // react can use comment node as parent so long as its text like bellow
        const placeholder = document.createComment(' react-mount-point-unstable ');
        const promise = new FakePromise(resolve => {
            // ReactDOM.render(nextVNode.props.reactVNode, placeholder, resolve);
            ReactDOM.unstable_renderSubtreeIntoContainer(
                nextVNode.props.parentRef.instance, 
                vNode,
                placeholder,
                resolve
            );
        });
        promises.push(promise);
        this.placeholder = placeholder;
        return placeholder;
    }

    update(lastVNode, nextVNode) {
        const vNode = this._addProps(nextVNode);
        const promise = new FakePromise(resolve => {
            // ReactDOM.render(nextVNode.props.reactVNode, this.placeholder, resolve);
            ReactDOM.unstable_renderSubtreeIntoContainer(
                nextVNode.props.parentRef.instance, 
                vNode,
                this.placeholder,
                resolve
            );
        });
        promises.push(promise);
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
