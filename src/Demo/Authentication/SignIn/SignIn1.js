import React from 'react';
// import { NavLink } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "../../../App/layout/AdminLayout/Breadcrumb";
// import config from '../../../config';
// import qs from 'querystring';
// import axios from 'axios';
import { createNotification } from '../../../index';
import { connect } from 'react-redux';
import { login } from '../../../store/actions/authactions';
class Signin1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isValid: {
                value: false,
                text: ''
            },
        }
    }
    componentDidMount() {
        const { auth, history } = this.props;
        if (auth.isAuthenticated) {
            history.push('/');
        }
    }
    componentDidUpdate(prevProps) {
        const { error, auth, history } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'LOGIN_FAIL') {
                createNotification('error', error.msg)
            } else if (error.id === 'NETWORK_ERROR') {
                createNotification('error', error.msg)
            }
        }
        if (auth.isAuthenticated) {
            history.push('/');
        }
    }
    handleTextChange(event) {
        this.setState({ [event.name]: event.value });
    }
    handleSubmit(e) {
        e.preventDefault();
        const { username, password } = this.state;
        if (!username && username.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Username', name: 'username' } });
            return;
        }

        if (!password && password.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Password', name: 'password' } });
            return;
        }
        this.props.login({ username, password });
        // const data = {
        //     'email': email,
        //     'password': password
        // }
        // const options = {
        //     url: `${config.prod}/api/users/AdminLogin`,
        //     method: 'POST',
        //     headers: {
        //         'content-type': 'application/x-www-form-urlencoded'
        //     },
        //     data: qs.stringify(data)
        // }
        // axios(options)
        //     .then(async response => {
        //         // console.log(response.data);
        //         await this.setSession(response.data);
        //         this.props.history.push('/dashboard');
        //     })
        //     .catch(err => {
        //         // console.log('Error: ', err.response);
        //         if (err.response && err.response.status && (err.response.status === 404 || err.response.status === 400 || err.response.status === 401 || err.response.status === 500)) {
        //             this.setState({ isValid: { value: true, text: err.response.data.msg } });
        //             createNotification('error', err.response.data);
        //         } else {
        //             this.setState({ isValid: { value: true, text: 'Unknown Error' } });
        //             createNotification('error', 'Unknown Error');
        //         }
        //     });
    }


    render() {
        const { auth } = this.props;
        return (
            <Aux>
                <Breadcrumb />
                <div className="auth-wrapper">
                    <div className="auth-content">
                        <div className="auth-bg">
                            <span className="r" />
                            <span className="r s" />
                            <span className="r s" />
                            <span className="r" />
                        </div>
                        <Form onSubmit={(e) => this.handleSubmit(e)}>
                            <div className="card">
                                <div className="card-body text-center">
                                    <div className="mb-4">
                                        <i className="feather icon-unlock auth-icon" />
                                    </div>
                                    <h3 className="mb-4">Login</h3>
                                    <div className="input-group mb-3">
                                        <input type="text"
                                            className={this.state.isValid.value && this.state.isValid.name === 'username' ? 'form-control is-invalid' : 'form-control'}
                                            placeholder="username"
                                            name="username"
                                            onFocus={() => this.setState({ isValid: { value: false, text: '', name: '' } })}
                                            onChange={(e) => this.handleTextChange(e.target)}
                                            required />
                                    </div>
                                    <div className="input-group mb-4">
                                        <input
                                            type="password"
                                            className={this.state.isValid.value && this.state.isValid.name === 'password' ? 'form-control is-invalid' : 'form-control'}
                                            placeholder="password"
                                            name="password"
                                            onFocus={() => this.setState({ isValid: { value: false, text: '', name: '' } })}
                                            onChange={(e) => this.handleTextChange(e.target)}
                                            required />
                                    </div>
                                    {/* <div className="form-group text-left">
                                    <div className="checkbox checkbox-fill d-inline">
                                        <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" />
                                            <label htmlFor="checkbox-fill-a1" className="cr"> Save credentials</label>
                                    </div>
                                </div> */}
                                    <button className="btn btn-primary shadow-2 mb-4" type="submit" disabled={auth.isLoading} >{auth.isLoading ? 'Loading' : 'Login'}</button>

                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </Aux>
        );
    }
}
const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error
})
export default connect(mapStateToProps, { login })(Signin1);