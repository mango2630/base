import TUINotification from './index.js';

function setNotification({}) {
    if (TUINotification.requestNotificationPermission()) {
        TUINotification.setNotification();
        TUINotification.notify()
    }
}

setNotification()