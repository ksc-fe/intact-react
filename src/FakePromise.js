// make sure all mount/update lifecycle methods of children have completed
export default class FakePromise {
    static all = function(promises) {
        let count = promises.length;
        let resolvedCount = 0;
        let callback;

        promises.forEach(p => {
            p.then(() => {
                resolvedCount++;
                if (count === resolvedCount) {
                    callback && callback();
                }
            });
        });

        return {
            then(cb) {
                callback = cb;
                if (!count) {
                    callback();
                }
            }
        };
    };

    constructor(callback) {
        this.resolved = false;
        this.callback = undefined;
        callback.call(this, () => this.resolve());
    }

    resolve() {
        this.resolved = true;
        this.callback && this.callback();
    }

    then(cb) {
        this.callback = cb;
        if (this.resolved) {
            this.callback();
        }
    }
}

export let promises = [];
const stacks = [];
export function pushStack() {
    stacks.push(promises); 
    promises = [];
}
export function popStack() {
    promises = stacks.pop();
}
