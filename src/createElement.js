import React from 'react';
import ReactDOM from 'react-dom';
import IntactReact from './IntactReact';

// let React don't validate Intact component's props
const _createElement = React.createElement;
export default function createElement(type, props, children) {
    const isIntact = type.$$cid === 'IntactReact';
    const propTypes = type.propTypes;
    if (isIntact && propTypes) {
        type.propTypes = undefined;
    }
    const element = _createElement.apply(this, arguments);
    if (isIntact && propTypes) {
        type.propTypes = propTypes;
    }

    return element;
}

React.createElement = createElement;

// let findDOMNode to get the element of intact component
const _findDOMNode = ReactDOM.findDOMNode;
ReactDOM.findDOMNode = function(component) {
    if (component instanceof IntactReact) {
        return component.element;
    }

    return _findDOMNode.call(ReactDOM, component);
};
