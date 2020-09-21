import { GET_ERRORS, CLEAR_ERRORS,NETWORK_ERROR } from '../actions/types';

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
            case NETWORK_ERROR:
                return {
                    id: action.payload.id,
                    status: action.payload.status,
                    msg: action.payload.msg
                }
        default:
            return state;
    }
}