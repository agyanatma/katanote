import React, { Component, useState } from 'react';
import { Text, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Container, Header, Icon, Left, Right, Body, Button, ListItem } from 'native-base';
import { TextInputMask, MaskService } from 'react-native-masked-text';

const NumberDetails = (props) => {
    const [editName, setEditname] = useState(false);
    const [editValue, setEditvalue] = useState(false);
    const maskedText =
        props.valueInput &&
        MaskService.toMask('money', props.valueInput, {
            unit: props.unit,
            precision: props.precision,
            separator: props.separator,
            delimiter: props.delimiter,
        });
    return (
        <ListItem icon>
            <Left>
                <TouchableWithoutFeedback onPress={() => setEditname(!editName)}>
                    {editName ? (
                        <TextInput
                            style={{ width: 100, textDecorationLine: 'underline' }}
                            placeholder="Property"
                            onChangeText={props.onChangeField}
                            onSubmitEditing={props.onSubmitLeft}
                            value={props.defaultField}
                            ellipsizeMode="tail"
                            autoFocus={true}
                            onBlur={(props.onSubmitLeft, () => setEditname(false))}
                        />
                    ) : (
                        <Text
                            style={{
                                marginLeft: 5,
                                width: 95,
                                color: props.defaultField ? 'black' : '#a5a5a5',
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={1}
                        >
                            {props.defaultField ? props.defaultField : 'Property'}
                        </Text>
                    )}
                </TouchableWithoutFeedback>

                <Text> : </Text>
            </Left>
            <Body style={{ borderBottomWidth: 0 }}>
                <TouchableWithoutFeedback onPress={() => setEditvalue(!editValue)}>
                    {editValue ? (
                        <TextInputMask
                            style={{ textDecorationLine: 'underline' }}
                            type={props.typeMask}
                            options={{
                                precision: props.precision,
                                separator: props.separator,
                                delimiter: props.delimiter,
                                unit: props.unit,
                                suffixUnit: props.suffix,
                            }}
                            placeholder={props.placeholder}
                            onChangeText={props.onChangeInput}
                            value={props.valueInput}
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            autoFocus={true}
                            includeRawValueInChangeText={true}
                            onSubmitEditing={props.onSubmitRight}
                            onBlur={(props.onSubmitRight, () => setEditvalue(false))}
                        />
                    ) : (
                        <Text
                            style={{
                                marginLeft: 5,
                                color: props.valueInput ? 'black' : '#a5a5a5',
                            }}
                        >
                            {props.valueInput ? maskedText : props.placeholder}
                        </Text>
                    )}
                </TouchableWithoutFeedback>

                {/* <Text>{props.unit}</Text>
                <TextInput
                    style={{textAlignVertical: 'center', borderBottomWidth: 0}}
                    placeholder='0'
                    onChangeText={props.onChangeInput}
                    defaultValue={props.valueInput}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    autoFocus={props.autoFocus}
                /> */}
            </Body>
            <Right style={{ borderBottomWidth: 0 }}>
                {props.deleteDetail ? (
                    <Button transparent onPress={props.onPressDelete}>
                        <Icon
                            name="trash"
                            type="Ionicons"
                            style={{ color: '#a5a5a5', fontSize: 18 }}
                        />
                    </Button>
                ) : (
                    <Button transparent onPress={props.onPressRight}>
                        <Icon
                            name="md-arrow-dropdown"
                            type="Ionicons"
                            style={{ color: '#a5a5a5' }}
                        />
                    </Button>
                )}
            </Right>
        </ListItem>
    );
};

export default NumberDetails;
