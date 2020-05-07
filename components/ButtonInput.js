import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MAIN_COLOR = '#39b772';

const ButtonInput = (props) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.butttonSubmitProfile} {...props}>
                <Text style={styles.placeholder}>{props.text}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
    },
    butttonSubmitProfile: {
        backgroundColor: MAIN_COLOR,
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderColor: MAIN_COLOR,
        borderWidth: 1,
        borderRadius: 10,
    },
    placeholder: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default ButtonInput;
