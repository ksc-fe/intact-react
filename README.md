# IntactReact
> - 在react 项目中运行intact组件
> - 理论上支持所有react 版本 , 本项目测试用例使用`react 16`

### 实现思路
1. 替换 `intact` 构造函数, react 调用实例化时 , 判断调用者为react时 ,还原props
2. 在 `intact` 上添加render 函数 内部返回一个空白标签 , 设置`ref` 以备后用
3. 在 `intact` 组件实例,添加react 响应的生命周期方法 , 在props 更新后选择重新实例化`intact`组件 , 挂载在真实dom ,或者更新`intact`组件
4. 重新实例化`intact`组件是转换传入的`props`为`intact`格式,同时转换children, 把`react` 通过props 传入的children为`react`的实例 再次转换为`intact` 实例 , 设置模拟proxy函数代理setState等react 方法 实质调用intact 更新


### 使用方式
1. 引入对应的intact库,intact 组件
2. 设置Intact 实例别名到IntactReact , 以下为webpack 示例
```js
resolve: {
    alias: {
        'intact$': 'intact-react'
    }
}
```
```js
import Intact from 'intact';
import React from 'react'
import ReactDOM from 'react-dom'
const h = React.createElement;

class I extends Intact {
    @Intact.template()
    static template = `<div ev-click={self.onClick}>{self.get("children")} child default content {self.get("count")}!</div>`

    onClick(e) {
        const count = this.get('count');
        this.set('count', count + 1);
    }

    defaults() {
        return {
            count: 1
        };
    }
}

class R extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1
        };
    }

    componentDidMount() {
        console.log(this, 'react componentDidMount')
    }

    click() {
        this.setState({
            count: this.state.count + 1
        })
    }

    render() {
        return h('div', {
            id: 'react',
            onClick: this.click.bind(this)
        }, ['wrap', h(I,{},'this is intact children'), `${this.state.count}`])
    }
}

const container = document.createElement('div');
document.body.appendChild(container);
const component = h(R,{});
ReactDOM.render(
    component,
    container
);
```


### 注意
- **intact 内部 的react 组件render 只支持返回一个节点 , 多节点将会报错**
- **react 添加 slot 支持 , children 的 props 属性上添加`slot` 将对应 intact 内部的`<b:block></b:block>` , 详细可参见test 目录下的测试用例**