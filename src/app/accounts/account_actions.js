import axios from 'axios';
import firebase from 'firebase';
import {
    BUDGETBUD_FUNCTIONS_URL, EBANKING_FUNCTIONS_URL
} from "../../config/firebase_config";

import {
    GET_ACCOUNTS,
    GET_ACCOUNTS_SUCCESS,
    GET_ACCOUNTS_FAIL,
    LINK_ACCOUNTS,
    LINK_ACCOUNTS_SUCCESS,
    LINK_ACCOUNTS_FAIL,
    ACCOUNTS_SELECTED,
    GET_LINKED_ACCOUNTS_SUCCESS,
    GET_LINKED_ACCOUNTS_FAIL,
    GET_LINKED_ACCOUNTS,
    RESET_ACCOUNTS_ERROR
} from '../../strings/types';

export const resetAccountsError = () => {
    return {
        type: RESET_ACCOUNTS_ERROR
    };
};

export const getAccounts = () => async dispatch => {
    dispatch({type: GET_ACCOUNTS});

    try {
        let token = await firebase.auth().currentUser.getIdToken();
        let userID = await firebase.auth().currentUser.uid;

        const promises = [];
        const getAccountsPromise =
            axios.get(`${EBANKING_FUNCTIONS_URL}/getAccounts?userID=${userID}`);

        promises.push(getAccountsPromise);

        let getLinkedAccountsPromise =
            axios.get(`${BUDGETBUD_FUNCTIONS_URL}/getLinkedAccounts?userID=${userID}`,
                {headers: {Authorization: 'Bearer ' + token}});

        promises.push(getLinkedAccountsPromise);

        const values = await Promise.all(promises);
        const eBankingAccounts = values[0].data;
        const linkedAccounts = values[1].data;

        dispatch({
            type: GET_ACCOUNTS_SUCCESS,
            payload: {eBankingAccounts, linkedAccounts}
        });
    } catch (err) {
        let {data} = err.response;
        dispatch({type: GET_ACCOUNTS_FAIL, payload: data.error});
    }
};

export const linkAccounts = (selectedAccounts, callback) => async dispatch => {
    dispatch({type: LINK_ACCOUNTS});

    try {
        let token = await firebase.auth().currentUser.getIdToken();
        let userID = await firebase.auth().currentUser.uid;

        await axios.post(`${BUDGETBUD_FUNCTIONS_URL}/linkAccounts`,
            {eBankingAccIDs: selectedAccounts, userID},
            {headers: {Authorization: 'Bearer ' + token}});

        dispatch({type: LINK_ACCOUNTS_SUCCESS});
        callback();
    } catch (err) {
        let {data} = err.response;
        dispatch({type: LINK_ACCOUNTS_FAIL, payload: data.error});
    }
};

export const accountsSelected = list => {
    return {
        type: ACCOUNTS_SELECTED,
        payload: list
    };
};

export const getLinkedAccounts = () => async dispatch => {
    dispatch({type: GET_LINKED_ACCOUNTS});

    try {
        let token = await firebase.auth().currentUser.getIdToken();
        let userID = await firebase.auth().currentUser.uid;

        let {data} =
            await axios.get(`${BUDGETBUD_FUNCTIONS_URL}/getLinkedAccounts?userID=${userID}`,
                {headers: {Authorization: 'Bearer ' + token}});

        dispatch({
            type: GET_LINKED_ACCOUNTS_SUCCESS,
            payload: data
        });
    } catch (err) {
        let {data} = err.response;
        dispatch({type: GET_LINKED_ACCOUNTS_FAIL, payload: data.error});
    }
};
