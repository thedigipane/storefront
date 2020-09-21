import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import windowSize from 'react-window-size';
import Config from '../../../config';
import Aux from "../../../hoc/_Aux";
import Axios from 'axios';
import { loadUserToken } from '../../../store/actions/authactions';
import { createNotification } from '../../../index';

import Loader from '../../../App/layout/Loader';

class ProductsComponent extends Component {
    state = {
        items: null,
        loading: true,
        searchData: JSON.parse(localStorage.getItem('searchitem'))
    };
    componentDidMount() {
        const { history, match: { params } } = this.props;

        Axios.get(`${Config.prod}/api/stock/component/${params.stockid}/${params.componentid}`, {
            params: {
                token: loadUserToken()
            }
        }).then(({ data }) => {

            if (data.length > 0) {
                this.setState({ items: data, loading: false });
            } else {
                this.setState({ items: null, loading: false });
            }
        }).catch(error => {
            this.setState({ loading: false })
            createNotification('error', 'Please Login Again');
            history.push('/auth/session')
        })
    }
    renderStatus = (status) => {
        if (status === 0) {
            return {
                background: 'yellow',
                title: ''
            }
        } else if (status === 1) {
            return {
                background: 'green',
                title: ''
            }
        } else if (status === 2) {
            return {
                background: 'blue',
                title: ''
            }
        } else {
            return {
                background: 'red',
                title: ''
            }
        }
    }
    render() {
        const { items, loading, searchData } = this.state;
        let badge = {
            position: 'absolute',
            top: '0',
            right: '15px',
            width: '20px',
            height: '20px',
            zIndex: 1
        }
        return (
            <Aux>
                <Row >
                    {
                        !loading && items ? items.map((item, index) => {
                            let status = this.renderStatus(item.status)
                            return (
                                <Col className="col-12 col-sm-6 col-lg-4  mb-2" key={index} >
                                    <span style={{ ...badge, ...status }} >
                                    </span>
                                    <Card  >
                                        <Row className="p-2 pt-3" noGutters>
                                            <Col className="col-5 p-2">
                                            <h6  > {searchData.companyname}</h6>
                                                {
                                                    <img alt={searchData.imagedescription || 'no image'} src={searchData.images ? searchData.images[0] : ''} className="img-fluid" />
                                                }
                                            </Col>
                                            <Col className="col-7 pt-3 text-right pr-3">
                                                <h6  ><b>Description: </b>{searchData.categorydescription}</h6>
                                                <h6  ><b>ID: </b>{searchData.componentid}</h6>
                                                <h6  ><b>Model:</b> {searchData.modelid}</h6>
                                                <h6  ><b>Supplier-Company:</b> {item.supplier_company}</h6>
                                            </Col>
                                        </Row>
                                        <Card.Body>
                                            <div>
                                                <h6  ><b>MPIN:</b> {item.mpin}</h6>
                                                <h6>
                                                    <b>Serial No: </b>{item.idproduct}
                                                </h6>
                                                <h6  ><b>Cost Price: </b>{item.costprice}</h6>
                                                <h6  ><b>Sale Price: </b>{item.saleprice}</h6>
                                                <h6  ><b>IdPO: </b>{item.idpo}</h6>

                                                <h6  ><b>Location Name: </b>{item.name}</h6>
                                                <h6  ><b>Level: </b>{item.level}</h6>
                                                <h6  ><b>Zone: </b>{item.zone}</h6>
                                                <h6  ><b>Rack: </b>{item.rack}</h6>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        }) : (loading ? <Loader /> : 'Data Not Found')
                    }
                </Row>
            </Aux>
        );
    }
}

export default windowSize(ProductsComponent);