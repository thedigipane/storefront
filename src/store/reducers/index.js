import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import errorReducer from './error.reducer';
import Navreducer from './reducer';
import validateRoute from './validatecomp.reducer';
export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    reducer: Navreducer,
    validateroute: validateRoute
})