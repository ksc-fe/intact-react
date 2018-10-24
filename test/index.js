import Intact from '../index.js';
import React from 'react'
import ReactDOM from 'react-dom'

const h = React.createElement;

class Idom extends Intact {
    @Intact.template()
    static template = `<div>Hello {self.get("name")}!</div>`;

    defaults() {
        return {
            name: 'test'
        };
    }
}

class Rdom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {count: 1};
    }

    render() {
        return h(
            'div',
            {
                id: 'react',
                onClick: () => {
                    this.setState({
                        count: this.state.count + 1
                    });
                },
                key: 2,
            },
            `this is react component click ${this.state.count}`
        )
    }
}

console.dir(Idom)
console.dir(Rdom)
console.dir(new Idom())
console.dir(new Rdom())

describe('Unit test', () => {
    describe('Render', () => {
        it('render intact component in react', (done) => {
            const container = document.createElement('div');
            document.body.appendChild(container);
            console.log(h(Idom, {key: 22}, '==='))
            const component = [h(Rdom, {key: 11}), '==='];
            ReactDOM.render(
                component,
                container,
                () => {
                    const react = document.getElementById('react');
                    let count = 1;
                    react.click();
                    setTimeout(() => {
                        const html = react.innerHTML;
                        count = count + 1;
                        expect(html).to.eql(`this is react component click ${count}`);
                        container.remove();
                        done()
                    })
                }
            );
        });
    })
})
