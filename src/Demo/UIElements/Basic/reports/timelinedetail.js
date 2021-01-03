import React, { Component } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import DEMO from '../../../../store/constant';
import windowSize from 'react-window-size';
import Config from '../../../../config';
import Aux from "../../../../hoc/_Aux";
import Axios from 'axios';
import { loadUserToken } from '../../../../store/actions/authactions';
import { createNotification } from '../../../../index';
import Loader from '../../../../App/layout/Loader';
import ReactToPrint from 'react-to-print';
import moment from 'moment';

class TimelineDetailComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading: false,
            job: null,
            shipment: null
        }
    }
    componentDidMount() {
        const { history, match: { params } } = this.props;
        this.setState({ loading: true });
        this.renderShipment();
        this.renderJob();
        this.renderTimelineDetail(history, params)
    }
    renderShipment = () => {
        const shipment = JSON.parse(localStorage.getItem('shipment'));
        this.setState({ shipment });

    }
    renderJob = () => {
        const job = JSON.parse(localStorage.getItem('job'));
        this.setState({ job });

    }
    renderTimelineDetail = (history, params) => {
        Axios.get(`${Config.prod}/api/report/cart/shipment/${params.id}`, {
            params: {
                token: loadUserToken()
            }
        }).then(({ data }) => {
            this.setState({ loading: false, items: data })
        }).catch(error => {
            createNotification('error', 'Please Login Again');
            history.push('/auth/session')
        })
    }
    render() {
        const { loading, items, job, shipment } = this.state;
        return (
            <Aux >
                {
                    loading && (
                        <Loader />
                    )
                }
                <ReactToPrint
                    trigger={() => {
                        // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                        // to the root node of the returned component as it will be overwritten.
                        return <a href="#" className="btn btn-primary btn-lg mb-3">Print this out!</a>;
                    }}
                    content={() => this.componentRef}
                />
                <div className="p-3" ref={el => (this.componentRef = el)}>
                    <Table borderless>
                        <tbody>
                            <tr className="bg-white">
                                <td style={{ border: 'none' }}>
                                    <tr>
                                        <td style={{ border: 'none' }} >
                                            {
                                                shipment && (
                                                    <div
                                                        style={{
                                                            maxWidth: '150px',
                                                            height: '95px',
                                                            padding: '7px'
                                                        }}>
                                                        <img src={shipment && shipment.image} alt="no image"
                                                            style={{
                                                                width: '100%',
                                                                height: 'auto'
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: 'none' }}>
                                            <div style={{
                                                height: '150px',
                                                background: '#e6e6e6',
                                                borderRadius: '5px',
                                                padding: '10px',
                                                display: 'inline-block',
                                                width:'235px'
                                            }} >
                                                <p className="mb-0" style={{ color: 'black', fontWeight: 'bold', fontSize: '18px' }}>
                                                    Order # {shipment && shipment.orderConfirmationCode}
                                                </p>
                                                <p className="mb-0" style={{ color: 'black', fontWeight: 'bold', fontSize: '18px' }}>
                                                    {
                                                        job && (
                                                            <>{job.fname} {job.lname}</>
                                                        )
                                                    }
                                                </p>

                                                <div className="text-left" style={{ fontWeight: 'bold' }}>
                                                    <p className="mb-0">ID: {shipment && shipment.idcart_tx}</p>
                                                    <p>Date: {shipment && moment(shipment.creaatedon).format('MMM-DD-YYYY')}</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </td>

                                <td style={{ border: 'none' }}>
                                    <div className="text-left ml-auto "
                                        style={{
                                            height: '300px',
                                            width: "400px",
                                            background: '#dedede',
                                            borderRadius: '10px',
                                            padding: '10px',

                                        }}>
                                        <div ><h3 style={{ color: 'black', fontWeight: 'bold' }}>Partial Shipment</h3></div>
                                        <div>
                                            {
                                                shipment && (
                                                    <p className="mb-0" style={{ wordBreak: 'break-all' }}>

                                                        <span>{shipment.address1}</span><br />
                                                        <span>{shipment.address2}</span><br />
                                                        <span>{shipment.city},{shipment.country} {shipment.zip}</span><br />
                                                        <span>Phone: {job && job.phoneno}</span>{' '}<span>Fax: {job && job.fax}</span>{' '}<span>Email:{job && job.email}</span><br />
                                                        <span>Contractor License # { }</span>
                                                    </p>
                                                )
                                            }
                                            <p className="mb-0">{
                                                job && (
                                                    <>{job.phoneno}</>
                                                )
                                            }</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>

                            </tr>

                        </tbody>
                    </Table>

                    <Table borderless>
                        <tbody>
                            <tr className="bg-white">
                                <td style={{ border: 'none' }}>
                                    <div
                                        style={{
                                            background: '#e6e6e6',
                                            borderRadius: '5px',
                                            padding: '10px',
                                            height: '130px',
                                            maxWidth: '250px',
                                            display: 'inline-block',
                                            whiteSpace:'pre-line'
                                        }}
                                    >
                                        <p className="m-0"><span className="font-weight-bold">Shipping To :</span> {shipment && shipment.projectSiteAddress}</p>
                                        
                                    </div>
                                    
                                </td>
                                <td style={{ border: 'none' }}>
                                    <div
                                        style={{
                                            background: '#e6e6e6',
                                            borderRadius: '5px',
                                            padding: '10px',
                                            width: '400px',
                                            marginLeft: 'auto',
                                            height: '130px'
                                        }}
                                    >
                                        <p>Shipment: <span className="font-weight-bold">Partial/Completed</span></p>
                                        <p>PO # <span className="font-weight-bold">{shipment && shipment.customerReferenceNumber}</span></p>
                                        <p>Tracking #: <span className="font-weight-bold">Todo</span></p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <Table striped bordered >
                        <thead>
                            <tr style={{ textAlign: 'center', color: '#545cd8', fontWeight: 'bold' }}>
                                <th>
                                    <b>Item Description</b>
                                </th>
                                <th >
                                    <b>Total Ordered</b>
                                </th>
                                <th >
                                    <b>Shipping now</b>
                                </th >
                                <th >
                                    <b>Backorder</b>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                items.map((item, index) => (
                                    <tr key={index} style={{ background: 'rgba(0, 0, 0, 0.05)' }}>
                                        <td >
                                            <p className="mb-0 overflow-hidden" style={{ fontWeight: 700, color: 'black' }}>
                                                {item.cmpDescription}
                                            </p>
                                            <p className="mb-0">{item.cmpModel}</p>
                                            <p className="mb-0">C-ID: {item.idcmp}</p>
                                        </td>
                                        <td className="text-right" style={{ color: '#212121' }}
                                        >
                                            <span>{item.shippedQuantity}</span>
                                        </td>
                                        <td className="text-right" style={{ color: '#212121' }}
                                        >
                                            <span>{item.quantity}</span>
                                        </td>
                                        <td className="text-right" style={{ color: '#212121' }}

                                        >
                                            <span>{item.backOrderQuantity}</span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
            </Aux>
        );
    }
}

export default windowSize(TimelineDetailComponent);