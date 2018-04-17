import axios from 'axios';
import firebase from 'firebase';
import {BUDGETBUD_FUNCTIONS_URL} from "../config/firebase_config";

import {
    GET_INITIAL_AUTH_STATE,
    CPR_NUMBER_CHANGED,
    PHONE_NUMBER_CHANGED,
    CODE_CHANGED,
    VALIDATE_CPR_NUMBER_FAIL,
    VALIDATE_PHONE_NUMBER_FAIL,
    VALIDATE_CODE_FAIL,
    SIGN_IN,
    SIGN_IN_FAIL,
    SIGN_UP,
    SIGN_UP_FAIL,
    DELETE_USER, GET_INITIAL_STATE,
} from './types';

export const authScreenSwitched = (callback) => async dispatch => {
    dispatch({type: GET_INITIAL_AUTH_STATE});
    callback();
};

export const cprNumberChanged = text => {
    return {
        type: CPR_NUMBER_CHANGED,
        payload: text
    };
};

export const phoneNumberChanged = text => {
    return {
        type: PHONE_NUMBER_CHANGED,
        payload: text
    };
};

export const codeChanged = text => {
    return {
        type: CODE_CHANGED,
        payload: text
    };
};

export const signUp = ({cprNumber, phoneNumber}, callback) => async dispatch => {
    if (cprNumber.length !== 10) {
        dispatch({type: VALIDATE_CPR_NUMBER_FAIL});
        return;
    } else if (phoneNumber.length !== 8) {
        dispatch({type: VALIDATE_PHONE_NUMBER_FAIL});
        return;
    }

    dispatch({type: SIGN_UP});

    try {
        await axios.post(`${BUDGETBUD_FUNCTIONS_URL}/createUser`, {cprNumber});
        await axios.post(`${BUDGETBUD_FUNCTIONS_URL}/requestCode`, {cprNumber, phoneNumber});

        dispatch({type: GET_INITIAL_AUTH_STATE});
        callback();
    } catch (err) {
        let {data} = err.response;
        signUpFail(dispatch, data.error);
    }
};

const signUpFail = (dispatch, error) => {
    dispatch({type: SIGN_UP_FAIL, payload: error});
};

export const signIn = ({cprNumber, code}) => async dispatch => {
    if (cprNumber.length !== 10) {
        dispatch({type: VALIDATE_CPR_NUMBER_FAIL});
        return;
    } else if (code.length !== 4) {
        dispatch({type: VALIDATE_CODE_FAIL});
        return;
    }

    dispatch({type: SIGN_IN});

    try {
        let {data} = await axios.post(`${BUDGETBUD_FUNCTIONS_URL}/verifyCode`, {
            cprNumber, code
        });

        await firebase.auth().signInWithCustomToken(data.token);
    } catch (err) {
        let {data} = err.response;
        signInFail(dispatch, data.error);
    }
};

const signInFail = (dispatch, error) => {
    dispatch({type: SIGN_IN_FAIL, payload: error});
};

export const signOut = () => async dispatch => {
    try {
        await firebase.auth().signOut();

        dispatch({type: GET_INITIAL_STATE});
    } catch (err) {
        let {data} = err.response;
        console.log(data.error);
    }
};

export const deleteUser = (callback) => async dispatch => {
    try {
        dispatch({type: DELETE_USER});
        let token = await firebase.auth().currentUser.getIdToken();
        let uid = await firebase.auth().currentUser.uid;

        await axios.post(`${BUDGETBUD_FUNCTIONS_URL}/deleteUser`, {cprNumber: uid}, {
            headers: { Authorization: 'Bearer ' + token }
        });

        dispatch({type: GET_INITIAL_STATE});
        callback();
    } catch (err) {
        let {data} = err.response;
        console.log(data.error);
    }
};
