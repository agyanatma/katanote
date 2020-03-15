import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, TextInput, FlatList, RefreshControl } from 'react-native'
import { Container, Header, Icon, Left, Right, Body, Button, Spinner, Item, Input, Form, Toast } from 'native-base'
import {TouchableOpacity, TouchableNativeFeedback} from 'react-native-gesture-handler';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({ name: "katanote.db", createFromLocation: "~katanote.db", location: "Library" });

const MAIN_COLOR = '#39b772';
const HEADER_HEIGHT = 130;

export default class Categories extends Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = {
            data: [],
            name_category: '',
            search: '',
            loading: false,
            showToast: false,
            isRefreshing: false
        }
        this.reloadData = [];
        this.board_id = this.props.navigation.state.params.board_id,
        this.name_board = this.props.navigation.state.params.name_board,
        this.searchHolder = [];
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
        this.setState({ loading: true });
        this.fetchData();
        this._isMounted = true;
        //console.log(this.state.name_category ? this.state.name_category : 'kosong');
    }

    componentWillUnmount(){
        this._isMounted = false;
        //this.reloadData();
    }

    fetchData() {
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM categories WHERE board_id = ? ORDER BY id DESC", [this.board_id],
                    (tx, results) => {
                        var len = results.rows.length;
                        //console.log(len);
                        if(len > 0){
                            var data = results.rows.raw();
                            //console.log(data);
                            if(this._isMounted){
                                this.setState({
                                    data: data
                                });
                                this.searchHolder = data;
                            }
                        }
                        if(this._isMounted){
                            this.setState({loading: false})
                        }
                    }, function(tx, err){
                        console.log(err);
                        this.toastMessage('Something wrong!','danger');
                        if(this._isMounted){
                            this.setState({loading: false});
                        }
                    }
                );
            });
        } catch (error) {
            console.log(error);
            if(this._isMounted){
                this.setState({loading: false});
            }
        }
        
    }

    onRefresh= () => {
        try {
            this.setState({ isRefreshing: true })
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM categories WHERE board_id = ? ORDER BY id DESC", [this.board_id],
                    (tx, results) => {
                        var len = results.rows.length;
                        if(len > 0){
                            var data = results.rows.raw();
                            if(this._isMounted){
                                this.setState({
                                    data: data,
                                    isRefreshing: false
                                });
                                this.searchHolder = data;
                            }
                        }
                        if(this._isMounted){
                            this.setState({loading: false})
                        }
                    }, function(tx, err){
                        console.log(err);
                        this.toastMessage('Something wrong!','danger');
                        if(this._isMounted){
                            this.setState({loading: false, isRefreshing: false});
                        }
                    }
                );
            });
        } catch (error) {
            console.log(error);
            if(this._isMounted){
                this.setState({loading: false, isRefreshing: false});
            }
        }
    }

    handleAdd = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO categories (name, board_id) VALUES (?,?)',
                [this.state.name_category, this.board_id],
                (tx, result) => {
                    console.log('Results', result.rowsAffected);
                    if(result.rowsAffected > 0){
                        this.toastMessage('New category was added!','success');
                        if(this._isMounted){
                            this.setState({
                                name_category:'' 
                            });
                        }

                        this.reloadData = this.props.navigation.addListener('didFocus', () => {
                            this.onRefresh();
                        });
                        // const resetAction = StackActions.reset({
                        //     index: 0,
                        //     actions: [NavigationActions.navigate({ routeName: 'Categories' })],
                        // });
                        // this.props.navigation.dispatch(resetAction);
                        //console.log(this.state.refresh == true ? 'true' : 'false');
                    }
                    else{
                        this.toastMessage('Adding new board failed!','danger');
                    }
                }, function(tx, err){
                    console.log(error);
                    this.toastMessage('Something wrong','danger')
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
        if(this._isMounted){
            this.setState({ data: searchData });
        }
    }

    renderItem = ({ item, index }) => {
        if (item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <View style={styles.item} >
                <TouchableNativeFeedback>
                    <View style={styles.itemContent}>
                        <Text style={styles.board}>{item.name ? item.name : ""}</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    };

    render() {
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
                            <Button transparent onPress={() => this.props.navigation.push('AddBoard')}>
                                <Icon name='md-more' style={styles.iconHeader}/>
                            </Button>
                        </Right>
                    </Header>
                    <View style={{marginLeft: 40}}>
                        <Text style={styles.title}>{this.name_board}</Text>
                    </View>
                </View>
                <View style={styles.searchBar}>
                    <Item style={styles.search}>
                            <Icon name="md-search" style={[styles.icon, styles.searchIcon]}/>
                            <Input onChangeText={(text) => this.handleSearch(text), (name) => this._isMounted ? this.setState({name_category: name}) : null} value={this.state.name_category} 
                            placeholder="Search or Add" placeholderTextColor="#dddd"/>
                            {
                                this.state.name_category ?
                                <Button transparent onPress={this.handleAdd}>
                                    <Icon name="md-add" style={[styles.icon, styles.searchIcon]}/>
                                </Button>
                                : null
                            }
                    </Item>
                </View>
                {
                    this.state.loading ? <Spinner style={styles.spinner}/> :
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        //onRefresh={this.state.refresh}
                        //refreshing={this.state.isRefreshing}
                        //onRefresh={this.onRefresh}
                        ListEmptyComponent={<Text style={styles.blank}>Data kosong</Text>}
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
        color: 'white'
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
        color: 'white'
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
    blank: {
        paddingTop: HEADER_HEIGHT,
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center'
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
