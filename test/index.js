import Intact from '../index';
import React, {Component} from 'react'
import ReactDOM from 'react-dom'

describe('Unit test', function() {
    this.enableTimeouts(false);

    function createIntactComponent(template, methods) {
        class Component extends Intact {
            get template() { return template; }
        }
        if (methods) {
            Object.assign(Component.prototype, methods);
        }

        return Component;
    }

    let container;
    function render(vNode) {
        container = document.createElement('div');
        document.body.appendChild(container);
        ReactDOM.render(vNode, container);
    }

    const SimpleIntactComponent = createIntactComponent('<div>Intact Component</div>');
    const ChildrenIntactComponent = createIntactComponent(`<div>{self.get('children')}</div>`);
    const PropsIntactComponent = createIntactComponent(`<div>a: {self.get('a')} b: {self.get('b')}</div>`);
    class SimpleReactComponent extends Component {
        render() {
            return <div>{this.props.children}</div>
        }
    }

    
    function expect(input) {
        if (typeof input === 'string') {
            input = input.replace(/<!--.*?-->/g, '');
        }
        return window.expect(input);
    }

    describe('Render', () => {
        it('render intact component in react', () => {
            render(<SimpleIntactComponent />);
            expect(container.innerHTML).to.eq('<div>Intact Component</div>');
        });

        it('render intact component in react element', () => {
            render(<div><SimpleIntactComponent /></div>);
            expect(container.innerHTML).to.eq('<div><div>Intact Component</div></div>');
        });

        it('render intact component in react component', () => {
            render(<SimpleReactComponent><SimpleIntactComponent /></SimpleReactComponent>);
            expect(container.innerHTML).to.eq('<div><div>Intact Component</div></div>');
        });

        it('render react element in intact component', () => {
            render(<ChildrenIntactComponent><div>test</div></ChildrenIntactComponent>);
            expect(container.innerHTML).to.eql('<div><div>test</div></div>');
        });

        it('render react component in intact component', () => {
            render(
                <ChildrenIntactComponent>
                    <SimpleReactComponent>test1</SimpleReactComponent>
                    <SimpleReactComponent>test2</SimpleReactComponent>
                </ChildrenIntactComponent>
            );
            expect(container.innerHTML).to.eql('<div><div>test1</div><div>test2</div></div>');
        });

        it('render nested react and intact component', () => {
            render(
                <ChildrenIntactComponent>
                    <SimpleReactComponent>
                        <ChildrenIntactComponent>test</ChildrenIntactComponent>
                    </SimpleReactComponent>
                </ChildrenIntactComponent>
            );
            expect(container.innerHTML).to.eql('<div><div><div>test</div></div></div>');
        });

        it('render with props', () => {
            render(<PropsIntactComponent a="a" b={1} />);
            expect(container.innerHTML).to.eql('<div>a: a b: 1</div>');
        });

        it('render react element with event', () => {
            const click = sinon.spy(() => console.log('click'));
            render(
                <ChildrenIntactComponent>
                    <div onClick={click}>click</div>
                </ChildrenIntactComponent>
            );

            container.firstChild.firstChild.click();
            expect(click.callCount).to.eql(1);
        });

        describe('Normalize', () => {
            it('normalize events', () => {
                const C = createIntactComponent(`<div ev-click={self.onClick}>click</div>`, {
                    onClick() {
                        this.set('value', 1);
                        this.trigger('click');
                    }
                });
                
                const click = sinon.spy(() => console.log('click'));
                const change = sinon.spy(() => console.log('change'));
                render(<div><C onClick={click} on$change-value={change}/></div>);

                container.firstChild.firstChild.click();
                expect(click.callCount).to.eql(1);
                expect(change.callCount).to.eql(1);
            });

            it('normalize bloks', () => {
                const C = createIntactComponent(`<div>{self.get('children')}<b:footer /></div>`);

                render(<C b-footer={<span>footer</span>}>children</C>);
                expect(container.innerHTML).to.eql('<div>children<span>footer</span></div>');

                render(<C b-footer={'footer'}>children</C>);
                expect(container.innerHTML).to.eql('<div>childrenfooter</div>');
            });

            it('normalize scope blocks', () => {
                const C = createIntactComponent(`<div>{self.get('children')}<b:footer args={[1]} /></div>`);
                render(<C b-footer={(i) => <span>footer{i}</span>}>children</C>);

                expect(container.innerHTML).to.eql('<div>children<span>footer1</span></div>');
            });
        });

        it('render intact functional component', () => {
            const h = Intact.Vdt.miss.h;
            const Component = Intact.functionalWrapper(function(props) {
                return h(ChildrenIntactComponent, props); 
            });
            render(<Component>test</Component>);
            expect(container.innerHTML).to.eql('<div>test</div>');

            const Components = Intact.functionalWrapper(function(props) {
                return [
                    h(ChildrenIntactComponent, props),
                    null,
                    h('div', null, 'text'),
                    'test'
                ];
            });
            render(<Components>test</Components>);
            expect(container.innerHTML).to.eql('<div>test</div><div>text</div>test');
        });

        it('render block to intact functional component', () => {
            const h = Intact.Vdt.miss.h;
            const Component = Intact.functionalWrapper(function(props) {
                return h(createIntactComponent('<div><b:test /></div>'), props);
            });
            render(<Component b-test={<span>test</span>} />);
            expect(container.innerHTML).to.eql('<div><span>test</span></div>');
        });

        it('render intact functional component which has wrapped in intact component', () => {
            const h = Intact.Vdt.miss.h;
            const Component = Intact.functionalWrapper(function(props) {
                return h(ChildrenIntactComponent, props); 
            });
            const C = createIntactComponent(`<Component>test</Component>`, {
                _init() {
                    this.Component = Component;
                }
            });
            render(<C />);
            expect(container.innerHTML).to.eql('<div>test</div>');
        });

        describe('_context', () => {
            let instance;
            let C;
            class App extends React.Component {
                constructor(props) {
                    super(props);
                    instance = this;
                    this.state = {value: 1};
                }
                getChildContext() {
                    return {
                        _context: this
                    }
                }
                render() {
                    return <C value={this.state.value} />
                }
            }
            App.childContextTypes = {
                _context: function() {}
            };

            it('should get _context in class component', () => {
                C = createIntactComponent(`<div>{self.get('value')}</div>`, {
                    _init() {
                        const _context = this.get('_context');
                        _context.data.set('value', 2);
                    }
                });
                render(<App />);
                expect(instance.state.value).to.eql(2);
            });

            it('shoule get _context in functional component', () => {
                const h = Intact.Vdt.miss.h;
                C = Intact.functionalWrapper(function(props) {
                    return h(createIntactComponent(`<div>{self.get('_context').data.get('value')}</div>`), props);
                });
                render(<App />);
            });
        });

        it('render async inatct component', () => {
            const C = createIntactComponent(`<div>test</div>`, {
                _init() {
                    return new Promise((resolve) => {
                        resolve();
                    });
                }
            });
            render(<C />);
            expect(container.innerHTML).to.eql('<div>test</div>');
        });
    });

    describe('Update', () => {
        let instance;
        const renderApp = (_render, state) => {
            class App extends React.Component {
                constructor(props) {
                    super(props);
                    instance = this;
                    window.vm = instance;
                    this.state = state;
                }
                render() {
                    return _render.call(this);
                }
            }
            render(<App />);
        }
        it('update intact component', () => {
            renderApp(function() {
                return <PropsIntactComponent a={this.state.a} />
            }, {a: 1});
            instance.setState({a: 2});
            expect(container.innerHTML).to.eql('<div>a: 2 b: </div>');
        });

        it('update react element in intact component', () => {
            renderApp(function() {
                return (
                    <ChildrenIntactComponent>
                        <div>{this.state.a}</div>
                    </ChildrenIntactComponent>
                )
            }, {a: 1});
            instance.setState({a: 2});
            expect(container.innerHTML).to.eql('<div><div>2</div></div>');
        });

        it('insert and append intact component in react element', () => {
            const C = createIntactComponent(`<div>`)
            renderApp(function() {
                return (
                    <div>
                        {this.state.list.map(item => {
                            return <ChildrenIntactComponent>{item}</ChildrenIntactComponent> 
                        })}
                    </div>
                );
            }, {list: [1, 2]});
            instance.setState({list: [2]});
            expect(container.innerHTML).to.eql('<div><div>2</div></div>')

            instance.setState({list: [1, 2, 3]});
            expect(container.innerHTML).to.eql('<div><div>1</div><div>2</div><div>3</div></div>')
        });

        it('insert and append react element in intact component', () => {
            renderApp(function() {
                return (
                    <ChildrenIntactComponent>
                        {this.state.list.map(item => {
                            return <div>{item}</div>
                        })}
                    </ChildrenIntactComponent>
                )
            }, {list: [1, 2]});
            instance.setState({list: [2]});
            expect(container.innerHTML).to.eql('<div><div>2</div></div>')

            instance.setState({list: [1, 2, 3]});
            expect(container.innerHTML).to.eql('<div><div>1</div><div>2</div><div>3</div></div>')
        });
    });

    it('validate props in intact instead of react', () => {
        const error = console.error;
        console.error = sinon.spy((...args) => {
            error.apply(console, args);
        });
        class IntactComponent extends Intact {
            @Intact.template()
            static template = `<div>test</div>`

            static propTypes = {
                show: Boolean,
            }
        }
        class IntactComponent2 extends IntactComponent {

        }
        render(
            <div>
                <IntactComponent />
                <IntactComponent2 />
            </div>
        );

        expect(console.error.callCount).to.eql(0);

        console.error = error;
    });

    describe('Lifecycle', () => {
        it('mount', () => {
            const C = createIntactComponent(
                `<div>{self.get('children')}</div>`,
                {
                    _mount() {
                        console.log('mount');
                    }
                }
            );
            render(<div><C><C>test</C></C></div>);
        });
    });
});
