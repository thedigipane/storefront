import React, { Component } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import DEMO from '../../../store/constant';
import windowSize from 'react-window-size';
import Config from '../../../config';
import Aux from "../../../hoc/_Aux";
import Axios from 'axios';
import { loadUserToken } from '../../../store/actions/authactions';
import { createNotification } from '../../../index';
let style = {
    width: "100%",
    background: 'none',
    marginLeft: '0px',
    minHeight: '0px',
    zIndex: 0
}
class DataGrid extends Component {
    state = {
        search: '',
        items: [],
        isLoading: false,
        check: false
    };
    HandleInput = (e) => {
        let search = e.target.value;
        const { check } = this.state;
        this.setState({
            [e.target.name]: search
        })

        if (search.length > 2) {

            Axios.get(`${Config.prod}/api/component/${check ? search : `search?q=${search}`}`, {
                params: {
                    token: loadUserToken()
                }
            }).then(({ data }) => {
                // console.log(data);
                this.setState({ items: data })
            }).catch(error => {
                createNotification('error', 'Please Login Again')
            })
        }
    }
    searchOnHandler = () => {
        const { search } = this.state;
        if (search !== '') {
            alert('You Enter ' + search);
        }
    }

    searchOffHandler = () => {
        this.setState({ search: '' })
    }
    renderByCheckId = (check) => {
        this.setState({ search: '', items: [], check: !check })
    }
    render() {
        const { items, check } = this.state;
        return (
            <Aux>
                <div className="pcoded-header" style={style}>
                    <div id="main-search" className="main-search open ml-0 w-100">
                        <div className="input-group" style={{height:'50px'}}>
                            <input type={check ? 'number' : 'text'}
                                id="m-search"
                                className="form-control"
                                placeholder="Search . . ."
                                name="search"
                                value={this.state.search}
                                onChange={(e) => this.HandleInput(e)}
                            />
                            <a href={DEMO.BLANK_LINK} className="input-group-append search-close" onClick={() => this.searchOffHandler()}>
                                <i className="feather icon-x input-group-text" style={{fontSize:'22px'}} />
                            </a>
                            {/* <span className="input-group-append search-btn btn btn-primary" onClick={this.searchOnHandler}>
                                <i className="feather icon-search input-group-text" />
                            </span> */}
                        </div>
                    </div>
                </div>
                <Row noGutters>
                    <Col>
                        <Form name="datagrid">
                            <div className="form-group text-right mt-2">
                                <div className="checkbox checkbox-fill d-inline" >
                                    <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" onClick={() => this.renderByCheckId(check)} />
                                    <label htmlFor="checkbox-fill-a1" className="cr">Search By Id</label>
                                </div>
                            </div>
                        </Form>
                    </Col>
                </Row>
                <Row >
                    {
                        items.map((item, index) => (
                            <Col className="col-12 col-sm-6 col-lg-4  mb-2" key={index}>
                                <Card style={{ borderRadius: '5px' }}  >
                                    <Row className="p-2 pt-3" noGutters>
                                        <Col className="col-5 p-2">
                                            {
                                                check ? <img alt="not-found" src={item._source.images ? item.source.images[0] : ''} className="img-fluid" /> : <img alt="not-forund" src={item.images[0]} className="img-fluid" />
                                            }
                                        </Col>
                                        <Col className="col-7 pt-3 text-right pr-3">
                                            <h6  ><b>ID: </b>{check ? item._source.componentid : item.componentid}</h6>
                                            <h6  ><b>Model:</b> {check ? item._source.mfgmodelnumber : item.mfgmodelnumber}</h6>
                                        </Col>
                                    </Row>
                                    <Card.Body>
                                        <div>

                                            <h6  ><b>Taxonomy:</b> {check ? item._source.taxonomy : item.taxonomy}</h6>
                                            <h6>
                                                <b>Elastomerdescription</b>{check ? item._source.elastomerdescription : item.elastomerdescription}
                                            </h6>
                                            <h6  ><b>Stockroomlabel: </b>{check ? item._source.stockroomlabel : item.stockroomlabel}</h6>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            </Aux>
        );
    }
}

export default windowSize(DataGrid);
