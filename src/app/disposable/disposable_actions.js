import axios from 'axios';
import firebase from 'firebase';
import {BUDGETBUD_FUNCTIONS_URL} from "../../config/firebase_config";
import I18n from "../../strings/i18n";

import {
    RESET_DISPOSABLE_FORM,
    RESET_DISPOSABLE_ERROR,
    DISPOSABLE_AMOUNT_CHANGED,
    CALCULATE_DISPOSABLE_CATEGORY_DIFFERENCES,
    EDIT_DISPOSABLE,
    SET_TMP_DISPOSABLE,
    CALCULATE_DISPOSABLE_CATEGORY_DIFFERENCES_SUCCESS,
    EDIT_DISPOSABLE_SUCCESS,
    EDIT_DISPOSABLE_FAIL, CALCULATE_DISPOSABLE_CATEGORY_DIFFERENCES_FAIL,
} from '../../strings/types';

export const resetDisposableForm = () => {
    return {
        type: RESET_DISPOSABLE_FORM
    };
};

export const resetDisposableError = () => {
    return {
        type: RESET_DISPOSABLE_ERROR
    };
};

export const disposableChanged = text => {
    return {
        type: DISPOSABLE_AMOUNT_CHANGED,
        payload: text
    };
};

export const editDisposable = ({tmpDisposable, categoryDisposableItems, budgetID}) => async dispatch => {

    dispatch({type: EDIT_DISPOSABLE});

    try {
        const categories = [];

        categoryDisposableItems.forEach(c => {
            if (c.categoryID !== 'disposable') {
                categories.push({
                    categoryID: c.categoryID,
                    newAmount: c.afterAmount
                });
            }
        });

        const token = await firebase.auth().currentUser.getIdToken();

        await axios.post(`${BUDGETBUD_FUNCTIONS_URL}/editDisposable`,
            {disposable: tmpDisposable, categories, budgetID}, {
                headers: {Authorization: 'Bearer ' + token}
            });

        dispatch({
            type: EDIT_DISPOSABLE_SUCCESS,
            payload: tmpDisposable
        });

    } catch (err) {
        let {data} = err.response;
        dispatch({type: EDIT_DISPOSABLE_FAIL, payload: data.error});
    }
};

export const setTmpDisposable = () => {
    return {type: SET_TMP_DISPOSABLE}
};

export const calculateDisposableCategoryDifferences = (disposable, tmpDisposable, categories, callback) => async dispatch => {
    let errorMsg;
    if (disposable === tmpDisposable) {errorMsg = I18n.t('disposableUnchangedError')}
    else if(categories.length === 0) {errorMsg = I18n.t('noCategoriesChosenError')}

    if (errorMsg) {
        dispatch({type: CALCULATE_DISPOSABLE_CATEGORY_DIFFERENCES_FAIL, payload: errorMsg});
        return;
    }

    dispatch({type: CALCULATE_DISPOSABLE_CATEGORY_DIFFERENCES});

    const disposableDifference = (tmpDisposable - disposable);

    try {
        const token = await firebase.auth().currentUser.getIdToken();

        const {data} = await axios.post(`${BUDGETBUD_FUNCTIONS_URL}/calculateDisposableCategoryDifferences`,
            {categories, disposableDifference}, {headers: {Authorization: 'Bearer ' + token}});

        dispatch({type: CALCULATE_DISPOSABLE_CATEGORY_DIFFERENCES_SUCCESS, payload: data});
        callback();
    } catch (err) {
        let {data} = err.response;
        dispatch({type: CALCULATE_DISPOSABLE_CATEGORY_DIFFERENCES_FAIL, payload: data.error});
    }
};
