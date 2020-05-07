import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    FlatList,
    TouchableNativeFeedback,
    Alert,
    RefreshControl,
} from 'react-native';
import { Container, Header, Icon, Left, Right, Body, Button, Spinner, Toast } from 'native-base';
import Animated from 'react-native-reanimated';
import DB from '../database';
import { openDatabase } from 'react-native-sqlite-storage';
const db = openDatabase({
    name: 'katanote.db',
    createFromLocation: '~katanote.db',
});

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        data.push({
            key: `blank-${numberOfElementsLastRow}`,
            empty: true,
        });
        numberOfElementsLastRow++;
    }

    return data;
};

const numColumns = 2;

const MAIN_COLOR = '#39b772';
const HEADER_HEIGHT = 130;

const scrollY = new Animated.Value(0);
const diffClampScrollY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);
const headerY = Animated.interpolate(diffClampScrollY, {
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
});

export default class Home extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            fetch: false,
            loading: true,
            showToast: false,
            userName: '',
            userDesc: '',
            isRefreshing: false,
        };
    }

    toastMessage = (message, type) => {
        Toast.show({
            text: message,
            duration: 5000,
            type: type,
            buttonText: 'Close',
        });
    };

    componentDidMount() {
        this.updateTitle = this.props.navigation.addListener('willFocus', async () => {
            this.getDataUser();
        });
        this.updateBoard = this.props.navigation.addListener('willFocus', async () => {
            this.fetchData();
        });
        this.getDataUser();
        this.fetchData();
        this.handlePragma();
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.updateBoard.remove();
        this.updateTitle.remove();
    }

    handlePragma = () => {
        db.executeSql('PRAGMA foreign_keys = ON;', []);
    };

    handleDeleteBoard = async (id) => {
        try {
            results = await DB.executeSql('DELETE FROM boards WHERE id=?', [id]);
            //console.log('Deleted board: ', results.rowsAffected);
            if (results.rowsAffected > 0) {
                this.toastMessage('Delete board success', 'success');
                this._isMounted &&
                    this.setState((prevState) => ({
                        ...prevState,
                        data: prevState.data.filter(
                            (data) => data.id !== id && data.empty !== true
                        ),
                    }));
                console.log(this.state.data);
            }
        } catch (error) {
            console.log(error);
            this.toastMessage('Something Wrong', 'danger');
        }
    };

    handleDeleteConfirmation = (id, name) => {
        Alert.alert('Delete Board', `Are you sure want to delete ${name} ?`, [
            {
                text: 'CANCEL',
                style: 'cancel',
                onPress: () => console.log('Cancel delete board'),
            },
            {
                text: 'DELETE',
                style: 'destructive',
                onPress: () => this.handleDeleteBoard(id),
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
                        userName: results.rows.item(0).username,
                    });
            }
        } catch (error) {
            console.log(error);
        }
    };

    fetchData = async () => {
        try {
            results = await DB.executeSql('SELECT * FROM boards', []);
            let len = results.rows.length;
            if (len >= 0) {
                var data = results.rows.raw();
                if (this._isMounted) {
                    this.setState({
                        data: data,
                    });
                }
            }
            if (this._isMounted) {
                this.setState({ loading: false, isRefreshing: false });
            }
        } catch (error) {
            console.log(error);
            this.toastMessage(error, 'danger');
            if (this._isMounted) {
                this.setState({ loading: false, isRefreshing: false });
            }
        }
    };

    onRefresh() {
        this.setState({ isRefreshing: true, loading: true });
        this.fetchData();
    }

    handleToggleDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    handleToSearch = () => {
        this.props.navigation.navigate('Search');
    };

    handleToAddBoard = () => {
        this.props.navigation.navigate('AddBoard', { board_id: '' });
    };

    renderItem = ({ item, index }) => {
        if (item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <View style={styles.item}>
                <TouchableNativeFeedback
                    onPress={() =>
                        this.props.navigation.navigate('Cards', {
                            board_id: item.id,
                            name_board: item.name,
                        })
                    }
                    onLongPress={() => this.handleDeleteConfirmation(item.id, item.name)}
                >
                    <View style={styles.itemContent}>
                        <Text style={styles.board}>{item.name}</Text>
                        <Text style={styles.description}>
                            {item.description ? item.description : ''}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    };

    render() {
        return (
            <Container style={styles.container}>
                <Animated.View style={styles.head}>
                    <Header androidStatusBarColor="#34a869" noShadow style={styles.header}>
                        <Left>
                            <Button transparent onPress={this.handleToggleDrawer}>
                                <Icon name="md-menu" style={styles.icon} />
                            </Button>
                        </Left>
                        <Body />
                        <Right>
                            <Button transparent onPress={this.handleToSearch}>
                                <Icon name="md-search" style={styles.icon} />
                            </Button>
                            <Button transparent onPress={this.handleToAddBoard}>
                                <Icon name="md-add" style={styles.icon} />
                            </Button>
                        </Right>
                    </Header>
                    <Text style={styles.title}>KataNote</Text>
                    <Text style={styles.subtitle}>
                        {this.state.userName
                            ? `Howdy, ${this.state.userName}`
                            : 'your private catalogs and notes'}
                    </Text>
                </Animated.View>
                {this.state.loading ? (
                    <Spinner style={styles.spinner} />
                ) : (
                    <AnimatedFlatList
                        bounces={false}
                        scrollEventThrottle={16}
                        onScroll={Animated.event([
                            {
                                nativeEvent: {
                                    contentOffset: { y: scrollY },
                                },
                            },
                        ])}
                        data={formatData(this.state.data, numColumns)}
                        //extraData={this.state.refresh}
                        ListEmptyComponent={
                            <View style={styles.blankSpace}>
                                <Text style={styles.blank}>Didn't find any data...</Text>
                                <Text style={styles.blank}>Add something above!</Text>
                            </View>
                        }
                        extraData={this.state}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                        contentContainerStyle={styles.list}
                        renderItem={this.renderItem}
                        numColumns={numColumns}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                )}
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
        backgroundColor: 'transparent',
    },
    head: {
        backgroundColor: MAIN_COLOR,
        //paddingBottom: 50,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        elevation: 1000,
        zIndex: 50,
        transform: [{ translateY: headerY }],
        //marginBottom: 20
    },
    list: {
        paddingTop: HEADER_HEIGHT + 10,
        padding: 10,
        backgroundColor: 'transparent',
    },
    titlePage: {
        //paddingBottom: 20
        //backgroundColor: '#39b772',
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
        color: 'white',
    },
    icon: {
        color: 'white',
        fontSize: 27,
    },
    item: {
        backgroundColor: 'white',
        margin: 10,
        //padding: 15,
        borderRadius: 5,
        flex: 1,
        elevation: 3,
        height: Dimensions.get('window').width / numColumns,
    },
    itemInvisible: {
        backgroundColor: 'transparent',
        elevation: 0,
    },
    itemContent: {
        height: Dimensions.get('window').width / numColumns,
        padding: 15,
    },
    board: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
        color: '#1e1e1e',
    },
    description: {
        fontSize: 12,
        fontWeight: '300',
        color: '#5e5e5e',
    },
    spinner: {
        color: MAIN_COLOR,
        //flex:1,
        //paddingTop: HEADER_HEIGHT+50,
        position: 'absolute',
        top: Dimensions.get('window').height / 2,
        left: 0,
        right: 0,
        zIndex: 50,
    },
    blankSpace: {
        height: Dimensions.get('window').height / 2 + HEADER_HEIGHT,
        justifyContent: 'center',
        alignContent: 'center',
    },
    blank: {
        textAlign: 'center',
        color: '#a5a5a5',
        fontSize: 16,
    },
});
