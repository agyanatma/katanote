import React, { Component } from 'react'

import Navigation from './navigation';
import { Root } from 'native-base';

export default class App extends Component {
  render() {
    return (
      <Root>
        <Navigation />
      </Root>
    );
  }
}
