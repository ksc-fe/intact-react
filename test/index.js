import Intact from '../index.js';
import React from 'react'
import ReactDOM from 'react-dom'

const h = React.createElement;


class Ajhj extends Intact {
    @Intact.template()
    static template = `<div>sd</div>`
}

class Idom extends Intact {
    @Intact.template()
    static template = `<Ajhj class="sdddd" key="-ss" ev-click={self.onClick}>sldkj Hello {self.get("count")}!</Ajhj>`;

    _init() {
        this.Ajhj = Ajhj;
    }

    onClick(e) {
        this.set('count', this.get('count') + 1);
    }

    defaults() {
        return {
            count: 1
        };
    }
}


class Rdom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {count: 1};
    }

    componentDidMount() {
        console.log(this, 'react componentDidMount')
    }

    render() {
        console.log(this, 'react render')
        const a = h(
            'div',
            {
                id: 'react',
                onClick: () => {
                    this.setState({
                        count: this.state.count + 1
                    });
                }
            },
            [`this is react component click ${this.state.count}`, h('div', {key: '==='})]
        )
        return a
    }
}

describe('Unit test', () => {
    describe('Render', () => {
        it('render intact component in react', (done) => {
            const container = document.createElement('div');
            document.body.appendChild(container);
            const r = h(Rdom, {key: 11});
            const i = h(Idom, {key: 22}, [h(Rdom, {key: 1}), h(Idom, {key: 2}), '====', 'skjd']);
            const component = [r, i, '==='];
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
                        // expect(html).to.eql(`this is react component click ${count}`);
                        // container.remove();
                        done()
                    })
                }
            );
        });
    })
})
