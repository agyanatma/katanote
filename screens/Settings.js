import React, { Component } from 'react';
import { Text, StyleSheet, View, Keyboard, Dimensions, FlatList, Alert } from 'react-native';
import { Container, Header, Left, Right, Body, Button, Icon, Toast, Spinner } from 'native-base';
import axios from 'axios';
import DB from '../database';
import { NavigationActions, StackActions } from 'react-navigation';
import RNFetchBlob from 'rn-fetch-blob';
import ButtonInput from '../components/ButtonInput';

const MAIN_COLOR = '#39b772';

const URL = 'http://katanoteapi.website/api';

export default class Settings extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            token: '',
            boards: [],
            cards: [],
            details: [],
            checkbox: [],
            date: [],
            images: [],
            loading: false,
            register: false,
            logged: false,
            errorMessage: '',
            isError: false,
            log: [],
            path: '',
        };
    }

    componentDidMount() {
        this.updateUser = this.props.navigation.addListener('willFocus', () => {
            this.getDataUser();
            this.setState({ log: [] });
        });
        this.getDataUser();
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.updateUser.remove();
    }

    toastMessage = (message, type) => {
        Toast.show({
            text: message,
            duration: 4000,
            type: type,
            buttonText: 'Close',
        });
    };

    handleConfirmation = () => {
        Alert.alert('Are you sure?', 'Your data will be wiped and cannot be restored', [
            {
                text: 'CANCEL',
                style: 'cancel',
                onPress: () => console.log('Cancel delete board'),
            },
            {
                text: 'IMPORT',
                style: 'destructive',
                onPress: () => this.handleImport(),
            },
        ]);
    };

    handleConfirmExport = () => {
        Alert.alert('Are you sure?', 'Your backup will be overwritten', [
            {
                text: 'CANCEL',
                style: 'cancel',
                onPress: () => console.log('Cancel delete board'),
            },
            {
                text: 'EXPORT',
                style: 'destructive',
                onPress: () => this.handleExport(),
            },
        ]);
    };

    getDataUser = async () => {
        try {
            results = await DB.executeSql('SELECT * FROM user', []);
            //console.log(results.rows.raw())
            if (results.rows.length > 0) {
                this._isMounted &&
                    this.setState({
                        logged: true,
                        username: results.rows.item(0).username,
                        token: results.rows.item(0).token,
                    });
                //console.log(results.rows.item(0));
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleDeleteUser = async () => {
        try {
            results = await DB.executeSql('DELETE FROM user', []);
            if (results.rowsAffected > 0) {
                this._isMounted &&
                    this.setState({
                        username: '',
                        email: '',
                        password: '',
                        token: '',
                    });
                console.log('delete success');
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleLogout = async () => {
        this._isMounted && this.setState({ loading: true });
        const { token } = this.state;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        await axios
            .get(URL + '/logout', config)
            .then(async (response) => {
                response = response.data;
                if (response.code > 200) {
                    console.log(response.message);
                    this.toastMessage(response.message, 'danger');
                } else {
                    await this.handleDeleteUser();
                    this.toastMessage(response.message, 'success');
                    this.props.navigation.navigate('Auth');
                }
            })
            .catch((error) => {
                console.log(error);
                this.toastMessage('Something wrong!', 'danger');
            });
        this._isMounted && this.setState({ loading: false });
    };

    handleExport = async () => {
        const { token, boards } = this.state;
        this._isMounted &&
            this.setState({
                loading: true,
                boards: [],
                cards: [],
                details: [],
                checkbox: [],
                date: [],
                images: [],
            });

        // GET ALL BOARDS
        results = await DB.executeSql('SELECT * FROM boards', []);
        var len = results.rows.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                this._isMounted &&
                    this.setState((prevState) => ({
                        boards: [...prevState.boards, results.rows.item(i)],
                        log: [
                            ...prevState.log,
                            { message: `boards data ${i == 0 ? '' : i} exported . . . OK!` },
                        ],
                    }));
                //console.log(results.rows.item(i));
            }
        }

        // GET ALL CARDS
        results = await DB.executeSql('SELECT * FROM cards', []);
        var len = results.rows.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                this._isMounted &&
                    this.setState((prevState) => ({
                        cards: [...prevState.cards, results.rows.item(i)],
                        log: [
                            ...prevState.log,
                            { message: `cards data ${i == 0 ? '' : i} exported . . . OK!` },
                        ],
                    }));
                //console.log(results.rows.item(i));
            }
        }

        // GET ALL DETAILS
        results = await DB.executeSql('SELECT * FROM details', []);
        var len = results.rows.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                this._isMounted &&
                    this.setState((prevState) => ({
                        details: [...prevState.details, results.rows.item(i)],
                        log: [
                            ...prevState.log,
                            { message: `details data ${i == 0 ? '' : i} exported . . . OK!` },
                        ],
                    }));
                //console.log(results.rows.item(i));
            }
        }

        // GET ALL CHECKBOX
        results = await DB.executeSql('SELECT * FROM checkbox', []);
        var len = results.rows.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                this._isMounted &&
                    this.setState((prevState) => ({
                        checkbox: [...prevState.checkbox, results.rows.item(i)],
                        log: [
                            ...prevState.log,
                            { message: `checkbox data ${i == 0 ? '' : i} exported . . . OK!` },
                        ],
                    }));
                //console.log(results.rows.item(i));
            }
        }

        // GET ALL DATE
        results = await DB.executeSql('SELECT * FROM date', []);
        var len = results.rows.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                this._isMounted &&
                    this.setState((prevState) => ({
                        date: [...prevState.date, results.rows.item(i)],
                        log: [
                            ...prevState.log,
                            { message: `date data ${i == 0 ? '' : i} exported . . . OK!` },
                        ],
                    }));
                //console.log(results.rows.item(i));
            }
        }

        // GET ALL IMAGES
        results = await DB.executeSql('SELECT * FROM images', []);
        var len = results.rows.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                let filename = results.rows.item(i).filename;
                let path = results.rows.item(i).uri;
                this._isMounted &&
                    this.setState((prevState) => ({
                        images: [...prevState.images, results.rows.item(i)],
                        log: [
                            ...prevState.log,
                            { message: `images data ${i == 0 ? '' : i} exported . . . OK!` },
                        ],
                    }));
                //console.log(results.rows.item(i));

                //UPLOAD IMAGES RNFS FETCH BLOB
                await this.uploadImage(i, filename, path);
            }
        }

        //SEND TO SERVER
        if (this.state.boards != null) {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios
                .post(
                    URL + '/export',
                    {
                        boards: JSON.stringify(this.state.boards),
                        cards: JSON.stringify(this.state.cards),
                        details: JSON.stringify(this.state.details),
                        checkbox: JSON.stringify(this.state.checkbox),
                        date: JSON.stringify(this.state.date),
                        images: JSON.stringify(this.state.images),
                    },
                    config
                )
                .then((response) => {
                    response = response.data;
                    if (response.code > 200) {
                        this.toastMessage(response.message, 'danger');
                    } else {
                        this.toastMessage('All data exported successfully!', 'success');
                        this._isMounted &&
                            this.setState((prevState) => ({
                                log: [
                                    ...prevState.log,
                                    { message: 'All data exported successfully!' },
                                ],
                            }));
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.toastMessage('Something wrong!', 'danger');
                });
        } else {
            this.toastMessage('Did not find any data', 'warning');
        }

        this._isMounted && this.setState({ loading: false });
    };

    uploadImage = async (i, filename, path) => {
        const { token } = this.state;
        await RNFetchBlob.fetch(
            'POST',
            'http://katanoteapi.website/api/uploads',
            {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'multipart/form-data',
            },
            [
                {
                    name: 'images',
                    filename: filename,
                    data: RNFetchBlob.wrap(path),
                },
            ]
        )
            .uploadProgress((written, total) => {
                console.log('uploaded', written / total);
            })
            .then((response) => {
                response = response.data;
                if (response.code > 200) {
                    this.toastMessage(response.message, 'danger');
                } else {
                    this._isMounted &&
                        this.setState((prevState) => ({
                            log: [
                                ...prevState.log,
                                {
                                    message: `images file ${i == 0 ? '' : i} uploaded . . . OK!`,
                                },
                            ],
                        }));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    deleteAllRows = async () => {
        // DELETE ALL DATA FIRST
        const tables = ['boards', 'cards', 'details', 'date', 'checkbox', 'images'];
        tables.forEach(async (data) => {
            //console.log(data);
            results = await DB.executeSql(`DELETE FROM ${data}`, []);
            if (results.rowsAffected > 0) {
                //console.log(`table ${data} deleted`);
            }
        });
        //results = await DB.executeSql('DELETE FROM cards', []);
    };

    handleImport = async () => {
        const { token } = this.state;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        this._isMounted && this.setState({ loading: true });
        //REQUEST ALL DATA
        await axios
            .get(URL + '/import', config)
            .then(async (response) => {
                response = response.data;
                if (response.data.code > 200) {
                    console.log(response.message);
                } else {
                    //console.log(JSON.parse(response.data.boards));

                    let boards = JSON.parse(response.data.boards);
                    let cards = JSON.parse(response.data.cards);
                    let details = JSON.parse(response.data.details);
                    let checkbox = JSON.parse(response.data.checkbox);
                    let date = JSON.parse(response.data.date);
                    let images = JSON.parse(response.data.images);

                    this._isMounted &&
                        this.setState({
                            boards,
                            cards,
                            details,
                            checkbox,
                            date,
                            images,
                        });
                    //console.log(response);

                    await this.deleteAllRows();
                    await this.handleAddDatabase();

                    this._isMounted &&
                        this.setState((prevState) => ({
                            log: [...prevState.log, { message: 'All data imported successfully!' }],
                        }));
                    this.toastMessage('All data imported successfully!', 'success');
                    this._isMounted && this.setState({ loading: false });
                }
            })
            .catch((error) => {
                console.log(error);
                this._isMounted && this.setState({ loading: false });
                this.toastMessage('Something wrong!', 'danger');
            });
    };

    handleAddDatabase = async () => {
        const { boards, cards, details, checkbox, date, images, token } = this.state;
        //console.log(boards, cards, details, checkbox, date, images);
        for (var i = 0; i < boards.length; i++) {
            results = await DB.executeSql(
                'INSERT INTO boards (id, name, description) VALUES (?,?,?)',
                [boards[i].id, boards[i].name, boards[i].description]
            );
            this._isMounted &&
                this.setState((prevState) => ({
                    log: [
                        ...prevState.log,
                        {
                            message: `boards data ${i == 0 ? '' : i} imported . . . OK!`,
                        },
                    ],
                }));
        }
        for (var i = 0; i < cards.length; i++) {
            results = await DB.executeSql(
                'INSERT INTO cards (id, name, board_id, description) VALUES (?,?,?,?)',
                [cards[i].id, cards[i].name, cards[i].board_id, cards[i].description]
            );
            this._isMounted &&
                this.setState((prevState) => ({
                    log: [
                        ...prevState.log,
                        {
                            message: `cards data ${i == 0 ? '' : i} imported . . . OK!`,
                        },
                    ],
                }));
        }
        for (var i = 0; i < details.length; i++) {
            results = await DB.executeSql(
                'INSERT INTO details (id, name, format, card_id, value) VALUES (?,?,?,?,?)',
                [
                    details[i].id,
                    details[i].name,
                    details[i].format,
                    details[i].card_id,
                    details[i].value,
                ]
            );
            this._isMounted &&
                this.setState((prevState) => ({
                    log: [
                        ...prevState.log,
                        {
                            message: `details data ${i == 0 ? '' : i} imported . . . OK!`,
                        },
                    ],
                }));
        }
        for (var i = 0; i < checkbox.length; i++) {
            results = await DB.executeSql(
                'INSERT INTO checkbox (id, done, card_id, value) VALUES (?,?,?,?)',
                [checkbox[i].id, checkbox[i].done, checkbox[i].card_id, checkbox[i].value]
            );
            this._isMounted &&
                this.setState((prevState) => ({
                    log: [
                        ...prevState.log,
                        {
                            message: `checkbox data ${i == 0 ? '' : i} imported . . . OK!`,
                        },
                    ],
                }));
        }
        for (var i = 0; i < date.length; i++) {
            results = await DB.executeSql('INSERT INTO date (id, value, card_id) VALUES (?,?,?)', [
                date[i].id,
                date[i].value,
                date[i].card_id,
            ]);
            this._isMounted &&
                this.setState((prevState) => ({
                    log: [
                        ...prevState.log,
                        {
                            message: `date data ${i == 0 ? '' : i} imported . . . OK!`,
                        },
                    ],
                }));
        }
        for (var i = 0; i < images.length; i++) {
            let path = `http://katanoteapi.website/api/downloads/${images[i].filename}`;
            results = await DB.executeSql(
                'INSERT INTO images (id, uri, card_id, filename) VALUES (?,?,?,?)',
                [images[i].id, images[i].uri, images[i].card_id, images[i].filename]
            );
            this._isMounted &&
                this.setState((prevState) => ({
                    log: [
                        ...prevState.log,
                        {
                            message: `images data ${i == 0 ? '' : i} imported . . . OK!`,
                        },
                    ],
                }));
        }
    };

    handleToEditUser() {
        this.props.navigation.navigate('EditUser');
    }

    render() {
        const { username, loading, log } = this.state;
        return (
            <Container>
                <Header
                    androidStatusBarColor="#34a869"
                    noShadow
                    style={{
                        backgroundColor: MAIN_COLOR,
                    }}
                >
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                            <Icon name="md-menu" style={styles.icon} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.title}>Settings</Text>
                    </Body>
                    <Right>{loading && <Spinner color="white" />}</Right>
                </Header>
                <View style={{ padding: 25, flex: 1 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Icon
                            name="circle-medium"
                            type="MaterialCommunityIcons"
                            style={{ color: MAIN_COLOR }}
                        />
                        <Text
                            style={{
                                color: '#1e1e1e',
                                fontSize: 18,
                                fontWeight: 'normal',
                            }}
                        >{`Logged as ${username}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <ButtonInput text="EXPORT DATA" onPress={this.handleConfirmExport} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <ButtonInput text="IMPORT DATA" onPress={this.handleConfirmation} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <ButtonInput
                                text="EDIT USER"
                                onPress={this.handleToEditUser.bind(this)}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <ButtonInput text="LOGOUT" onPress={this.handleLogout} />
                        </View>
                    </View>
                    <View style={{ flex: 1, marginTop: 10 }}>
                        {log.length > 0 && (
                            <FlatList
                                renderItem={({ item }) => {
                                    return (
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>{item.message}</Text>
                                            <Icon
                                                name="md-checkmark"
                                                type="Ionicons"
                                                style={{
                                                    color: 'green',
                                                    fontSize: 18,
                                                    marginLeft: 10,
                                                }}
                                            />
                                        </View>
                                    );
                                }}
                                ListHeaderComponent={
                                    <Text style={{ fontSize: 16 }}>Data logs</Text>
                                }
                                data={log}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={{ paddingVertical: 10 }}
                            />
                        )}
                    </View>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    userImage: {
        marginBottom: 10,
        width: 70,
        height: 70,
        borderRadius: 75,
    },
    butttonEditProfile: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: MAIN_COLOR,
        borderWidth: 1,
    },
    icon: {
        color: 'white',
        fontSize: 27,
    },
    spinner: {
        position: 'absolute',
        top: Dimensions.get('window').width / 2,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99,
    },
});
