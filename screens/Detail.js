import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'

export default class Detail extends Component {
    render() {
        return (
            <View>
                <Text> {this.props.navigation.state.params.card_id} </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({})
