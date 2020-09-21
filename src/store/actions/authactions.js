import {
    USER_LOADING,
    // USER_LOADED,
    // AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
} from '../actions/types';
import config from '../../config';
// import { Cookies } from 'react-cookie';
import { returnErrors } from './erroractions';
import axios from 'axios';
import qs from 'querystring';
import jwt from  'jsonwebtoken'; 
export const loaduser = () => (dispatch, getSate) => {
    console.log(loadHeaders(getSate))
}

export const login = (body) => (dispatch) => {
    dispatch({ type: USER_LOADING });
    axios(loadHeaders(`${config.prod}/api/session`, body, 'POST')).then(result => {
        dispatch({
            type: LOGIN_SUCCESS,
            payload: result.data
        })
    }).catch(error => {
        if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
            dispatch(returnErrors(error.response.data, error.response.status, LOGIN_FAIL));
        } else if (error) {
            dispatch(returnErrors(error.message, '', LOGIN_FAIL))
        }
        dispatch({
            type: LOGIN_FAIL
        });
    })
}

export const logout = (callback) => (dispatch) => {
    axios.delete(`${config.prod}/api/token`, {
        params: {
            refreshToken: loadRefreshToken()
        }
    }).then(result => {
        dispatch({ type: LOGOUT_SUCCESS });
        callback();
    }).catch(error => {
        console.log(error);
    })

}
export const loadHeaders = (path, data, method) => {
    let options = {
        url: path,
        method: method,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(data)
    }
    return options;
}

export const isUserAuthenticated = () => {
    return true;
}
export const setUserToken = (user) => {
    localStorage.setItem('mannkamal_user_token', user.token.split(' ')[1]);
    localStorage.setItem('mannkamal_user_refresh', user.refreshToken);
}
export const logoutUser = () => {
    localStorage.removeItem('mannkamal_user_token');
    localStorage.removeItem('mannkamal_user_refresh');
}
export const loadUserToken = () => {
    return localStorage.getItem('mannkamal_user_token');
}
export const loadRefreshToken = () => {
    return localStorage.getItem('mannkamal_user_refresh');
}
export const setNewToken = (token) => {
    localStorage.setItem('mannkamal_user_token', token.split(' ')[1]);
}
export const jwtdecode = () => {
   return jwt.decode(loadUserToken());
}