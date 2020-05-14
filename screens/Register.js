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

const URL = 'http://katanoteapi.website/api';

export default class Login extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            username: '',
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

    handleRegister = () => {
        const { username, email, password } = this.state;
        this.setState({ loading: true });
        if (username != '' && email != '' && password != '') {
            axios
                .post(URL + '/register', {
                    username: username,
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
                            this.toastMessage('Something wrong!', 'danger');
                        }
                    }
                    this.setState({ loading: false });
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({ loading: false });
                });
        } else {
            this.setState({
                isError: true,
                errorMessage: 'The email, username, and password field is required!',
            });
            this.setState({ loading: false });
        }
    };

    handleChangeForm() {
        this.props.navigation.navigate('Login');
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
            username,
            email,
            password,
            loading,
            errorMessage,
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
                        Register
                    </Text>
                    <IconInput
                        icon="md-person"
                        placeholder="Username"
                        onChangeText={(text) =>
                            this._isMounted &&
                            this.setState({
                                username: text,
                            })
                        }
                        autoCapitalize="none"
                        value={username}
                    />
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
                        onPress={this.showPassword.bind(this)}
                        iconRight="md-eye"
                        secureTextEntry={secureText}
                        autoCapitalize="none"
                        value={password}
                    />
                    <View>
                        {isError && <Text style={{ color: 'red' }}>{`*${errorMessage}`}</Text>}
                        <TouchableWithoutFeedback
                            style={{ paddingVertical: 10 }}
                            onPress={this.handleChangeForm.bind(this)}
                        >
                            <Text style={{ color: '#1e1e1e' }}>
                                Already have account? Login here!
                            </Text>
                        </TouchableWithoutFeedback>
                        <View style={{ width: '50%' }}>
                            <ButtonInput onPress={this.handleRegister} text="SIGN UP" />
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
