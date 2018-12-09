import React from 'react';

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
