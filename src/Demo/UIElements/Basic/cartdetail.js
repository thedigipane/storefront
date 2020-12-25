import React, { Component } from 'react';
import { Card, Row, Col, Button, Form, FormGroup, FormControl } from 'react-bootstrap';
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
        showpopupcheckout: false,
        title: '',
        description: ''
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
                if (error.response && error.response.status === 400) {
                    this.onCancelCheckout()
                    createNotification('error', error.response.data.error);
                    this.setState({ loading: false })
                } else {
                    createNotification('error', 'Please Login Again');
                    this.setState({ loading: false })
                    history.push('/auth/session')
                }
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
            if (error.response && error.response.status === 400) {
                this.onCancelCheckout()
                createNotification('error', error.response.data.error);
                this.setState({ loading: false })
            } else {
                createNotification('error', 'Please Login Again');
                this.setState({ loading: false })
                history.push('/auth/session')
            }

        })
    }
    onCancelCart = () => {
        this.setState(state => ({
            showpopupdelete: !state.showpopupdelete
        }))
    }
    checkout = () => {
        const { history } = this.props;
        const { item, title, description } = this.state;
        Axios.put(config.prod + '/api/cart/' + item.idcart + '/checkout', { ocId: item.idPO, title, description }, {
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
    onDecrement = (item, index) => {
        if (item.quantity < 1) {
            createNotification('warning', 'Minimum quantity must be 1');
            return
        }
        const items = this.state.item;
        item.quantity -= 1;
        this.setState({
            item: items
        })
    }
    onIncrement = (item, index) => {
        // if (item.quantity > item.details.availablequantity) {
        //     createNotification('warning', 'Quantity not available!');
        //     return
        // }
        const items = this.state.item;
        item.quantity += 1;
        this.setState({
            item: items
        })
    }
    onInputValue = (e, item, index) => {
        // console.log(e.target.value);
    }
    updateCartProduct = (item, index) => {
        if (item.quantity < 1) {
            createNotification('warning', 'Minimum quantity must be 1');
            return
        }
        // if (item.quantity > item.details.availablequantity) {
        //     createNotification('warning', 'Quantity not available!');
        //     return;
        // }
        const { history } = this.props;
        this.setState({ loading: true })
        console.log(item);
        Axios.put(config.prod + `/api/cart/${item.idcart}/product`, {
            stockId: item.idstock,
            quantity: item.quantity
        }, {
            headers: {
                'Content-Type': 'application/json'
            }, params: { token: loadUserToken() }
        }).then(({ data }) => {
            this.setState({ loading: false })
            if (data.error) {
                createNotification('error', data.error.message);
            } else {
                createNotification('success', 'Cart updated successfully');
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
    rendertextinput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    rendertoTimeline=(id)=>{
        const { history } = this.props;
        history.push(`/basic/reports/timeline/${id}`)
    }
    render() {
        const { item, loading, showpopupdelete, showpopupcheckout, title, description } = this.state;
        return (
            <Aux>
                <Row >
                    <Col>
                        <Card style={{ borderRadius: '5px', }}>
                            <Card.Body>
                                <Row >
                                    <Col className="col-12 col-sm-6">
                                    <h5><b>{item && item.description}</b></h5>
                                        <h6  ><b>Cart Id: </b>{item && item.idcart}</h6>
                                        <h6  ><b>OC Id: </b>{item && item.idPO}</h6>                                        
                                        <h6  ><b>Job Name: </b>{item && item.jobname}</h6>
                                    </Col>
                                    <Col className="col-12 col-sm-6">
                                        <h6  ><b>Cost Center Id: </b>{item && item.costcenterid}</h6>
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
                                        <Col className="col-12 px-3 mt-3">
                                            <h6><b>Available: </b>{item.details && item.details.availablequantity}</h6>
                                        </Col>
                                    </Row>
                                    <Card.Body>
                                        <Row noGutters>
                                            <Col className="col-8 col-sm-12   col-xl-8 ">
                                                <div id="incdec" >
                                                    <Button size="sm" disabled={item.quantity == 1}
                                                        onClick={(e) => this.onDecrement(item, index)}>
                                                        <FaMinus />
                                                    </Button>
                                                    <input type="number" name="quatity" value={item.quantity} onChange={(e) => this.onInputValue(item, index)} />
                                                    <Button size="sm"
                                                        onClick={(e) => this.onIncrement(item, index)}>
                                                        <FaPlus />
                                                    </Button>
                                                </div>
                                            </Col>
                                            <Col className="col-12 col-sm-12   col-xl-12  text-right">
                                                <Button size="sm" onClick={() => this.updateCartProduct(item, index)}>Update</Button>
                                                <Button size="sm" variant="danger" onClick={() => this.deleteStock(item.idstock, index)}>
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
                            {
                                item && (
                                    item.idcart_tx && (
                                        <Col className="text-center">
                                            <Button onClick={()=>this.rendertoTimeline(item.idcart_tx )}>
                                                Report
                                            </Button>
                                        </Col>
                                    )
                                )
                            }
                            <Col className="text-right">
                                <Button onClick={() => this.setState({ showpopupcheckout: true, title: '', description: '' })}>
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
                            <Form>
                                <FormGroup>
                                    <FormControl placeholder="Tilte" name="title" onChange={(e) => this.rendertextinput(e)} />
                                </FormGroup>
                                <FormGroup>
                                    <FormControl as="textarea" name="description" placeholder="Description" onChange={(e) => this.rendertextinput(e)} />
                                </FormGroup>
                            </Form>
                        </SweetAlert> : ''
                }
            </Aux>
        );
    }
}

export default windowSize(CartDetailComponent);