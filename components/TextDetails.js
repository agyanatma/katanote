import React, { Component } from "react";
import { Text, TextInput } from "react-native";
import {
  Container,
  Header,
  Icon,
  Left,
  Right,
  Body,
  Button,
  ListItem
} from "native-base";

const TextDetails = props => {
  return (
    <ListItem icon>
      <Left>
        <TextInput
          style={{ width: 100 }}
          placeholder="Property"
          onChangeText={props.onChangeField}
          value={props.defaultField}
          ellipsizeMode="tail"
          numberOfLines={1}
          onSubmitEditing={props.onSubmitLeft}
          onBlur={props.onSubmitLeft}
        />
        <Text> : </Text>
      </Left>
      <Body style={{ borderBottomWidth: 0 }}>
        <TextInput
          style={{ textAlignVertical: "center", borderBottomWidth: 0 }}
          placeholder="Empty"
          onChangeText={props.onChangeInput}
          value={props.valueInput}
          ellipsizeMode="tail"
          numberOfLines={1}
          autoFocus={props.autoFocus}
          onSubmitEditing={props.onSubmitRight}
          onBlur={props.onSubmitRight}
        />
      </Body>
      <Right style={{ borderBottomWidth: 0 }}>
        {props.deleteDetail ? (
          <Button transparent onPress={props.onPressDelete}>
            <Icon
              name="trash"
              type="Ionicons"
              style={{ color: "#a5a5a5", fontSize: 18 }}
            />
          </Button>
        ) : (
          <Button transparent onPress={props.onPressRight}>
            <Icon
              name="md-arrow-dropdown"
              type="Ionicons"
              style={{ color: "#a5a5a5" }}
            />
          </Button>
        )}
      </Right>
    </ListItem>
  );
};

export default TextDetails;
