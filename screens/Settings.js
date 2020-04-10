import React, { Component } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import { Container, Header, Left, Right, Body, Button, Icon, Toast } from 'native-base';
import { TouchableWithoutFeedback, TextInput } from 'react-native-gesture-handler';
import DB from '../database';

const MAIN_COLOR = '#39b772';
const HEADER_HEIGHT = 130;

export default class Settings extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            userDesc: ''
        };
    }

    componentDidMount() {
        this.getDataUser();
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    toastMessage = (message, type) => {
        Toast.show({
            text: message,
            duration: 2000,
            type: type,
            buttonText: 'Close'
        });
    };

    getDataUser = async () => {
        try {
            results = await DB.executeSql('SELECT * FROM user', []);
            //console.log(results.rows.raw())
            if (results.rows.length > 0) {
                this._isMounted &&
                    this.setState({
                        userName: results.rows.item(0).username,
                        userDesc: results.rows.item(0).description
                    });
            }
        } catch (error) {
            console.log(error);
        }
    };

    updateDataUser = async () => {
        const { userName, userDesc } = this.state;
        try {
            if (userName.length > 0) {
                results = await DB.executeSql('UPDATE user SET username=? WHERE id=?', [userName, 1]);
                results = await DB.executeSql('UPDATE user SET description=? WHERE id=?', [userDesc, 1]);
                console.log('Update user: ', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    this.toastMessage('Title successfully updated!', 'success');
                    this.props.navigation.navigate('Home');
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        const { userName, userDesc } = this.state;
        return (
            <Container>
                <Header androidStatusBarColor="#34a869" noShadow style={{ backgroundColor: MAIN_COLOR }}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                            <Icon name="md-menu" style={styles.icon} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.title}>Settings</Text>
                    </Body>
                    <Right />
                </Header>
                <ScrollView style={{ padding: 25 }}>
                    {/* <View style={{alignItems: 'center', marginBottom: 30}}>
                        <Thumbnail source={require('../assets/user.jpg')} style={styles.userImage} />
                        <TouchableWithoutFeedback style={styles.butttonEditProfile} onPress={() => console.log('pres')}>
                            <Text style={{ color: MAIN_COLOR }}>Edit profile picture</Text>
                        </TouchableWithoutFeedback>
                    </View> */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#a5a5a5',
                            borderRadius: 10,
                            marginVertical: 5
                        }}
                    >
                        <Icon name="md-person" style={{ marginHorizontal: 20, fontSize: 21, color: '#a5a5a5' }} />
                        <View style={{ flex: 1 }}>
                            <TextInput
                                style={{ fontSize: 14 }}
                                placeholder="Username"
                                onChangeText={text => this._isMounted && this.setState({ userName: text })}
                                value={userName}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#a5a5a5',
                            borderRadius: 10,
                            marginVertical: 5
                        }}
                    >
                        <Icon name="md-list" style={{ marginHorizontal: 20, fontSize: 21, color: '#a5a5a5' }} />
                        <View style={{ flex: 1 }}>
                            <TextInput
                                style={{ fontSize: 14 }}
                                placeholder="Optional description"
                                onChangeText={text => this._isMounted && this.setState({ userDesc: text })}
                                value={userDesc}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 10, alignItems: 'stretch' }}>
                        <TouchableWithoutFeedback style={styles.butttonSubmitProfile} onPress={this.updateDataUser}>
                            <Text
                                style={{
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                }}
                            >
                                UPDATE
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
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
    userImage: {
        marginBottom: 10,
        width: 70,
        height: 70,
        borderRadius: 75
    },
    butttonEditProfile: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: MAIN_COLOR,
        borderWidth: 1
    },
    butttonSubmitProfile: {
        backgroundColor: MAIN_COLOR,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderColor: MAIN_COLOR,
        borderWidth: 1,
        borderRadius: 10
    }
});
