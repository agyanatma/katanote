import React, { Component } from 'react'

import Navigation from './navigation';
import { Root } from 'native-base';
import SplashScreen from 'react-native-splash-screen';

export default class App extends Component {

  componentDidMount() {
    SplashScreen.hide()
  }

  render() {
    return (
      <Root>
        <Navigation />
      </Root>
    );
  }
}
