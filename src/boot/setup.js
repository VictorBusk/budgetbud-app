import {Font, AppLoading} from 'expo';
import React, {Component} from 'react';
import firebase from 'firebase';
import I18n from 'ex-react-native-i18n';
import firebaseConfig from "../config/firebase_config";
import {StyleProvider} from 'native-base';
import getTheme from "../theme/components";
import variables from "../theme/variables/commonColor";
import {connect} from 'react-redux';
import {
    removeConnectionChangeEventListener,
    addConnectionChangeEventListener
} from '../helpers';
import App from "../App";
import {
    getBudgetID,
    getCategoryAlarms,
    getExpensesOfMonth
} from "../redux/actions";

class Setup extends Component {
    state = {isReady: false, isAuthorized: false, isOffline: false};

    async componentWillMount() {
        await Promise.all([I18n.initAsync(), this.loadFonts()])
    }

    componentWillUnmount() {
        removeConnectionChangeEventListener(this.handleConnectivityChange);
    }

    componentDidMount() {
        addConnectionChangeEventListener(this.handleConnectivityChange);
        firebase.initializeApp(firebaseConfig);

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.getBudgetID(user, (budgetID) => {
                    if (budgetID) {
                        this.props.getCategoryAlarms(budgetID);
                        this.props.getExpensesOfMonth();
                    }

                    this.setState({...this.state, isReady: true, isAuthorized: true});
                });
            } else {
                this.setState({...this.state, isReady: true, isAuthorized: false});
            }
        });
    }

    handleConnectivityChange = (connectionInfo) => {
        if (connectionInfo.type === 'none') {
            this.setState({...this.state, isReady: true, isOffline: true});
            removeConnectionChangeEventListener(this.handleConnectivityChange);
        }
    };

    loadFonts() {
        Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            'Ionicons': require('native-base/Fonts/Ionicons.ttf')
        });
    }

    render() {
        if (!this.state.isReady)
            return <AppLoading/>;

        return (
            <StyleProvider style={getTheme(variables)}>
                <App isOffline={this.state.isOffline}
                     isAuthorized={this.state.isAuthorized}
                     initialBudgetRoute={this.props.initialBudgetRoute}/>
            </StyleProvider>
        );
    }
}

const mapDispatchToProps = {
    getBudgetID, getExpensesOfMonth, getCategoryAlarms
};

export default connect(null, mapDispatchToProps)(Setup);
