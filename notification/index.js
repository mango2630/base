
class TUINotification {
    // todo: notificationTitle 还是 title
    isShow = true;
    title = 'TUIcallKit 来电';
    body = '';
    icon = 'https://github.com/tencentyun/TUICallKit/blob/main/Preview/logo.png?raw=true';

    static instance = null;

    constructor() {

    }

    requestNotificationPermission() {
        let hasPermission = false;
        if (window && 'Notification' in window) {

            if (Notification.permission === 'granted') {
                hasPermission = true;
            } else {
                Notification.requestPermission()
                .then(permissionResult => {
                    if (permissionResult === 'granted') {
                        hasPermission = true;
                    }
                })
                .catch( error => {
                    console.error(error);
                })
            }

        }
        return hasPermission;
    }

    notify() {
        if (!this.isShow) return;
        const options = {
            body: this.body,
            icon: this.icon,
        }
        const notification = new Notification(this.title, options);
        notification.onclick = function() {
            // todo
        }
    }

    setNotificationInfo(infoObj) {
        const {
            isShow = this.isShow,
            title = this.title,
            body = this.body,
            icon = this.icon,
        } = infoObj
        this.isShow = isShow;
        this.title = title;
        this.body = body;
        this.icon = icon;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new TUINotification();
        }
        return this.instance;
    }
}
// 客户使用会遇到什么问题，这异常问题怎么处理
export default TUINotification.getInstance();