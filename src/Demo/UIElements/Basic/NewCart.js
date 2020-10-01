import React, { Component } from 'react';
import { Card, Row, Col, Button, Container, Form } from 'react-bootstrap';
// import DEMO from '../../../store/constant';
import windowSize from 'react-window-size';
import Config from '../../../config';
import Aux from "../../../hoc/_Aux";
import NewCartSearch from './newcartserach';
import Axios from 'axios';
import { loadUserToken } from '../../../store/actions/authactions';
import { createNotification } from '../../../index';
import Loader from '../../../App/layout/Loader';;

class NewCartComponent extends Component {
    state = {
        showModal: false,
        cart: null,
        loading: false,
        description: ''
    }
    componentDidMount() {
        window.addEventListener('keydown', this.renderCosmeticClicks);
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.renderCosmeticClicks);
    }
    renderCosmeticClicks = (event) => {
        const { history } = this.props;
        if (!(event.ctrlKey && event.altKey)) {
            return;
        }

        let keyPressed = String(event.key).toLowerCase();
        if (navigator.appVersion.indexOf("Mac") != -1) {
            keyPressed = event.code;
        }

        switch (keyPressed) {

            case 'KeyO':
            case 'o':
                this.renderModal()
                break;
            case 'KeyY':
            case 'y':
                this.createCart()
                break;
            case 'KeyT':
            case 't':
                history.push('/basic/carts')
                break;
            case 'KeyI':
            case 'i':
                this.renderDesciption();
                break;
            default:
                return;

        }
    }
    renderModal = () => {
        const { showModal } = this.state;
        this.setState({ showModal: !showModal })
    }
    renderCart = (item) => {
        this.setState({
            cart: item
        })
        this.renderModal();
    }
    renderDesciption = () => {
        let input = document.getElementById('desctiption');
        input.focus();
    }
    createCart = () => {
        const { history } = this.props;
        const { cart, description } = this.state;
        if (!cart) {
            createNotification('error', 'Please Select Product');
            return;
        }
        this.setState({ loading: true });
        Axios.post(Config.prod + '/api/cart/', {
            ...cart,
            description
        }, {
            headers: {
                'Content-Type': 'application/json'
            }, params: { token: loadUserToken() }
        })
            .then(({ data }) => {

                this.setState({
                    loading: false,
                })
                if (data.code === 'ER_DUP_ENTRY') {
                    createNotification('error', 'Duplicate Entry');
                    this.setState({
                        cart: null,
                        description: ''
                    })
                } else {
                    createNotification('success', 'Successfully Added');
                    history.push('/basic/carts');
                }
            }).catch(error => {
                createNotification('error', 'Please Login Again');
                this.setState({ loading: false })
                history.push('/auth/session')
            })
    }

    render() {
        const { showModal, cart, loading, description } = this.state;
        const { history } = this.props;
        return (
            <Aux>
                <Container style={{ maxWidth: '520px' }}>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    {
                                        cart ? <div>
                                            <h6  ><b>OC Code:</b> {cart.ocId}</h6>
                                            <h6>
                                                <b>Job Name: </b>{cart.jobname}
                                            </h6>
                                            <h6  ><b>Cost Center Id: </b>{cart.costcenterid}</h6>
                                            <h6  ><b>Contact Info: </b>{cart.contactinfo}</h6>
                                        </div> : <Button onClick={() => this.renderModal()} block>Select an Order Confirmation</Button>
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Form>
                                        <Form.Group as={Row} >
                                            <Form.Label column sm="4">
                                                Description:
                                            </Form.Label>
                                            <Col sm="8">
                                                <Form.Control id="desctiption"  type="text" value={description} onChange={(e) => this.setState({ description: e.target.value })} />
                                            </Col>
                                        </Form.Group>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Button variant="danger" onClick={() => history.push('/basic/carts')}>
                                        Discard
                                    </Button>
                                </Col>
                                <Col className="text-right">
                                    <Button onClick={() => this.createCart()}>Create</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
                {
                    showModal ? <NewCartSearch history={history} renderModal={this.renderModal} renderCart={this.renderCart} /> : ''
                }
                {
                    loading ? <Loader /> : ''
                }
            </Aux>
        );
    }
}

export default windowSize(NewCartComponent);