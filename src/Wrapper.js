import ReactDOM from 'react-dom';

// wrap the react element to render it by react self
export default class Wrapper {
    init(lastVNode, nextVNode) {
        // react can use comment node as parent so long as its text like bellow
        const placeholder = document.createComment(' react-mount-point-unstable ');
        ReactDOM.render(nextVNode.props.reactVNode, placeholder, function() {
            // placeholder.parentNode.replaceChild(container, placeholder);
        });
        this.placeholder = placeholder;
        return placeholder;
    }

    update(lastVNode, nextVNode) {
        ReactDOM.render(nextVNode.props.reactVNode, this.placeholder);
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
}
