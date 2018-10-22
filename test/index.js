import Intact from '../index.js';
import React from 'react'

describe('Unit test', () => {
    describe('Render', () => {
        it('render intact component in react', (done) => {
            console.log(Intact, 'sjkh')
            console.log(React)
            setTimeout(() => {
                console.log(done)
                done()
            }, 200)
        });
    })
})
