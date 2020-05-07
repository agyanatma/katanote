import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const IconTextarea = (props) => {
    return (
        <View style={styles.field}>
            <Icon name={props.icon} type={props.type} style={styles.icon} />
            <View style={{ flex: 1, height: 150 }}>
                <TextInput style={{ fontSize: 16 }} {...props} />
            </View>
            <TouchableWithoutFeedback {...props}>
                <Icon name={props.iconRight} type={props.typeRight} style={styles.icon} />
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#a5a5a5',
        borderRadius: 10,
        marginVertical: 5,
        alignItems: 'flex-start',
    },
    icon: {
        marginHorizontal: 20,
        fontSize: 21,
        color: '#a5a5a5',
        marginTop: 13,
    },
});

export default IconTextarea;
