import React, { Component } from 'react';
import { Text, View } from 'react-native';
import DB from '../database';
import { Spinner, Container, Header, Left, Body, Right, Icon, Button } from 'native-base';

const MAIN_COLOR = '#39b772';

export default class Auth extends Component {
    componentDidMount() {
        this.handleAuthToken();
    }

    handleAuthToken = async () => {
        results = await DB.executeSql('SELECT token FROM user', []);
        if (results.rows.length > 0) {
            this.props.navigation.navigate('App');
        } else {
            this.props.navigation.navigate('Auth');
        }
    };

    render() {
        return (
            <Container>
                <Header
                    androidStatusBarColor="#34a869"
                    noShadow
                    style={{
                        backgroundColor: MAIN_COLOR,
                    }}
                >
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                            <Icon
                                name="md-menu"
                                style={{
                                    color: 'white',
                                    fontSize: 27,
                                }}
                            />
                        </Button>
                    </Left>
                    <Body>
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                color: 'white',
                            }}
                        >
                            Settings
                        </Text>
                    </Body>
                    <Right />
                </Header>
                <View
                    style={{
                        backgroundColor: 'white',
                        flex: 1,
                    }}
                >
                    <Spinner
                        style={{
                            flex: 1,
                            color: 'green',
                            justifyContent: 'center',
                            alignContent: 'center',
                        }}
                    />
                </View>
            </Container>
        );
    }
}
