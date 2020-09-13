
const initialState = {
    route:false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SET_ROUTE':
            return {...state, route: action.payload };
        default:
            return state;
    }
}