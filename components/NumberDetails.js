import React, { Component, useState } from 'react';
import { Text, TextInput } from 'react-native';
import { Container, Header, Icon, Left, Right, Body, Button, ListItem } from 'native-base';
import { TextInputMask } from 'react-native-masked-text';

const NumberDetails = (props) => {
    const [editName, setEditname] = useState(false);
    const [editValue, setEditvalue] = useState(false);
    return (
        <ListItem icon>
            <Left>
                <TouchableWithoutFeedback onPress={() => setEditname(!editName)}>
                    {editName ? (
                        <TextInput
                            style={{ width: 100 }}
                            placeholder="Property"
                            onChangeText={props.onChangeField}
                            onSubmitEditing={props.onSubmitLeft}
                            value={props.defaultField}
                            ellipsizeMode="tail"
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
                            autoFocus={props.autoFocus}
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
                            {props.valueInput ? props.valueInput : 'Empty'}
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
