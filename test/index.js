import Intact from '../index.js';
import React from 'react'
import ReactDOM from 'react-dom'

const h = React.createElement;


class Child extends Intact {
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

class Idom extends Intact {
    @Intact.template()
    static template = `<div class={self.get('className')} key="1" ev-click={self.onClick}>
                <div>========</div>
                intact default content
                {self.get('children')}
                <Child class="default" >
                    child wrap content {self.get("count")}!
                </Child>
                <div>========</div>
            </div>`;

    _init() {
        this.Child = Child;
    }

    onClick(e) {
        // debugger
        const count = this.get('count');
        this.set('count', count + 1);
    }

    defaults() {
        return {
            count: 10
        };
    }
}


class Rdom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {count: 20};
    }

    componentDidMount() {
    }

    render() {
        return h(
            'div',
            {
                id: 'reactinnder',
                onClick: () => {
                    this.setState({
                        count: this.state.count + 1
                    });
                }
            },
            [
                `this is react component click ${this.state.count}`,
                h(
                    Child,
                    {key: '3'},
                    'react wrap'
                ),
                h(
                    'div',
                    {key: '2'},
                    'react content'
                ),
                this.props.children
            ]
        )
    }
}

class Wdom extends React.Component {
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
        const r = h(Rdom, {key: 11});

        const s = h(
            Idom,
            {
                key: '4',
                className: `idom-${this.state.count}`
            }
        );

        const i = h(
            Idom,
            {
                className: `className-${this.state.count}`,
                key: '3'
            },
            [
                h(Rdom, {key: 1, className: `className-${this.state.count}`}, `=====这是一个测试${this.state.count}内容====`),
                h(Idom, {key: 2}),
                `正常文本${this.state.count}`
            ]
        );
        return h('div', {
            id: 'react',
            onClick: this.click.bind(this)
        }, ['wrap', i, `${this.state.count}`])
    }
}


describe('Unit test', () => {
    describe('Render', () => {
        it('render intact component in react', (done) => {
            const container = document.createElement('div');
            document.body.appendChild(container);
            const component = h(Wdom, {});
            ReactDOM.render(
                component,
                container,
                () => {
                    const react = document.getElementById('react');
                    let count = 1;
                    setTimeout(() => {
                        done()
                    })
                }
            );
        });
    })
})
