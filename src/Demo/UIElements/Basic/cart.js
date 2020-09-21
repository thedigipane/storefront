import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
// import DEMO from '../../../store/constant';
import windowSize from 'react-window-size';
// import Config from '../../../config';
import Aux from "../../../hoc/_Aux";
// import Axios from 'axios';
// import { loadUserToken } from '../../../store/actions/authactions';
// import { createNotification } from '../../../index';
// import Loader from '../../../App/layout/Loader';

class CartComponent extends Component {

    render() {
        return (
            <Aux>
              <Card>
                  <Card.Body>
                  <h1>Carts- TODO </h1>
                  </Card.Body>
              </Card>
            </Aux>
        );
    }
}

export default windowSize(CartComponent);