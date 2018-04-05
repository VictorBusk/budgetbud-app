import {
    SCREEN_CHANGED,
    GET_INITIAL_AUTH_STATE,
    GET_BUDGET_ID_SUCCESS,
    CREATE_BUDGET_SUCCESS,
    DELETE_BUDGET
} from '../actions/types';

const INITIAL_STATE = {
    currentRoute: 'MyBudget'
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SCREEN_CHANGED:
            return {currentRoute: action.payload};
        case GET_INITIAL_AUTH_STATE:
            return INITIAL_STATE;
        case GET_BUDGET_ID_SUCCESS:
            return INITIAL_STATE;
        case CREATE_BUDGET_SUCCESS:
            return INITIAL_STATE;
        case DELETE_BUDGET:
            return INITIAL_STATE;
        default:
            return state;
    }
};
