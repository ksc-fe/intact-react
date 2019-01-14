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
    const ChildrenIntactComponent = createIntactComponent(`<div>{self.get('children')}</div>`,{
        displayName: 'ChildrenIntactComponent',
    });
    ChildrenIntactComponent.displayName = 'ChildrenIntactComponent';
    const PropsIntactComponent = createIntactComponent(`<div>a: {self.get('a')} b: {self.get('b')}</div>`);
    class SimpleReactComponent extends Component {
        render() {
            return <div>{this.props.children}</div>
        }
    }

    const renderApp = (_render, state) => {
        let instance;
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
        return instance;
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

        it('render nested array children', () => {
            render(
                <ChildrenIntactComponent>
                    {[1, 2].map(item => <div>{item}</div>)}
                    <div>3</div>
                </ChildrenIntactComponent>
            );
            expect(container.innerHTML).to.eql('<div><div>1</div><div>2</div><div>3</div></div>');
        });

        describe('Normalize', () => {
            it('normalize events', () => {
                const C = createIntactComponent(`<div ev-click={self.onClick}>click {self.get('on')}</div>`, {
                    onClick() {
                        this.set('value', 1);
                        this.trigger('click');
                    }
                });
                
                const click = sinon.spy(() => console.log('click'));
                const change = sinon.spy(() => console.log('change'));
                render(<div><C onClick={click} on$change-value={change} on="1"/></div>);

                container.firstChild.firstChild.click();
                expect(container.innerHTML).to.eql('<div><div>click 1</div></div>');
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

            it('normalize the property which value is vNodes', () => {
                const C = createIntactComponent(`<div>{normalize(self.get('test'))}</div>`, {
                    _init() {
                        this.normalize = Intact.normalize;
                    }
                });
                render(<C test={<div>test</div>} />);

                expect(container.innerHTML).to.eql('<div><div>test</div></div>');
            });

            it('normalize React.Fragment', () => {
                const C = createIntactComponent(`<div>{self.get('children')}</div>`, {
                    _init() {
                        const children = this.get('children');
                        expect(children.type).to.eql(1);
                        expect(children.children).to.eql('react');
                    }
                });
                render(<C><React.Fragment>react</React.Fragment></C>);
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
            render(<Components>test<i>test</i></Components>);
            expect(container.innerHTML).to.eql('<div>test<i>test</i></div><div>text</div>test');
        });

        it('render block to intact functional component', () => {
            const h = Intact.Vdt.miss.h;
            const Component = Intact.functionalWrapper(function(props) {
                return h(createIntactComponent('<div><b:test /></div>'), props);
            });
            render(<Component b-test={<span>test</span>} />);
            expect(container.innerHTML).to.eql('<div><span>test</span></div>');
        });

        it('render block to firsthand intact component', () => {
            const C = createIntactComponent(`<div><b:test args={[1]} />{self.get('children')}</div>`);
            render(
                <ChildrenIntactComponent>
                    <C b-test={(v) => <div>{v}</div>}><div>2</div></C>
                </ChildrenIntactComponent>
            );
            expect(container.innerHTML).to.eql('<div><div><div>1</div><div>2</div></div></div>');
        });

        it('render block witch value is text node', () => {
            const C = createIntactComponent(`<div><b:test/>{self.get('children')}</div>`);
            render(<C b-test={<React.Fragment>test</React.Fragment>} />);
            expect(container.innerHTML).to.eql('<div>test</div>');
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

        it('render intact component which return the react children directly', () => {
            const C = createIntactComponent(`return self.get('children');<div></div>`);
            let instance1;
            let instance2;
            render(
                <C ref={(i) => {instance1 = i}}>
                    <C ref={(i) => {instance2 = i}}>
                        <div>test</div>
                    </C>
                </C>
            );
            expect(instance1.element.outerHTML).to.eql('<div>test</div>');
            expect(instance1.element).to.eql(instance2.element);
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
                    expect(props._context.data.get('value')).to.eql(1);
                    return h(createIntactComponent(`<div>{self.get('_context').data.get('value')}</div>`), props);
                });
                render(<App />);
                expect(container.innerHTML).to.eql('<div>1</div>');
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
        it('update intact component', () => {
            const instance = renderApp(function() {
                return <PropsIntactComponent a={this.state.a} />
            }, {a: 1});
            instance.setState({a: 2});
            expect(container.innerHTML).to.eql('<div>a: 2 b: </div>');
        });

        it('update react element with string', () => {
            const instance = renderApp(function() {
                return (
                    <ChildrenIntactComponent>
                        {this.state.a === 1 ? <div>a</div> : 'b'}
                    </ChildrenIntactComponent>
                )
            }, {a: 1});
            instance.setState({a: 2});
            expect(container.innerHTML).to.eql('<div>b</div>');
        });

        it('update react element in intact component', () => {
            const instance = renderApp(function() {
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
            const instance = renderApp(function() {
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
            const instance = renderApp(function() {
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

        it('_update lifecycle of intact should be called after all children has updated when call its update method directly', () => {
            const C = createIntactComponent(`<div><b:test args={[self.get('v')]} /></div>`, {
                defaults() {
                    return {v: 1};
                },
                _update() {
                    expect(this.element.innerHTML).to.eql('<i>2</i>');
                } 
            });
            const instance = renderApp(function() {
                return (
                    <C b-test={(v) => v === 1 ? <SimpleReactComponent>{v}</SimpleReactComponent> : <i>{v}</i>} ref={i => {
                        this.i = i;
                    }} />
                );
            });
            instance.i.set('v', 2);
        });

        it('update intact component itself with react element', () => {
            const C = createIntactComponent(`
                <div ev-click={self.set.bind(self, 'show', !self.get('show'))}>
                    <span v-if={self.get('show')}>intact</span>
                    <div v-else>{self.get('children')}</div>
                </div>
            `);
            const instance = renderApp(function() {
                return <C><div>react</div></C>
            });
            container.firstChild.click();
            container.firstChild.click();
            expect(container.innerHTML).to.eql('<div><div><div>react</div></div></div>');
        });

        it('update intact component which children is react element', () => {
            const C = createIntactComponent(`return self.get('children');<i></i>`, {
                _mount() {
                    expect(this.element.outerHTML).to.eql('<div>react</div>');
                }
            });
            const D = createIntactComponent(`<div><C v-if={self.get('show')}>{self.get('children')}</C></div>`, {
                _init() {
                    this.C = C;
                }
            });
            let d;
            const instance = renderApp(function() {
                return <D ref={i => d = i}><div>react</div></D>
            });
            d.set('show', true);
            // destroy
            d.set('show', false);
            d.update();
            expect(container.innerHTML).to.eql('<div></div>');
        });

        it('update block', () => {
            const C = createIntactComponent(`<div><b:test /></div>`);
            let c;
            const instance = renderApp(function() {
                return <C ref={i => c = i} b-test={<React.Fragment><SimpleIntactComponent /></React.Fragment>}></C>
            });
            c.update();
            expect(container.innerHTML).to.eql('<div><div>Intact Component</div></div>');
            c.update();
            expect(container.innerHTML).to.eql('<div><div>Intact Component</div></div>');
            instance.forceUpdate();
            expect(container.innerHTML).to.eql('<div><div>Intact Component</div></div>');
            instance.forceUpdate();
            expect(container.innerHTML).to.eql('<div><div>Intact Component</div></div>');
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
        it('lifecycle of intact in react', () => {
            const _create = sinon.spy();
            const _mount = sinon.spy();
            const _update = sinon.spy();
            const _destroy = sinon.spy();
            const C = createIntactComponent(
                `<div>test</div>`,
                {
                    _create,
                    _mount,
                    _update,
                    _destroy,
                }
            );
            const instance = renderApp(function() {
                return <div>{this.state.show ? <C /> : undefined}</div>
            }, {show: true});

            // update
            instance.setState({a: 1});
            expect(_create.callCount).to.eql(1);
            expect(_mount.callCount).to.eql(1);
            expect(_update.callCount).to.eql(1);

            // destroy
            instance.setState({show: false});
            expect(_destroy.callCount).to.eql(1);
        });

        it('lifecycle of react in intact', () => {
            const getDerivedStateFromProps = sinon.spy(function(props) {
                console.log('getDerivedStateFromProps');
                return props;
            });
            const shouldComponentUpdate = sinon.spy(() => {
                console.log('shouldComponentUpdate');
                return true;
            });
            const getSnapshotBeforeUpdate = sinon.spy(() => {
                console.log('getSnapshotBeforeUpdate');
                return null;
            });
            const componentDidMount = sinon.spy(() => console.log('componentDidMount'));
            const componentDidUpdate = sinon.spy(() => console.log('componentDidUpdate'));
            const componentWillUnmount = sinon.spy(() => console.log('componentWillUnmount'));
            class ReactComponent extends React.Component {
                static getDerivedStateFromProps = getDerivedStateFromProps;
                constructor(props) {
                    super(props);
                    this.state = {};
                }
                render() {
                    return <div>{this.state.a}</div>
                }
            }
            Object.assign(ReactComponent.prototype, {
                shouldComponentUpdate,
                getSnapshotBeforeUpdate,
                componentDidMount,
                componentDidUpdate,
                componentWillUnmount,
            });
            const instance = renderApp(function() {
                return <ChildrenIntactComponent>
                    {this.state.a === 3 ? undefined : <ReactComponent a={this.state.a} />}
                </ChildrenIntactComponent>
            }, {a: 1});

            expect(getDerivedStateFromProps.callCount).to.eql(1);
            expect(componentDidMount.callCount).to.eql(1);

            // update
            instance.setState({a: 2});
            expect(getDerivedStateFromProps.callCount).to.eql(2);
            expect(componentDidMount.callCount).to.eql(1);
            expect(shouldComponentUpdate.callCount).to.eql(1);
            expect(getSnapshotBeforeUpdate.callCount).to.eql(1);
            expect(componentDidUpdate.callCount).to.eql(1);

            // destroy 
            instance.setState({a: 3});
            expect(componentWillUnmount.callCount).to.eql(1);
        });

        it('lifecycle of mount of nested intact component', () => {
            const mount1 = sinon.spy(function() {
                console.log(1);
                expect(document.body.contains(this.element)).to.eql(true);
                expect(this.element.outerHTML).to.eql('<div><div><div>test</div></div></div>');
            });
            const mount2 = sinon.spy(function() {
                console.log(2);
                expect(document.body.contains(this.element)).to.eql(true);
                expect(this.element.outerHTML).to.eql('<div>test</div>');
            });
            const C = createIntactComponent(`<div>{self.get('children')}</div>`, {
                _mount: mount1
            });
            const D = createIntactComponent(`<div>test</div>`, {
                _mount: mount2
            });
            const instance = renderApp(function() {
                return (
                    <div className="a">
                        <C>
                            <div>
                                <D />
                            </div>
                        </C>
                    </div>
                )
            });
            expect(mount1.callCount).to.eql(1);
            expect(mount2.callCount).to.eql(1);
            // order is unnecessary
            // expect(mount2.calledAfter(mount1)).be.true;
        });

        it('lifecycle of mount of existing firsthand intact component', () => {
            const mount = sinon.spy(function() {
                console.log('mount');
            });
            const C = createIntactComponent(`<div>{self.get('show') ? self.get('children') : null}</div>`, {
                _mount: mount
            });
            const instance = renderApp(function() {
                return (
                    <div>
                        <ChildrenIntactComponent>
                            <C ref={i => this.c = i}>
                                <div>
                                    <C show={true}>
                                        <span>test</span>
                                    </C>
                                </div>
                            </C>
                        </ChildrenIntactComponent>
                    </div>
                )
            });
            // instance.setState({show: true});
            window.i = instance;
        });

        it('lifecycle of componentDidMount of nested react component in intact component', () => {
            const componentDidMount = sinon.spy(function() {
                expect(document.body.contains(this.dom)).to.be.true;
            });
            class ReactComponent extends React.Component {
                render() {
                    return <div ref={i => this.dom = i}>test</div>
                }
            }
            ReactComponent.prototype.componentDidMount = componentDidMount;
            const instance = renderApp(function() {
                return (
                    <ChildrenIntactComponent>
                        <div>
                            <ReactComponent />
                        </div>
                    </ChildrenIntactComponent>
                )
            });
            expect(componentDidMount.callCount).to.eql(1);
        });

        it('mount lifecycle of intact in intact template', () => {
            const mount = sinon.spy(function() {
                expect(document.body.contains(this.element)).to.be.true;
            });
            const C = createIntactComponent(`<D />`, {
                _init() {
                    this.D = D;
                }
            });
            const D = createIntactComponent(`<div>test</div>`, {
                _mount: mount
            });
            const instance = renderApp(function() {
                return <C />
            });
            expect(mount.callCount).to.eql(1);
        });

        it('mount lifycycle of intact in react render method', () => {
            const mount = sinon.spy(function() {
                expect(document.body.contains(this.element)).to.be.true;
            });
            class C extends React.Component {
                render() {
                    return <D />
                }
            }
            const D = createIntactComponent(`<div>test</div>`, {
                _mount: mount
            });
            const instance = renderApp(function() {
                return <C />
            });
            expect(mount.callCount).to.eql(1);
        });

        it('componentWillUnmount will be called when remove the element by parent', () => {
            const componentWillUnmount = sinon.spy(() => {
                console.log('unmount')
            });
            class C extends React.Component {
                render() {
                    return <div>react</div>
                }
            }
            Object.assign(C.prototype, {
                componentWillUnmount,
            });

            const instance = renderApp(function() {
                return <div>
                    {this.state.a === 1 ?
                        <ChildrenIntactComponent><C /></ChildrenIntactComponent> :
                        <div>test</div>
                    }
                </div>
            }, {a: 1});
            instance.setState({a: 2});
            expect(componentWillUnmount.callCount).to.eql(1);
        });
    });

    describe('vNode', () => {
        it('should get parentVNode of nested intact component', () => {
            const C = createIntactComponent(`<div>{self.get('children')}</div>`, {
                displayName: 'C',
                _mount() {
                    expect(this.parentVNode === undefined).to.be.true;
                    console.log(this.element.innerHTML);
                }
            });
            const D = createIntactComponent('<span>test</span>', {
                _mount() {
                    expect(this.parentVNode.parentVNode.tag === C).to.be.true;
                    expect(this.parentVNode.children).be.an.instanceof(E);
                },
                displayName: 'D',
            });
            const E = createIntactComponent('<i>{self.get("children")}</i>', {
                displayName: 'E',
                _mount() {
                    expect(this.parentVNode.tag === C).to.be.true;
                    expect(this.parentVNode.children).be.an.instanceof(C);
                }
            });
            const F = createIntactComponent('<span>f</span>', {
                _mount() {
                    // firsthand intact component
                    expect(this.parentVNode.tag === 'div').to.be.true;
                    expect(this.parentVNode.parentVNode.tag === C).to.be.true;
                    expect(this.parentVNode.parentVNode.children).be.an.instanceof(C);
                },
                displayName: 'F',
            });
            const G = createIntactComponent('<b>g</b>', {
                _mount() {
                    expect(this.parentVNode.parentVNode.tag === ChildrenIntactComponent).to.be.true;
                },
                displayName: 'G',
            });

            const instance = renderApp(function() {
                return <div>
                    <C>
                        <p><E><b><D /></b></E></p>
                        <F />
                        <ChildrenIntactComponent><G /></ChildrenIntactComponent>
                    </C>
                    <ChildrenIntactComponent><div>aaa</div></ChildrenIntactComponent>
                </div>
            });
        });

        it('should get parentVNode which return by functional component', () => {
            const h = Intact.Vdt.miss.h;
            const C = Intact.functionalWrapper((props) => {
                return h(D, props);
            });
            const D = createIntactComponent(`<div>test</div>`, {
                displayName: 'D',
                _mount() {
                    expect(this.parentVNode.tag === 'div').to.be.true;
                    expect(this.parentVNode.parentVNode.tag === E).to.be.true;
                }
            });
            D.displayName = 'D';
            const E = createIntactComponent(`<div>{self.get('children')}</div>`, {
                displayName: 'E',
            });
            E.displayName = 'E';
            const instance = renderApp(function() {
                return (
                    <ChildrenIntactComponent>
                        <E>
                            <C />
                        </E>
                    </ChildrenIntactComponent>
                )
            });
        });

        it('should get parentVNode which nest functional component in functional component', () => {
            const h = Intact.Vdt.miss.h;
            const C = Intact.functionalWrapper((props) => {
                return h(D, props);
            });
            let firstD = true;
            const D = createIntactComponent(`<div>{self.get('children')}</div>`, {
                displayName: 'D',
                _mount() {
                    if (firstD) {
                        expect(this.parentVNode).to.be.undefined
                        firstD = false;
                    } else {
                        expect(this.parentVNode.parentVNode.tag === E).to.be.true;
                    }
                }
            });
            D.displayName = 'D';
            let e;
            const E = createIntactComponent(`<div>{self.get('show') ? self.get('children') : null}</div>`, {
                displayName: 'E',
                _mount() {
                    e = this;
                    expect(this.parentVNode.parentVNode.tag).to.eql(D);
                }
            });
            E.displayName = 'E';
            const F = createIntactComponent(`<div>{self.get('children')}</div>`, {
                _mount() {
                    // update in updating
                    e.update();
                    expect(this.parentVNode.parentVNode.tag).to.eql(D);
                    expect(this.parentVNode.parentVNode.parentVNode.parentVNode.tag).to.eql(E);
                    expect(this.parentVNode.parentVNode.parentVNode.parentVNode.parentVNode.parentVNode.tag).to.eql(D);
                }
            });
            F.displayName = 'F';
            const instance = renderApp(function() {
                return (
                    <C className="a">
                        <i>test</i>
                        <E>
                            <C className="b">
                                <F><span>test</span></F>
                            </C>
                        </E>
                    </C>
                )
            });
            e.set('show', true);
        });

        it('should get parentVNode in template & update', () => {
            const mount = sinon.spy();
            const update = sinon.spy();

            const C = createIntactComponent(`<div>{self.get('children')}</div>`);
            C.displayName = 'C';
            const D = createIntactComponent('<i>{self.get("children")}</i>', {
                displayName: 'D',
                _mount() {
                    mount();
                    expect(this.parentVNode.tag === E).to.be.true;
                    expect(this.parentVNode.parentVNode.tag === F).to.be.true;
                    expect(this.parentVNode.parentVNode.children).be.an.instanceof(F);
                },

                _update() {
                    update();
                    expect(this.parentVNode.tag === E).to.be.true;
                    expect(this.parentVNode.parentVNode.tag === F).to.be.true;
                    expect(this.parentVNode.parentVNode.children).be.an.instanceof(F);
                }
            });
            D.displayName = 'D';
            const E = createIntactComponent(`<D>{self.get('children')}</D>`, {
                _init() {
                    this.D = D;
                }
            });
            E.displayName = 'E';
            const F = createIntactComponent(`<C>{self.get('children')}</C>`, {
                _init() {
                    this.C = C;
                }
            });
            F.displayName = 'F';

            const instance = renderApp(function() {
                return (
                    <div>
                        {this.state.count}
                        <F>
                            <p>
                                {this.state.count}
                                <E>
                                    test{this.state.count}
                                </E>
                            </p>
                        </F>
                    </div>
                );
            }, {count: 1});

            instance.setState({count: 2});
            expect(mount.callCount).to.eql(1);
            expect(update.callCount).to.eql(1);
        });

        it('change props of react children in intact', () => {
            const onClick = sinon.spy(() => console.log('click'));
            class IntactComponent extends Intact {
                get template() {
                    return `<div>{self.get('children')}</div>`
                }

                _init() {
                    this._changeProps();
                    this.on('$change:children', this._changeProps);
                }

                _changeProps() {
                    const children = this.get('children');
                    children.props['ev-click'] = this.onClick.bind(this);
                }
            }
            IntactComponent.prototype.onClick = onClick;

            const instance = renderApp(function() {
                return <IntactComponent><div>click</div></IntactComponent>
            });

            container.firstChild.firstChild.click(); 
            expect(onClick.callCount).to.eql(1);
            instance.forceUpdate();
            container.firstChild.firstChild.click(); 
            expect(onClick.callCount).to.eql(2);
        });

        it('should get children of intact component', () => {
            const C = createIntactComponent(`<div>{self.get('children')}</div>`, {
                _init() {
                    const {children, first} = this.get();
                    if (first) {
                        expect(children.tag === C).to.be.true;
                    }
                }
            });
            const instance = renderApp(function() {
                return <C first={true}><C>test</C></C>
            });
        });

        it('should get key', () => {
            const C = createIntactComponent(`<div>{self.get('children')}</div>`, {
                _init() {
                    const {key, first} = this.get();
                    if (!first) {
                        expect(key === 'a').to.be.true;
                    }
                }
            });
            const instance = renderApp(function() {
                return <C first={true}><C key="a">test</C></C>
            });
        })
    });

    it('ReactDom.findDOMNode', () => {
        const refs = {};
        render(<div>
            <ChildrenIntactComponent ref={i => refs.a = i}>
                <div>test</div>
            </ChildrenIntactComponent> 
            <SimpleReactComponent ref={i => refs.b = i}>
                <ChildrenIntactComponent ref={i => refs.c = i}>test</ChildrenIntactComponent>
            </SimpleReactComponent>
        </div>);
        expect(ReactDOM.findDOMNode(refs.a).outerHTML).to.eql('<div><div>test</div></div>');
        expect(ReactDOM.findDOMNode(refs.b).outerHTML).to.eql('<div><div>test</div></div>');
        expect(ReactDOM.findDOMNode(refs.c).outerHTML).to.eql('<div>test</div>');
    });

    it('React.createRef', () => {
        const ref1 = React.createRef();
        const ref2 = React.createRef();
        render(<div>
            <ChildrenIntactComponent ref={ref1}>
                <SimpleIntactComponent ref={ref2} />
            </ChildrenIntactComponent>
        </div>);
        console.log(ref1, ref2);
        expect(ref1.current).be.an.instanceof(ChildrenIntactComponent);
        expect(ref2.current).be.an.instanceof(SimpleIntactComponent);
    });

    it('ref conflict', () => {
        const C = createIntactComponent(`<div ref="a">test</div>`, {
            _mount() {
                expect(this.refs.a.outerHTML).to.eql('<div>test</div>');
            }
        });
        render(<div><C /></div>);
    });
});
