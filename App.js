import React, { Component } from 'react';

import Navigation from './navigation';
import { Root } from 'native-base';
import SplashScreen from 'react-native-splash-screen';
import PushNotification from 'react-native-push-notification';

export default class App extends Component {
    componentDidMount() {
        SplashScreen.hide();
        console.disableYellowBox = true;
    }

    render() {
        return (
            <Root>
                <Navigation />
            </Root>
        );
    }
}

PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
        console.log('TOKEN:', token);
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);

        //     // process the notification

        //     // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    // permissions: {
    //     alert: true,
    //     badge: true,
    //     sound: true,
    // },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: false,
});
