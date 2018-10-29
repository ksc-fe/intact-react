import Intact from '../index.js';
import React from 'react'
import ReactDOM from 'react-dom'

const h = React.createElement;


class Intact1 extends Intact {
    @Intact.template()
    static template = `<div ev-click={self.onClick} id={self.get('id')}>Intact {self.get("count")}{self.get("children")}<b:header></b:header><b:default></b:default></div>`

    onClick(e) {
        console.log(this)
        const count = this.get('count');
        this.set('count', count + 1);
    }

    defaults() {
        return {
            count: 1
        };
    }
}

class React1 extends React.Component {
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
        console.log('=====')
        console.log(this.click)
        return h('div', {
            id: this.props.id,
            onClick: this.click.bind(this)
        }, [
            'React',
            `${this.state.count}`,
            this.props.children
        ])
    }
}

const br = document.createElement('div')
br.style = 'height:100px';


describe('Unit test', () => {
    describe('Render A Intact Event 1', () => {
        it('render intact component in react', (done) => {
            const container1 = document.createElement('div');
            document.body.appendChild(container1);
            const component = h(React1, {id: 'react1'}, [h(Intact1, {key: 1, id: 'intact1'})]);
            ReactDOM.render(
                component,
                container1,
                () => {
                    const react = document.getElementById('react1');
                    let count = 1;
                    setTimeout(() => {
                        react.click()
                        count++;
                        react.click()
                        count++;
                        console.log(react.innerHTML)
                        assert(react.innerHTML === `React${count}<div id="intact1">Intact 1</div>`, '渲染结果不正确');
                        // container1.remove();
                        container1.appendChild(br.cloneNode())
                        done()
                    })
                }
            );
        });
    })
    describe('Render A Intact Event 2', () => {
        it('render intact component in react', (done) => {
            const container2 = document.createElement('div');
            document.body.appendChild(container2);
            const component = h(React1, {id: 'react2'}, [h(Intact1, {key: 1, id: 'intact2'})]);
            ReactDOM.render(
                component,
                container2,
                () => {
                    const intact = document.getElementById('intact2');
                    let count = 1;
                    setTimeout(() => {
                        intact.click()
                        count++;
                        intact.click()
                        count++;
                        console.log(intact.innerHTML)
                        assert(intact.innerHTML === `Intact ${count}`, '渲染结果不正确');
                        // container2.remove();
                        container2.appendChild(br.cloneNode())
                        done()
                    })
                }
            );
        });
    })
    describe('Render A Intact Inner React event', () => {
        it('render intact component in react', (done) => {
            const container3 = document.createElement('div');
            document.body.appendChild(container3);
            const component = h(Intact1, {id: 'intact3'}, [h(React1, {key: 1, id: 'react3'}, '==')]);
            ReactDOM.render(
                component,
                container3,
                () => {
                    const intact = document.getElementById('intact3');
                    let count = 1;
                    setTimeout(() => {
                        intact.click()
                        count++;
                        intact.click()
                        count++;
                        console.log(intact.innerHTML)
                        assert(intact.innerHTML === `Intact ${count}<div id="react3">React1==</div>`, '渲染结果不正确');
                        // container3.remove();
                        container3.appendChild(br.cloneNode())
                        done()
                    })
                }
            );
        });
    })
    describe('Render A Intact Inner React block', () => {
        it('render intact component in react', (done) => {
            // const container3 = document.createElement('div');
            // document.body.appendChild(container3);
            //
            // class JJ extends Intact {
            //     @Intact.template()
            //     static template = `<Wrap><b:header><div>这是一个头</div></b:header><div>lskjdjk</div><b:default><div>这是一个头</div></b:default></Wrap>`
            //
            //     constructor() {
            //         super()
            //         this.Wrap = Intact1
            //     }
            // }
            //
            // container3.appendChild(new JJ().init())
            // container3.remove();
            const container4 = document.createElement('div');
            document.body.appendChild(container4);
            const component = h(Intact1,
                {id: 'intact4'},
                [
                    h(React1,
                        {key: 1, id: 'react4'}
                    ),
                    h('div',
                        {
                            key: 2,
                            slot: true
                        },
                        h('div', {}, '=====default===')
                    ),
                    h('div',
                        {
                            key: 3,
                            slot: 'header'
                        },
                        'header'
                    )
                ]);
            ReactDOM.render(
                component,
                container4,
                () => {
                    const intact = document.getElementById('intact4');
                    let count = 1;
                    setTimeout(() => {
                        intact.click()
                        count++;
                        intact.click()
                        count++;
                        console.log(intact.innerHTML)
                        assert(intact.innerHTML === `Intact ${count}<div id="react4">React1</div><div>header</div><div><div>=====default===</div></div>`, '渲染结果不正确');
                        // container4.remove();
                        container4.appendChild(br.cloneNode())
                        done()
                    })
                }
            );
        });
    })
})
