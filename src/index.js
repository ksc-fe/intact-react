import React from 'react';
// for webpack alias Intact to IntactReact
import Intact from 'intact/dist';
import {isFunction, conversionProps} from './util'

const h = Intact.Vdt.miss.h;
const {get, set, extend, isArray, create} = Intact.utils;

export default class IntactReact extends Intact {
    constructor(...args) {
        super(...args);
        this.$$intactProps = this.props;
        this.props = args[0];
        this.$$wrapDom = null;
        this.$$isIntact = true;
    }

    componentDidMount() {
        const parentElement = this.$$wrapDom.parentElement;
        this.props = this.$$intactProps;
        parentElement.replaceChild(this.init(), this.$$wrapDom);
    }

    componentDidUpdate() {
        this.update()
    }

    render() {
        return React.createElement('div', extend({}, this.props, {
            ref: (element) => {
                this.$$wrapDom = element
            }
        }));
    }

    get isMounted() {
        return this.mounted;
    }

    get isReactComponent() {
        return {}
    }

}

