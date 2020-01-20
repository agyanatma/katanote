import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'

const Title = (props) => {
    return (
        <Text style={{
            fontSize: 24,
            fontWeight: 'bold'
        }}>{props.title}</Text>
    );
}

export default Title;