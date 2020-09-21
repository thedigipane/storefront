import { CLEAR_ERRORS, GET_ERRORS,NETWORK_ERROR } from './types';

export const returnErrors = (msg, status, id = null) => {
    return {
        type: GET_ERRORS,
        payload: { msg, status, id }
    }
}
export const returnNetworkError=(msg, status, id = null) => {
    return {
        type: NETWORK_ERROR,
        payload: { msg, status, id }
    }
}

export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    }
}
