import React, { Component } from 'react';
import {StyleSheet, Image} from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { Container, Header, Content, Body, Text, Thumbnail, List, ListItem, Left, Right, Icon } from 'native-base';

import Home from '../screens/Home';
import AddBoard from '../screens/AddBoard';
import Search from '../screens/Search';
import Cards from '../screens/Cards';
import Detail from '../screens/Detail';
import Modal from '../screens/Modal';
import Settings from '../screens/Settings';
import About from '../screens/About';
import Help from '../screens/Help';

const MAIN_COLOR = '#39b772';

const CustomDrawerContentComponent = (props) => (
    
    <Container>
        <Header androidStatusBarColor='#34a869' noShadow style={styles.drawerHeader}>
            <Body>
                <Thumbnail source={require('../assets/user.jpg')} style={styles.userImage} />
                <Text style={styles.userName}>Nore Inovasi</Text>
                <Text style={styles.description}>Jasa Pembuatan Website</Text>
            </Body>
        </Header>
            <Content>
                <DrawerItems {...props}/>
            </Content>
    </Container>

);

const StackNavigator = createStackNavigator({
    Home,
    AddBoard,
    Search,
    Cards,
    Detail
},
{
    headerMode: 'none'
});

const DrawerNavigator = createDrawerNavigator({
    Home: {
        screen: StackNavigator,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon name='md-home' style={{ fontSize: 24, color: tintColor}}/>
            )
        }
    },
    Settings: {
        screen: Settings,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon name='md-settings'style={{ fontSize: 24, color: tintColor }}/>
            )
        }
    },
    About: {
        screen: About,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon name='md-information-circle-outline'style={{ fontSize: 24, color: tintColor }}/>
            )
        }
    },
    Help: {
        screen: Help,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon name='md-help-circle-outline'style={{ fontSize: 24, color: tintColor }}/>
            )
        }
    }
},{
    initialRouteName: 'Home',
    drawerPosition: 'left',
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    contentOptions: {
        itemsContainerStyle: {
            marginTop: -5
        },
        iconContainerStyle: {
            opacity: 1
        },
        activeTintColor: MAIN_COLOR,
        inactiveTintColor: '#1e1e1e',
        labelStyle: {
            fontWeight: 'normal'
        }
    }
});


const styles = StyleSheet.create({
    drawerHeader: {
        backgroundColor: '#39b772',
        height: 200,
    },
    userImage: {
        marginBottom: 30,
        width: 70,
        height: 70,
        borderRadius: 75
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white'
    },
    description: {
        fontWeight: 'normal',
        fontSize: 14,
        color: 'white'
    },
    list: {
        fontSize: 16,
        color: '#1e1e1e'
    },
    iconList: {
        fontSize: 24,
        marginRight: 10,
        color: '#1e1e1e'
    }
});


export default createAppContainer(DrawerNavigator);