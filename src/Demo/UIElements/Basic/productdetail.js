import React, { Component } from 'react';
import { Row, Col, Card, Button, Collapse } from 'react-bootstrap';
import DEMO from '../../../store/constant';
import windowSize from 'react-window-size';
import Config from '../../../config';
import Aux from "../../../hoc/_Aux";
import Axios from 'axios';
import { loadUserToken } from '../../../store/actions/authactions';
import { createNotification } from '../../../index';
import Loader from '../../../App/layout/Loader';

class ProductDetail extends Component {
    state = {
        show: false,
        item: {},
        loading: true,
        searchData: JSON.parse(localStorage.getItem('searchitem'))
    };

    componentDidMount() {
        const { history, match: { params } } = this.props;
        Axios.get(`${Config.prod}/api/stock/component/${params.componentid}`, {
            params: {
                token: loadUserToken()
            }
        }).then(({ data }) => {
            this.setState({ item: data[0], loading: false });
            if (data[0]) {
                window.addEventListener('keydown', this.renderCosmeticClicks);
            }
        }).catch(error => {
            this.setState({ loading: false })
            createNotification('error', 'Please Login Again');
            history.push('/auth/session')
        })

    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.renderCosmeticClicks);
    }
    renderCosmeticClicks = (event) => {
        // const { history } = this.props;
        if (event.ctrlKey && event.altKey && String(event.key).toLowerCase() === 'a') {
            this.renderProducts();
        } else if (event.ctrlKey && event.altKey && String(event.key).toLowerCase() === 'o') {
            this.renderProducts();
        } else if (event.ctrlKey && event.altKey && String(event.key).toLowerCase() === 'p') {
            alert('add product')
        } else if (event.ctrlKey && event.altKey && String(event.key).toLowerCase() === 'c') {

        } else if (event.ctrlKey && event.altKey && String(event.key).toLowerCase() === 'd') {

        }
    }
    renderProducts = () => {
        const { history } = this.props;
        const { item } = this.state;
        history.push(`/basic/products/${item.idstock}/${item.idcmp}`);
    }
    render() {
        const { show, item, loading, searchData } = this.state;
        return (
            <Aux>
                {
                    !loading ? (<>
                        <Row>
                            <Col className="col-12 col-md-4">
                                <Card >

                                    <Card.Body>
                                        <h6  > {searchData.companyname}</h6>
                                        {
                                            <img alt={searchData.imagedescription || 'no image'} src={searchData.images ? searchData.images[0] : ''} className="img-fluid" />
                                        }
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col className="col-12 col-md-8">
                                <Card>
                                    <Card.Body>
                                        <h5 ><b>{searchData.categorydescription}</b></h5>
                                        <h6 ><b>Component ID: {searchData.componentid}</b></h6>
                                        <h6 ><b>Model ID: {searchData.modelid}</b> </h6>
                                        <h6 ><b>Size: {searchData.sizes}</b> </h6>
                                        <h6 ><b>Price: {item ? item.price : 0}</b> </h6>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col className="col-12 col-sm-6 d-flex justify-content-around">
                                        <Button size="lg" variant="primary" onClick={() => this.renderProducts()} ><b>{item ? item.availablequantity : ''}</b> Available</Button>
                                        <Button size="lg" variant="primary" onClick={() => this.renderProducts()}><b>{item ? item.orderedquantity : ''}</b> Ordered</Button>
                                    </Col>
                                    <Col className="col-12 col-sm-6 d-flex justify-content-around" >
                                        <Button size="lg" variant="primary">Add Product</Button>
                                        <Button size="lg" variant="primary">Add to Cart</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">
                                    <a href={DEMO.BLANK_LINK}
                                        onClick={() => this.setState({ show: !show })}
                                        aria-controls="accordion1"
                                        aria-expanded={show}>
                                        Details
                                    </a>
                                </Card.Title>
                            </Card.Header>
                            <Collapse in={show}>
                                <div id="accordion1">
                                    <Card.Body>
                                        <h6  ><b>Taxonomy:</b> {searchData.taxonomy}</h6>
                                        <h6><b>Category description: </b>{searchData.categorydescription}</h6>
                                        <h6  ><b>Stockroomlabel: </b>{searchData.stockroomlabel}</h6>
                                        <h6  ><b>Design Description: </b>{searchData.designdescription}</h6>
                                        <h6  ><b>Elastomers: </b> {searchData.elastomers}</h6>
                                        <h6  ><b>Materials: </b>{searchData.materials}</h6>
                                        <br />
                                        <h6  ><b>Company Name: </b>{searchData.companyname}</h6>
                                        <h6  ><b>Manufacturers Symbol: </b>{searchData.manufacturerssymbol}</h6>
                                        <h6  ><b>Mfgmodel Number: </b>{searchData.mfgmodelnumber}</h6>
                                        <h6  ><b>Mfgpart Number: </b>{searchData.mfgpartnumber}</h6>
                                        <h6  ><b>Manufacturer Id: </b>{searchData.manufacturerid}</h6>
                                        <br />
                                        <h6  ><b>Category Code: </b>{searchData.categorycode}</h6>
                                        <h6  ><b>Configuration Key: </b>{searchData.configurationkey}</h6>
                                        <h6  ><b>Subcomponent Configurations: </b>{searchData.subcomponentconfigurations}</h6>
                                        <h6  ><b>Taxonomy Code: </b>{searchData.taxonomycode}</h6>
                                        <h6  ><b>Universal Productcode: </b>{searchData.universalproductcode}</h6>
                                        <h6  ><b>Configurations: </b>{searchData.configurations}</h6>

                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>
                    </>) : <Loader />
                }
            </Aux>
        );
    }
}

export default windowSize(ProductDetail);