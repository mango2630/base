class Store {
    constructor() {
        this.watcher = {}; // 存储 watch 对象
        this.store = {};   // 存储状态对象
    }

    watch(key, callback) {
        if (!this.watcher[key]) {
            this.watcher[key] = [];
        }
        this.watcher[key].push(callback);
    }

    update(key, value) {
        this.state[key] = value;
        this.notify(key, value);
    }

    notify(key, value) {
        if (!this.watcher[key]) return;
        this.watcher[key].forEach( callback => {
            callback(value);
        });
    }

    unwatch(key, callback) {
        if (!this.watcher[key]) return;
        this.watcher[key] = this.watcher[key].forEach( cb => cb !== callback);
    }
}