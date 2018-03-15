import {AsyncStorage} from 'react-native';
import axios from 'axios';
import firebase from 'firebase';
import {firebaseFunctionsURL} from "../config/firebase_config";

import {
    GET_INITIAL_STATE
} from './types';

const ROOT_URL = firebaseFunctionsURL;

export const getInitialState = text => {
    return {
        type: GET_INITIAL_STATE,
        payload: text
    };
};