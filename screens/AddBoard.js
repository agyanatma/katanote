import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Header, Left, Right, Body, Button, Icon, Content, Title, Item, Input, Form, Textarea, Text, Toast } from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import DB from '../database';

export default class AddBoard extends Component {

    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            name_board: '',
            desc_board: '',
            showToast: false,
            loading: false,
            isError: false,
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

    componentDidMount(){
        this._isMounted = true;
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    addBoard = async () => {
        const {name_board, desc_board} = this.state;
        try {
            if(this.state.name_board){
                results = await DB.executeSql('INSERT INTO boards (name, description) VALUES (?,?)', [name_board, desc_board]);
                console.log('Results', results.rowsAffected);
                if(results.rowsAffected > 0){
                    this.toastMessage('New board was added!','success');
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Home' })],
                    });
                    this.props.navigation.dispatch(resetAction);
                }
                else{
                    this.toastMessage('Adding new board failed!','danger');
                    if(this._isMounted){
                        this.setState({ loading: false })
                    }
                }
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
                            <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                                <Icon name='md-arrow-back' style={styles.icon} />
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
                            <Input placeholderTextColor='grey' placeholder='Title' onChangeText={(text) => this._isMounted ? this.setState({name_board: text}) : null} value={this.state.name_board} />
                        </Item>
                        {
                            this.state.isError ? 
                            <Text style={styles.textError}>Please fill the name field!</Text>
                            : <Text style={styles.textError}></Text>
                        }
                        <Item regular style={styles.form} >
                            <Input placeholderTextColor='grey' placeholder='Description' onChangeText={(text) => this._isMounted ? this.setState({desc_board:text}) : null} value={this.state.desc_board} />
                        </Item>
                        {/* <Textarea regular style={styles.form} placeholderTextColor='grey' bordered rowSpan={5} placeholder='Description' onChangeText={(text) => this.setState({desc_board:text})} value={this.state.desc_board} /> */}
                        <Button block style={styles.button} onPress={this.addBoard} >
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
        elevation: 5,
        borderRadius: 10,
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
        borderRadius: 5,
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
