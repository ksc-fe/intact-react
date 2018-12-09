import Intact from 'intact/dist';
import {normalizeProps} from './normalize';
import createElement from './createElement';

const {isStringOrNumber, isArray} = Intact.utils;

// wrap the functional component of intact
export default function functionalWrapper(Component) {
    function Ctor(props, context) {
        if (context) {
            // invoked by React
            const vNodes = Component(normalizeProps(props, context, {}), true);
            if (isArray(vNodes)) {
                return vNodes.map(vNode => {
                    return normalizeIntactVNodeToReactVNode(vNode);
                });
            }
            return normalizeIntactVNodeToReactVNode(vNodes);
        } else {
            // invoked by Intact
            return Component(props);
        }
    }

    return Ctor;
}

export function normalizeIntactVNodeToReactVNode(vNode) {
    if (isStringOrNumber(vNode)) {
        return vNode;
    } else if (vNode) {
        return createElement(
            vNode.tag,
            vNode.props,
            vNode.props.children || vNode.children
        );
    }
}
