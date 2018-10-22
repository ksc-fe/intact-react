import Intact from '../index.js';
import React from 'react'
import ReactDOM from 'react-dom'

const h = React.createElement;
const c = React.Component;

describe('Unit test', () => {
    describe('Render', () => {
        it('render intact component in react', (done) => {
            const container = document.createElement('div');
            ReactDOM.render(
                h('div', {
                    onClick: () => console.log('++++++')
                }, '======'),
                container
            );
            document.body.appendChild(container);
            done();
        });
    })
})
