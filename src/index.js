import React from 'react';
import ReactDOM from 'react-dom';
// import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App/index';
import * as serviceWorker from './serviceWorker';
// import reducer from './store/reducers/reducer';
import config from './config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Store from './store';
import 'react-notifications/lib/notifications.css';

// const store = createStore(reducer);

function createNotification(type, value) {
    switch (type) {
        case 'info':
            NotificationManager.info(value, '', 5000);
            break;
        case 'success':
            NotificationManager.success(value, '', 5000);
            break;
        case 'warning':
            NotificationManager.warning(value, '', 5000);
            break;
        case 'error':
            NotificationManager.error(value, '', 5000);
            break;
        default: break;
    }
};
const app = (
    <Provider store={Store}>
        <NotificationContainer  />
        <BrowserRouter basename={config.basename} >
            {/* basename="/datta-able" */}
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

export { createNotification }