import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Container, Header, Left, Right, Body, Button, Icon, Content, Thumbnail, Input, Item, Form, ListItem } from 'native-base'
import { TouchableWithoutFeedback, TextInput } from 'react-native-gesture-handler';

const MAIN_COLOR = '#39b772';
const HEADER_HEIGHT = 130;

export default class Settings extends Component {
    render() {
        return (
            <Container>
                <Header androidStatusBarColor='#34a869' noShadow style={{backgroundColor: MAIN_COLOR}}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                            <Icon name='md-menu' style={styles.icon} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.title}>Settings</Text>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.handleOptions}>
                            <Icon name='md-more' style={styles.iconHeader}/>
                        </Button>
                    </Right>
                </Header>
                <View style={{padding: 25}}>
                    <View style={{alignItems: 'center', marginBottom: 30}}>
                        <Thumbnail source={require('../assets/user.jpg')} style={styles.userImage} />
                        <TouchableWithoutFeedback style={styles.butttonEditProfile} onPress={() => console.log('pres')}>
                            <Text style={{ color: MAIN_COLOR }}>Edit profile picture</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#a5a5a5', borderRadius: 10 }}>
                        <Icon name='md-person' style={{marginHorizontal: 20, fontSize: 24}} />
                        <View style={{flex:1}}>
                            <TextInput
                                style={{fontSize: 16}}
                                placeholder='Username'
                            />
                        </View>
                    </View>
                </View>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
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
        borderWidth: 1, 
        alignSelf: 'flex-start'
    }
})
