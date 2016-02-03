//PUSHWOOSH

function initPushwoosh() {
    console.log('pushwoosh init')
    var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

    //set push notification callback before we initialize the plugin
    document.addEventListener('push-notification', function(event) {
                                //get the notification payload
                                var notification = event.notification;

                                //display alert to the user for example
                                alert(notification.aps.alert);

                                //clear the app badge
                                pushNotification.setApplicationIconBadgeNumber(0);
                            });

    //initialize the plugin
    pushNotification.onDeviceReady({pw_appid:"4FF24-5ACEC"});

    //register for pushes
    pushNotification.registerDevice(
        function(status) {
            var deviceToken = status['deviceToken'];
            console.warn('registerDevice: ' + deviceToken);
        },
        function(status) {
            console.warn('failed to register : ' + JSON.stringify(status));
            alert(JSON.stringify(['failed to register ', status]));
        }
    );

    //reset badges on app start
    pushNotification.setApplicationIconBadgeNumber(0);
}

// console.log('DEVICE TOKEN IS : '+deviceToken)

document.addEventListener('push-notification', function(event) {
             var notification = event.notification;
             alert(notification.aps.alert);
             pushNotification.setApplicationIconBadgeNumber(0);
});
