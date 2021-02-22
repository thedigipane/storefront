import React, { Component } from "react";
import { Modal, Row, Col, Card, Form } from "react-bootstrap";
import DEMO from "../../../store/constant";
import Config from "../../../config";
import Axios from "axios";
import { loadUserToken } from "../../../store/actions/authactions";
import { createNotification } from "../../../index";

let style = {
  width: "100%",
  background: "none",
  marginLeft: "0px",
  minHeight: "0px",
  zIndex: 0,
};
class NewCartSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      search: "",
      items: [],
      isLoading: false,
      check: false,
      timeout: null,
    };
  }
  componentDidMount() {
    window.addEventListener("keydown", this.renderCosmeticClicks);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.renderCosmeticClicks);
  }
  renderCosmeticClicks = (event) => {
    // const { history } = this.props;
    if (!(event.ctrlKey && event.altKey)) {
      return;
    }
    if (event.ctrlKey && event.altKey && event.key == 0) {
      this.renderSearchField();
      return;
    }
    const { items } = this.state;
    items.map((item, index) => {
      if (event.ctrlKey && event.altKey && event.key == index + 1) {
        this.renderCart(item);
      }
      return item;
    });
  };
  renderSearchField = () => {
    let input = document.getElementById("m-search");
    input.focus();
  };
  renderModal = () => {
    this.setState({ show: false });
    setTimeout(() => {
      this.props.renderModal();
    }, 1000);
  };
  searchOffHandler = () => {
    this.setState({ search: "" });
  };
  HandleInput = (e) => {
    let search = e.target.value;
    const { check, timeout } = this.state;
    const { history } = this.props;
    this.setState({
      [e.target.name]: search,
    });
    if (search.length > 2) {
      this.debounce(() => {
        this.callSearchAPi(check, history, search);
      }, 500);
    } else {
      clearTimeout(timeout);
      this.setState({ timeout: null });
    }
  };
  callSearchAPi = (check, history, search) => {
    Axios.get(
      `${Config.prod}/api/oc/${check ? search : `search?q=${search}`}`,
      {
        params: {
          token: loadUserToken(),
        },
      }
    )
      .then(({ data }) => {
        // console.log(data);
        this.setState({ items: data });
      })
      .catch((error) => {
        createNotification("error", "Please Login Again");
        history.push("/auth/session");
      });
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
  renderByCheckId = (check) => {
    this.setState({ search: "", items: [], check: !check });
  };
  renderSearchField = () => {
    let input = document.getElementById("m-search");
    input.focus();
  };
  renderCart = (item) => {
    this.setState({
      show: false,
    });
    setTimeout(() => {
      this.props.renderCart({
        ocId: item.orderconfirmationid,
        jobname: item.jobname,
        costcenterid: item.costcenterid,
        contactinfo: item.contactinfo,
        title: item.title,
      });
    }, 1000);
  };
  render() {
    const { items, check, show } = this.state;
    return (
      <Modal
        show={show}
        onHide={() => this.renderModal()}
        dialogClassName="custom-modal"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          {/* <Modal.Title id="example-custom-modal-styling-title">
                        Custom Modal Styling
                </Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <div className="pcoded-header" style={style}>
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
                  <div className="checkbox checkbox-fill d-inline">
                    <input
                      type="checkbox"
                      name="checkbox-fill-1"
                      id="checkbox-fill-a1"
                      onClick={() => this.renderByCheckId(check)}
                    />
                    <label htmlFor="checkbox-fill-a1" className="cr">
                      By Id
                    </label>
                  </div>
                </div>
              </Form>
            </Col>
          </Row>
          <Row>
            {items.map((item, index) => (
              <Col className="col-12 col-sm-6 col-lg-4  mb-2" key={index}>
                <Card
                  style={{ borderRadius: "5px", cursor: "pointer" }}
                  onClick={() => this.renderCart(item)}
                >
                  <Card.Body>
                    <div>
                      <h6>
                        <b>Title: </b>
                        {item.title}
                      </h6>
                      <h6>
                        <b>Customer# </b>
                        {item.customerreferencenumber}
                      </h6>
                      <h6>
                        <b>Order Confirmation#</b> {item.orderconfirmationid}
                      </h6>
                      <h6>
                        <b>Job Name: </b>
                        {item.jobname}
                      </h6>
                      <h6>
                        <b>Cost Center Id: </b>
                        {item.costcenterid}
                      </h6>
                      <h6>
                        <b>Contact Info: </b>
                        {item.contactinfo}
                      </h6>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    );
  }
}

export default NewCartSearch;
