import React, { Component } from 'react';

// import DEMO from '../../../store/constant';
import windowSize from 'react-window-size';
// import Config from '../../../config';
import Aux from "../../../hoc/_Aux";
// import Axios from 'axios';
// import { loadUserToken } from '../../../store/actions/authactions';
// import { createNotification } from '../../../index';
// import Loader from '../../../App/layout/Loader';
import Table from '../../Tables/BootstrapTable';
class ReportComponent extends Component {
    state = {
        show: false
    }
    render() {
        return (
            <Aux>
                <Table />
            </Aux>
        );
    }
}

export default windowSize(ReportComponent);