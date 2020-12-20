import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import DEMO from '../../../../store/constant';
import windowSize from 'react-window-size';
import Config from '../../../../config';
import Aux from "../../../../hoc/_Aux";
import Axios from 'axios';
import { loadUserToken } from '../../../../store/actions/authactions';
import { createNotification } from '../../../../index';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { FaSchool, FaHome } from 'react-icons/fa';
import Loader from '../../../../App/layout/Loader';
import moment from 'moment';

class TimelineComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading: false,
            job: null
        }
    }
    componentDidMount() {
        const { history, match: { params } } = this.props;
        this.setState({ loading: true });
        this.renderJob(params, history);
        this.renderTimeLine(params, history);
    }
    renderJob = (params, history) => {
        const job = JSON.parse(localStorage.getItem('job'));
        this.setState({ job })
    }
    renderTimeLine = (params, history) => {
        Axios.get(`${Config.prod}/api/report/cart/${params.id}`, {
            params: {
                token: loadUserToken()
            }
        }).then(({ data }) => {
            // console.log(data);
            this.setState({ loading: false })
            this.setState({ items: data })
        }).catch(error => {
            createNotification('error', 'Please Login Again');
            history.push('/auth/session')
        })
    }
    renderTotimedetail = (item) => {
        const { history } = this.props;
        localStorage.setItem('shipment', JSON.stringify(item));
        history.push(`/basic/reports/timeline/detail/${item.idcart_tx}`)
    }
    render() {
        const { loading, items, job } = this.state;
        return (
            <Aux>
                {
                    loading && (
                        <Loader />
                    )
                }
                <div className="py-3 bg-white">
                    {
                        job && (
                            <div className="text-center py-2 mb-3 " >
                                <h3 style={{ fontWeight: 'bold' }}>{job.jobname}</h3>
                            </div>
                        )
                    }

                    <VerticalTimeline layout="1-column" className="bg-white w-100">
                        {
                            items.map((item, index) => (
                                <VerticalTimelineElement
                                    key={index}
                                    className="vertical-timeline-element--work"
                                    contentStyle={{ background: '#fff', color: '#fff' }}
                                    contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                    icon={<FaSchool />}
                                >
                                    <p className="vertical-timeline-element-title my-0">
                                        <span className="text-dark" style={{fontSize:'18px',fontWeight:'bold'}}>{item.title}</span>
                                        {' '}
                                        <a href="#"
                                            style={{ color: item.status === 1 ? 'green' : 'blue', cursor: 'pointer' }}
                                            onClick={(e) => this.renderTotimedetail(item)}>
                                            {moment(item.createdon).format('ddd DD MMM-YYYY hh:mm A')}
                                        </a>
                                    </p>
                                    <p className="vertical-timeline-element-subtitle  my-1 text-muted">{item.description}</p>

                                </VerticalTimelineElement>
                            ))
                        }
                    </VerticalTimeline>
                </div>
            </Aux>
        );
    }
}

export default windowSize(TimelineComponent);