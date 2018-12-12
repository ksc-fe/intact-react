// make sure all mount/update lifecycle methods of children have completed
export default class FakePromise {
    static all = function(promises) {
        let resolvedCount = 0;
        let callback;
        let resolved = false;
        let done = false;

        promises.forEach(p => p.then(then));

        if (promises._hasRewrite) {
            console.error('promises has not been done')
        }
        const push = promises.push;
        promises.push = function(p) {
            p.then(then);
            push.call(promises, p);
        };
        promises._hasRewrite = true;

        function _cb() {
            // clear array
            promises.length = 0;
            promises.push = push;
            promises._hasRewrite = false;
            callback();
        }

        function then() {
            resolvedCount++;
            if (promises.length === resolvedCount) {
                resolved = true;
                if (done) {
                    return console.error('promise has done');
                }
                if (callback) {
                    done = true;
                    _cb();
                }
            }
        }


        return {
            then(cb) {
                callback = cb;
                if (!promises.length || resolved) {
                    _cb();
                }
            }
        };
    };

    constructor(callback) {
        this.resolved = false;
        this.callbacks = [];
        callback.call(this, () => this.resolve());
    }

    resolve() {
        this.resolved = true;
        let cb;
        while (cb = this.callbacks.shift()) {
            cb();
        }
    }

    then(cb) {
        this.callbacks.push(cb);
        if (this.resolved) {
            this.resolve();
        }
    }
}
