import React, { Component } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
// import DEMO from '../../../store/constant';
import windowSize from 'react-window-size';
// import Config from '../../../config';
import Aux from "../../../hoc/_Aux";
import Axios from 'axios';
import { loadUserToken } from '../../../store/actions/authactions';
import { createNotification } from '../../../index';
import Loader from '../../../App/layout/Loader';
import { FaPlus, FaMinus } from 'react-icons/fa';
import config from '../../../config';
import SweetAlert from 'react-bootstrap-sweetalert';

class CartDetailComponent extends Component {
    state = {
        item: null,
        loading: false,
        showpopupdelete: false,
        showpopupcheckout: false

    }
    componentDidMount() {
        const { history, match: { params } } = this.props;
        window.addEventListener('keydown', this.renderCosmeticClicks);
        this.setState({ loading: true })
        Axios.get(config.prod + '/api/cart/' + params.id, {
            params: {
                token: loadUserToken()
            }
        }).then(({ data }) => {
            this.setState({
                item: data,
                loading: false
            })
        }).catch(error => {
            createNotification('error', 'Please Login Again');
            this.setState({ loading: false })
            history.push('/auth/session')
        })
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.renderCosmeticClicks);
    }
    renderCosmeticClicks = (event) => {
        const { history } = this.props;
        // const { items } = this.state;

        if (!(event.ctrlKey && event.altKey)) {
            return;
        }
        let keyPressed = String(event.key).toLowerCase();
        if (navigator.appVersion.indexOf("Mac") != -1) {
            keyPressed = event.code;
        }

        switch (keyPressed) {
            case 'KeyY':
            case 'y':
                this.setState({ showpopupcheckout: true })
                break;
            case 'KeyT':
            case 't':
                this.setState({ showpopupdelete: true })
                break;
            default:
                break;

        }
        // items.map((item, index) => {
        //     if (event.key == index) {
        //         history.push('/basic/cartdetail/' + item.idcart)
        //     }
        // })
    }
    deleteStock = (id, index) => {
        const { history } = this.props;
        const { item } = this.state;
        this.setState({ loading: true });
        Axios(config.prod + '/api/cart/' + item.idcart + '/product', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                token: loadUserToken(),
            },
            data: {
                stockId: id
            }
        })
            .then(({ data }) => {
                console.log(data);
                this.setState(state => ({
                    [state.item.stocks]: state.item.stocks.splice(index, 1),
                    loading: false
                }))
                createNotification('info', 'Successfully Stock Deleted!');
            }).catch(error => {
                createNotification('error', 'Please Login Again');
                this.setState({ loading: false })
                history.push('/auth/session')
            })
    }
    deleteCart = () => {
        const { history } = this.props;
        const { item } = this.state;
        Axios.delete(config.prod + '/api/cart/' + item.idcart, {
            headers: {
                'Content-Type': 'application/json'
            }, params: { token: loadUserToken() }
        }).then(({ data }) => {
            if (data) {
                createNotification('info', 'Successfully Cart Deleted!');
                this.onCancelCart();
                history.push('/basic/carts');
            } else {
                createNotification('error', 'Something Went Wrong!');
            }
        }).catch(error => {
            createNotification('error', 'Please Login Again');
            this.setState({ loading: false })
            history.push('/auth/session')
        })
    }
    onCancelCart = () => {
        this.setState(state => ({
            showpopupdelete: !state.showpopupdelete
        }))
    }
    checkout = () => {
        const { history } = this.props;
        const { item } = this.state;
        Axios.put(config.prod + '/api/cart/' + item.idcart + '/checkout', { ocId: item.idPO }, {
            headers: {
                'Content-Type': 'application/json'
            }, params: { token: loadUserToken() }
        }).then(({ data }) => {
            if (data.checkout) {
                createNotification('success', 'Successfully CheckOut');
                history.push('/basic/carts');
            } else {
                createNotification('error', 'Something Went Wrong!');
                history.push('/basic/carts');
            }
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                this.onCancelCheckout()
                createNotification('error', error.response.data.error);
            } else {
                createNotification('error', 'Please Login Again');
                this.setState({ loading: false })
                history.push('/auth/session')
            }

        })
    }
    onCancelCheckout = () => {
        this.setState(state => ({
            showpopupcheckout: !state.showpopupcheckout
        }))
    }
    render() {
        const { item, loading, showpopupdelete, showpopupcheckout } = this.state;

        return (
            <Aux>
                <Row >
                    <Col>
                        <Card style={{ borderRadius: '5px', }}>
                            <Card.Body>

                                <Row >
                                    <Col className="col-12 col-sm-6">
                                        <h6  ><b>idCart: </b>{item && item.idcart}</h6>
                                        <h6  ><b>idPO: </b>{item && item.idPO}</h6>
                                        <h6  ><b>Description: </b>{item && item.description}</h6>
                                        <h6  ><b>JobName: </b>{item && item.jobname}</h6>
                                    </Col>
                                    <Col className="col-12 col-sm-6">
                                        <h6  ><b>CostCenterId: </b>{item && item.costcenterid}</h6>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <br />
                <Row >
                    {
                        item && item.stocks.map((item, index) => (
                            <Col className="col-12 col-sm-6 col-lg-4  mb-2" key={index}>
                                <Card style={{ borderRadius: '5px', cursor: 'pointer' }}  >
                                    <Row className="p-2 pt-3" noGutters>
                                        <Col className="col-5 p-2">
                                            {
                                                <img alt={item.details && item.details.imagedescription} src={item.details && item.details.images[0]} className="img-fluid" />
                                            }
                                        </Col>
                                        <Col className="col-7 pt-3 text-right pr-3">
                                            <h6 ><b>Component Id: </b>{item.details && item.details.idcmp}</h6>
                                            <h6 ><b>Company Name: </b>{item.details && item.details.companyname}</h6>
                                            <h6 ><b>Model: </b>{item.details && item.details.mfgmodelnumber}</h6>
                                        </Col>
                                    </Row>
                                    <Card.Body>
                                        <Row noGutters>
                                            <Col className="col-8 col-sm-12   col-xl-8 ">
                                                <div id="incdec" >
                                                    <Button size="sm">
                                                        <FaMinus />
                                                    </Button>
                                                    <input type="number" defaultValue={item.quantity} />
                                                    <Button size="sm">
                                                        <FaPlus />
                                                    </Button>
                                                </div>
                                            </Col>
                                            <Col className="col-4 col-sm-12   col-xl-4  text-right">
                                                <Button size="sm" onClick={() => this.deleteStock(item.idstock, index)}>
                                                    Delete
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col>
                                <Button variant="danger" onClick={() => this.setState({ showpopupdelete: true })}>
                                    Delete
                            </Button>
                            </Col>
                            <Col className="text-right">
                                <Button onClick={() => this.setState({ showpopupcheckout: true })}>
                                    Checkout
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                {
                    loading ? <Loader /> : ''
                }
                {
                    showpopupdelete ?
                        <SweetAlert
                            warning
                            showCancel
                            confirmBtnText="Yes, delete it!"
                            confirmBtnBsStyle="danger"
                            title="Are you sure?"
                            onConfirm={this.deleteCart}
                            onCancel={this.onCancelCart}
                            focusCancelBtn
                        >

                        </SweetAlert> : ''
                }
                {
                    showpopupcheckout ?
                        <SweetAlert
                            warning
                            showCancel
                            confirmBtnText="Check Out"
                            confirmBtnBsStyle="info"
                            title="Are you sure?"
                            onConfirm={this.checkout}
                            onCancel={this.onCancelCheckout}
                            focusCancelBtn
                        >

                        </SweetAlert> : ''
                }
            </Aux>
        );
    }
}

export default windowSize(CartDetailComponent);