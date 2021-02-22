import React, { Component } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
// import DEMO from '../../../store/constant';
import windowSize from "react-window-size";
import Config from "../../../config";
import Aux from "../../../hoc/_Aux";
import Axios from "axios";
import { loadUserToken } from "../../../store/actions/authactions";
import { createNotification } from "../../../index";
import Loader from "../../../App/layout/Loader";
import { FaPlus } from "react-icons/fa";

class CartComponent extends Component {
  state = {
    items: [],
    loading: null,
  };
  componentDidMount() {
    const { history } = this.props;
    this.setState({ loading: true });
    window.addEventListener("keydown", this.renderCosmeticClicks);
    Axios.get(Config.prod + "/api/cart/all", {
      params: {
        token: loadUserToken(),
      },
    })
      .then(({ data }) => {
        this.setState({
          items: data,
          loading: false,
        });
      })
      .catch((error) => {
        createNotification("error", "Please Login Again");
        this.setState({ loading: false });
        history.push("/auth/session");
      });
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.renderCosmeticClicks);
  }

  renderCosmeticClicks = (event) => {
    const { history } = this.props;
    const { items } = this.state;

    if (!(event.ctrlKey && event.altKey)) {
      return;
    }
    let keyPressed = String(event.key).toLowerCase();
    if (navigator.appVersion.indexOf("Mac") != -1) {
      keyPressed = event.code;
    }

    switch (keyPressed) {
      case "KeyN":
      case "n":
        history.push("/basic/newcart");
        return;
      default:
        break;
    }
    items.map((item, index) => {
      if (event.key == index + 1) {
        history.push("/basic/cartdetail/" + item.idcart);
      }
      return item;
    });
  };
  render() {
    const { items, loading } = this.state;
    const { history } = this.props;
    return (
      <Aux>
        <Row>
          <Col className="text-right">
            <Button size="sm" onClick={() => history.push("/basic/newcart")}>
              <FaPlus />
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          {items.map((item, index) => (
            <Col className="col-12 col-sm-6 col-lg-4  mb-2" key={index}>
              <Card
                style={{ borderRadius: "5px", cursor: "pointer" }}
                onClick={() => history.push("/basic/cartdetail/" + item.idcart)}
              >
                <Card.Body>
                  <h5>
                    <b>{item.description}</b>
                  </h5>
                  <h6>
                    <b>Cart ID: </b>
                    {item.idcart}
                  </h6>
                  <h6>
                    <b>Order Confitmation ID: </b>
                    {item.idPO}
                  </h6>
                  <h6>
                    <b>Job Name: </b>
                    {item.jobname}
                  </h6>
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
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {loading ? <Loader /> : ""}
      </Aux>
    );
  }
}

export default windowSize(CartComponent);
