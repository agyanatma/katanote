import React, { Component } from 'react';
import { StyleSheet, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import {
    Container,
    Header,
    Left,
    Right,
    Body,
    Button,
    Icon,
    Content,
    Title,
    Item,
    Input,
    Form,
    Textarea,
    Text,
    Spinner,
    ListItem,
} from 'native-base';
import DB from '../database';

const MAIN_COLOR = '#39b772';

export default class AddBoard extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            name_board: '',
            data: [],
            loading: true,
            cancel: false,
            searchHolder: [],
        };
    }

    componentDidMount() {
        this.fetchAll();
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchAll = async () => {
        await this.fetchData();
        await this.fetchCard();
        this._isMounted && this.setState({ loading: false });
    };

    fetchData = async () => {
        const { data, searchHolder } = this.state;
        try {
            results = await DB.executeSql('SELECT id, name FROM boards', []);
            let len = results.rows.length;
            if (len >= 0) {
                var item = results.rows.raw();
                this._isMounted &&
                    this.setState({
                        data: item,
                        searchHolder: item,
                    });
            }
            //console.log(this.state.data);
        } catch (error) {
            console.log(error);
        }
    };

    fetchCard = async () => {
        const { data, searchHolder } = this.state;
        try {
            results = await DB.executeSql(
                'SELECT c.id AS id_card, c.name AS name, b.id AS id_board, b.name AS name_board FROM boards b INNER JOIN cards c ON b.id=c.board_id',
                []
            );
            let len = results.rows.length;
            if (len >= 0) {
                for (let i = 0; i < len; i++) {
                    var item = results.rows.item(i);
                    this._isMounted &&
                        this.setState((prevState) => ({
                            data: [...prevState.data, item],
                            searchHolder: [...prevState.searchHolder, item],
                        }));
                }
            }
            //console.log(this.state.data);
        } catch (error) {
            console.log(error);
        }
    };

    handleSearch = (text) => {
        const { searchHolder } = this.state;
        const searchData = searchHolder.filter((item) => {
            const itemData = `${item.name.toLowerCase()}`;
            const textData = text.toLowerCase();
            return itemData.indexOf(textData) > -1;
        });
        console.log(searchData);

        this.setState({ data: searchData, cancel: true });
    };

    handleToCard = (item) => {
        this.props.navigation.navigate('Cards', {
            board_id: item.id,
            name_board: item.name,
        });
    };

    handleToDetail = (item) => {
        this.props.navigation.navigate('Detail', {
            card_id: item.id,
            board_id: item.id_board,
            name_card: item.name,
            name_board: item.name_board,
        });
    };

    handleGoBack = () => {
        this.props.navigation.goBack();
    };

    renderItem = ({ item, index }) => {
        return (
            <View key={index}>
                <TouchableWithoutFeedback
                    onPress={
                        item.id_board
                            ? this.handleToDetail.bind(this, item)
                            : this.handleToCard.bind(this, item)
                    }
                >
                    <View style={styles.item}>
                        <Icon
                            name={item.id_board ? 'md-card' : 'md-clipboard'}
                            style={styles.icon}
                        />
                        <View style={{ flex: 1, marginHorizontal: 20 }}>
                            <Text style={styles.board} numberOfLines={1} ellipsizeMode="tail">
                                {item.name}
                            </Text>
                        </View>
                        <Icon name="arrow-forward" style={styles.icon} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };

    render() {
        return (
            <Container style={styles.container}>
                <Header androidStatusBarColor="#34a869" searchBar noShadow style={styles.header}>
                    <Item style={styles.search}>
                        <Icon name="md-search" style={styles.icon} />
                        <Input
                            onChangeText={(text) => this.handleSearch(text)}
                            placeholder="Search"
                            placeholderTextColor="#dddd"
                        />
                        <TouchableWithoutFeedback onPress={this.handleGoBack}>
                            <Text style={styles.cancel}>Cancel</Text>
                        </TouchableWithoutFeedback>
                    </Item>
                </Header>
                {this.state.loading ? (
                    <Spinner style={styles.spinner} />
                ) : (
                    <FlatList
                        data={this.state.data}
                        contentContainerStyle={styles.list}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.blankSpace}>
                                <Text style={styles.blank}>Didn't find any data...</Text>
                            </View>
                        }
                    />
                )}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    header: {
        backgroundColor: MAIN_COLOR,
    },
    list: {
        //padding: 5
        //flex: 1,
    },
    search: {
        borderRadius: 10,
    },
    item: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderColor: '#dddd',
        borderBottomWidth: 0.5,
        //backgroundColor: 'white',
        // borderWidth: 0.5,
        // borderColor: '#dddd'
    },
    icon: {
        color: '#a5a5a5',
        fontSize: 21,
    },
    spinner: {
        color: MAIN_COLOR,
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        zIndex: 50,
    },
    cancel: {
        color: '#a5a5a5',
        marginRight: 20,
    },
    board: {
        fontSize: 16,
        color: '#1e1e1e',
    },
    blankSpace: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    blank: {
        textAlign: 'center',
        color: '#a5a5a5',
        fontSize: 16,
    },
});
