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
            password: '',
            newPassword: '',
            token: '',
            loading: false,
            logged: false,
            errorMessage: '',
            isError: false,
            secureText: true,
        };
    }

    componentDidMount() {
        this.handleGetUser();
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

    handleGetUser = async () => {
        results = await DB.executeSql('SELECT token, username FROM user', []);
        if (results.rows.length > 0) {
            this._isMounted &&
                this.setState({
                    token: results.rows.item(0).token,
                    username: results.rows.item(0).username,
                });
        }
    };

    handleUpdate = () => {
        const { username, newPassword, password, token } = this.state;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        this.setState({ loading: true });
        axios
            .post(
                URL + '/update',
                {
                    username: username,
                    new_password: newPassword,
                    password: password,
                },
                config
            )
            .then(async (response) => {
                response = response.data;
                if (response.code > 200) {
                    this.setState({
                        isError: true,
                        errorMessage: response.message,
                        password: '',
                        newPassword: '',
                    });
                    this.setState({ loading: false });
                } else {
                    let email = response.data.email;
                    let username = response.data.username;
                    try {
                        results = await DB.executeSql('UPDATE user SET username=? WHERE email=?', [
                            username,
                            email,
                        ]);
                        if (results.rowsAffected > 0) {
                            console.log('update success');
                            this.toastMessage(response.message, 'success');
                            this.props.navigation.navigate('Settings');
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            });
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
            newPassword,
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
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="md-arrow-back" style={styles.icon} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.title}>Edit User</Text>
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
                        Edit User
                    </Text>
                    <View style={{ marginBottom: 30 }}>
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
                            icon="md-key"
                            placeholder="New Password"
                            onChangeText={(text) =>
                                this._isMounted &&
                                this.setState({
                                    newPassword: text,
                                })
                            }
                            autoCapitalize="none"
                            value={newPassword}
                        />
                    </View>
                    <IconInput
                        icon="md-key"
                        placeholder="Confirm Your Password"
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
                        <View style={{ width: '50%' }}>
                            <ButtonInput onPress={this.handleUpdate} text="UPDATE" />
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
