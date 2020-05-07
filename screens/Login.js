import React, { Component } from 'react';
import { Text, StyleSheet, View, Keyboard, Dimensions, FlatList, AsyncStorage } from 'react-native';
import { Container, Header, Left, Right, Body, Button, Icon, Toast, Spinner } from 'native-base';
import axios from 'axios';
import DB from '../database';
import { NavigationActions, StackActions } from 'react-navigation';
import RNFetchBlob from 'rn-fetch-blob';

import IconInput from '../components/IconInput';
import ButtonInput from '../components/ButtonInput';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const MAIN_COLOR = '#39b772';
const HEADER_HEIGHT = 130;

const URL = 'http://katanoteapi.website/api';

export default class Login extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            token: '',
            loading: false,
            logged: false,
            errorMessage: '',
            isError: false,
            secureText: true,
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    toastMessage = (message, type) => {
        Toast.show({
            text: message,
            duration: 4000,
            type: type,
            buttonText: 'Close',
        });
    };

    handleLogin = () => {
        const { email, password } = this.state;
        this.setState({ loading: true });
        axios
            .post(URL + '/login', {
                email: email,
                password: password,
            })
            .then(async (response) => {
                response = response.data;
                if (response.code > 200) {
                    this.setState({
                        isError: true,
                        errorMessage: response.message,
                    });
                } else {
                    let username = response.data.user.username;
                    let email = response.data.user.email;
                    let token = response.data.token;
                    try {
                        results = await DB.executeSql(
                            'INSERT INTO user (username, email, token) VALUES (?,?,?)',
                            [username, email, token]
                        );
                        if (results.rowsAffected > 0) {
                            console.log('save success');
                            this.toastMessage(response.message, 'success');
                            this.props.navigation.navigate('LoadingScreen');
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                this.setState({ loading: false });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    handleSaveUser = async (username, email, token) => {
        try {
            results = await DB.executeSql(
                'INSERT INTO user (username, email, token) VALUES (?,?,?)',
                [username, email, token]
            );
            if (results.rowsAffected > 0) {
                console.log('save success');
                this.setState({ logged: true, username });
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleChangeForm() {
        this.props.navigation.navigate('Register');
    }

    handleForgotPassword() {
        this.props.navigation.navigate('ForgotPassword');
    }

    showPassword() {
        const { secureText } = this.state;
        this._isMounted &&
            this.setState({
                secureText: !secureText,
            });
    }

    render() {
        const {
            email,
            password,
            loading,
            errorMessage,
            register,
            logged,
            isError,
            secureText,
        } = this.state;
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
                    <Body>
                        <Text style={styles.title}>Settings</Text>
                    </Body>
                    <Right>{loading && <Spinner color="white" />}</Right>
                </Header>
                <View style={{ padding: 25, flex: 1 }}>
                    <Text
                        style={{
                            color: '#1e1e1e',
                            fontSize: 26,
                            fontWeight: 'bold',
                            marginBottom: 10,
                        }}
                    >
                        Login
                    </Text>
                    <IconInput
                        icon="md-mail"
                        placeholder="Email"
                        onChangeText={(text) =>
                            this._isMounted &&
                            this.setState({
                                email: text,
                            })
                        }
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                    />
                    <IconInput
                        icon="md-key"
                        placeholder="Password"
                        onChangeText={(text) =>
                            this._isMounted &&
                            this.setState({
                                password: text,
                            })
                        }
                        autoCapitalize="none"
                        onPress={this.showPassword.bind(this)}
                        iconRight="md-eye"
                        secureTextEntry={secureText}
                        value={password}
                    />
                    <View>
                        {isError && <Text style={{ color: 'red' }}>{`*${errorMessage}`}</Text>}
                        <TouchableWithoutFeedback
                            style={{ paddingVertical: 10 }}
                            onPress={this.handleChangeForm.bind(this)}
                        >
                            <Text style={{ color: '#1e1e1e' }}>
                                Don't have account? Register here!
                            </Text>
                        </TouchableWithoutFeedback>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                                <ButtonInput onPress={this.handleLogin} text="SIGN IN" />
                            </View>
                            <View
                                style={{
                                    width: '50%',
                                    justifyContent: 'center',
                                }}
                            >
                                <TouchableWithoutFeedback
                                    style={{
                                        padding: 10,
                                        alignSelf: 'center',
                                    }}
                                    onPress={this.handleForgotPassword.bind(this)}
                                >
                                    <Text style={{ color: MAIN_COLOR, fontWeight: 'bold' }}>
                                        Forgot Password?
                                    </Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                </View>
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
    userImage: {
        marginBottom: 10,
        width: 70,
        height: 70,
        borderRadius: 75,
    },
    butttonEditProfile: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: MAIN_COLOR,
        borderWidth: 1,
    },
    icon: {
        color: 'white',
        fontSize: 27,
    },
});
