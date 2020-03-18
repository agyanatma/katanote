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
import Settings from '../screens/Settings';
import About from '../screens/About';
import Help from '../screens/Help';


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
            <List>
                <ListItem>
                    <Icon name='settings' style={styles.iconList} />
                    <Text style={styles.list}>Settings</Text>
                </ListItem>
                <ListItem>
                    <Icon name='help-circle-outline' style={styles.iconList}/>
                    <Text style={styles.list}>Tutorial</Text>
                </ListItem>
                <ListItem>
                    <Icon name='information-circle-outline' style={styles.iconList} />
                    <Text style={styles.list}>Help & Feedback</Text>
                </ListItem>
            </List>
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
    App: StackNavigator
},{
    drawerPosition: 'left',
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle'
});


const styles = StyleSheet.create({
    drawerHeader: {
        backgroundColor: '#39b772',
        height: 200
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