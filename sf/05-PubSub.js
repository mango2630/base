/**
 * 
 * publish: key, value
 * subscribe: key, callback; 一个 key 可能对应多个 callback
 * unsubscribe: key, callback
 */

class PubSub {
    constructor() {
        this.task = {}; // 存储要订阅的事件
    }
    subscribe(eventName, callback) {
        if (!this.task[eventName]) {
            this.task[eventName] = [];
        }
        this.task[eventName].push(callback);
    }
    unsubscribe(eventName, callback) {
        if (this.task[eventName]) {
            this.task[eventName] = this.task[eventName].filter(item => item!== callback);
        }
    }
    publish(eventName, data) {
        if (this.task[eventName]) {
            this.task[eventName].forEach( callback => {
                callback(data)
            });
        }
    }
}

const pubsub = new PubSub();
pubsub.subscribe('key', e => console.log(e));
pubsub.publish('key', '订阅的事件');