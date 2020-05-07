import React, { Component } from 'react';
import { Text, StyleSheet, View, Linking } from 'react-native';
import { Container, Header, Left, Right, Body, Button, Icon, Toast, Spinner } from 'native-base';
import axios from 'axios';
import DB from '../database';
import { NavigationActions, StackActions } from 'react-navigation';
import RNFetchBlob from 'rn-fetch-blob';
import email from 'react-native-email';

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
            requestCode: '',
            verifyEmail: '',
            password: '',
            token: '',
            loading: false,
            logged: false,
            errorMessage: '',
            isError: false,
            secureText: true,
            emailSection: true,
            codeSection: false,
            passwordSection: false,
            code: '',
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

    handleRequestCode = async () => {
        const { email } = this.state;
        let random = Math.floor(100000 + Math.random() * 900000);
        let code = random.toString();
        const URL = `http://katanoteapi.website/api/forgotpassword/${code}/${email}`;
        if (email.length > 0) {
            this._isMounted && this.setState({ loading: true });
            await axios
                .get(URL)
                .then((res) => {
                    if (res.data.code > 200) {
                        this.toastMessage('Your email not registered!', 'danger');
                        this._isMounted && this.setState({ loading: false });
                    } else {
                        this._isMounted &&
                            this.setState({
                                code,
                                codeSection: true,
                                emailSection: false,
                                loading: false,
                            });
                        this.toastMessage('Your email was successfully sent!', 'success');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.toastMessage('Something wrong!', 'danger');
                    this._isMounted && this.setState({ loading: false });
                });
        } else {
            this._isMounted &&
                this.setState({
                    isError: true,
                    errorMessage: 'Email address is required!',
                });
        }
    };

    handleCheckCode = () => {
        const { code, requestCode } = this.state;
        if (requestCode.length > 0) {
            this._isMounted && this.setState({ loading: true });
            if (code == requestCode) {
                this._isMounted &&
                    this.setState({
                        codeSection: false,
                        passwordSection: true,
                        loading: false,
                    });
            } else {
                this._isMounted &&
                    this.setState({
                        isError: true,
                        errorMessage: 'Your code did not match!',
                        loading: false,
                    });
            }
        } else {
            this._isMounted &&
                this.setState({
                    isError: true,
                    errorMessage: 'Request code is required!',
                });
        }
    };

    handleNewPassword = async () => {
        const { email, password } = this.state;
        const URL = 'http://katanoteapi.website/api/password';
        if (password.length > 0) {
            this._isMounted && this.setState({ loading: true });
            await axios
                .post(URL, {
                    email,
                    password,
                })
                .then((res) => {
                    if (res.data.code > 200) {
                        this.toastMessage('Something wrong!', 'danger');
                        console.log(res.data.message);
                        this._isMounted && this.setState({ loading: false });
                    } else {
                        this.toastMessage('Password has changed!', 'success');
                        this.props.navigation.navigate('Login');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.toastMessage('Something wrong!', 'danger');
                    this._isMounted && this.setState({ loading: false });
                });
        } else {
            this._isMounted &&
                this.setState({
                    isError: true,
                    errorMessage: 'Password is required!',
                });
        }
    };

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
            emailSection,
            codeSection,
            passwordSection,
            requestCode,
        } = this.state;
        return (
            <Container>
                <Header
                    androidStatusBarColor="#34a869"
                    noShadow
                    style={{
                        backgroundColor: 'transparent',
                    }}
                >
                    <Left>
                        {emailSection && (
                            <Button
                                transparent
                                onPress={() => this.props.navigation.navigate('Login')}
                            >
                                <Icon name="md-arrow-back" style={styles.icon} />
                            </Button>
                        )}
                    </Left>
                    <Body />
                </Header>
                {emailSection && (
                    <View style={{ padding: 25, flex: 1 }}>
                        <Text
                            style={{
                                color: '#1e1e1e',
                                fontSize: 26,
                                fontWeight: 'bold',
                            }}
                        >
                            Email Address
                        </Text>
                        <Text style={{ color: '#a5a5a5', marginBottom: 10 }}>
                            We will send you a request code via email.
                        </Text>
                        <IconInput
                            icon="md-mail"
                            placeholder="Registered email address"
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
                        <View>
                            {isError && <Text style={{ color: 'red' }}>{`*${errorMessage}`}</Text>}
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '50%', justifyContent: 'center' }}>
                                    <ButtonInput
                                        onPress={this.handleRequestCode}
                                        text="REQUEST CODE"
                                    />
                                </View>
                                <View
                                    style={{
                                        width: '50%',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Spinner color={loading ? MAIN_COLOR : 'white'} />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                {codeSection && (
                    <View style={{ padding: 25, flex: 1 }}>
                        <Text
                            style={{
                                color: '#1e1e1e',
                                fontSize: 26,
                                fontWeight: 'bold',
                            }}
                        >
                            Verify Request Code
                        </Text>
                        <Text style={{ color: '#a5a5a5', marginBottom: 10 }}>
                            Check your email to see the requested code.
                        </Text>
                        <IconInput
                            icon="md-code"
                            placeholder="Enter your request code"
                            onChangeText={(text) =>
                                this._isMounted &&
                                this.setState({
                                    requestCode: text,
                                })
                            }
                            keyboardType="numeric"
                            value={requestCode}
                        />
                        <View>
                            {isError && <Text style={{ color: 'red' }}>{`*${errorMessage}`}</Text>}
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '50%', justifyContent: 'center' }}>
                                    <ButtonInput
                                        onPress={this.handleCheckCode}
                                        text="SUBMIT CODE"
                                    />
                                </View>
                                <View
                                    style={{
                                        width: '50%',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Spinner color={loading ? MAIN_COLOR : 'white'} />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                {passwordSection && (
                    <View style={{ padding: 25, flex: 1 }}>
                        <Text
                            style={{
                                color: '#1e1e1e',
                                fontSize: 26,
                                fontWeight: 'bold',
                            }}
                        >
                            New Password
                        </Text>
                        <Text style={{ color: '#a5a5a5', marginBottom: 10 }}>
                            Enter your new password account below.
                        </Text>
                        <IconInput
                            icon="md-key"
                            placeholder="Your new password"
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
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '50%', justifyContent: 'center' }}>
                                    <ButtonInput onPress={this.handleNewPassword} text="UPDATE" />
                                </View>
                                <View
                                    style={{
                                        width: '50%',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Spinner color={loading ? MAIN_COLOR : 'white'} />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
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
        color: MAIN_COLOR,
        fontSize: 27,
    },
});
