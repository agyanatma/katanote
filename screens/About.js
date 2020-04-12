import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Image,
    Linking
} from 'react-native';
import {
    Container,
    Header,
    Left,
    Right,
    Body,
    Button,
    Icon,
    Toast,
    Footer
} from 'native-base';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const MAIN_COLOR = '#39b772';
const APP = require('../package.json');

export default class About extends Component {
    render() {
        return (
            <Container>
                <Header
                    androidStatusBarColor="#34a869"
                    noShadow
                    style={{
                        backgroundColor: 'white'
                    }}
                >
                    <Left>
                        <Button
                            transparent
                            onPress={() =>
                                this.props.navigation.toggleDrawer()
                            }
                        >
                            <Icon
                                name="md-menu"
                                style={styles.icon}
                            />
                        </Button>
                    </Left>
                    <Body>
                        {/* <Text style={styles.title}>About</Text> */}
                    </Body>
                    <Right />
                </Header>
                <View
                    style={{
                        flex: 1,
                        padding: 25,
                        justifyContent: 'center',
                        alignContent: 'center',
                        marginTop: -50
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>KataNote</Text>
                    <Text style={styles.subtitle}>
                        your private catalogs and notes
                    </Text>
                    <Image
                        source={require('../assets/icon.png')}
                        resizeMode="contain"
                        style={{
                            height: 120,
                            width: '100%',
                            marginVertical: 20
                        }}
                    />
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 16,
                            color: '#4a4a4a'
                        }}
                    >{`Version ${APP.version}`}</Text>
                </View>
                <Footer style={{ backgroundColor: 'transparent' }}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Linking.openURL('https://nore.web.id/');
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 14,
                                color: '#a5a5a5'
                            }}
                        >
                            Powered by Nore
                        </Text>
                    </TouchableWithoutFeedback>
                </Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white'
    },
    icon: {
        color: MAIN_COLOR,
        fontSize: 27
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1e1e1e'
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#4a4a4a',
        marginBottom: 10
    }
});
