import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, FlatList, TouchableNativeFeedback } from 'react-native'
import { Container, Header, Icon, Left, Right, Body, Button, Spinner } from 'native-base'
import Animated from 'react-native-reanimated'
import DB from '../database';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
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
    outputRange: [0, -HEADER_HEIGHT]
})

export default class Home extends Component {

    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            data: [],
            fetch: false,
            loading: false,
            showToast: false
        }
    };

    toastMessage = (message, type) => {
        Toast.show({
            text: message,
            duration: 5000,
            type: type,
            buttonText: 'Close',
        });
    }

    componentDidMount(){
        this.fetchData();
        this.setState({loading: true});
        this._isMounted = true;
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    fetchData = async () => {
        try {
            results = await DB.executeSql("SELECT * FROM boards ORDER BY id DESC", []);
            var len = results.rows.length;
            if(len > 0){
                var data = results.rows.raw();
                if(this._isMounted){
                    this.setState({
                        data: data
                    });
                }
            }
            if(this._isMounted){
                this.setState({loading: false})
            }
        } catch (error) {
            console.log(error);
            this.toastMessage(error, 'danger');
        }
    }

    renderItem = ({ item, index }) => {
        if (item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <View style={styles.item} >
                <TouchableNativeFeedback onPress={() => this.props.navigation.navigate('Cards', {board_id : item.id, name_board: item.name})}>
                    <View style={styles.itemContent}>
                        <Text style={styles.board}>{item.name}</Text>
                        <Text style={styles.description}>{item.description ? item.description : ""}</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    };

    render() {
        return (
            <Container style={styles.container}>
                <Animated.View style={styles.head}>
                    <Header androidStatusBarColor='#34a869' noShadow style={styles.header}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                                <Icon name='md-menu' style={styles.icon} />
                            </Button>
                        </Left>
                        <Body/>
                        <Right>
                            <Button transparent onPress={() => this.props.navigation.navigate('Search')}>
                                <Icon name='md-search' style={styles.icon}/>
                            </Button>
                            <Button transparent onPress={() => this.props.navigation.navigate('AddBoard')}>
                                <Icon name='md-add' style={styles.icon}/>
                            </Button>
                        </Right>
                    </Header>
                    <Text style={styles.title}>KataNote</Text>
                    <Text style={styles.subtitle}>your private catalogs and notes</Text>
                </Animated.View>
                {
                    this.state.loading ? <Spinner style={styles.spinner}/> :
                    <AnimatedFlatList
                        bounces={false}
                        scrollEventThrottle={16}
                        onScroll={Animated.event([
                            {
                                nativeEvent:{contentOffset: {y: scrollY}}
                            }
                        ])}
                        data={formatData(this.state.data, numColumns)}
                        //extraData={this.state.refresh}
                        ListEmptyComponent={<Text style={styles.blank}>Data kosong</Text>}
                        contentContainerStyle={styles.list}
                        renderItem={this.renderItem}
                        numColumns={numColumns}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                }
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
        flex:1
    },
    header: {
        backgroundColor: 'transparent'
    },
    head: {
        backgroundColor: MAIN_COLOR,
        //paddingBottom: 50,
        position: 'absolute',
        top:0,
        left:0,
        right:0,
        height: HEADER_HEIGHT,
        elevation: 1000,
        zIndex: 50,
        transform: [{ translateY: headerY }]
        //marginBottom: 20
    },
    list: {
        paddingTop: HEADER_HEIGHT + 10,
        padding: 10,
        backgroundColor: 'transparent'
    },
    titlePage: {
        //paddingBottom: 20
        //backgroundColor: '#39b772',
    }, 
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
        color: 'white'
    },
    icon: {
        color: 'white',
        fontSize: 27
    },
    item: {
        backgroundColor: 'white',
        margin: 10,
        //padding: 15,
        borderRadius: 5,
        flex:1,
        elevation: 3,
        height: Dimensions.get('window').width / numColumns
    },
    itemInvisible: {
        backgroundColor: 'transparent',
        elevation: 0
    },
    itemContent: {
        height: Dimensions.get('window').width / numColumns,
        padding: 15
    },
    board: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
        color: '#1e1e1e'
    },
    description: {
        fontSize: 12,
        fontWeight: '300',
        color: '#5e5e5e'
    },
    spinner: {
        color: MAIN_COLOR,
        //flex:1,
        //paddingTop: HEADER_HEIGHT+50,
        position: 'absolute',
        top: Dimensions.get('window').height / 2,
        left:0,
        right:0,
        zIndex: 50,
    },
    blank: {
        paddingTop: Dimensions.get('window').height / 2 - HEADER_HEIGHT,
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center'
    }
})
