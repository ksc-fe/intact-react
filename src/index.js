import React from 'react';
// for webpack alias Intact to IntactReact
import Intact from 'intact/dist';
import {isFunction} from './util'

export default class IntactReact extends Intact {
    constructor() {
        super(...arguments);
        const props = this.props;
        // 兼容react实例属性开始
        this.props = props;
        this.context = {};
        this.refs = {};
        this.updater = {};
        this.state = this.props;
        // 兼容react实例属性结束

    }

    //兼容react生成生命周期开始
    /*
    * 生命周期详解
    * 初始化
    * constructor()
    * static getDerivedStateFromProps()
    * render()
    * componentDidMount()
    * 更新
    * static getDerivedStateFromProps()
    * shouldComponentUpdate()
    * render()
    * getSnapshotBeforeUpdate()
    * componentDidUpdate()
    * 卸载
    * componentWillUnmount()
    * 渲染中出现错误
    * componentDidCatch()
    *
    * */
    static getDerivedStateFromProps() {

    }

    static defaultProps() {
        return this.defaults ?
            (
                isFunction(this.defaults) ?
                    this.defaults() :
                    this.defaults
            ) :
            {}
    }
    

    componentDidMount() {

    }

    shouldComponentUpdate() {
    }

    getSnapshotBeforeUpdate() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentWillUnmount() {
    }

    componentDidCatch() {
    }

    //兼容react生成生命周期结束

    get isMounted() {
        return this.mounted;
    }

    get isReactComponent() {
        return {}
    }

    //兼容react实例方法开始
    forceUpdate(callback) {

    }

    setState(partialState, callback) {
        this.set(partialState);
        callback();
    }

    //兼容react实例方法结束

}

