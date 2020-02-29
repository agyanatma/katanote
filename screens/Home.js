import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, FlatList } from 'react-native'
import { Container, Header, Icon, Left, Right, Body, Button } from 'native-base'


const data = [
    { id: 1, board: 'Electronics', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, board: 'Stationary', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 3, board: 'Acessories', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 4, board: 'Electronics', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 5, board: 'Stationary', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
];

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

export default class Home extends Component {
    // constructor(){
    //     super(props);
    //     this.state = {
    //         loading: false,
    //         data: [],
    //         error: null
    //     };
    // }

    // componentDidMount(){

    // }

    renderItem = ({ item, index }) => {
        if (item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <View style={styles.item} >
                <Text style={styles.board}>{item.board}</Text>
                <Text style={styles.description}>{item.desc}</Text>
            </View>
        );
    };

    render() {
        return (
            <Container style={styles.container}>
                <Header androidStatusBarColor='#34a869' noShadow style={styles.container}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                            <Icon name='menu' style={styles.icon} />
                        </Button>
                    </Left>
                    <Body/>
                    <Right>
                        <Button transparent onPress={() => { }}>
                            <Icon name='search' style={styles.icon} onPress={() => this.props.navigation.navigate('Search')} />
                        </Button>
                        <Button transparent onPress={() => { }}>
                            <Icon name='add' style={styles.icon} onPress={() => this.props.navigation.navigate('AddBoard')} />
                        </Button>
                    </Right>
                </Header>
                <Text style={styles.title}>KataNote</Text>
                <Text style={styles.subtitle}>your private catalogs and notes</Text>
                <FlatList 
                    data={formatData(data, numColumns)}
                    style={styles.list}
                    renderItem={this.renderItem}
                    numColumns={numColumns}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#39b772'
    },
    list: {
        marginTop: 10,
        marginHorizontal: 15
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
        color: 'white',
        marginBottom: 10
    },
    icon: {
        color: 'white'
    },
    item: {
        backgroundColor: 'white',
        margin: 7,
        padding: 15,
        flex: 1,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        height: Dimensions.get('window').width / numColumns
    },
    itemInvisible: {
        backgroundColor: 'transparent',
        elevation: 0
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
    }
})
