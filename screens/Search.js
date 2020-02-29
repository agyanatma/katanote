import React, { Component } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { Container, Header, Left, Right, Body, Button, Icon, Content, Title, Item, Input, Form, Textarea, Text } from 'native-base'

const data = [
    { id: 1, board: 'Electronics', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, board: 'Stationary', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 3, board: 'Acessories', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 4, board: 'Electronics', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 5, board: 'Stationary', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
];

export default class AddBoard extends Component {

    renderItem = ({ item, index }) => {
        return (
            <View style={styles.item}>
                <Text style={styles.board}>{item.board}</Text>
            </View>
        );
    };

    render() {
        return (
            <Container>
                <Header androidStatusBarColor='#34a869' noShadow searchBar style={styles.container}>
                    <Item style={styles.search}>
                        <Icon name="search" />
                        <Input placeholder="Type here..." />
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>
                <FlatList 
                    data={data}
                    style={styles.content}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
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
    search: {
        borderRadius: 15
    }
})
