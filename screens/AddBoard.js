import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Header, Left, Right, Body, Button, Icon, Content, Title, Item, Input, Form, Textarea, Text, Toast } from 'native-base'
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({ name: "katanote.db", createFromLocation: "~katanote.db", location: "Library" });

export default class AddBoard extends Component {

    constructor(props){
        super(props);
        this.state = {
            name_board: '',
            desc_board: '',
            showToast: false,
            loading: false,
            isError: false
        }
    }

    toastMessage = (message, type) => {
        Toast.show({
            text: message,
            duration: 5000,
            type: type,
            buttonText: 'Close',
        });
    }

    addBoard = () => {
        try {
            if(this.state.name_board){
                db.transaction((tx) => {
                    tx.executeSql(
                        'INSERT INTO boards (name, description) VALUES (?,?)',
                        [this.state.name_board, this.state.desc_board],
                        (tx, result) => {
                            console.log('Results', result.rowsAffected);
                            if(result.rowsAffected > 0){
                                this.toastMessage('New board was added!','success');
                                this.props.navigation.push('Home');
                            }
                            else{
                                this.toastMessage('Adding new board failed!','danger');
                            }
                        }
                    );
                });
            }
            else{
                this.setState({ isError: true });
            }
        } catch (error) {
            this.toastMessage('Something wrong','danger')
            console.log(error);
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <View style={styles.head}>
                    <Header androidStatusBarColor='#34a869' noShadow style={styles.header}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back' style={styles.icon} />
                            </Button>
                        </Left>
                        <Body/>
                        <Right/>
                    </Header>
                    <Text style={styles.title}>Create Board</Text>
                </View>
                <View style={styles.content} >
                    <Form>
                        <Item regular style={styles.form} >
                            <Input placeholderTextColor='grey' placeholder='Title' onChangeText={(text) => this.setState({name_board: text})} value={this.state.name_board} />
                        </Item>
                        {
                            this.state.isError ? 
                            <Text style={styles.textError}>Please fill the name field!</Text>
                            : <Text style={styles.textError}></Text>
                        }
                        <Item regular style={styles.form} >
                            <Input placeholderTextColor='grey' placeholder='Description' onChangeText={(text) => this.setState({desc_board:text})} value={this.state.desc_board} />
                        </Item>
                        {/* <Textarea regular style={styles.form} placeholderTextColor='grey' bordered rowSpan={5} placeholder='Description' onChangeText={(text) => this.setState({desc_board:text})} value={this.state.desc_board} /> */}
                        <Button block style={styles.button} onPress={this.addBoard.bind(this)} >
                            <Text style={styles.textButton} >Create</Text>
                        </Button>
                    </Form>
                </View>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex:1
    },
    head: {
        backgroundColor: '#39b772',
        flex:1,
        position: 'absolute',
        top:0,
        left:0,
        right:0,
        height: 200
    },
    header: {
        backgroundColor: 'transparent'
    },
    content: {
        marginTop: 120,
        margin: 20,
        paddingVertical: 50,
        paddingHorizontal: 25,
        elevation: 25,
        borderRadius: 25,
        shadowColor: '#fefefe',
        shadowOpacity: 0.1,
        backgroundColor: 'white'
    },
    icon: {
        color: 'white',
        fontSize: 27
    },
    title: {
        fontWeight: 'bold',
    },
    form: {
        borderRadius: 10,
    },
    button: {
        marginTop: 50,
        backgroundColor: '#39b772',
        borderRadius: 10
    },
    textButton: {
        fontWeight: 'bold'
    },
    textError: {
        color: 'red',
        fontSize: 12,
        padding: 0,
        margin: 0
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    }
})
