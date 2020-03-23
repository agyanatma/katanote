import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, TextInput, FlatList, RefreshControl, TouchableWithoutFeedback, Keyboard, TouchableWithoutFeedbackComponent } from 'react-native'
import { Container, Header, Icon, Left, Right, Body, Button, Spinner, Item, Input, Form, Toast } from 'native-base'
import DB from '../database';

const MAIN_COLOR = '#39b772';
const HEADER_HEIGHT = 130;

export default class Detail extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            editable: false,
            name_card: ''
        }
        const {params} = this.props.navigation.state;
        this.card_id = params.card_id;
        this.name_card = params.name_card;
        this.board = params.board;
    }

    componentDidMount(){
        this.fetchData();
        this._isMounted = true;
        if(this._isMounted){
            this.setState({name_card: this.name_card});
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    fetchData = async () => {
        try {
            results = await DB.executeSql("SELECT * FROM details WHERE card_id = ?", [this.card_id]);
            var len = results.rows.length;
            if(len > 0){
                var data = results.rows.raw();
                if(this._isMounted){
                    this.setState({data: data});
                }
                //console.log(data);
            }
            if(this._isMounted){
                this.setState({loading: false});
            }
        } catch (error) {
            console.log(error);
            this.toastMessage('Something Wrong','danger');
            if (this._isMounted) {
                this.setState({ loading: false });
            }
        }
    }

    handleEdit = async () => {
        const {name_card} = this.state;
        try {
            if(name_card){
                results = await DB.executeSql("UPDATE cards set name = ? where id = ?", [name_card, this.card_id]);
                console.log('Results', results.rowsAffected);
                if(results.rowsAffected > 0){
                    Keyboard.dismiss();   
                }
            }
        } catch (error) {
            console.log(error);
            this.toastMessage('Something Wrong','danger');
        }
    }

    render() {
        const {editable, name_card} = this.state;
        return (
            <Container style={styles.container}>
                <View style={styles.head}>
                    <Header androidStatusBarColor='#34a869' noShadow style={styles.header}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='md-arrow-back' style={styles.iconHeader} />
                            </Button>
                        </Left>
                        <Body/>
                        <Right>
                            <Button transparent>
                                <Icon name='md-more' style={styles.iconHeader}/>
                            </Button>
                        </Right>
                    </Header>
                    <View style={{marginHorizontal: 40}}>
                        {
                            editable ?
                            <TextInput style={styles.titleEdit} 
                                onChangeText={(text) => this.setState({name_card: text})} 
                                value={name_card}
                                onBlur={() => this.setState({editable: false})}
                                onSubmitEditing={this.handleEdit}
                                autoFocus
                            />
                            : <Text style={styles.title} onPress={() => this.setState({editable: true})}>{name_card}</Text>

                        }
                        <Text style={styles.subtitle}>{`Card from ${this.board}`}</Text>
                    </View>
                </View>
                {/* {
                    this.state.loading ? <Spinner style={styles.spinner}/> :
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        //refreshing={this.state.isRefreshing}
                        //onRefresh={this.onRefresh}
                        ListEmptyComponent={
                            <View style={styles.blankSpace}>
                                <Text style={styles.blank}>Didn't find any data...</Text>
                                <Text style={styles.blank}>Add something above!</Text>
                            </View>
                        }
                        contentContainerStyle={styles.list}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                } */}
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
        flex:1
    },
    header: {
        backgroundColor: 'transparent'
    },
    head: {
        backgroundColor: MAIN_COLOR,
        // position: 'absolute',
        // top:0,
        // left:0,
        // right:0,
        height: HEADER_HEIGHT,
        //elevation: 1000,
        //zIndex: 50,
        //transform: [{ translateY: headerY }]
        //marginBottom: 20
    },
    list: {
        paddingTop: 40,
        padding: 15,
        backgroundColor: 'transparent'
    },
    titlePage: {
        //paddingBottom: 20
        //backgroundColor: '#39b772',
    }, 
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        color: 'white',
        margin: 0,
        padding: 0
    },
    titleEdit: {
        fontSize: 27,
        fontWeight: 'bold',
        color: 'white',
        margin: 0,
        padding: 0,
        borderBottomWidth: 2,
        borderColor: '#34a869'
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'white',
        marginTop: 5
    },
    iconHeader: {
        color: 'white',
        fontSize: 27
    },
    icon: {
        color: '#a6a6a6',
        fontSize: 21
    },
    item: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 5,
        //padding: 15,
        borderRadius: 5,
        flex:1,
        elevation: 3,
        //height: Dimensions.get('window').width / numColumns
    },
    itemInvisible: {
        backgroundColor: 'transparent',
        elevation: 0
    },
    itemContent: {
        //height: Dimensions.get('window').width / numColumns,
        padding: 15
    },
    board: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
        color: '#1e1e1e'
    },
    description: {
        fontSize: 12,
        fontWeight: '300',
        color: '#5e5e5e'
    },
    spinner: {
        color: MAIN_COLOR,
        //flex:1,
        //paddingTop: HEADER_HEIGHT+50,
        position: 'absolute',
        top: Dimensions.get('window').height / 2,
        left:0,
        right:0,
        zIndex: 50,
    },
    blankSpace: {
        // position:'absolute',
        // top: 0,
        // left:0,
        // right:0,
        // zIndex: 100
        //backgroundColor: 'red',
        height: Dimensions.get('window').height / 2,
        justifyContent: 'center',
        alignContent: 'center',
    },
    blank: {
        //paddingTop: Dimensions.get('window').height / 2 - HEADER_HEIGHT ,
        textAlign: 'center',
        color: '#a5a5a5',
        fontSize: 16
    },
    searchBar: {
        //backgroundColor: 'red',
        //zIndex: 500,
        //marginTop: HEADER_HEIGHT - 25,
        //marginHorizontal: 40,
        position: 'absolute',
        top: HEADER_HEIGHT-25,
        left:40,
        right:40
        //justifyContent: 'center',
        //paddingHorizontal: 10,
        //borderRadius: 10
    },
    search: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10
    },
    searchIcon: {
        paddingHorizontal: 10
    }

})
