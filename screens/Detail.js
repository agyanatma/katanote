import React, { Component, useState } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    TextInput,
    FlatList,
    RefreshControl,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Alert,
    Image,
    PermissionsAndroid,
} from 'react-native';
import {
    Container,
    Header,
    Icon,
    Left,
    Right,
    Body,
    Button,
    Spinner,
    Item,
    Input,
    Form,
    Toast,
    ListItem,
    ActionSheet,
    Thumbnail,
    CheckBox,
} from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
//import { Image } from 'react-native-elements';
import DB from '../database';
import ImagePicker from 'react-native-image-picker';
import Lightbox from 'react-native-lightbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Share from 'react-native-share';
import { MaskService } from 'react-native-masked-text';
import RNFetchBlob from 'rn-fetch-blob';
import { PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';

import NumberDetails from '../components/NumberDetails';
import TextDetails from '../components/TextDetails';
import Checklist from '../components/Checklist';

const MAIN_COLOR = '#39b772';
const SECONDARY_COLOR = '#34a869';
const HEADER_HEIGHT = 130;
const MAIN_TEXT = '#54595F';

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editable_title: false,
            editable_desc: false,
            editable_checkbox: false,
            editable_field: false,
            delete_detail: false,
            name_card: '',
            description_card: '',
            image: null,
            checklist: [],
            new_checklist: '',
            details: [],
            check_done: true,
            date: new Date(),
            showDatePicker: false,
            dateChanged: false,
            expiredDate: false,
            showCheck: false,
            showAttachment: false,
            showDetail: false,
            toggleChecklist: true,
            toggleAttachment: true,
            toggleDetail: true,
            counter: 0,
            totalCounter: 0,
            loading: true,
            filename: '',
            downloadable: false,
            thumbnails: '',
            token: '',
            progress: 0,
            exist: false,
        };
        const { params } = this.props.navigation.state;
        this.card_id = params.card_id;
        this.board_id = params.board_id;
        this.name_card = params.name_card;
        this.name_board = params.name_board;
    }

    componentDidMount() {
        this.getToken();
        this.fetchAll();
        this._isMounted = true;
        if (this._isMounted) {
            this.setState({ name_card: this.name_card });
        }

        console.log(this.card_id);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    toastMessage = (message, type) => {
        Toast.show({
            text: message,
            duration: 5000,
            type: type,
            buttonText: 'Close',
        });
    };

    getToken = async () => {
        results = await DB.executeSql('SELECT token FROM user', []);
        if (results.rows.length > 0) {
            this._isMounted && this.setState({ token: results.rows.item(0).token });
        }
    };

    fetchAll = async () => {
        await this.getCardDescription();
        await this.getDateCard();
        await this.getAllDetails();
        await this.getChecklists();
        await this.getImageCard();
        this._isMounted && this.setState({ loading: false });
    };

    handleBack = () => {
        this.props.navigation.goBack();
    };

    handleEdit = async () => {
        const { name_card } = this.state;
        try {
            results = await DB.executeSql('UPDATE cards SET name = ? where id = ?', [
                name_card,
                this.card_id,
            ]);
            //console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
                this._isMounted &&
                    this.setState({
                        editable_title: false,
                        name_card,
                    });
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleDeleteCard = async () => {
        try {
            results = await DB.executeSql('DELETE FROM cards WHERE id=?', [this.card_id]);
            //console.log('Deleted card: ', results.rowsAffected);
            if (results.rowsAffected > 0) {
                this.props.navigation.navigate('Cards');
                this.toastMessage('Delete card success', 'success');
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleEditOptions = () => {
        const BUTTONS = ['Edit Card', 'Delete Card', 'Cancel'];

        ActionSheet.show(
            {
                options: BUTTONS,
                title: 'Select Options',
                cancelButtonIndex: 2,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        ActionSheet.hide();
                        if (this._isMounted) {
                            this.setState({ editable_title: true });
                        }
                        break;
                    case 1:
                        ActionSheet.hide();
                        Alert.alert(
                            'Delete Card',
                            `Are you sure want to delete ${this.name_card} ?`,
                            [
                                {
                                    text: 'CANCEL',
                                    style: 'cancel',
                                    onPress: () => console.log('Cancel action'),
                                },
                                {
                                    text: 'DELETE',
                                    style: 'destructive',
                                    onPress: () => this.handleDeleteCard(),
                                },
                            ]
                        );
                        break;
                }
            }
        );
    };

    handleOptions = () => {
        const { name_card, description_card, image, details, exist } = this.state;
        const BUTTONS = [
            {
                text: 'Share on Whatsapp',
                icon: 'logo-whatsapp',
                iconColor: '#0cc042',
            },
            {
                text: 'Share on Facebook',
                icon: 'logo-facebook',
                iconColor: '#4267b2',
            },
            {
                text: 'Share on Twitter',
                icon: 'logo-twitter',
                iconColor: '#1c9cea',
            },
            {
                text: 'Share on Email',
                icon: 'mail',
                iconColor: '#a5a5a5',
            },
        ];
        const message = details.map((item) => {
            switch (item.format) {
                case 3:
                    var money = MaskService.toMask('money', item.value, {
                        unit: 'Rp',
                        precision: 0,
                        separator: '.',
                        delimiter: ',00',
                    });
                    break;
                case 4:
                    var money = MaskService.toMask('money', item.value, {
                        unit: '$',
                        precision: 2,
                        separator: '.',
                        delimiter: ',',
                    });
                    break;
                case 5:
                    var money = MaskService.toMask('money', item.value, {
                        unit: '¥',
                        precision: 0,
                        separator: '.',
                        delimiter: ',',
                    });
                    break;

                default:
                    break;
            }

            if (item.name && item.value)
                return `${item.name}: ${item.format > 2 ? money : item.value}\n`;
        });
        //console.log(message);
        let textMessage = `${name_card && name_card + ':\n'}${description_card &&
            description_card + '\n'}${message && message.join('')}`;

        const shareOptions = {
            message: textMessage.replace(null, ''),
            url: image && exist ? `file://${image}` : '',
            whatsAppNumber: '', // country code + phone number
            //filename: image // only for base64 file in Android
        };
        //console.log(this.state.exist);

        ActionSheet.show(
            {
                options: BUTTONS,
                title: 'Select Share Options',
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        ActionSheet.hide();
                        Share.isPackageInstalled('com.whatsapp').then(({ isInstalled }) => {
                            isInstalled
                                ? Share.shareSingle(
                                      Object.assign(shareOptions, {
                                          social: Share.Social.WHATSAPP,
                                      })
                                  )
                                : this.toastMessage('You do not have the application', 'danger');
                        });
                        break;
                    case 1:
                        ActionSheet.hide();
                        Share.isPackageInstalled('com.facebook.orca').then(({ isInstalled }) => {
                            isInstalled
                                ? Share.shareSingle(
                                      Object.assign(shareOptions, {
                                          social: Share.Social.FACEBOOK,
                                      })
                                  )
                                : this.toastMessage('You do not have the application', 'danger');
                        });
                        break;
                    case 2:
                        ActionSheet.hide();
                        Share.isPackageInstalled('com.twitter.android').then(({ isInstalled }) => {
                            isInstalled
                                ? Share.shareSingle(
                                      Object.assign(shareOptions, {
                                          social: Share.Social.TWITTER,
                                      })
                                  )
                                : this.toastMessage('You do not have the application', 'danger');
                        });
                        break;
                    case 3:
                        ActionSheet.hide();
                        Share.shareSingle(
                            Object.assign(shareOptions, {
                                social: Share.Social.EMAIL,
                            })
                        );

                        break;

                    default:
                        break;
                }
            }
        );
    };

    getCardDescription = async () => {
        try {
            results = await DB.executeSql('SELECT description FROM cards WHERE id=?', [
                this.card_id,
            ]);
            if (results.rows.length > 0) {
                let description = results.rows.item(0).description;
                if (this._isMounted) {
                    this.setState({ description_card: description });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleUpdateDescription = async () => {
        const { description_card } = this.state;
        try {
            results = await DB.executeSql('UPDATE cards SET description=? WHERE id=?', [
                description_card,
                this.card_id,
            ]);
            // console.log(
            //     'Card description updated: ',
            //     results.rowsAffected
            // );
            if (results.rowsAffected > 0) {
                this._isMounted &&
                    (this.setState({ editable_desc: false }),
                    this.setState((prevState) => ({
                        ...prevState,
                        description_card,
                    })));
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleAddChecklist = async () => {
        const { new_checklist, totalCounter } = this.state;
        try {
            if (new_checklist) {
                results = await DB.executeSql(
                    'INSERT INTO checkbox (value, card_id) VALUES (?,?)',
                    [new_checklist, this.card_id]
                );
                //console.log('Checkbox added: ', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    this._isMounted &&
                        (this.setState((prevState) => ({
                            checklist: [
                                ...prevState.checklist,
                                {
                                    card_id: this.card_id,
                                    done: 0,
                                    id: results.insertId,
                                    value: new_checklist,
                                },
                            ],
                        })),
                        this.setState({
                            new_checklist: '',
                            totalCounter: totalCounter + 1,
                        }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleOnChangeChecklist = (text, id) => {
        this._isMounted &&
            this.setState((prevState) => ({
                ...prevState,
                checklist: prevState.checklist.map((data) => ({
                    ...data,
                    value: data.id === id ? text : data.value,
                })),
            }));
    };

    handleEditChecklist = async (item) => {
        if (item.value) {
            try {
                results = await DB.executeSql('UPDATE checkbox SET value=? WHERE id=?', [
                    item.value,
                    item.id,
                ]);
                //console.log('Checkbox updated: ', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    if (this._isMounted) {
                        this.setState({ editable_checkbox: false });
                    }
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            this.handleDeleteCheckbox(item);
        }
    };

    getChecklists = async () => {
        try {
            results = await DB.executeSql('SELECT * FROM checkbox WHERE card_id=?', [this.card_id]);
            let len = results.rows.length;
            if (len > 0) {
                let count = 0;
                for (var i = 0; i < len; i++) {
                    if (results.rows.item(i).done == 1) {
                        count += 1;
                    }
                }
                if (this._isMounted) {
                    this.setState({
                        checklist: results.rows.raw(),
                        showCheck: true,
                        totalCounter: len,
                        counter: count,
                    });
                }
            } else {
                if (this._isMounted) {
                    this.setState({ showCheck: false });
                }
                //console.log(this.state.checklist.length);
            }
        } catch (error) {
            console.log(error);
            if (this._isMounted) {
                this.setState({ showCheck: false });
            }
        }
    };

    handleChecked = async (item) => {
        const { counter, totalCounter } = this.state;
        try {
            let done = item.done == 0 ? 1 : 0;
            results = await DB.executeSql('UPDATE checkbox SET done=? WHERE id=?', [done, item.id]);
            //console.log('Change checked: ', results.rowsAffected);
            if (results.rowsAffected > 0) {
                //this.getChecklists();
                this._isMounted &&
                    this.setState((prevState) => ({
                        ...prevState,
                        checklist: prevState.checklist.map((data) => ({
                            ...data,
                            done: data.id === item.id ? done : data.done,
                        })),
                    }));
                switch (done) {
                    case 0:
                        if (counter > 0) this.setState({ counter: counter - 1 });
                        break;

                    case 1:
                        if (counter < totalCounter) this.setState({ counter: counter + 1 });
                        break;

                    default:
                        break;
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleDeleteCheckbox = async (item) => {
        const { totalCounter, counter, checklist } = this.state;
        try {
            results = await DB.executeSql('DELETE FROM checkbox WHERE id=?', [item.id]);
            //console.log('Delete checkbox: ', results.rowsAffected);
            //console.log(checklist.length);
            if (results.rowsAffected > 0) {
                this._isMounted &&
                    this.setState((prevState) => ({
                        ...prevState,
                        checklist: prevState.checklist.filter((data) => data.id !== item.id),
                    })),
                    this.setState({
                        totalCounter: totalCounter - 1,
                        counter: counter == totalCounter || item.done == 1 ? counter - 1 : counter,
                    }),
                    checklist.length == 1 && this.setState({ showCheck: false });
            }
        } catch (error) {
            console.log(error);
        }
    };

    renderChecklists = (item) => {
        const { editable_checkbox } = this.state;
        return (
            <ListItem
                iconLeft
                key={item.id}
                style={{
                    borderBottomWidth: 0,
                    justifyContent: 'space-between',
                    alignContent: 'flex-start',
                    height: 50,
                }}
            >
                <Checklist
                    checked={item.done == 0 ? false : true}
                    onPress={this.handleChecked.bind(this, item)}
                    Value={item.value}
                    autoFocus={true}
                    onSubmitEditing={() => this.handleEditChecklist(item)}
                    onBlur={() => this.handleEditChecklist(item)}
                    onChangeText={(text) => this.handleOnChangeChecklist(text, item.id)}
                    defaultValue={item.value}
                    Multiline={true}
                    NumberOfLines={5}
                    itemProps={item}
                />
                <View style={{ alignItems: 'center' }}>
                    {editable_checkbox && (
                        <Button transparent onPress={() => this.handleDeleteCheckbox(item)}>
                            <Icon
                                name="md-trash"
                                style={(styles.textDefault, styles.iconDefault)}
                            />
                        </Button>
                    )}
                </View>
            </ListItem>
        );
    };

    handleChangeInput = (text, id) => {
        this._isMounted &&
            this.setState((prevState) => ({
                ...prevState,
                details: prevState.details.map((detail) => ({
                    ...detail,
                    value: detail.id === id ? text : detail.value,
                })),
            }));
    };

    handleChangeField = (text, id) => {
        this._isMounted &&
            this.setState((prevState) => ({
                ...prevState,
                details: prevState.details.map((detail) => ({
                    ...detail,
                    name: detail.id === id ? text : detail.name,
                })),
            }));
    };

    renderAllDetails = (item) => {
        const { delete_detail } = this.state;
        switch (item.format) {
            case 1: // text format
                return (
                    <View key={item.id.toString()}>
                        <TextDetails
                            onPressRight={() => this.handleChooseFormat(item.id)}
                            onChangeField={(text) => this.handleChangeField(text, item.id)}
                            onSubmitLeft={() => this.handleEditDetailField(item.name, item.id)}
                            defaultField={item.name}
                            placeholder={'Empty'}
                            onChangeInput={(text) => this.handleChangeInput(text, item.id)}
                            valueInput={item.value}
                            deleteDetail={delete_detail}
                            onPressDelete={() => this.handleDeleteDetail(item)}
                            onSubmitRight={() =>
                                this.handleEditDetailValue(item.value, item.id, item.format)
                            }
                        />
                    </View>
                );
                break;

            case 2: // number format
                return (
                    <View key={item.id.toString()}>
                        <NumberDetails
                            onPressRight={() => this.handleChooseFormat(item.id)}
                            onChangeField={(text) => this.handleChangeField(text, item.id)}
                            onSubmitLeft={() => this.handleEditDetailField(item.name, item.id)}
                            defaultField={item.name}
                            typeMask={'money'}
                            precision={0}
                            separator={null}
                            delimiter={'.'}
                            unit={null}
                            placeholder={'0'}
                            onChangeInput={(rawText) => this.handleChangeInput(rawText, item.id)}
                            valueInput={item.value ? item.value : ''}
                            deleteDetail={delete_detail}
                            onPressDelete={() => this.handleDeleteDetail(item)}
                            onSubmitRight={() =>
                                this.handleEditDetailValue(item.value, item.id, item.format)
                            }
                        />
                    </View>
                );
                break;

            case 3:
                return (
                    <View key={item.id.toString()}>
                        <NumberDetails
                            onPressRight={() => this.handleChooseFormat(item.id)}
                            onChangeField={(text) => this.handleChangeField(text, item.id)}
                            onSubmitLeft={() => this.handleEditDetailField(item.name, item.id)}
                            defaultField={item.name}
                            typeMask={'money'}
                            precision={0}
                            separator={','}
                            delimiter={'.'}
                            unit={'Rp'}
                            placeholder={'Rp0'}
                            onChangeInput={(maskedText, rawText) =>
                                this.handleChangeInput(rawText, item.id)
                            }
                            valueInput={item.value ? item.value : ''}
                            deleteDetail={delete_detail}
                            onPressDelete={() => this.handleDeleteDetail(item)}
                            onSubmitRight={() =>
                                this.handleEditDetailValue(item.value, item.id, item.format)
                            }
                        />
                    </View>
                );
                break;

            case 4:
                return (
                    <View key={item.id.toString()}>
                        <NumberDetails
                            onPressRight={() => this.handleChooseFormat(item.id)}
                            onChangeField={(text) => this.handleChangeField(text, item.id)}
                            onSubmitLeft={() => this.handleEditDetailField(item.name, item.id)}
                            defaultField={item.name}
                            typeMask={'money'}
                            precision={2}
                            separator={'.'}
                            delimiter={','}
                            unit={'$'}
                            placeholder={'$0.00'}
                            onChangeInput={(maskedText, rawText) =>
                                this.handleChangeInput(rawText, item.id)
                            }
                            valueInput={item.value ? item.value : ''}
                            deleteDetail={delete_detail}
                            onPressDelete={() => this.handleDeleteDetail(item)}
                            onSubmitRight={() =>
                                this.handleEditDetailValue(item.value, item.id, item.format)
                            }
                        />
                    </View>
                );
                break;

            case 5: // yen format
                return (
                    <View key={item.id.toString()}>
                        <NumberDetails
                            onPressRight={() => this.handleChooseFormat(item.id)}
                            onChangeField={(text) => this.handleChangeField(text, item.id)}
                            onSubmitLeft={() => this.handleEditDetailField(item.name, item.id)}
                            defaultField={item.name}
                            typeMask={'money'}
                            precision={0}
                            separator={'.'}
                            delimiter={','}
                            unit={'¥'}
                            placeholder={'¥0'}
                            onChangeInput={(maskedText, rawText) =>
                                this.handleChangeInput(rawText, item.id)
                            }
                            valueInput={item.value ? item.value : ''}
                            deleteDetail={delete_detail}
                            onPressDelete={() => this.handleDeleteDetail(item)}
                            onSubmitRight={() =>
                                this.handleEditDetailValue(item.value, item.id, item.format)
                            }
                        />
                    </View>
                );
                break;

            default:
                break;
        }
    };

    handleAddDetails = async () => {
        try {
            results = await DB.executeSql(
                'INSERT INTO details (name, format, card_id, value) VALUES (?,?,?,?)',
                ['', 1, this.card_id, '']
            );
            //console.log('Detail added: ', results.rowsAffected);
            if (results.rowsAffected > 0) {
                this._isMounted &&
                    this.setState((prevState) => ({
                        details: [
                            ...prevState.details,
                            {
                                card_id: this.card_id,
                                format: 1,
                                id: results.insertId,
                                value: '',
                            },
                        ],
                    }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleDeleteDetail = async (item) => {
        const { details } = this.state;
        try {
            results = await DB.executeSql('DELETE FROM details WHERE id=?', [item.id]);
            //console.log('Detail deleted: ', results.rowsAffected);
            if (results.rowsAffected > 0) {
                this._isMounted &&
                    this.setState((prevState) => ({
                        ...prevState,
                        details: prevState.details.filter((data) => data.id !== item.id),
                    }));
                details.length == 1 && (this._isMounted && this.setState({ showDetail: false }));
            }
        } catch (error) {
            console.log();
        }
    };

    getAllDetails = async () => {
        try {
            results = await DB.executeSql('SELECT * FROM details WHERE card_id=?', [this.card_id]);
            if (results.rows.length > 0) {
                let details = results.rows.raw();
                this._isMounted &&
                    this.setState({
                        details: details,
                        showDetail: true,
                    });
                //console.log('details :', this.state.details);
            }
            if (results.rows.length == 0) {
                let details = results.rows.raw();
                this._isMounted &&
                    this.setState({
                        details: details,
                        showDetail: false,
                    });
                //console.log('details :',this.state.details);
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleEditDetailFormat = async (format, index) => {
        try {
            results = await DB.executeSql('UPDATE details SET format=? WHERE id=?', [
                format,
                index,
            ]);
            //console.log('Format updated: ', results.rowsAffected);
            this._isMounted &&
                this.setState((prevState) => ({
                    ...prevState,
                    details: prevState.details.map((detail) => ({
                        ...detail,
                        format: detail.id === index ? format : detail.format,
                    })),
                }));
        } catch (error) {
            console.log(error);
        }
    };

    handleEditDetailField = async (text, id) => {
        try {
            results = await DB.executeSql('UPDATE details SET name=? WHERE id=?', [text, id]);
        } catch (error) {
            console.log(error);
        }
    };

    handleEditDetailValue = async (text, id, format) => {
        try {
            console.log(text);
            if (format == 4) {
                let dollar = text ? text * 100 : null;
                results = await DB.executeSql('UPDATE details SET value=? WHERE id=?', [
                    dollar,
                    id,
                ]);
            } else {
                results = await DB.executeSql('UPDATE details SET value=? WHERE id=?', [text, id]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleChooseFormat = (index) => {
        const BUTTONS = ['Text', 'Number', 'ID Rupiah', 'US Dollar', 'JP Yen', 'Cancel'];

        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: 5,
                title: 'Select format detail',
            },
            (buttonIndex) => {
                let format;
                switch (buttonIndex) {
                    case 0:
                        format = 1;
                        ActionSheet.hide();
                        if (this._isMounted) {
                            this.setState({ showDetail: true });
                        }
                        this.handleEditDetailFormat(format, index);
                        this.handleChangeInput('', index);
                        break;
                    case 1:
                        format = 2;
                        ActionSheet.hide();
                        if (this._isMounted) {
                            this.setState({ showDetail: true });
                        }
                        this.handleEditDetailFormat(format, index);
                        this.handleChangeInput('', index);
                        break;

                    case 2:
                        format = 3;
                        ActionSheet.hide();
                        if (this._isMounted) {
                            this.setState({ showDetail: true });
                        }
                        this.handleEditDetailFormat(format, index);
                        this.handleChangeInput('', index);
                        break;

                    case 3:
                        format = 4;
                        ActionSheet.hide();
                        if (this._isMounted) {
                            this.setState({ showDetail: true });
                        }
                        this.handleEditDetailFormat(format, index);
                        this.handleChangeInput('', index);
                        break;

                    case 4:
                        format = 5;
                        ActionSheet.hide();
                        if (this._isMounted) {
                            this.setState({ showDetail: true });
                        }
                        this.handleEditDetailFormat(format, index);
                        this.handleChangeInput('', index);
                        break;

                    default:
                        break;
                }
            }
        );
    };

    handleAddImage = () => {
        const { image } = this.state;
        const options = {
            title: 'Select Image',
            noData: true,
            mediaType: 'photo',
            //maxWidth: 500,
            storageOptions: {
                skipBackup: true,
                //waitUntilSaved: true,
                //cameraRoll: true,
                path: 'KataNote',
            },
        };

        ImagePicker.showImagePicker(options, async (response) => {
            try {
                if (response.didCancel) {
                    console.log('Cancel Add Image');
                } else {
                    if (image == null) {
                        results = await DB.executeSql(
                            'INSERT INTO images (uri, card_id, filename) VALUES (?,?,?)',
                            [response.path, this.card_id, response.fileName]
                        );
                        if (results.rowsAffected > 0) {
                            if (this._isMounted) {
                                this.setState({
                                    image: response.path,
                                    filename: response.fileName,
                                    showAttachment: true,
                                    exist: true,
                                });
                            }
                        }
                    } else {
                        results = await DB.executeSql(
                            'UPDATE images SET uri=?,filename=? WHERE card_id=?',
                            [response.path, response.fileName, this.card_id]
                        );
                        if (results.rowsAffected > 0) {
                            if (this._isMounted) {
                                this.setState({
                                    image: response.path,
                                    filename: response.fileName,
                                    exist: true,
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        });
    };

    handleDeleteImage = async () => {
        const { filename, token } = this.state;
        const URL = `http://katanoteapi.website/api/delete/${filename}`;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            results = await DB.executeSql('DELETE FROM images WHERE card_id=?', [this.card_id]);
            if (results.rowsAffected > 0) {
                this._isMounted &&
                    this.setState({
                        image: null,
                        showAttachment: false,
                    });
                await axios
                    .get(URL, config)
                    .then((res) => {
                        if (res.data.code > 200) {
                            console.log(res.data.message);
                        } else {
                            console.log(res.data.message);
                        }
                    })
                    .catch((error) => console.log(error));
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleStoreImage = async () => {
        const { filename, token } = this.state;
        this._isMounted &&
            this.setState({
                progress: 1,
            });
        await RNFetchBlob.fs
            .exists(`${RNFetchBlob.fs.dirs.PictureDir}/KataNote`)
            .then((exist) => {
                if (!exist) {
                    RNFetchBlob.fs.mkdir(`${RNFetchBlob.fs.dirs.PictureDir}/KataNote`);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        await RNFetchBlob.config({
            fileCache: true,
            path: `${RNFetchBlob.fs.dirs.PictureDir}/KataNote/${filename}`,
        })
            .fetch('GET', `http://katanoteapi.website/uploads/${filename}`, {
                Authorization: 'Bearer ' + token,
            })
            .progress((received, total) => {
                this._isMounted &&
                    this.setState({
                        progress: Math.floor((received / total) * 100),
                    });
            })
            .then(async (res) => {
                if (res) {
                    console.log(res);
                    let path = `${RNFetchBlob.fs.dirs.PictureDir}/KataNote/${filename}`;
                    results = await DB.executeSql('UPDATE images SET uri=? WHERE card_id=?', [
                        path,
                        this.card_id,
                    ]);
                    if (results.rowsAffected > 0) {
                        if (this._isMounted) {
                            this.setState({
                                image: path,
                                filename: filename,
                                downloadable: false,
                                exist: true,
                                progress: 0,
                            });
                        }
                    }
                    this.toastMessage('Image successfully downloaded!', 'success');
                } else {
                    if (this._isMounted) {
                        this.setState({
                            downloadable: true,
                            progress: 0,
                        });
                    }
                }
            })
            .catch((err) => {
                this.toastMessage('Download failed!', 'danger');
                if (this._isMounted) {
                    this.setState({
                        downloadable: true,
                        progress: 0,
                    });
                }
                console.log(err);
            });
    };

    handleDownloadImage = async () => {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);

        await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
            .then((result) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.log(
                            'This feature is not available (on this device / in this context)'
                        );
                        break;
                    case RESULTS.DENIED:
                        console.log(
                            'The permission has not been requested / is denied but requestable'
                        );
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission is granted');
                        this.handleStoreImage();
                        break;
                    case RESULTS.BLOCKED:
                        console.log('The permission is denied and not requestable anymore');
                        break;
                }
            })
            .catch((error) => {
                console.log(error);
                this.toastMessage('Something Wrong!', 'danger');
            });
    };

    checkImage = async (filename) => {
        const { image } = this.state;
        console.log(`gambar: ${image}`);
        const dirImage = `file://${image}`;
        await RNFetchBlob.fs
            .exists(dirImage)
            .then(async (exist) => {
                if (exist) {
                    await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                    );
                    await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                    );
                    //console.log(this.state.downloadable);
                    this._isMounted &&
                        this.setState({ downloadable: false, exist: true, thumbnails: '' });
                } else {
                    this._isMounted && this.setState({ exist: false });
                    await this.getThumbnail(filename);
                    console.log('thumb');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    getThumbnail = async (filename) => {
        const { token } = this.state;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const URL = `http://katanoteapi.website/api/downloads/${filename}/100`;
        await axios
            .get(URL, config)
            .then((response) => {
                //\\console.log(response);
                this._isMounted &&
                    this.setState({
                        thumbnails: response.data.data,
                        downloadable: true,
                    });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    downloadable: false,
                    thumbnails: '',
                });
            });
    };

    getImageCard = async () => {
        try {
            results = await DB.executeSql('SELECT * FROM images WHERE card_id=?', [this.card_id]);
            //console.log(results.rows.raw());
            let len = results.rows.length;
            if (len > 0) {
                if (this._isMounted) {
                    this.setState({
                        image: results.rows.item(0).uri,
                        filename: results.rows.item(0).filename,
                        showAttachment: true,
                    });
                }
                //console.log(results.rows.item(0));
                await this.checkImage(results.rows.item(0).filename);
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleAddDate = async (event, date) => {
        this.setState({ showDatePicker: false });
        const { dateChanged, name_card } = this.state;
        let formatedDate = Date.parse(date);

        try {
            if (date === undefined) {
                this.setState({ showDatePicker: false });
                await this.getDateCard();
            } else {
                switch (dateChanged) {
                    case false:
                        results = await DB.executeSql(
                            'INSERT INTO date (value, card_id) VALUES (?,?)',
                            [formatedDate, this.card_id]
                        );
                        if (results.rowsAffected > 0) {
                            PushNotification.localNotificationSchedule({
                                largeIcon: 'icon',
                                autoCancel: true,
                                title: 'KataNote Schedule',
                                message: `Tomorrow is due date for ${name_card} card!`, // (required)
                                date: new Date(formatedDate - 86400 * 1000), // 86400 in 60 secs
                            });
                            console.log('cek');
                            await this.getDateCard();
                            if (this._isMounted) {
                                this.setState({
                                    showDatePicker: false,
                                    dateChanged: true,
                                });
                            }
                        }
                        break;
                    case true:
                        results = await DB.executeSql('UPDATE date SET value=? WHERE card_id=?', [
                            formatedDate,
                            this.card_id,
                        ]);
                        if (results.rowsAffected > 0) {
                            // console.log(
                            //     'Date updated: ',
                            //     results.rowsAffected
                            // );
                            PushNotification.cancelAllLocalNotifications();
                            PushNotification.localNotificationSchedule({
                                largeIcon: 'icon',
                                autoCancel: true,
                                title: 'KataNote Schedule',
                                message: `Tomorrow is due date for ${name_card} card!`, // (required)
                                date: new Date(formatedDate - 86400 * 1000), // in 60 secs
                                //date: new Date(formatedDate + 5 * 1000), // in 60 secs
                            });
                            await this.getDateCard();
                            if (this._isMounted) {
                                this.setState({
                                    showDatePicker: false,
                                    dateChanged: true,
                                });
                            }
                        }
                        break;
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleDeleteDate = async () => {
        try {
            results = await DB.executeSql('DELETE FROM date WHERE card_id=?', [this.card_id]);
            //console.log('Date deleted: ', results.rowsAffected);
            if (results.rowsAffected > 0) {
                if (this._isMounted) {
                    this.setState({ dateChanged: false });
                }
                PushNotification.cancelAllLocalNotifications();
            }
        } catch (error) {
            console.log(error);
        }
    };

    getDateCard = async () => {
        try {
            results = await DB.executeSql('SELECT value FROM date WHERE card_id=?', [this.card_id]);
            if (results.rows.length > 0) {
                let formatedDate = parseInt(results.rows.item(0).value);
                let date = new Date(formatedDate);
                if (this._isMounted) {
                    this.setState({ date, dateChanged: true });
                }
                if (Date.parse(date) <= Date.parse(new Date())) {
                    this.setState({ expiredDate: true });
                } else {
                    this.setState({ expiredDate: false });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleExpiredStyle(expiredDate) {
        const { dateChanged } = this.state;
        if (dateChanged) {
            switch (expiredDate) {
                case true:
                    return {
                        color: 'red',
                    };
                    break;

                case false:
                    return {
                        color: MAIN_COLOR,
                    };
                    break;
            }
        }
        return {
            color: '#a5a5a5',
        };
    }

    renderHeader = () => {
        const { editable_title, editable_desc } = this.state;
        if (editable_title) {
            return (
                <Header androidStatusBarColor="#34a869" noShadow style={styles.header}>
                    <Left>
                        <Button
                            transparent
                            onPress={() =>
                                this.setState({
                                    editable_title: false,
                                    name_card: this.name_card,
                                })
                            }
                        >
                            <Icon name="md-close" style={styles.iconHeader} />
                        </Button>
                    </Left>
                    <Body />
                    <Right>
                        <Button transparent onPress={this.handleEdit}>
                            <Icon type="Ionicons" name="md-checkmark" style={styles.iconHeader} />
                        </Button>
                    </Right>
                </Header>
            );
        }
        if (editable_desc) {
            return (
                <Header androidStatusBarColor="#34a869" noShadow style={styles.header}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => {
                                this.setState({
                                    editable_desc: false,
                                }),
                                    this.getCardDescription();
                            }}
                        >
                            <Icon name="md-close" style={styles.iconHeader} />
                        </Button>
                    </Left>
                    <Body />
                    <Right>
                        <Button transparent onPress={this.handleUpdateDescription}>
                            <Icon type="Ionicons" name="md-checkmark" style={styles.iconHeader} />
                        </Button>
                    </Right>
                </Header>
            );
        } else {
            return (
                <Header androidStatusBarColor="#34a869" noShadow style={styles.header}>
                    <Left>
                        <Button transparent onPress={this.handleBack}>
                            <Icon name="md-arrow-back" style={styles.iconHeader} />
                        </Button>
                    </Left>
                    <Body />
                    <Right>
                        <Button transparent onPress={this.handleAddImage}>
                            <Icon
                                type="MaterialCommunityIcons"
                                name="image-plus"
                                style={styles.iconHeader}
                            />
                        </Button>
                        <Button transparent onPress={this.handleOptions}>
                            <Icon name="md-share" style={styles.iconHeader} />
                        </Button>
                        <Button transparent onPress={this.handleEditOptions}>
                            <Icon name="md-more" style={styles.iconHeader} />
                        </Button>
                    </Right>
                </Header>
            );
        }
    };

    renderButtonDetail() {
        const { showDetail } = this.state;
        if (showDetail == false) {
            return (
                <ListItem icon onPress={this.handleButtonDetail}>
                    <Left>
                        <Icon name="md-add" style={(styles.textDefault, styles.iconDefault)} />
                    </Left>
                    <Body style={{ borderBottomWidth: 0 }}>
                        <Text style={styles.textDefault}>Add Detail</Text>
                    </Body>
                </ListItem>
            );
        }
    }

    handleEditableTitle = () => {
        this._isMounted && this.setState({ editable_title: true });
    };

    handleEditableDesc = () => {
        this._isMounted && this.setState({ editable_desc: true });
    };

    handleButtonTask = () => {
        this._isMounted && this.setState({ showCheck: true });
    };

    handleButtonDetail = () => {
        this._isMounted && this.setState({ showDetail: true });
    };

    render() {
        const {
            editable_title,
            editable_desc,
            name_card,
            image,
            checklist,
            new_checklist,
            showCheck,
            showAttachment,
            showDetail,
            toggleDetail,
            details,
            counter,
            totalCounter,
            delete_detail,
            format,
            description_card,
            date,
            showDatePicker,
            dateChanged,
            expiredDate,
            editable_checkbox,
            toggleChecklist,
            toggleAttachment,
            filename,
            downloadable,
            thumbnails,
            progress,
            exist,
        } = this.state;
        return (
            <Container style={styles.container}>
                {this.renderHeader()}
                <ScrollView
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                >
                    <View style={styles.head}>
                        {//----------------------------------------TITLE SECTION----------------------------------------
                        editable_title ? (
                            <TextInput
                                style={styles.titleEdit}
                                onChangeText={(text) => this.setState({ name_card: text })}
                                value={name_card}
                                onBlur={() =>
                                    this.setState({
                                        editable_title: false,
                                    })
                                }
                                onSubmitEditing={this.handleEdit}
                                autoFocus
                            />
                        ) : (
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.title}
                                onPress={this.handleEditableTitle}
                            >
                                {name_card}
                            </Text>
                        )}
                        <Text style={styles.subtitle}>{`Item from ${this.name_board}`}</Text>
                    </View>
                    {this.state.loading ? (
                        <Spinner style={styles.spinner} />
                    ) : (
                        <View>
                            <View
                                style={{
                                    paddingHorizontal: 25,
                                    paddingVertical: 20,
                                }}
                            >
                                {//----------------------------------------DESCRIPTION SECTION----------------------------------------
                                editable_desc ? (
                                    <TextInput
                                        placeholder="Edit description..."
                                        style={{
                                            color: MAIN_TEXT,
                                            padding: 0,
                                            margin: 0,
                                        }}
                                        multiline={true}
                                        value={description_card}
                                        onChangeText={(text) =>
                                            this.setState({
                                                description_card: text,
                                            })
                                        }
                                        autoFocus={editable_desc}
                                        onBlur={this.handleUpdateDescription}
                                        autoFocus
                                    />
                                ) : (
                                    <Text
                                        style={
                                            !description_card
                                                ? { color: '#a5a5a5' }
                                                : { color: MAIN_TEXT }
                                        }
                                        onPress={this.handleEditableDesc}
                                    >
                                        {description_card
                                            ? description_card
                                            : 'Edit description...'}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.addDetail}>
                                {/* -------------------------------DATE SECTION--------------------------------------- */}
                                <ListItem
                                    icon
                                    onPress={() =>
                                        this.setState({
                                            showDatePicker: true,
                                        })
                                    }
                                >
                                    <Left>
                                        <Icon
                                            name="md-calendar"
                                            style={[
                                                styles.iconDefault,
                                                this.handleExpiredStyle(expiredDate),
                                            ]}
                                        />
                                    </Left>
                                    <Body
                                        style={{
                                            borderBottomWidth: 0,
                                        }}
                                    >
                                        {showDatePicker ? (
                                            <DateTimePicker
                                                value={date}
                                                mode="date"
                                                display="calendar"
                                                minimumDate={new Date()}
                                                onChange={this.handleAddDate}
                                            />
                                        ) : (
                                            <Text style={this.handleExpiredStyle(expiredDate)}>
                                                {dateChanged
                                                    ? `Due Date: ${moment(date).format(
                                                          'dddd, DD MMMM YYYY'
                                                      )}`
                                                    : 'Due Date'}
                                            </Text>
                                        )}
                                    </Body>
                                    <Right
                                        style={{
                                            borderBottomWidth: 0,
                                        }}
                                    >
                                        {dateChanged && (
                                            <Icon
                                                name="md-close"
                                                style={styles.iconDefault}
                                                onPress={this.handleDeleteDate}
                                            />
                                        )}
                                    </Right>
                                </ListItem>
                                {!showDetail && (
                                    <ListItem icon onPress={this.handleButtonDetail}>
                                        <Left>
                                            <Icon
                                                name="md-add"
                                                style={(styles.textDefault, styles.iconDefault)}
                                            />
                                        </Left>
                                        <Body
                                            style={{
                                                borderBottomWidth: 0,
                                            }}
                                        >
                                            <Text style={styles.textDefault}>Add Detail</Text>
                                        </Body>
                                    </ListItem>
                                )}
                                {!showCheck && (
                                    <ListItem icon onPress={this.handleButtonTask}>
                                        <Left>
                                            <Icon
                                                name="md-checkbox-outline"
                                                style={(styles.textDefault, styles.iconDefault)}
                                            />
                                        </Left>
                                        <Body
                                            style={{
                                                borderBottomWidth: 0,
                                            }}
                                        >
                                            <Text style={styles.textDefault}>Add Task</Text>
                                        </Body>
                                    </ListItem>
                                )}
                            </View>
                            {/* ----------------------------------------------------------DETAIL SECTION----------------------------------------------------- */}
                            {showDetail && (
                                <View>
                                    <View style={styles.detailTitle}>
                                        <ListItem icon>
                                            <Left style={{ padding: 0 }}>
                                                <Icon
                                                    style={{
                                                        color: MAIN_TEXT,
                                                        fontSize: 24,
                                                    }}
                                                    name="md-list"
                                                />
                                            </Left>
                                            <Body
                                                style={{
                                                    borderBottomWidth: 0,
                                                }}
                                            >
                                                <TouchableWithoutFeedback
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                toggleDetail: !toggleDetail,
                                                            });
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            fontWeight: '700',
                                                            color: MAIN_TEXT,
                                                        }}
                                                    >
                                                        Details
                                                    </Text>
                                                </TouchableWithoutFeedback>
                                            </Body>
                                            {toggleDetail && (
                                                <Right
                                                    style={{
                                                        borderBottomWidth: 0,
                                                        width: 80,
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {details.length > 0 && (
                                                        <TouchableWithoutFeedback
                                                            onPress={() =>
                                                                this.setState({
                                                                    delete_detail: !delete_detail,
                                                                })
                                                            }
                                                        >
                                                            <Text style={styles.textDefault}>
                                                                {delete_detail ? 'Cancel' : 'Edit'}
                                                            </Text>
                                                        </TouchableWithoutFeedback>
                                                    )}
                                                </Right>
                                            )}
                                        </ListItem>
                                    </View>
                                    {toggleDetail && (
                                        <View style={styles.addDetail}>
                                            {details &&
                                                details.map((item) => {
                                                    return this.renderAllDetails(item);
                                                })}
                                            <TouchableWithoutFeedback
                                                onPress={this.handleAddDetails}
                                            >
                                                <ListItem icon>
                                                    <Left>
                                                        <Icon
                                                            name="md-add"
                                                            style={
                                                                (styles.textDefault,
                                                                styles.iconDefault)
                                                            }
                                                        />
                                                    </Left>
                                                    <Body
                                                        style={{
                                                            borderBottomWidth: 0,
                                                        }}
                                                    >
                                                        <Text style={styles.textDefault}>
                                                            Add new detail...
                                                        </Text>
                                                    </Body>
                                                </ListItem>
                                            </TouchableWithoutFeedback>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* ---------------------------------------------------------CHECKLIST SECTION-------------------------------------------------- */}
                            {showCheck && (
                                <View>
                                    <View style={styles.detailTitle}>
                                        <ListItem icon>
                                            <Left style={{ padding: 0 }}>
                                                <Icon
                                                    style={{
                                                        color: MAIN_TEXT,
                                                        fontSize: 24,
                                                    }}
                                                    name="md-checkbox-outline"
                                                />
                                            </Left>
                                            <Body
                                                style={{
                                                    borderBottomWidth: 0,
                                                }}
                                            >
                                                <TouchableWithoutFeedback
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                toggleChecklist: !toggleChecklist,
                                                            });
                                                    }}
                                                >
                                                    {checklist.length > 0 ? (
                                                        <Text
                                                            style={{
                                                                fontSize: 20,
                                                                fontWeight: '700',
                                                                color: MAIN_TEXT,
                                                            }}
                                                        >{`Checklist ${counter}/${totalCounter}`}</Text>
                                                    ) : (
                                                        <Text
                                                            style={{
                                                                fontSize: 20,
                                                                fontWeight: '700',
                                                                color: MAIN_TEXT,
                                                            }}
                                                        >{`Checklist`}</Text>
                                                    )}
                                                </TouchableWithoutFeedback>
                                            </Body>
                                            {toggleChecklist && (
                                                <Right
                                                    style={{
                                                        borderBottomWidth: 0,
                                                        width: 80,
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {checklist.length > 0 && (
                                                        <TouchableWithoutFeedback
                                                            style={{
                                                                alignItems: 'center',
                                                            }}
                                                            onPress={() =>
                                                                this._isMounted &&
                                                                this.setState({
                                                                    editable_checkbox: !editable_checkbox,
                                                                })
                                                            }
                                                        >
                                                            <Text style={styles.textDefault}>
                                                                {editable_checkbox
                                                                    ? 'Cancel'
                                                                    : 'Edit'}
                                                            </Text>
                                                        </TouchableWithoutFeedback>
                                                    )}
                                                </Right>
                                            )}
                                        </ListItem>
                                    </View>
                                    {toggleChecklist && (
                                        <View style={styles.addDetail}>
                                            {checklist &&
                                                checklist.map((item) => {
                                                    return this.renderChecklists(item);
                                                })}
                                            <ListItem icon>
                                                {new_checklist.length > 0 ? (
                                                    <Left>
                                                        <Icon
                                                            name="md-close"
                                                            style={
                                                                (styles.textDefault,
                                                                styles.iconDefault)
                                                            }
                                                            onPress={() => {
                                                                this.setState({
                                                                    new_checklist: '',
                                                                }),
                                                                    Keyboard.dismiss();
                                                            }}
                                                        />
                                                    </Left>
                                                ) : (
                                                    <Left>
                                                        <Icon
                                                            name="md-add"
                                                            style={
                                                                (styles.textDefault,
                                                                styles.iconDefault)
                                                            }
                                                        />
                                                    </Left>
                                                )}
                                                <Body
                                                    style={{
                                                        borderBottomWidth: 0,
                                                    }}
                                                >
                                                    <TextInput
                                                        placeholder="Add new task..."
                                                        onChangeText={(text) =>
                                                            this.setState({
                                                                new_checklist: text,
                                                            })
                                                        }
                                                        value={new_checklist}
                                                        //autoFocus={showCheck}
                                                    />
                                                </Body>
                                                {new_checklist.length > 0 ? (
                                                    <Right
                                                        style={{
                                                            borderBottomWidth: 0,
                                                        }}
                                                    >
                                                        <Button
                                                            transparent
                                                            onPress={this.handleAddChecklist}
                                                        >
                                                            <Icon
                                                                type="Ionicons"
                                                                name="md-checkmark"
                                                                style={
                                                                    (styles.textDefault,
                                                                    styles.iconDefault)
                                                                }
                                                            />
                                                        </Button>
                                                    </Right>
                                                ) : null}
                                            </ListItem>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* ------------------------------------------------------ATTACHMENTS SECTION--------------------------------------------------- */}
                            {showAttachment && (
                                <View>
                                    <View style={styles.detailTitle}>
                                        <ListItem icon>
                                            <Left
                                                style={{
                                                    padding: 0,
                                                }}
                                            >
                                                <Icon
                                                    style={{
                                                        color: MAIN_TEXT,
                                                        fontSize: 24,
                                                    }}
                                                    type="FontAwesome"
                                                    name="paperclip"
                                                />
                                            </Left>
                                            <Body
                                                style={{
                                                    borderBottomWidth: 0,
                                                }}
                                            >
                                                <TouchableWithoutFeedback
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                toggleAttachment: !toggleAttachment,
                                                            });
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            fontWeight: '700',
                                                            color: MAIN_TEXT,
                                                        }}
                                                    >
                                                        Attachments
                                                    </Text>
                                                </TouchableWithoutFeedback>
                                            </Body>

                                            <Right
                                                style={{
                                                    borderBottomWidth: 0,
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {downloadable && progress == 0 && (
                                                    <TouchableWithoutFeedback
                                                        style={{
                                                            alignItems: 'center',
                                                        }}
                                                        onPress={this.handleDownloadImage}
                                                    >
                                                        <Icon
                                                            name="md-download"
                                                            style={{
                                                                color: '#a6a6a6',
                                                                fontSize: 21,
                                                                paddingRight: 20,
                                                            }}
                                                        />
                                                    </TouchableWithoutFeedback>
                                                )}
                                                {progress > 0 && (
                                                    <Text
                                                        style={{ textAlign: 'center' }}
                                                    >{`Downloading...${progress}%`}</Text>
                                                )}
                                            </Right>
                                        </ListItem>
                                    </View>
                                    {toggleAttachment && (
                                        <View style={styles.addDetail}>
                                            <ListItem
                                                style={{
                                                    borderBottomWidth: 0,
                                                }}
                                            >
                                                {!exist ? (
                                                    thumbnails || downloadable ? (
                                                        <Image
                                                            style={styles.image}
                                                            source={{
                                                                uri: thumbnails,
                                                            }}
                                                            resizeMode={'contain'}
                                                            blurRadius={5}
                                                        />
                                                    ) : (
                                                        <Image
                                                            style={styles.image}
                                                            source={require('../assets/default.jpg')}
                                                            resizeMode={'contain'}
                                                        />
                                                    )
                                                ) : (
                                                    <Lightbox
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                        underlayColor="transparent"
                                                    >
                                                        <Image
                                                            style={styles.image}
                                                            source={{
                                                                uri: `file://${image}`,
                                                            }}
                                                            resizeMode={'contain'}
                                                        />
                                                    </Lightbox>
                                                )}
                                            </ListItem>
                                            <Button
                                                block
                                                transparent
                                                onPress={this.handleDeleteImage}
                                            >
                                                <Text style={{ color: 'red' }}>DELETE IMAGE</Text>
                                            </Button>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
        flex: 1,
    },
    header: {
        backgroundColor: MAIN_COLOR,
    },
    head: {
        paddingHorizontal: 25,
        backgroundColor: MAIN_COLOR,
        paddingBottom: 15,
    },
    list: {
        paddingTop: 40,
        padding: 15,
        backgroundColor: 'transparent',
    },
    titlePage: {
        //paddingBottom: 20
        //backgroundColor: '#39b772',
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        color: 'white',
        margin: 0,
        padding: 0,
    },
    titleEdit: {
        fontSize: 27,
        fontWeight: 'bold',
        color: 'white',
        margin: 0,
        padding: 0,
        borderBottomWidth: 2,
        borderColor: '#34a869',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'white',
        marginTop: 5,
    },
    iconHeader: {
        color: 'white',
        fontSize: 27,
    },
    icon: {
        color: '#a6a6a6',
        fontSize: 21,
    },
    item: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 5,
        //padding: 15,
        borderRadius: 5,
        flex: 1,
        elevation: 3,
        //height: Dimensions.get('window').width / numColumns
    },
    itemInvisible: {
        backgroundColor: 'transparent',
        elevation: 0,
    },
    itemContent: {
        //height: Dimensions.get('window').width / numColumns,
        padding: 15,
    },
    board: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
        color: '#1e1e1e',
    },
    description: {
        //paddingVertical: 20,
        //paddingHorizontal:40,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    spinner: {
        color: MAIN_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height / 2,
    },
    blankSpace: {
        // position:'absolute',
        // top: 0,
        // left:0,
        // right:0,
        // zIndex: 100
        //backgroundColor: 'red',
        height: Dimensions.get('window').height / 2,
        justifyContent: 'center',
        alignContent: 'center',
    },
    blank: {
        //paddingTop: Dimensions.get('window').height / 2 - HEADER_HEIGHT ,
        textAlign: 'center',
        color: '#a5a5a5',
        fontSize: 16,
    },
    detailTitle: {
        //alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 0,
        borderBottomWidth: 3,
        borderColor: MAIN_COLOR,
        //flex:1
    },
    addDetail: {
        //flexDirection: 'row',
        //alignItems: 'center',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#dddd',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#f3f3f3',
        flex: 1,
    },
    textDefault: {
        color: '#a5a5a5',
    },
    textSuccess: {
        color: MAIN_COLOR,
    },
    iconDefault: {
        color: '#a5a5a5',
        fontSize: 24,
    },
    image: {
        //backgroundColor: 'red',
        //resizeMode: 'contain',
        flex: 1,
        height: 400,
        //position: 'absolute',
        //top:0
    },
    checkedList: {},
    uncheckedList: {},
});
