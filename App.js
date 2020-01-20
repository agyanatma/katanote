import React, { Component } from 'react'

import Navigation from './navigation';
import { Container } from 'native-base';

export default class App extends Component {
  render() {
    return (
      <Container>
        <Navigation />
      </Container>
    );
  }
}
