import React, { Component } from 'react'
import { Text, TextInput } from 'react-native'
import { Container, Header, Icon, Left, Right, Body, Button, ListItem } from 'native-base'
import {TextInputMask} from 'react-native-masked-text';

const NumberDetails = (props) => {
    return (
        <ListItem icon>
            <Left>
                <TextInput
                    style={{width: 100}}
                    placeholder='Property'
                    onChangeText={props.onChangeField}
                    onSubmitEditing={props.onSubmitLeft}
                    value={props.defaultField}
                    ellipsizeMode="tail"
                    onBlur={props.onSubmitLeft}
                />
                <Text> : </Text>
            </Left>
            <Body style={{borderBottomWidth: 0}}>
                <TextInputMask
                    type={props.typeMask}
                    options={{
                        precision: props.precision,
                        separator: props.separator,
                        delimiter: props.delimiter,
                        unit: props.unit

                    }}
                    placeholder={props.placeholder}
                    onChangeText={(props.onChangeInput)}
                    value={props.valueInput}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    autoFocus={props.autoFocus}
                    includeRawValueInChangeText={true}
                    onSubmitEditing={props.onSubmitRight}
                    onBlur={props.onSubmitRight}
                />
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
            <Right style={{borderBottomWidth: 0}}>
                {
                    props.deleteDetail ?
                    <Button transparent onPress={props.onPressDelete}>
                        <Icon name='trash' type='Ionicons' style={{color: '#a5a5a5', fontSize: 18}}/>
                    </Button> :
                    <Button transparent onPress={props.onPressRight}>
                        <Icon name='md-arrow-dropdown' type='Ionicons' style={{color: '#a5a5a5'}}/>
                    </Button>
                }
            </Right>
        </ListItem>
    )
}

export default NumberDetails;


