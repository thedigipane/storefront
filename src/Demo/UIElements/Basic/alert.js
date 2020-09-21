import React, { Component } from 'react';
import { Card, Alert, Button } from 'react-bootstrap';
// import DEMO from '../../../store/constant';
import windowSize from 'react-window-size';
// import Config from '../../../config';
import Aux from "../../../hoc/_Aux";
// import Axios from 'axios';
// import { loadUserToken } from '../../../store/actions/authactions';
// import { createNotification } from '../../../index';
// import Loader from '../../../App/layout/Loader';

class AlertComponent extends Component {
    state = {
        show: false
    }
    render() {
        return (
            <Aux>
                <Card>
                    <Card.Body>
                        <h1>Alerts</h1>
                        {
                            [
                                'primary',
                                'secondary',
                                'success',
                                'danger',
                                'warning',
                                'info',
                                'light',
                                'dark',
                            ].map((variant, idx) => (
                                <Alert key={idx} variant={variant}>
                                    This is a {variant} alert—check it out!
                                </Alert>
                            ))
                        }
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body>
                        {
                            this.state.show ? '' : <Button onClick={() => this.setState({ show: true })}>Show Alert</Button>
                        }
                        <br />
                        {
                            this.state.show ? <Alert variant="danger" onClose={() => this.setState({ show: false })} dismissible>
                                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                <p>
                                    Change this and that and try again. Duis mollis, est non commodo
                                    luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                                    Cras mattis consectetur purus sit amet fermentum.
                            </p>
                            </Alert> : ''
                        }
                    </Card.Body>
                </Card>
            </Aux>
        );
    }
}

export default windowSize(AlertComponent);