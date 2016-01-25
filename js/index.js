// Leave this file be

function onDeviceReady() {
    StatusBar.overlaysWebView(false);
    StatusBar.styleDefault();

    applogic();
}

document.addEventListener("deviceready", onDeviceReady, false);