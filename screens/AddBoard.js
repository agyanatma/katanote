import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Header, Left, Right, Body, Button, Icon, Content, Title, Item, Input, Form, Textarea, Text, Toast } from 'native-base'

import {databaseOptions, BOARD_SCHEMA, BoardSchema} from '../database/allSchemas';
const Realm = require('realm');

export default class AddBoard extends Component {

    constructor(props){
        super(props);
        this.state = {
            nameBoard: '',
            descBoard: '',
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

    addBoard() {
        Realm.open(databaseOptions)
        .then(realm => {
            if(this.state.nameBoard){
                let sort = realm.objects(BOARD_SCHEMA).max('id');
                let ID = sort ? sort + 1 : 1;
                realm.write(() => {
                    realm.create(BOARD_SCHEMA, {
                        id: ID,
                        name: this.state.nameBoard,
                        description: this.state.descBoard
                    })
                });
                this.props.navigation.navigate('Home');
                this.toastMessage('Data saved!','success');
                realm.close();
            }
            else{
                this.setState({isError: true});
            }
        })
        .catch(error =>{
            console.log(error);
            this.toastMessage('Something wrong!','danger');
        });
    }

    render() {
        return (
            <Container>
                <Header androidStatusBarColor='#34a869' noShadow style={styles.container}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-round-back' style={styles.icon} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={styles.title} >Create Board</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content contentContainerStyle={styles.content}>
                    <Form>
                        <Item regular style={styles.form} >
                            <Input placeholderTextColor='grey' placeholder='Title' onChangeText={(text) => this.setState({nameBoard: text})} />
                        </Item>
                        {
                            this.state.isError ? 
                            <Text style={styles.textError}>Please fill the name field!</Text>
                            : <Text style={styles.textError}></Text>
                        }
                        <Textarea regular style={styles.form} placeholderTextColor='grey' bordered rowSpan={5} placeholder='Description' onChangeText={(text) => this.setState({descBoard:text})} />
                        <Button block style={styles.button} onPress={() => this.addBoard()}>
                            <Text style={styles.textButton} >Create</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#39b772'
    },
    content: {
        padding: 20
    },
    icon: {
        color: 'white'
    },
    title: {
        fontWeight: 'bold'
    },
    form: {
        borderRadius: 10,
    },
    button: {
        width: 100,
        alignSelf: 'flex-end',
        marginTop: 20,
        //elevation: 0,
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
    }
})
