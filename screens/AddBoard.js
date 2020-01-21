import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Header, Left, Right, Body, Button, Icon, Content, Title, Item, Input, Form, Textarea, Text } from 'native-base'

export default class AddBoard extends Component {
    render() {
        return (
            <Container>
                <Header androidStatusBarColor='#34a869' noShadow style={styles.container}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-round-back' style={styles.icon} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={styles.title} >Create Board</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content contentContainerStyle={styles.content}>
                    <Form>
                        <Item regular style={styles.form} >
                            <Input placeholderTextColor='grey' placeholder='Title' />
                        </Item>
                        <Textarea regular style={styles.form} placeholderTextColor='grey' bordered rowSpan={5} placeholder='Description' />
                        <Button block style={styles.button} >
                            <Text>Create</Text>
                        </Button>
                    </Form>
                </Content>
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
    icon: {
        color: 'white'
    },
    title: {
        fontWeight: 'bold'
    },
    form: {
        marginBottom: 10,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    button: {
        width: 100,
        alignSelf: 'flex-end',
        marginTop: 20
    }
})
