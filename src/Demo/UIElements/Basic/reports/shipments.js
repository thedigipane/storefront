import React, { Component } from "react";
import { Row, Col, Card } from "react-bootstrap";
import DEMO from "../../../../store/constant";
import windowSize from "react-window-size";
import Config from "../../../../config";
import Aux from "../../../../hoc/_Aux";
import Axios from "axios";
import { loadUserToken } from "../../../../store/actions/authactions";
import { createNotification } from "../../../../index";
import moment from "moment";

let style = {
  width: "100%",
  background: "none",
  marginLeft: "0px",
  minHeight: "0px",
  zIndex: 0,
};
class ShipmentComponent extends Component {
  state = {
    search: "",
    items: [],
    isLoading: false,
    check: false,
    timeout: null,
  };
  componentDidMount() {
    const { history } = this.props;
    window.addEventListener("keydown", this.renderCosmeticClicks);
    Axios.get(`${Config.prod}/api/report/cart/all`, {
      params: {
        token: loadUserToken(),
      },
    })
      .then(({ data }) => {
        // console.log(data);
        this.setState({ items: data });
      })
      .catch((error) => {
        createNotification("error", "Please Login Again");
        history.push("/auth/session");
      });
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.renderCosmeticClicks);
  }
  renderCosmeticClicks = (event) => {
    // const { history } = this.props;
    if (event.ctrlKey && event.altKey && event.key == 0) {
      this.renderSearchField();
      return;
    }
    const { history } = this.props;
    const { items } = this.state;
    items.map((item, index) => {
      if (event.ctrlKey && event.altKey && event.key == index + 1) {
        localStorage.setItem("searchitem", JSON.stringify(item));
        history.push(`/basic/detail/${item.componentid}`);
      }
      return item;
    });
  };
  searchOnHandler = () => {
    const { search } = this.state;
    if (search !== "") {
      alert("You Enter " + search);
    }
  };

  searchOffHandler = () => {
    this.setState({ search: "" });
  };
  renderByCheckId = (check) => {
    this.setState({ search: "", items: [], check: !check });
  };
  renderSearchField = () => {
    let input = document.getElementById("m-search");
    input.focus();
  };
  HandleInput = (e) => {
    // let search = e.target.value;
    // const { check, timeout } = this.state;
    // const { history } = this.props;
    // this.setState({
    //     [e.target.name]: search
    // })
    // if (search.length > 2) {
    //     this.debounce(() => {
    //         this.callSearchApi(check, history, search)
    //     }, 500)
    // } else {
    //     clearTimeout(timeout)
    //     this.setState({ timeout: null })
    // }
  };
  debounce = (func, wait) => {
    let { timeout } = this.state;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func();
    }, wait);
    this.setState({
      timeout: timeout,
    });
  };
  renderToTimeline = (item) => {
    const { history } = this.props;
    localStorage.setItem("job", JSON.stringify(item));
    history.push(`/basic/reports/timeline/${item.idcart_tx}`);
  };
  render() {
    const { items, check } = this.state;
    const { history } = this.props;
    return (
      <Aux>
        <div className="pcoded-header mb-3" style={style}>
          <div id="main-search" className="main-search open ml-0 w-100">
            <div className="input-group" style={{ height: "50px" }}>
              <input
                type={check ? "number" : "text"}
                id="m-search"
                className="form-control"
                placeholder="Search . . ."
                name="search"
                value={this.state.search}
                onChange={(e) => this.HandleInput(e)}
              />
              <a
                href={DEMO.BLANK_LINK}
                className="input-group-append search-close"
                onClick={() => this.searchOffHandler()}
              >
                <i
                  className="feather icon-x input-group-text"
                  style={{ fontSize: "22px" }}
                />
              </a>
            </div>
          </div>
        </div>
        <Row>
          {items.map((item, index) => (
            <Col className="col-12 col-sm-6 col-lg-4  mb-2" key={index}>
              <Card
                className={
                  item.status === 1 ? "bg-sunny-morning" : "bg-info text-white"
                }
                style={{ borderRadius: "5px", cursor: "pointer" }}
                onClick={(e) => this.renderToTimeline(item)}
              >
                <Card.Body>
                  <p className="mb-2">
                    <b>{item && item.title_oc}</b>
                  </p>
                  <p className="mb-2">
                    <b>{item && item.customerreferencenumber}</b>
                  </p>
                  <p className="mb-2">
                    <b>{item.jobname}</b>
                  </p>
                  <p className="mb-2">
                    Cost Center Id:s <b>{item.costcenterid}</b>
                  </p>
                  <p className="mb-5">
                    OC Id: <b>{item.idOC}</b>
                  </p>
                  <p className="mb-2">
                    {moment(item.createdOn).format("ddd DD MMM-YYYY hh:mm A")}
                  </p>
                  <p className="mb-2">
                    {item.fname} {item.lname}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Aux>
    );
  }
}

export default windowSize(ShipmentComponent);
