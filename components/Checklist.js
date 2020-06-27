import React, { Component, useState } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback } from 'react-native';
import { CheckBox } from 'native-base';

const Checklist = (props) => {
    const [edit, setEdit] = useState(false);
    const item = props.itemProps;
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', width: 200 }}>
            <CheckBox {...props} />
            <View style={{ marginLeft: 15 }}>
                <TouchableWithoutFeedback onPress={() => setEdit(!edit)}>
                    {edit ? (
                        <TextInput
                            {...props}
                            style={{
                                height: 50,
                            }}
                            onBlur={() => setEdit(false)}
                        />
                    ) : (
                        <Text
                            multiline={props.Multiline}
                            numberOfLines={props.NumberOfLines}
                            ellipsizeMode={'tail'}
                            style={{
                                marginLeft: 5,
                                textDecorationLine: item.done == 1 ? 'line-through' : 'none',
                                color: item.done == 0 ? 'black' : '#a5a5a5',
                            }}
                        >
                            {props.Value}
                        </Text>
                    )}
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

export default Checklist;
