import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isUserAuthenticated, setNewToken } from './store/actions/authactions';
import Axios from 'axios';
import config from './config';
import Loader from './App/layout/Loader';
import * as actions from './store/actions/validatecomp.action';
import { connect } from 'react-redux';

import qs from 'querystring';

export default function (ComposedComponent) {

    class Authentication extends Component {
        state = {
            valid: false
        }
        componentDidMount() {
            const { history } = this.props;
            // get(`${config.prod}/api/token`,{data:{token:localStorage.getItem('mannkamal_user_token')}})
            // Axios.get(`${config.prod}/api/token`, {token:localStorage.getItem('mannkamal_user_token')}).then(result => {
            //     this.setState({ valid: true })
            // }).catch(error => {

            // })
            if(localStorage.getItem('mannkamal_user_token')){
                Axios(`${config.prod}/api/token`, {
                    method: 'GET', // or 'PUT'
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: { token: localStorage.getItem('mannkamal_user_token') },
                })
                    .then(({ data: { verified } }) => {
                        if (verified) {
                            this.props.validateRoute(true);
                            this.setState({ valid: true })
                        } else {
                            Axios(`${config.prod}/api/token`, {
                                method: 'POST', // or 'PUT'
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: qs.stringify({ username: 'adureg', token: localStorage.getItem('mannkamal_user_refresh') }),
                            }).then(({ data: { token } }) => {
                                setNewToken(token);
                                this.props.validateRoute(true);
                                this.setState({ valid: true })
                            }).catch(error => {
                                history.push('/auth/session')
                            })
                        }
    
                    }).catch(error => {
                        history.push('/auth/session')
                    })
            }else{
                history.push('/auth/session')
            }
            
        }

        render() {
            let isValidToken = isUserAuthenticated();
            if (isValidToken) {
                if (this.state.valid) {
                    return <ComposedComponent {...this.props} />;
                } else {
                    return <Loader />
                }
                // return <ComposedComponent {...this.props} />;
            }
            else {
                return <Redirect to="/login" />
            };
        }
    }

    const mapStateToProps = state => ({
        auth: state.auth,
        error: state.error
    })
    return connect(mapStateToProps, actions)(Authentication);
}
