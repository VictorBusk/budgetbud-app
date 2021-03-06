import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
    AppHeader,
    Separator
} from "../../components/index";
import {
    Container,
    ListItem,
    Body,
    Right,
    Text,
    Spinner,
    CheckBox,
    Button,
    List, Content
} from 'native-base';
import I18n from "../../strings/i18n";
import {
    button,
    text,
    list,
    container, color
} from "../../style/index";
import {showWarningToast} from "../../helpers/index";
import {
    budgetExceededToggled,
    getBudgetAlarms,
    resetAlarmsError,
    toggleBudgetAlarms,
    weeklyStatusToggled
} from "../../redux/actions";

class Alarms extends PureComponent {
    componentWillMount() {
        if (!this.props.budgetAlarmsInitialized && this.props.budgetID)
            this.props.getBudgetAlarms(this.props.budgetID);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.alarmsError) {
            showWarningToast(nextProps.alarmsError);
            this.props.resetAlarmsError();
        }
    }

    onSavePress = () => {
        if (!this.props.budgetID) {
            showWarningToast(I18n.t('noBudgetCreated'));
        } else {
            this.props.toggleBudgetAlarms(this.props, () => {
                this.props.navigation.pop();
            });
        }
    };

    onBudgetExceededPress = () => {
        this.props.budgetExceededToggled(this.props.budgetExceeded);
    };

    onWeeklyStatusPress = () => {
        this.props.weeklyStatusToggled(this.props.weeklyStatus);
    };

    render() {
        return (
            <Container style={container.signedInContainer}>
                <AppHeader headerText={I18n.t('alarmsHeader')}
                           infoText={I18n.t('alarmsInfo')}
                           showBackButton={true}
                           onLeftButtonPress={() => {
                               if (!this.props.toggleLoading)
                                   this.props.navigation.pop()
                           }}/>

                <Container style={{justifyContent: 'center'}}>
                    {this.props.alarmsLoading ? (
                        <Spinner style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }} color='#1c313a'/>) : (
                        <Content>
                            <List>
                                <ListItem>
                                    <Body>
                                    <Text style={color.text}>{I18n.t('alarmsNotifyBudgetExceeded')}</Text>
                                    </Body>
                                    <Right style={list.listItemCheckBoxPadding}>
                                        <CheckBox
                                            style={this.props.budgetExceeded ?
                                                color.checkboxChecked : color.checkboxUnchecked}
                                            checked={this.props.budgetExceeded}
                                            onPress={() => this.onBudgetExceededPress()}
                                        />
                                    </Right>
                                </ListItem>
                                <ListItem>
                                    <Body>
                                    <Text style={color.text}>{I18n.t('alarmsNotifyWeeklyStatus')}</Text>
                                    </Body>
                                    <Right style={list.listItemCheckBoxPadding}>
                                        <CheckBox
                                            style={this.props.weeklyStatus ?
                                                color.checkboxChecked : color.checkboxUnchecked}
                                            checked={this.props.weeklyStatus}
                                            onPress={() => this.onWeeklyStatusPress()}
                                        />
                                    </Right>
                                </ListItem>
                            </List>
                        </Content>
                    )}
                </Container>

                <Separator/>

                <Button rounded
                        onPress={() => {
                            if (!this.props.toggleLoading ||
                                !this.props.alarmsLoading) {
                                this.onSavePress()
                            }
                        }}
                        style={[button.defaultButton, color.button]}
                >
                    {this.props.toggleLoading ? (
                        <Spinner color='#D0D0D0'/>) : (
                        <Text style={text.submitButtonText}>{I18n.t('alarmsSaveButton')}</Text>
                    )}
                </Button>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    const {budgetID} = state.budget;

    const {
        alarmsLoading,
        toggleLoading,
        budgetExceeded,
        weeklyStatus,
        alarmsError,
        budgetAlarmsInitialized
    } = state.alarm;

    return {
        budgetID,
        alarmsLoading,
        toggleLoading,
        budgetExceeded,
        weeklyStatus,
        alarmsError,
        budgetAlarmsInitialized
    };
};

const mapDispatchToProps = {
    budgetExceededToggled,
    weeklyStatusToggled,
    getBudgetAlarms,
    toggleBudgetAlarms,
    resetAlarmsError
};

export default connect(mapStateToProps, mapDispatchToProps)(Alarms);
