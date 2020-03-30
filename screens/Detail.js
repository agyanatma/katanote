import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, TextInput, FlatList, RefreshControl, TouchableWithoutFeedback, Keyboard, Image, ScrollView } from 'react-native'
import { Container, Header, Icon, Left, Right, Body, Button, Spinner, Item, Input, Form, Toast, ListItem, ActionSheet, Thumbnail, CheckBox } from 'native-base'
import { StackActions, NavigationActions } from 'react-navigation';
import DB from '../database';
import ImagePicker from 'react-native-image-picker';
import Lightbox from 'react-native-lightbox';


const MAIN_COLOR = '#39b772';
const HEADER_HEIGHT = 130;
const MAIN_TEXT = '#54595F';

export default class Detail extends Component {
    constructor(props){
        super(props);
        this.state = {
            editable_title: false,
            editable_desc: false,
            name_card: '',
            description_card: '',
            image: null,
            checklist: [],
            checkbox_value: '',
            check_done: true,
            showCheck: false
        }
        const {params} = this.props.navigation.state;
        this.card_id = params.card_id;
        this.board_id = params.board_id;
        this.name_card = params.name_card;
        this.name_board = params.name_board;
    }

    componentDidMount(){
        this.getCardDescription();
        this.getChecklists();
        this.getImageCard();
        this._isMounted = true;
        if(this._isMounted){
            this.setState({name_card: this.name_card});
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    toastMessage = (message, type) => {
        Toast.show({
            text: message,
            duration: 5000,
            type: type,
            buttonText: 'Close',
        });
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    handleEdit = async () => {
        const {name_card} = this.state;
        try {
            if(name_card){
                results = await DB.executeSql("UPDATE cards SET name = ? where id = ?", [name_card, this.card_id]);
                console.log('Results', results.rowsAffected);
                Keyboard.dismiss();
            }
        } catch (error) {
            console.log(error);
            //this.toastMessage('Something Wrong','danger');
        }
    }

    handleCancelEdit = () => {
        if(this._isMounted){
            this.setState({ editable_title: false, name_card: this.name_card});
        }
    }

    handleAddChecklist = async () => {
        const {checkbox_value} = this.state;
        try {
            if(checkbox_value){
                results = await DB.executeSql('INSERT INTO checkbox (value, card_id) VALUES (?,?)', [checkbox_value, this.card_id]);
                console.log('Results', results.rowsAffected);
                if(results.rowsAffected > 0){
                    if(this._isMounted){
                        this.setState({ checkbox_value: '' })
                    }
                    this.getChecklists();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    getCardDescription = async () => {
        try {
            results = await DB.executeSql('SELECT description FROM cards WHERE id=?', [this.card_id]);
            //console.log(results.rows.raw());
            if(results.rows.length > 0){
                let description = results.rows.item(0).description;
                //console.log(description);
                if(this._isMounted){
                    this.setState({ description_card: description });
                }
            }
        } catch(error) {
            console.log(error);
        }
    }

    handleUpdateDescription = async () => {
        const {description_card} = this.state;
        try {
            results = await DB.executeSql('UPDATE cards SET description=? WHERE id=?', [description_card, this.card_id]);
            console.log('Card description updated: ', results.rowsAffected);
            if(results.rowsAffected > 0){
                if(this._isMounted){
                    this.setState({ editable_desc: false });
                }
                this.getCardDescription();
            }
        } catch (error) {
            console.log(error);
        }
    }

    getChecklists = async () => {
        try {
            results = await DB.executeSql('SELECT * FROM checkbox WHERE card_id=?', [this.card_id]);
            //console.log(results.rows.length);
            if(results.rows.length > 0){
                if(this._isMounted){
                    this.setState({ checklist: results.rows.raw(), showCheck: true });
                    //console.log(this.state.checklist)
                }
            }
            else{
                if(this._isMounted){
                    this.setState({ showCheck: false });
                }
            }
        } catch (error) {
            console.log(error);
            if(this._isMounted){
                this.setState({ showCheck: false });
            }
        }
    }

    // showChecklists = () => {
    //     const {checklist, editable_title} = this.state;
    //     checklist.map(item => {
    //         return(
    //             <ListItem>
    //                 <CheckBox checked={item.done == 0 ? false : true} />
    //                 <Body>
    //                     <Text>{item.value}</Text>
    //                 </Body>
    //             </ListItem>
    //         );
    //     })
    // }

    handleChecked = async (item) => {
        try {
            let done = item.done == 0 ? 1 : 0 
            results = await DB.executeSql('UPDATE checkbox SET done=? WHERE id=?', [done, item.id]);
            console.log('Change checked :',results.rowsAffected);
            if(results.rowsAffected > 0){
                this.getChecklists();
            }
        } catch (error) {
            console.log(error);
        }
    } 

    handleAddImage = () => {
        const {image} = this.state;
        const options = {
            title: 'Select Image',
            noData: true,
            mediaType: 'photo',
            maxWidth: 500,
            storageOptions: {
                skipBackup: true,
                path: 'Katanote',
            },
        }

        ImagePicker.showImagePicker(options, async (response) => {
            //console.log(response);
            try {
                switch (image) {
                    case null:
                        results = await DB.executeSql("INSERT INTO images (uri, card_id) VALUES (?,?)", [response.uri, this.card_id]);
                        if(results.rowsAffected > 0){
                            console.log('New image added: ',results.rowsAffected);
                            if(this._isMounted){
                                this.setState({ image: response.uri});
                            }
                        } 
                        break;
                    default:
                        results = await DB.executeSql("UPDATE images SET uri=? WHERE card_id=?", [response.uri, this.card_id]);
                        if(results.rowsAffected > 0){
                            console.log('New image updated: ',results.rowsAffected);
                            if(this._isMounted){
                                this.setState({ image: response.uri});
                            }
                        } 
                        break;
                }
                
            } catch (error) {
                console.log(error);
            }
        });
    }

    getImageCard = async () => {
        try {
            results = await DB.executeSql("SELECT * FROM images WHERE card_id=?", [this.card_id]);
            //console.log(results.length);
            let len = results.rows.length;
            if(len > 0){
                if(this._isMounted){
                    this.setState({ image: results.rows.item(0).uri });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const {editable_title, editable_desc, name_card, image, checklist, checkbox_value, showCheck, description_card} = this.state;
        return (
            <Container style={styles.container}>
                <Header androidStatusBarColor='#34a869' style={styles.header}>
                    {
                        editable_title ?
                        <Left>
                            <Button transparent onPress={this.handleCancelEdit}>
                                <Icon name='md-close' style={styles.iconHeader}/>
                            </Button>
                        </Left> :
                        <Left>
                            <Button transparent onPress={this.handleBack}>
                                <Icon name='md-arrow-back' style={styles.iconHeader} />
                            </Button>
                        </Left>
                    }
                    <Body/>
                    {
                        editable_title ?
                        <Right>
                            <Button transparent onPress={this.handleEdit}>
                                <Icon type='Ionicons' name='md-checkmark' style={styles.iconHeader}/>
                            </Button>
                        </Right> :
                        <Right>
                            <Button transparent onPress={this.handleAddImage}>
                                <Icon type='MaterialCommunityIcons' name='image-plus' style={styles.iconHeader}/>
                            </Button>
                            <Button transparent>
                                <Icon name='md-more' style={styles.iconHeader}/>
                            </Button>
                        </Right>

                    }
                </Header>
                <ScrollView style={{flex: 1}}>
                    <View style={styles.head}>
                        {
                            editable_title ?
                            <TextInput style={styles.titleEdit} 
                                onChangeText={(text) => this.setState({name_card: text})} 
                                value={name_card}
                                onBlur={() => this.setState({editable_title: false})}
                                onSubmitEditing={this.handleEdit}
                                autoFocus
                            />
                            : <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title} onPress={() => this.setState({editable_title: true})}>{name_card}</Text>

                        }
                        <Text style={styles.subtitle}>{`Item from ${this.name_board}`}</Text>
                    </View>
                    {
                        editable_desc ?
                        <View style={styles.description}>
                            <Button transparent onPress={() => this.setState({ editable_desc: false })}>
                                <Icon type='Ionicons' name='md-close'style={styles.textDefault, styles.iconDefault} />
                            </Button>
                            <TextInput placeholder='Edit description...' 
                                style={{color: MAIN_TEXT, width: '70%'}} 
                                multiline={true} 
                                numberOfLines={3} 
                                value={description_card} 
                                onChangeText={(text) => this.setState({ description_card : text })}
                                autoFocus 
                            />
                            <Button transparent onPress={this.handleUpdateDescription}>
                                <Icon type='Ionicons' name='md-checkmark'style={styles.textDefault, styles.iconDefault} />
                            </Button>
                        </View> :
                        <View style={{paddingHorizontal: 40}}>
                            <Text style={{color: MAIN_TEXT,paddingVertical: 25, width: '80%'}} numberOfLines={3} onPress={() => this.setState({ editable_desc: true })}>{description_card}</Text>
                        </View>
                    }
                    <View style={styles.addDetail}>
                        {/* <View style={styles.fieldDetail}>
                            <Icon type='MaterialCommunityIcons' name='image-plus' style={styles.textDefault}/>
                            <Text style={styles.textDefault}>Add Image</Text>
                        </View>
                        <View style={styles.fieldDetail}>
                            <Icon type='MaterialCommunityIcons' name='image-plus' style={styles.textDefault}/>
                            <Text style={styles.textDefault}>Add Image</Text>
                        </View> */}
                        <ListItem icon onPress={() => console.log('press')}>
                            <Left>
                                <Icon name='md-calendar' style={styles.textDefault, styles.iconDefault}/>
                            </Left>
                            <Body style={{borderBottomWidth: 0}}>
                                <Text style={styles.textDefault}>Add Date</Text>
                            </Body>
                        </ListItem>
                        <ListItem icon onPress={() => this.setState({ showCheck: true })}>
                            <Left>
                                <Icon name='md-checkbox-outline' style={styles.textDefault, styles.iconDefault}/>
                            </Left>
                            <Body style={{borderBottomWidth: 0}}>
                                <Text style={styles.textDefault}>Add Task</Text>
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
                    { //-------------------------CHECKLIST SECTION---------------------------------
                        showCheck ?
                        <View>
                            <View style={styles.detailTitle}>
                                <ListItem icon>
                                    <Left style={{padding: 0}}>
                                        <Icon style={{ color: MAIN_TEXT, fontSize: 24 }} name='md-checkbox-outline'/>
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <Text style={{fontSize: 20, fontWeight: '700', color: MAIN_TEXT}} >Checklist</Text>
                                    </Body>
                                </ListItem>
                            </View>
                            <View style={styles.addDetail}>
                                {
                                    checklist ?
                                    checklist.map(item => {
                                        return(
                                            <ListItem icon key={item.id}>
                                                <CheckBox checked={item.done == 0 ? false : true} onPress={() => this.handleChecked(item)}/>
                                                <Body style={{borderBottomWidth: 0}}>
                                                    <Text style={item.done == 0 ? {marginLeft: 20} : {marginLeft: 20, textDecorationLine: 'line-through', color:'#a5a5a5'}}>{item.value}</Text>
                                                </Body>
                                            </ListItem>
                                        );
                                    }) : null
                                }
                                <ListItem icon>
                                    <Left>
                                        <Icon name='md-add' style={styles.textDefault, styles.iconDefault}/>
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <TextInput
                                            placeholder='What you do next?'
                                            onChangeText={text => this.setState({ checkbox_value: text })}
                                            value={checkbox_value}
                                            //onSubmmitEditing={this.handleAddChecklist}
                                            autoFocus
                                        />
                                    </Body>
                                    {
                                        checkbox_value.length > 0 ?
                                        <Right style={{borderBottomWidth: 0}}>
                                            <Button transparent onPress={this.handleAddChecklist}>
                                                <Icon type='Ionicons' name='md-checkmark' style={styles.textDefault, styles.iconDefault}/>
                                            </Button>
                                        </Right> : null
                                    }
                                </ListItem>
                            </View>
                        </View> : null
                    }
                    { //-------------------------ATTACHMENTS SECTION---------------------------------
                        image ? 
                        <View>
                            <View style={styles.detailTitle}>
                                <ListItem icon>
                                    <Left style={{padding: 0}}>
                                        <Icon style={{ color: MAIN_TEXT, fontSize: 24 }} type='FontAwesome' name='paperclip'/>
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <Text style={{fontSize: 20, fontWeight: '700', color: MAIN_TEXT}} >Attachments</Text>
                                    </Body>
                                </ListItem>
                            </View>
                            <View style={styles.addDetail}>
                                <ListItem  style={{borderBottomWidth: 0}}>
                                    <Lightbox style={{flex:1}} underlayColor='transparent'>
                                        {/* <Thumbnail square large source={{uri: image}} /> */}
                                        <Image style={styles.image} source={{uri: image}} resizeMode={'contain'} />
                                    </Lightbox>
                                </ListItem>
                            </View>
                        </View> : null
                    }
                </ScrollView>
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
        backgroundColor: MAIN_COLOR,
    },
    head: {
        paddingHorizontal: 40, 
        backgroundColor: MAIN_COLOR, 
        paddingBottom: 15
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
        //paddingVertical: 20,
        //paddingHorizontal:40,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
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
    detailTitle: {
        //alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal:0,
        borderBottomWidth: 3,
        borderColor: MAIN_COLOR
        //flex:1
    },
    addDetail: {
        //flexDirection: 'row',
        //alignItems: 'center',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#dddd',
        paddingVertical: 10,
        paddingHorizontal:20,
        backgroundColor: '#f3f3f3',
        flex:1
    },
    textDefault: {
        color: '#a5a5a5'
    },
    iconDefault: {
        color: '#a5a5a5',
        fontSize: 24
    },
    image: {
        //backgroundColor: 'red',
        //resizeMode: 'contain',
        flex:1,
        height: 200,
        //position: 'absolute',
        //top:0
    },
    checkedList: {

    },
    uncheckedList: {
        
    }

})
