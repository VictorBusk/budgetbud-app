import React, {PureComponent} from 'react';
import {View, FlatList} from 'react-native';
import {connect} from 'react-redux';
import _, {debounce} from 'lodash';
import {
    AppHeader,
    ConfirmDialog,
    Separator
} from "../../components";
import {button, text} from "../../style";
import {
    Container,
    Button,
    ListItem,
    Body,
    Right,
    Icon,
    Text,
    Spinner
} from 'native-base';
import I18n from "../../strings/i18n";
import {container, color} from "../../style";
import {showWarningToast} from "../../helpers";
import {
    debtSelected,
    deleteDebt,
    resetDebtError,
    getCategories
} from "../../redux/actions";

class DebtOverview extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (nextProps.debtError) {
            showWarningToast(nextProps.debtError);
            this.props.resetDebtError();
        }
    }

    onCreateDebtPress = () => {
        this.props.navigation.navigate('CreateDebt');
    };

    deleteDebt = async () => {
        this.confirmDialog.dismissDialog();
        await this.props.deleteDebt(this.props.selectedDebt);
        await this.props.getCategories(this.props.budgetID);
    };

    onDebtSelect = (debt) => {
        this.props.debtSelected(debt);
    };

    render() {
        return (
            <Container style={container.signedInContainer}>
                <ConfirmDialog
                    title={I18n.t('confirmDialogDeletionHeader')}
                    text={I18n.t('debtOverviewConfirmDialogBody')}
                    confirmCallback={() => this.deleteDebt()}
                    debtLoading={this.props.debtLoading}
                    ref={(confirmDialog) => {
                        this.confirmDialog = confirmDialog
                    }}
                />

                <Container>
                    <AppHeader headerText={I18n.t('debtOverviewHeader')}
                               infoText={I18n.t('debtOverviewInfo')}
                               showBackButton={true}
                               onLeftButtonPress={() => this.props.navigation.pop()}/>

                    <Container style={{flex: 4, justifyContent: 'center'}}>
                        {this.props.debtLoading ? (
                            <Spinner style={{
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} color='#1c313a'/>) : (
                            <FlatList
                                data={this.props.debts}
                                renderItem={this.renderItem}
                            />
                        )}
                    </Container>

                    <Separator/>

                    <Button rounded
                            onPress={debounce(() => {
                                this.onCreateDebtPress()
                            }, 400)}
                            style={[button.defaultButton, color.button]}
                    >
                        <Text style={text.submitButtonText}>{I18n.t('debtOverviewCreateDebtButton')}</Text>
                    </Button>
                </Container>
            </Container>
        );
    }

    renderItem = ({item}) => {
        return (
            <ListItem>
                <Body>
                <Text style={color.text}>{item.name}</Text>
                <Text note>{item.totalAmount} {I18n.t('currency')}</Text>
                </Body>
                <Right>
                    <View style={{flexDirection: 'row'}}>
                        <Icon
                            onPress={debounce(() => {
                                this.onDebtSelect(item);
                                this.props.navigation.navigate('EditDebt');
                            }, 400)}
                            style={{marginRight: 7, fontSize: 30}}
                            name="md-create"/>
                        <Icon
                            onPress={() => {
                                this.onDebtSelect(item);
                                this.confirmDialog.showDialog()
                            }}
                            style={{marginHorizontal: 7, fontSize: 30}}
                            name="md-trash"/>
                    </View>
                </Right>
            </ListItem>
        );
    }
}

const mapStateToProps = (state) => {
    const budgetID = state.budget.budgetID;
    const {debtLoading, selectedDebt, debtError} = state.debt;

    const debts = _.map(state.debt.debts, (item, key) => {
        return {...item.debtData, debtID: item.id, key: key};
    });

    return {budgetID, debts, debtLoading, selectedDebt, debtError};
};

const mapDispatchToProps = {
    debtSelected, deleteDebt, getCategories, resetDebtError
};

export default connect(mapStateToProps, mapDispatchToProps)(DebtOverview);
