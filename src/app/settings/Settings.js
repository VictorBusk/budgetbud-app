import React, {Component} from 'react';
import {
    Container,
    Content,
    List,
    ListItem,
    Label,
    Body,
    Left,
    Right,
    Icon
} from "native-base";
import {AppHeader, ConfirmDialog} from "../../components";
import {connect} from "react-redux";
import I18n from "../../strings/i18n";
import {container, color} from "../../style";
import {showWarningToast} from "../../helpers";
import {
    deleteBudget,
    resetBudgetError,
    getBudgetAlarms,
    getAccounts
} from "../../redux/actions";
import {debounce} from "lodash";

class Settings extends Component {
    componentWillMount() {
        if (!this.props.budgetAlarmsInitialized && this.props.budgetID)
            this.props.getBudgetAlarms(this.props.budgetID);

        if (!this.props.accountsInitialized)
            this.props.getAccounts();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.budgetError) {
            showWarningToast(nextProps.budgetError);
            this.props.resetBudgetError();
        }
    }

    deleteBudget = () => {
        const {budgetID} = this.props;
        this.props.deleteBudget({budgetID});
    };

    render() {
        return (
            <Container style={container.signedInContainer}>
                <ConfirmDialog
                    title={I18n.t('confirmDialogDeletionHeader')}
                    text={I18n.t('settingsConfirmDialogBody')}
                    confirmCallback={() => this.deleteBudget()}
                    loading={this.props.budgetLoading}
                    ref={(confirmDialog) => {
                        this.confirmDialog = confirmDialog
                    }}
                />

                <Container>
                    <AppHeader headerText={I18n.t('settingsHeader')}
                               infoText={I18n.t('settingsInfo')}
                               onLeftButtonPress={() => this.props.navigation.navigate("DrawerOpen")}/>

                    <Content>
                        <List>
                            <ListItem icon onPress={debounce(() => {
                                this.props.navigation.navigate("UserDetails")}, 400)}>
                                <Left>
                                    <Icon style={color.darkIcon} name="md-person"/>
                                </Left>
                                <Body>
                                <Label style={color.text}>{I18n.t('settingsUserDetails')}</Label>
                                </Body>
                                <Right>
                                    <Icon name="arrow-forward"/>
                                </Right>
                            </ListItem>
                            <ListItem icon onPress={debounce(() => {
                                this.props.navigation.navigate("Accounts")}, 400)}>
                                <Left>
                                    <Icon style={color.darkIcon} name="md-card"/>
                                </Left>
                                <Body>
                                <Label style={color.text}>{I18n.t('settingsAccounts')}</Label>
                                </Body>
                                <Right>
                                    <Icon name="arrow-forward"/>
                                </Right>
                            </ListItem>
                            <ListItem icon onPress={debounce(() => {
                                this.props.navigation.navigate("Alarms")}, 400)}>
                                <Left>
                                    <Icon style={color.darkIcon} name="md-notifications-outline"/>
                                </Left>
                                <Body>
                                <Label style={color.text}>{I18n.t('settingsAlarms')}</Label>
                                </Body>
                                <Right>
                                    <Icon name="arrow-forward"/>
                                </Right>
                            </ListItem>
                            <ListItem icon onPress={() => this.confirmDialog.showDialog()}>
                                <Left>
                                    <Icon style={color.darkIcon} name="md-trash"/>
                                </Left>
                                <Body>
                                <Label style={color.text}>{I18n.t('settingsDeleteBudget')}</Label>
                                </Body>
                                <Right>
                                    <Icon name="arrow-forward"/>
                                </Right>
                            </ListItem>
                        </List>
                    </Content>
                </Container>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    const {accountsInitialized} = state.account;
    const {budgetAlarmsInitialized} = state.alarm;
    const {budgetID, budgetError, budgetLoading} = state.budget;

    return {
        budgetID,
        budgetError,
        budgetAlarmsInitialized,
        accountsInitialized,
        budgetLoading
    };
};

const mapDispatchToProps = {
    deleteBudget,
    resetBudgetError,
    getBudgetAlarms,
    getAccounts
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
