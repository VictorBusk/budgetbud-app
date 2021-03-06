import {CREATE_CATEGORIES, CREATE_CATEGORIES_SUCCESS, RESET_CATEGORIES_ERROR} from '../../src/strings/types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import {setupFirebaseMock} from "../test_helper/firebase_mock";

jest.mock('axios');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const categoryActions = require('../../src/app/categories/category_actions');

describe('reset', () => {
    it('should create an action to reset category error', () => {
        const expectedAction = {
            type: RESET_CATEGORIES_ERROR
        };
        expect(categoryActions.resetCategoriesError()).toEqual(expectedAction);
    });
});

describe('createCategories', () => {
    beforeEach(() => {
        setupFirebaseMock();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should create category and initialize state', async () => {
        const budgetID = 123;
        const categories = [{amount: 123}, {amount: 456}];
        const postResult = {data: {id: 123}};

        axios.post.mockResolvedValue(postResult);

        const expectedAction = [
            {type: CREATE_CATEGORIES},
            {
                type: CREATE_CATEGORIES_SUCCESS,
                payload: {categories}
            }
        ];
        const store = mockStore({});

        const mockCallback = jest.fn();
        return store.dispatch(await categoryActions.createCategories(
            budgetID, categories, mockCallback)).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedAction)
            expect(mockCallback).toHaveBeenCalled()
        });
    })
});