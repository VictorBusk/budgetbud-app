import React, {Component} from 'react';
import {Keyboard} from 'react-native';
import {Container} from 'native-base';
import {connect} from 'react-redux';
import {BudgetForm, AppHeader} from "../components/";
import I18n from "../strings/i18n";
import {
    editBudget,
    incomeChanged,
    categoryChanged
} from "../actions";
import * as _ from "lodash";

class EditBudget extends Component {
    onIncomeChange = (text) => {
        this.props.incomeChanged(text);
    };

    onCategoryChange = (text) => {
        this.props.categoryChanged(text);
    };

    handleSubmit = () => {
        Keyboard.dismiss();

        this.props.editBudget(this.props, () => {
            this.props.navigation.navigate.pop();
        });
    };

    testInput = (income, categories) => {
        let allowedRegex = /^[+-]?(?=.)(?:\d+,)*\d*(?:\.\d+)?$/;
        if (!allowedRegex.test(income))
            return false;

        categories.forEach(c => {
            if (!allowedRegex.test(c.amount))
                return false;
        });
        return true;
    };

    render() {
        return (
            <Container style={[{alignItems: 'stretch'}]}>
                <AppHeader headerText={I18n.t('editBudgetHeader')}
                           showBackButton={true}
                           onLeftButtonPress={() => this.props.navigation.pop()}/>

                <BudgetForm handleSubmit={this.handleSubmit}
                            onIncomeChanged={this.onIncomeChange}
                            onCategoryChanged={this.onCategoryChange}
                            testInput={this.testInput}
                            income={this.props.income}
                            totalExpenses={this.props.totalExpenses}
                            disposable={this.props.disposable}
                            categories={this.props.categories}
                            debt={this.props.debt}
                            loading={this.props.loading}
                            error={this.props.error}
                />
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        income,
        debt,
        totalExpenses,
        disposable,
        loading,
        error
    } = state.budget;

    const categoryItems = _.map(state.category.categories, (item, key) => {
        return {...item.categoryData, categoryID: item.id, key: key};
    });

    return {
        income,
        debt,
        totalExpenses,
        disposable,
        loading,
        error,
        categoryItems
    };
};

const mapDispatchToProps = {
    editBudget,
    incomeChanged,
    categoryChanged
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBudget);
