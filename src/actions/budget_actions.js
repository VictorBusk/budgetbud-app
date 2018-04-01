import axios from 'axios';
import firebase from 'firebase';
import {cloudFunctionsURL} from "../config/firebase_config";
import {
    INCOME_CHANGED,
    CATEGORY_CHANGED,
    CREATE_BUDGET,
    CREATE_BUDGET_FAIL,
    GET_BUDGET,
    GET_BUDGET_FAIL,
    GET_BUDGET_SUCCESS,
    CREATE_BUDGET_SUCCESS,
    DELETE_BUDGET,
    GET_INITIAL_BUDGET_STATE,
    GET_ACCOUNT_DATA,
    EDIT_BUDGET,
    EDIT_BUDGET_SUCCESS,
    EDIT_BUDGET_FAIL,
    GET_BUDGET_ID_FAIL,
    GET_BUDGET_ID_SUCCESS
} from './types';

const ROOT_URL = cloudFunctionsURL;

export const getBudgetID = (user) => async dispatch => {
        try {
            let token = await user.getIdToken();
            console.log(token);

            const {data} = await axios.get(`${ROOT_URL}/getBudgetID?userID=${user.uid}`,
                {headers: {Authorization: 'Bearer ' + token}});

            dispatch({type: GET_BUDGET_ID_SUCCESS, payload: data.id})
        } catch (err) {
            let {data} = err.response;
            getBudgetIDFail(dispatch, data.error)
        }
    };

const getBudgetIDFail = (dispatch, error) => {
    dispatch({type: GET_BUDGET_ID_FAIL, payload: error});
};

export const createBudget = ({income, categories, totalExpenses, disposable}, callback) =>
    async dispatch => {
        if (income.length === 0)
            income = 0;

        dispatch({type: CREATE_BUDGET});

        try {
            let token = await firebase.auth().currentUser.getIdToken();
            let userID = await firebase.auth().currentUser.uid;

            await axios.post(`${ROOT_URL}/createBudget`,
                {userID, income, categories, totalExpenses, disposable},
                {headers: {Authorization: 'Bearer ' + token}});

            dispatch({type: CREATE_BUDGET_SUCCESS, payload: {income, categories, totalExpenses, disposable}});

            callback();
        } catch (err) {
            let {data} = err.response;
            createBudgetFail(dispatch, data.error)
        }
    };

const createBudgetFail = (dispatch, error) => {
    dispatch({type: CREATE_BUDGET_FAIL, payload: error});
};

export const getBudget = (budgetID, callBack) => async dispatch => {
    console.log("BudgetID fra getBudget: " + budgetID)

    try {
        if (budgetID === '')
            callBack();

        dispatch({type: GET_BUDGET});

        let token = await firebase.auth().currentUser.getIdToken();

        let budgetResponse = await axios.get(`${ROOT_URL}/getBudget?budgetID=${budgetID}`,
            {headers: {Authorization: 'Bearer ' + token}});

        dispatch({
            type: GET_BUDGET_SUCCESS,
            payload: budgetResponse.data.budgetData
        });

    } catch (err) {
        let {data} = err.response;
        getBudgetFail(dispatch, data.error)
    }
};

const getBudgetFail = (dispatch, error) => {
    dispatch({type: GET_BUDGET_FAIL, payload: error});
};

export const editBudget = ({budgetID, income, categories}, callback) => async dispatch => {
    dispatch({type: EDIT_BUDGET});
    let token = await firebase.auth().currentUser.getIdToken();

    try {
        await axios.post(`${ROOT_URL}/editBudget`,
            {budgetID, income, categories},
            {headers: {Authorization: 'Bearer ' + token}});

        dispatch({
            type: EDIT_BUDGET_SUCCESS,
            income,
            categories
        });

    } catch (err) {
        let {data} = err.response;
        editBudgetFail(dispatch, data.error)
    }
};

const editBudgetFail = (dispatch, error) => {
    dispatch({type: EDIT_BUDGET_FAIL, payload: error});
};

export const deleteBudget = ({budgetID}, callback) => async dispatch => {
    try {
        dispatch({type: DELETE_BUDGET});
        let token = await firebase.auth().currentUser.getIdToken();

        await axios.post(`${ROOT_URL}/deleteBudget`, {budgetID}, {
            headers: {Authorization: 'Bearer ' + token}
        });

        dispatch({type: GET_INITIAL_BUDGET_STATE});
        callback();
    } catch (err) {
        let {data} = err.response;
        console.log(data.error);
    }
};

export const incomeChanged = text => {
    return {
        type: INCOME_CHANGED,
        payload: text
    };
};

export const categoryChanged = (name, amount) => {
    return {
        type: CATEGORY_CHANGED,
        payload: {
            name,
            amount
        }
    };
};

export const getAccountData = (dispatch) => async dispatch => {
    dispatch({type: GET_ACCOUNT_DATA});
};
