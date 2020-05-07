import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
    Container,
    Header,
    Left,
    Right,
    Body,
    Button,
    Icon,
    Content,
    Title,
    Item,
    Input,
    Form,
    Textarea,
    Text,
    Toast,
} from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import DB from '../database';

import IconInput from '../components/IconInput';
import ButtonInput from '../components/ButtonInput';
import IconTextarea from '../components/IconTextarea';

export default class AddBoard extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            name_board: '',
            desc_board: '',
            loading: false,
            isError: false,
            editable: false,
        };
        const { params } = this.props.navigation.state;
        this.board_id = params.board_id;
    }

    toastMessage = (message, type) => {
        Toast.show({
            text: message,
            duration: 2000,
            type: type,
            buttonText: 'Close',
        });
    };

    componentDidMount() {
        this.getIdBoard();
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getIdBoard = async () => {
        try {
            console.log(this.board_id);
            if (this.board_id) {
                results = await DB.executeSql('SELECT * FROM boards WHERE id=?', [this.board_id]);
                if (results.rows.length > 0) {
                    if (this._isMounted) {
                        this.setState({
                            name_board: results.rows.item(0).name,
                            desc_board: results.rows.item(0).description,
                            editable: true,
                        });
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    addBoard = async () => {
        const { name_board, desc_board, editable } = this.state;
        try {
            if (name_board && editable == false) {
                results = await DB.executeSql(
                    'INSERT INTO boards (name, description) VALUES (?,?)',
                    [name_board, desc_board]
                );
                console.log('Board added: ', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    this.toastMessage('New board was added!', 'success');
                    this.props.navigation.goBack();
                } else {
                    this.toastMessage('Adding new board failed!', 'danger');
                    if (this._isMounted) {
                        this.setState({ loading: false });
                    }
                }
            } else if (name_board && editable == true) {
                results = await DB.executeSql(
                    'UPDATE boards SET name=?, description=? WHERE id=?',
                    [name_board, desc_board, this.board_id]
                );
                console.log('Board updated: ', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    this.toastMessage('Board successfully updated!', 'success');
                    this.props.navigation.navigate('Home');
                }
            } else {
                if (this._isMounted) {
                    this.setState({ isError: true });
                }
            }
        } catch (error) {
            this.toastMessage('Something wrong', 'danger');
            console.log(error);
        }
    };

    handleToHome = () => {
        this.props.navigation.navigate('Home');
    };

    render() {
        const { name_board, desc_board } = this.state;
        return (
            <Container style={styles.container}>
                <View style={styles.head}>
                    <Header androidStatusBarColor="#34a869" noShadow style={styles.header}>
                        <Left>
                            <Button transparent onPress={this.handleToHome}>
                                <Icon name="md-arrow-back" style={styles.icon} />
                            </Button>
                        </Left>
                        <Body />
                        <Right />
                    </Header>
                    <Text style={styles.title}>
                        {this.state.editable ? 'Update Board' : 'Create Board'}
                    </Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 25 }}>
                    <IconInput
                        placeholder="Title"
                        icon="md-clipboard"
                        onChangeText={(text) =>
                            this._isMounted && this.setState({ name_board: text })
                        }
                        value={name_board}
                    />
                    {this.state.isError && (
                        <Text style={styles.textError}>Title field is required!</Text>
                    )}
                    <IconTextarea
                        placeholder="Description"
                        icon="md-list"
                        onChangeText={(text) =>
                            this._isMounted && this.setState({ desc_board: text })
                        }
                        multiline={true}
                        //numberOfLines={1}
                        value={desc_board}
                    />
                    <View style={{ marginTop: 10 }}>
                        <ButtonInput
                            onPress={this.addBoard}
                            text={this.state.editable ? 'UPDATE' : 'CREATE'}
                        />
                    </View>
                </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    head: {
        backgroundColor: '#39b772',
        //flex:1,
        // position: 'absolute',
        // top:0,
        // left:0,
        // right:0,
        height: 130,
    },
    header: {
        backgroundColor: 'transparent',
    },
    content: {
        //marginTop: 120,
        paddingTop: 20,
        //paddingVertical: 50,
        paddingHorizontal: 45,
        //elevation: 5,
        borderRadius: 10,
        shadowColor: '#fefefe',
        shadowOpacity: 0.1,
        backgroundColor: 'white',
    },
    icon: {
        color: 'white',
        fontSize: 27,
    },
    title: {
        fontWeight: 'bold',
    },
    form: {
        borderRadius: 5,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#39b772',
        borderRadius: 10,
    },
    textButton: {
        fontWeight: 'bold',
    },
    textError: {
        color: 'red',
        fontSize: 12,
        padding: 0,
        margin: 0,
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
});
