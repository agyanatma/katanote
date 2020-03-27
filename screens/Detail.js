import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, TextInput, FlatList, RefreshControl, TouchableWithoutFeedback, Keyboard, Image } from 'react-native'
import { Container, Header, Icon, Left, Right, Body, Button, Spinner, Item, Input, Form, Toast, ListItem, ActionSheet, Thumbnail } from 'native-base'
import { StackActions, NavigationActions } from 'react-navigation';
import DB from '../database';
import ImagePicker from 'react-native-image-picker';


const MAIN_COLOR = '#39b772';
const HEADER_HEIGHT = 130;

export default class Detail extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            editable: false,
            name_card: '',
            image: ''
        }
        const {params} = this.props.navigation.state;
        this.card_id = params.card_id;
        this.board_id = params.board_id;
        this.name_card = params.name_card;
        this.name_board = params.name_board;
    }

    componentDidMount(){
        this.getImageCard();
        this._isMounted = true;
        if(this._isMounted){
            this.setState({name_card: this.name_card});
        }
        //console.log(this.state.image);
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    // getDetailCard = async () => {
    //     try {
    //         results = await DB.executeSql("SELECT * FROM details WHERE card_id = ?", [this.card_id]);
    //         var len = results.rows.length;
    //         if(len > 0){
    //             var data = results.rows.raw();
    //             if(this._isMounted){
    //                 this.setState({data: data});
    //             }
    //         }
    //         if(this._isMounted){
    //             this.setState({loading: false});
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         //this.toastMessage('Something Wrong','danger');
    //         if (this._isMounted) {
    //             this.setState({ loading: false });
    //         }
    //     }
    // }

    toastMessage = (message, type) => {
        Toast.show({
            text: message,
            duration: 5000,
            type: type,
            buttonText: 'Close',
        });
    }

    getImageCard = async () => {
        try {
            results = await DB.executeSql("SELECT * FROM images WHERE card_id=?", [this.card_id]);
            let image = results.rows.item(0).uri;
            console.log(image);
            if(results){
                if(this._isMounted){
                    this.setState({ image });
                }
                //console.log('has image');
            }
            //console.log(results.rows.item(0).image);
        } catch (error) {
            console.log(error);
        }
    }

    handleAddImage = () => {
        const options = {
            title: 'Select Image',
            noData: true,
            mediaType: 'photo',
            storageOptions: {
                skipBackup: true,
                path: 'Katanote',
            },
        }

        ImagePicker.showImagePicker(options, async (response) => {
            console.log(response.uri);
            try {
                results = await DB.executeSql("INSERT INTO images (uri, card_id) VALUES (?,?)", [response.uri, this.card_id]);
                if(results.rowsAffected > 0){
                    console.log('Results',results.rowsAffected);
                    await this.getImageCard();
                } 
            } catch (error) {
                console.log(error); 
            }
        });


    }

    handleBack = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName:'Cards', params: {board_id: this.board_id, name_board: this.name_board}})],
        });
        this.props.navigation.dispatch(resetAction);
    }

    handleEdit = async () => {
        const {name_card} = this.state;
        try {
            if(name_card){
                results = await DB.executeSql("UPDATE cards SET name = ? where id = ?", [name_card, this.card_id]);
                console.log('Results', results.rowsAffected);
                if(results.rowsAffected > 0){
                    console.log('Results:', resul)
                }
            }
        } catch (error) {
            console.log(error);
            //this.toastMessage('Something Wrong','danger');
        }
    }

    render() {
        const {editable, name_card, image} = this.state;
        return (
            <Container style={styles.container}>
                <View style={styles.head}>
                    <Header androidStatusBarColor='#34a869' noShadow style={styles.header}>
                        <Left>
                            <Button transparent onPress={this.handleBack}>
                                <Icon name='md-arrow-back' style={styles.iconHeader} />
                            </Button>
                        </Left>
                        <Body/>
                        <Right>
                            { 
                            image == '' ?
                                <Button transparent onPress={this.handleAddImage}>
                                    <Icon type='MaterialCommunityIcons' name='image-plus' style={styles.iconHeader}/>
                                </Button>
                            : null
                            }
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
                            : <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title} onPress={() => this.setState({editable: true})}>{name_card}</Text>

                        }
                        <Text style={styles.subtitle}>{`Item from ${this.name_board}`}</Text>
                    </View>
                </View>
                <View style={styles.detailContainer}>
                    <View style={styles.detail}>
                        {
                            image ? 
                            <Thumbnail style={{marginBottom: 20, borderWidth: 1, borderColor: '#dddd', height:100, width: 100}} square large source={{uri: image}} />
                            //<Image style={{marginBottom: 20, height: 100, resizeMode: 'contain', flexDirection: 'row', backgroundColor: 'red' }} source={{uri: image}} />
                            : null
                        }
                        <Text style={styles.textDefault}>Edit description...</Text>
                    </View>
                    <View style={styles.addDetail}>
                        {/* <View style={styles.fieldDetail}>
                            <Icon type='MaterialCommunityIcons' name='image-plus' style={styles.textDefault}/>
                            <Text style={styles.textDefault}>Add Image</Text>
                        </View>
                        <View style={styles.fieldDetail}>
                            <Icon type='MaterialCommunityIcons' name='image-plus' style={styles.textDefault}/>
                            <Text style={styles.textDefault}>Add Image</Text>
                        </View> */}
                        <ListItem icon>
                            <Left>
                                <Icon name='md-calendar' style={styles.textDefault, styles.iconDefault}/>
                            </Left>
                            <Body style={{borderBottomWidth: 0}}>
                                <Text style={styles.textDefault}>Add Date</Text>
                            </Body>
                        </ListItem>
                        <ListItem icon>
                            <Left>
                                <Icon name='md-add' style={styles.textDefault, styles.iconDefault}/>
                            </Left>
                            <Body style={{borderBottomWidth: 0}}>
                                <Text style={styles.textDefault}>Add Detail</Text>
                            </Body>
                        </ListItem>
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
        right:40,
        //justifyContent: 'center',
        //paddingHorizontal: 10,
        //borderRadius: 10
    },
    search: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10
    },
    detailContainer: {
        flex:1,
    },
    detail: {
        //alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal:40,
        //flex:1
    },
    addDetail: {
        //flexDirection: 'row',
        //alignItems: 'center',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#dddd',
        paddingVertical: 10,
        paddingHorizontal:25,
        backgroundColor: '#f3f3f3'
    },
    textDefault: {
        color: '#a5a5a5'
    },
    iconDefault: {
        color: '#a5a5a5',
        fontSize: 24
    }

})
