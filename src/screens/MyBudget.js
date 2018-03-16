import React, {Component} from 'react';
import {Body, Button, Container, Form, Icon, ListItem, Text, View, Label} from "native-base";
import AppHeader from "../components/AppHeader";
import Separator from "../components/Separator";
import {FlatList} from "react-native";
import {connect} from "react-redux";
import {openDrawer} from "../actions/budget_actions";
import Modal from 'react-native-modalbox';
import {AsyncStorage} from 'react-native';


class MyBudget extends Component {
    render() {
        return (
            <Container style={{alignItems: 'stretch'}}>
                {/*---HEADER---*/}
                <AppHeader headerText={'Mit budget'}
                           onLeftButtonPress={() => this.props.navigation.navigate("DrawerOpen")}/>

                <Container>
                    {/*---INCOME FIELD<---*/}
                    <Form style={{flexGrow: 1, alignSelf: 'stretch'}}>
                        <View style={[styles.leftContainer, {
                            justifyContent: 'space-between',
                            marginTop: 20,
                            alignSelf: 'center'
                        }]}>
                            <Text style={[styles.textStyle, {flex: 1}]}>Indkomst:</Text>
                            <Text style={[styles.textStyle, {flex: 1}]}>{this.props.income} KR</Text>
                        </View>
                    </Form>

                    <Separator/>

                    {/*---CATEGORY LISTVIEW---*/}
                    <Form style={{flex: 4, alignItems: 'stretch'}}>
                        <FlatList
                            data={this.props.category}
                            extraData={this.props.categoryValue}
                            renderItem={this.renderCategory}
                            keyExtractor={item => item.name}
                            style={styles.listStyle}
                        />
                    </Form>

                    <Separator/>

                    {/*---DEBT LISTVIEW---*/}
                    <Form style={{flex: 2, alignSelf: 'stretch'}}>
                        <FlatList
                            data={this.props.debt}
                            renderItem={this.renderDebt}
                            keyExtractor={item => item.name}
                            style={styles.listStyle}
                        />
                    </Form>

                    <Separator/>


                    {/*---CALCULATED TOTAL---*/}
                    <View style={{flexGrow: 2}}>
                        <Form style={{flexGrow: 2, alignSelf: 'stretch'}}>
                            <View style={[styles.leftContainer, {marginTop: 10}]}>
                                <Text style={[styles.textStyle, {flex: 1}]}>Totale udgifter:</Text>
                                <Text style={[styles.textStyle, {flex: 1}]}>{this.props.expenses} KR</Text>
                            </View>
                            <View style={[styles.leftContainer]}>
                                <Text style={[styles.textStyle, {flex: 1}]}>Til rådighed:</Text>
                                <Text style={[styles.textStyle, {flex: 1}]}>{this.props.disposable} KR</Text>
                            </View>

                            <Button transparent
                                    onPress={() => this.refs.bottomModal.open()}
                                    style={styles.buttonStyle}
                            >
                                <Icon name="ios-arrow-dropup-circle"
                                            style={{color: "#1c313a"}}/>
                            </Button>
                        </Form>


                        <Modal style={styles.modal} position={"bottom"} ref={"bottomModal"}>
                            <Label style={[styles.textStyle, {alignSelf: 'center', marginTop: 10}]}>Redigér:</Label>
                            <Form style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginHorizontal: 40}}>
                                <Button
                                    transparent
                                    onPress={() => this.props.navigation.navigate("EditBudget")}
                                >
                                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                        <Icon name="md-clipboard" style={{color: "#1c313a"}}/>
                                        <Label style={styles.textStyle}>Budget</Label>
                                    </View>
                                </Button>

                                <Button
                                    transparent
                                    onPress={() => this.props.navigation.navigate("EditDisposable")}
                                >
                                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                        <Icon name="logo-usd" style={{color: "#1c313a"}}/>
                                        <Label style={styles.textStyle}>Rådighedsbeløb</Label>
                                    </View>
                                </Button>

                                <Button
                                    transparent
                                    onPress={() => this.props.navigation.navigate("DebtOverview")}
                                >
                                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                        <Icon name="ios-archive" style={{color: "#1c313a"}}/>
                                        <Label style={styles.textStyle}>Gæld</Label>
                                    </View>
                                </Button>
                            </Form>
                            <Button transparent
                                    onPress={() => this.refs.bottomModal.close()}
                                    style={styles.buttonStyle}
                            >
                                <Icon name="ios-arrow-dropdown-circle"
                                            style={{color: "#1c313a"}}/>
                            </Button>
                        </Modal>
                    </View>
                </Container>

            </Container>

        );
    }

    renderCategory = ({item, index}) => {
        return (
            <ListItem>
                <Body>
                <View style={styles.leftContainer}>
                    <Text style={[styles.textStyle, {flex: 1}]}>{item.name + ":"}</Text>
                    <Text style={[styles.textStyle, {flex: 1}]}>{item.value} KR</Text>
                </View>
                </Body>
            </ListItem>
        );
    };

    renderDebt = ({item, index}) => {
        return (
            <ListItem>
                <Body>
                <View style={styles.leftContainer}>
                    <Text style={[styles.textStyle, {flex: 1}]}>{item.name + ":"}</Text>
                    <Text style={[styles.textStyle, {flex: 1}]}>{item.value} KR</Text>
                </View>
                </Body>
            </ListItem>
        );
    };
}

const styles = {
    buttonStyle: {
        justifyContent: 'flex-end',
        alignSelf: 'flex-end'
    },
    incomeFormStyle: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 5,
        width: '90%'
    },
    itemStyle: {
        fontWeight: '600',
        alignSelf: 'flex-start',
        color: 'white'
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: '5%',
        marginRight: '5%'
    },
    listStyle: {
        marginLeft: 0,
        marginRight: 0,
        padding: 0
    },
    textStyle: {
        fontWeight: '400',
        fontSize: 14,
        alignSelf: 'flex-start',
        marginLeft: 5,
    },
    inputStyle: {
        borderColor: '#001',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 0,
        paddingRight: 0,
        alignSelf: 'center',
        height: 40
    },
    modalStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        backgroundColor: '#166a97'
    }
};

const mapStateToProps = ({budget}) => {
    const {income, categoryValue, category, debt, expenses, disposable, estimatedIncome} = budget;
    return {income, categoryValue, category, debt, expenses, disposable, estimatedIncome}
};

export default connect(mapStateToProps, {
    openDrawer
})(MyBudget);
