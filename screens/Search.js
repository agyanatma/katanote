import React, { Component } from 'react'
import { StyleSheet, View, FlatList, TouchableWithoutFeedback } from 'react-native'
import { Container, Header, Left, Right, Body, Button, Icon, Content, Title, Item, Input, Form, Textarea, Text, Spinner, ListItem } from 'native-base'
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({ name: "katanote.db", createFromLocation: "~katanote.db", location: "Library" });

const MAIN_COLOR = '#39b772';

export default class AddBoard extends Component {

    constructor(props){
        super(props);
        this.state = {
            name_board: '',
            data: [],
            loading: true,
            cancel: false
        }
        this.searchHolder = [];
    }

    componentDidMount(){
        this.fetchData();
    }

    fetchData() {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM boards", [],
                (tx, results) => {
                    var len = results.rows.length;
                    if(len > 0){
                        var data = results.rows.raw();
                        this.setState({
                            data: data,
                            loading:false
                        });
                        this.searchHolder = data;
                    }
                }, function(tx, err){
                    console.log(err);
                    this.toastMessage('Something','danger');
                }
            );
        });
    }

    handleSearch = text => {
        const searchData = this.searchHolder.filter(item => {      
            const itemData = `${item.name.toLowerCase()}`;
            const textData = text.toLowerCase();
            return itemData.indexOf(textData) > -1;    
        });
        
        this.setState({ data: searchData, cancel: true });
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={styles.item}>
                <Left style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name="md-list" style={styles.icon} />
                    <Text style={styles.board}>{item.name}</Text>
                </Left>
                <Right>
                    <Button transparent onPress={() => this.props.navigation.navigate('Cards', {board_id : item.id, name_board: item.name})}>
                        <Icon name="arrow-forward" style={styles.icon} />
                    </Button>
                </Right>
            </View>
        );
    };

    render() {
        return (
            <Container style={styles.container}>
                <Header androidStatusBarColor='#34a869' searchBar noShadow style={styles.header}>
                    <Item style={styles.search}>
                        <Icon name="md-search" style={styles.icon}/>
                        <Input onChangeText={(text) => this.handleSearch(text)} placeholder="Search" placeholderTextColor="#dddd"/>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
                            <Text style={styles.cancel}>Cancel</Text>
                        </TouchableWithoutFeedback>
                    </Item>
                </Header>
                {
                    this.state.loading ? <Spinner style={styles.spinner}/> :
                    <FlatList 
                        data={this.state.data}
                        contentContainerStyle={styles.list}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                    />

                }
                
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    header: {
        backgroundColor: MAIN_COLOR,
    },
    list: {
        //padding: 5
    },
    search: {
        borderRadius: 10
    },
    item: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        //paddingVertical: 12,
        borderColor: '#dddd',
        borderBottomWidth: 0.5
        //backgroundColor: 'white',
        // borderWidth: 0.5,
        // borderColor: '#dddd'
    },
    icon: {
        color: '#a5a5a5',
        fontSize: 21
    },
    spinner: {
        color: MAIN_COLOR,
        flex:1,
        justifyContent: 'center',
        alignContent: 'center',
        zIndex: 50,
    },
    cancel: {
        color: '#a5a5a5',
        marginRight:20
    },
    board: {
        fontSize: 16,
        color: '#1e1e1e',
        marginLeft: 10
    }
})

