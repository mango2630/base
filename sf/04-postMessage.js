/**
 * postMessage
 * - 目标窗口 
 * - 消息内容
 * - 目标窗口的域
 */

// window.location.origin

class WindowMock {
  constructor() {
    this.task = {};
    // this.origin = window.location.origin;
  }
  postMessage(data, targetOrigin = '') {
    if (this.task['message']) {
      this.task['message'].forEach( callback => {
        callback({
          data,
          origin: ''
        })
      });
    }
  }
  addEventListener(eventName, callback) {
    if (!this.task[eventName]) {
      this.task[eventName] = [];
    }
    this.task[eventName].push(callback);
  }
  removeEventListener(eventName, callback) {
    if (this.task[eventName]) {
      this.task[eventName] = this.task[eventName].filter( item => item !== callback);
    }
  }
}

const wm = new WindowMock();

wm.addEventListener('message', e => console.log(e));
wm.postMessage('abc');