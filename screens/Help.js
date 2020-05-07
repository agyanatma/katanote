import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    ScrollView,
    Linking,
    TouchableWithoutFeedback,
} from 'react-native';
import { Container, Header, Left, Right, Button, Icon, Body, Content, ListItem } from 'native-base';

const MAIN_COLOR = '#39b772';

export default class Help extends Component {
    openURL = (scheme, url) => {
        console.log('1');
        Linking.canOpenURL(scheme)
            .then((supported) => Linking.openURL(supported ? scheme : url))
            .catch((err) => console.error('An error occurred', err));
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
                            <Icon name="md-menu" style={styles.icon} />
                        </Button>
                    </Left>
                    <Body>{/* <Text style={styles.title}>Help</Text> */}</Body>
                    <Right />
                </Header>
                <ScrollView
                    contentContainerStyle={{ padding: 25 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        source={require('../assets/bg_help.png')}
                        resizeMode="contain"
                        style={{
                            height: 200,
                            width: '100%',
                            marginBottom: 10,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#1e1e1e',
                            marginBottom: 15,
                        }}
                    >
                        Help & Support
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#1e1e1e',
                            marginBottom: 5,
                        }}
                    >
                        We provide several features for managing your archives such as date, text,
                        pricing, checklist and image. You can also share archives on various social
                        media.
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#1e1e1e',
                            marginBottom: 5,
                        }}
                    >
                        Contact us for system complaints or question regarding our application.
                    </Text>
                    <Text
                        style={{
                            fontSize: 18,
                            color: '#1e1e1e',
                            marginBottom: 10,
                            marginTop: 15,
                            fontWeight: 'bold',
                        }}
                    >
                        Contact Us
                    </Text>
                    <TouchableWithoutFeedback
                        onPress={() => Linking.openURL('https://nore.web.id/')}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 5,
                            }}
                        >
                            <Icon
                                name="md-globe"
                                style={{
                                    color: MAIN_COLOR,
                                    marginHorizontal: 10,
                                    fontSize: 24,
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                }}
                            >
                                Nore Website
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() =>
                            this.openURL(
                                'fb://profile/norewebid',
                                'https://www.facebook.com/norewebid/'
                            )
                        }
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 5,
                            }}
                        >
                            <Icon
                                name="logo-facebook"
                                style={{
                                    color: '#4267b2',
                                    marginHorizontal: 10,
                                    fontSize: 24,
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                }}
                            >
                                Nore
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() =>
                            this.openURL(
                                'instagram://user?username=nore.web.id',
                                'https://www.instagram.com/nore.web.id/'
                            )
                        }
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 5,
                            }}
                        >
                            <Icon
                                name="logo-instagram"
                                style={{
                                    color: '#dd336d',
                                    marginHorizontal: 10,
                                    fontSize: 24,
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                }}
                            >
                                nore.web.id
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() =>
                            this.openURL(
                                'linkedin://profile?id=noreweb',
                                'https://www.linkedin.com/company/noreweb'
                            )
                        }
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 5,
                            }}
                        >
                            <Icon
                                name="logo-linkedin"
                                style={{
                                    color: '#0073b0',
                                    marginHorizontal: 10,
                                    fontSize: 24,
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                }}
                            >
                                Nore
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    icon: {
        color: 'white',
        fontSize: 27,
    },
});
