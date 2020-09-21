import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import config from '../../../../config';
import navigation from '../../../../menu-items';
import DEMO from "../../../../store/constant";
import Aux from "../../../../hoc/_Aux";

class Breadcrumb extends Component {
    state = {
        main: [],
        item: [],
        custom: false
    };

    componentDidMount() {
        (navigation.items).map((item, index) => {
            if (item.type && item.type === 'group') {
                this.getCollapse(item, index);
            }
            return false;
        });
    };

    componentWillReceiveProps = () => {
        (navigation.items).map((item, index) => {
            if (item.type && item.type === 'group') {
                this.getCollapse(item);
            }
            return false;
        });
    };

    getCollapse = (item) => {

        if (item.children) {
            (item.children).filter(collapse => {
                if (collapse.type && collapse.type === 'collapse') {
                    this.getCollapse(collapse,);
                } else if (collapse.type && collapse.type === 'item') {
                    if (document.location.pathname === config.basename + collapse.url) {
                        this.setState({ item: collapse, main: item, custom: false });
                    }
                } else if (collapse.type && collapse.type === 'custom') {
                    let pathname = String(document.location.pathname).includes(config.basename + collapse.url);
                    if (pathname) {
                        this.setState({ item: collapse, main: item, custom: true });
                    }
                }
                return false;
            });
        }
    };
    renderToParentUrl = (e, url) => {
        e.preventDefault();
        const { history } = this.props;

        history.push(this.state.item.parent.url)
    }
    render() {
        let main, item;
        let breadcrumb = '';
        let title = 'Welcome';
        if (this.state.main && this.state.main.type === 'collapse') {
            main = (
                <li className="breadcrumb-item">
                    <a href={DEMO.BLANK_LINK}>{this.state.main.title}</a>
                </li>
            );
        }

        if (this.state.item && this.state.item.type === 'item') {
            title = this.state.item.title;
            item = (
                <li className="breadcrumb-item">
                    <a href={DEMO.BLANK_LINK}>{title}</a>
                </li>
            );

            if (this.state.item.breadcrumbs !== false) {
                breadcrumb = (
                    <div className="page-header">
                        <div className="page-block">
                            <div className="row align-items-center">
                                <div className="col-md-12">
                                    <div className="page-header-title">
                                        <h5 className="m-b-10">{title}</h5>
                                    </div>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/"><i className="feather icon-home" /></Link>
                                        </li>
                                        {main}
                                        {item}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

        }
        if (this.state.item && this.state.item.type === 'custom') {
            title = this.state.item.title;
            item = (
                <>
                    <li className="breadcrumb-item">
                        <a href={this.state.item.parent.url} onClick={(e) => this.renderToParentUrl(e, this.state.item.parent.url)}>{this.state.item.parent.title}</a>
                    </li>
                    <li className="breadcrumb-item">
                        <a href={DEMO.BLANK_LINK}>{title}</a>
                    </li>
                </>
            );

            if (this.state.item.breadcrumbs !== false) {
                breadcrumb = (
                    <div className="page-header">
                        <div className="page-block">
                            <div className="row align-items-center">
                                <div className="col-md-12">
                                    <div className="page-header-title">
                                        <h5 className="m-b-10">{title}</h5>
                                    </div>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/"><i className="feather icon-home" /></Link>
                                        </li>
                                        {main}
                                        {item}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

        }

        document.title = title;
        return (
            <Aux>
                {breadcrumb}
            </Aux>
        );
    }
}

export default withRouter(Breadcrumb);
