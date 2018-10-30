import React from 'react';
// for webpack alias Intact to IntactReact
import Intact from 'intact/dist';
import {conversionProps} from './util'

const {get, set, extend, isObject, isArray, create, isFunction} = Intact.utils;

const _createElement = React.createElement;
React.createElement = function createElementWithValidation(type, props, children) {
    const isIntact = isObject(type.prototype) && type.prototype.$$cid === 'IntactReact';
    const propTypes = type.propTypes;
    if (isIntact) {
        delete type.propTypes;
    }
    const element = _createElement.call(this, type, props, children);
    if (isIntact && propTypes) {
        type.propTypes = propTypes;
    }
    return element;
};


class IntactReact extends Intact {
    constructor(...args) {
        const isReactCall = args.length === 2; //react 实例化是会传入两个参数  , 故使用此判断 是否为react 调用实例
        super(...args);
        if (isReactCall) {
            this.$$innerInstance = undefined;
            this.props = args[0];//react 需要验证props 全等 ,蛋疼
            this.$$wrapDom = null;
            this.$$props = extend({}, this.props);
        }
    }

    get $$cid() {
        return 'IntactReact';
    }

    componentDidMount() {
        const parentElement = this.$$wrapDom.parentElement;
        //重新初始化并创建节点 , 替换已存在节点
        this.$$innerInstance = new this.constructor(conversionProps(this.$$props));
        parentElement.replaceChild(
            this.$$innerInstance.init(),
            this.$$wrapDom
        );
    }

    componentWillUnmount() {
        this.$$innerInstance && this.$$innerInstance.destroy();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // 更新实例
        this.$$innerInstance && this.$$innerInstance.set(conversionProps(this.$$props));
    }

    render() {
        this.$$props = extend(this.$$props, this.props);
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

