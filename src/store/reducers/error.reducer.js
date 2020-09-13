import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

const initialState = {
    id: null,
    status: null,
    msg: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            return {
                id: action.payload.id,
                status: action.payload.status,
                msg: action.payload.msg.error
            }
        case CLEAR_ERRORS:
            return {
                id: null,
                status: null,
                msg: {}
            }
        default:
            return state;
    }
}