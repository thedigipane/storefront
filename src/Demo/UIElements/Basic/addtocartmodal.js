import React, { Component } from 'react';
import { Modal, Row, Col, Button, Card, Form } from 'react-bootstrap';
import Aux from '../../../hoc/_Aux';
import { FaPlus, FaMinus } from 'react-icons/fa';
import Axios from 'axios';
import { loadUserToken } from '../../../store/actions/authactions';
import config from '../../../config';
import { createNotification } from '../../..';
import Select from 'react-select';
class AddToCartModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            items: [],
            item: null,
            quantity: 1,
            itemshow: false
        }
    }
    componentDidMount() {
        const { history } = this.props;
        window.addEventListener('keydown', this.renderCosmeticClicks);
        Axios.get(config.prod + '/api/cart/all', {
            params: {
                token: loadUserToken()
            }
        }).then(({ data }) => {
            this.setState({
                items: data
            })
        }).catch(error => {
            createNotification('error', 'Please Login Again');
            history.push('/auth/session');
        })
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.renderCosmeticClicks);
    }
    renderCosmeticClicks = (event) => {
        if (!(event.ctrlKey && event.altKey)) {
            return;
        }

        let keyPressed = String(event.key).toLowerCase();
        if (navigator.appVersion.indexOf("Mac") != -1) {
            keyPressed = event.code;
        }
        switch (keyPressed) {
            case 'KeyI':
            case 'i':
                this.incrementQuantity()
                break;
            case 'KeyU':
            case 'u':
                this.decrementQuantity()
                break;
            case 'KeyY':
            case 'y':
                this.addToCart()
                break;
            case 'KeyT':
            case 't':
                this.renderModal();
                break;
            case '0':
                this.renderSelect()
                break;
            default:
                return;
        }
    }
    renderModal = () => {
        this.setState(state => ({
            show: !state.show
        }))
        setTimeout(() => {
            this.props.addtoCart()
        }, 1000)
    }
    renderSelect = () => {
        console.log('select')
        this.setState(state => ({
            itemshow: !state.itemshow
        }))
    }
    renderItem = (item) => {
        this.setState({
            item: item
        })
        // this.renderSelect();
    }
    incrementQuantity = () => {
        this.setState(state => ({
            quantity: state.quantity + 1
        }))
    }
    decrementQuantity = () => {
        this.setState(state => ({
            quantity: state.quantity - 1
        }))
    }
    renderQuantity = (e) => {
        if (isNaN(e.target.value)) {
            createNotification('error', 'Please Enter Number');
            return;
        }
        this.setState({ quantity: Number(e.target.value) })
    }
    addToCart = () => {
        const { quantity, item } = this.state;
        const { history, idstock } = this.props;
        if (!item) {
            createNotification('error', 'Please Select Cart');
            return;
        }
        if (quantity < 1) {
            createNotification('error', 'Quantity must be greater then 0');
            return;
        }
        if (!idstock) {
            createNotification('error', 'Stock is not available');
            return;
        }
        Axios.post(`${config.prod}/api/cart/${item.idcart}/product`, {
            quantity,
            stockId: idstock
        }, {
            headers: {
                'Content-Type': 'application/json'
            }, params: { token: loadUserToken() },
        }).then(({ data }) => {
            if (data.code === 'ER_DUP_ENTRY') {
                createNotification('error', data.message);
            } else {
                createNotification('success', 'Added To Cart');
                this.renderModal();
            }
        }).catch(error => {
            createNotification('error', 'Please Login Again');
            history.push('/auth/session')
        })
    }
    render() {
        const { show, items, item, quantity, itemshow } = this.state;
        return (
            <Aux>
                <Modal
                    size="md"
                    show={show}
                    onHide={() => this.renderModal()}
                    aria-labelledby="example-modal-sizes-title-lg"
                    centered
                >
                    <Modal.Body>
                        <Card>
                            <Card.Body>
                                <Form.Group as={Col} className="p-0" >
                                    <Select options={items.map(item => { return { label: `${item.idcart}:${item.idPO}:${item.costcenterid}`, value: item } })}
                                        openMenuOnClick={() => this.renderSelect()}
                                        onFocus={() => this.renderSelect()}
                                        onBlur={() => this.renderSelect()} onChange={(e) => {
                                            this.renderItem(e.value)
                                        }} menuIsOpen={itemshow} />
                                </Form.Group>

                                <h6><b>Cart:</b> {item && item.idcart}</h6>
                                <h6><b>PO:</b> {item && item.idPO}</h6>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <Row className="mb-3">
                                    <Col className="col-4">
                                        <h6><b>Quantity:</b></h6>
                                    </Col>
                                    <Col className="col-8">
                                        <div id="incdec" >
                                            <Button size="sm" onClick={() => this.decrementQuantity()}>
                                                <FaMinus />
                                            </Button>
                                            <input type="number" value={quantity} onChange={(e) => this.renderQuantity(e)} />
                                            < Button size="sm" onClick={() => this.incrementQuantity()}>
                                                <FaPlus />
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button variant="danger" onClick={() => this.renderModal()}>Cancel</Button>
                                    </Col>
                                    <Col className="text-right">
                                        <Button onClick={() => this.addToCart()}>Add</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Modal.Body>
                </Modal>
            </Aux>
        );
    }
}

export default AddToCartModal;