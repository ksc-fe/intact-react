import React from 'react';
// for webpack alias Intact to IntactReact
import Intact from 'intact/dist';
import {conversionProps} from './util'

const {get, set, extend, isArray, create, isFunction} = Intact.utils;

export default class IntactReact extends Intact {
    constructor(...args) {
        super(...args);
        this.$$intactProps = this.props;
        this.props = args[0];
        this.$$wrapDom = null;
    }

    get $$cid() {
        return 'IntactReact';
    }

    componentDidMount() {
        const parentElement = this.$$wrapDom.parentElement;
        this.props = conversionProps(this.props);
        parentElement.replaceChild(
            this.init(),
            this.$$wrapDom
        );
    }

    componentDidUpdate() {
        this.update()
    }

    render() {
        this.props = extend(this.$$intactProps, this.props);
        return React.createElement('i', extend({}, this.props, {
            ref: (element) => {
                this.$$wrapDom = element
            },
            children: ''
        }), '');
    }

    get(...args) {
        this.props = this.$$intactProps
        return super.get(...args);
    }

    get isMounted() {
        return this.mounted;
    }

    get isReactComponent() {
        return {}
    }

}

