import React from 'react';
// for webpack alias Intact to IntactReact
import Intact from 'intact/dist';
import {conversionProps, unfreeze} from './util'

const {get, set, extend, isArray, create, isFunction} = Intact.utils;

class IntactReact extends Intact {
    constructor(...args) {
        const isReactCall = args.length === 2;
        super(...args);
        if (isReactCall) {
            this.$$innerInstance = {};
            this.props = args[0];//react 需要验证props 全等 ,蛋疼
            this.$$wrapDom = null;
            this.$$props = extend({}, this.attributes, this.props);
        }
    }

    get $$cid() {
        return 'IntactReact';
    }

    componentDidMount() {
        const parentElement = this.$$wrapDom.parentElement;
        this.$$innerInstance = new this.constructor(this.$$props);
        parentElement.replaceChild(
            this.$$innerInstance.init(),
            this.$$wrapDom
        );
    }

    componentWillUnmount() {
        this.$$innerInstance && this.$$innerInstance.destroy();
    }

    componentDidUpdate() {
        this.$$innerInstance.props = extend(this.$$innerInstance.props, this.$$props);
        this.$$innerInstance && this.$$innerInstance.update();
    }

    render() {
        this.$$props = conversionProps(extend(this.$$props, this.props));
        return React.createElement(
            'i',
            extend({}, {
                ref: (element) => {
                    this.$$wrapDom = element
                }
            }),
            '');
    }

    get isMounted() {
        return this.mounted;
    }

    get isReactComponent() {
        return {}
    }

}

export default IntactReact

