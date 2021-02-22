import React, { Component } from "react";
import { Row, Col, Card, Button, Collapse } from "react-bootstrap";
import DEMO from "../../../store/constant";
import windowSize from "react-window-size";
import Config from "../../../config";
import Aux from "../../../hoc/_Aux";
import Axios from "axios";
import { loadUserToken } from "../../../store/actions/authactions";
import { createNotification } from "../../../index";
import Loader from "../../../App/layout/Loader";
import AddToCartModal from "./addtocartmodal";

class ProductDetail extends Component {
  state = {
    show: false,
    item: {},
    loading: true,
    searchData: JSON.parse(localStorage.getItem("searchitem")),
    showAddToCartModal: false,
  };

  componentDidMount() {
    const {
      history,
      match: { params },
    } = this.props;
    window.addEventListener("keydown", this.renderCosmeticClicks);
    Axios.get(`${Config.prod}/api/stock/component/${params.componentid}`, {
      params: {
        token: loadUserToken(),
      },
    })
      .then(({ data }) => {
        this.setState({ item: data[0], loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        createNotification("error", "Please Login Again");
        history.push("/auth/session");
      });
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.renderCosmeticClicks);
  }
  renderCosmeticClicks = (event) => {
    // const { history } = this.props;
    if (!(event.ctrlKey && event.altKey)) {
      return;
    }

    let keyPressed = String(event.key).toLowerCase();
    if (navigator.appVersion.indexOf("Mac") != -1) {
      keyPressed = event.code;
    }

    switch (keyPressed) {
      case "KeyQ":
      case "q":
        this.renderProducts();
        break;

      case "KeyO":
      case "o":
        this.renderProducts();
        break;

      case "KeyP":
      case "p":
        this.addProduct();
        break;

      case "KeyW":
      case "w":
        this.addtoCart();
        break;

      case "KeyE":
      case "e":
        this.renderDetail();
        break;
      default:
        return;
    }
  };
  addProduct = () => {
    createNotification("info", "Add Product");
  };
  addtoCart = () => {
    this.setState((state) => ({
      showAddToCartModal: !state.showAddToCartModal,
    }));
  };
  renderProducts = () => {
    const { history } = this.props;
    const { item } = this.state;
    if (item) {
      if (item.idstock && item.idcmp) {
        history.push(`/basic/products/${item.idstock}/${item.idcmp}`);
      } else {
        createNotification("info", "Not Available");
      }
    } else {
      createNotification("info", "Not Available");
    }
  };
  renderDetail = () => {
    this.setState((state) => ({
      show: !state.show,
    }));
  };
  render() {
    const { show, item, loading, searchData, showAddToCartModal } = this.state;
    const { history } = this.props;
    return (
      <Aux>
        {!loading ? (
          <>
            <Row>
              <Col className="col-12 col-md-4">
                <Card>
                  <Card.Body>
                    <h6> {searchData.companyname}</h6>
                    {
                      <img
                        alt={searchData.imagedescription || "no image"}
                        src={searchData.images ? searchData.images[0] : ""}
                        className="img-fluid"
                      />
                    }
                  </Card.Body>
                </Card>
              </Col>

              <Col className="col-12 col-md-8">
                <Card>
                  <Card.Body>
                    <h5>
                      <b>{searchData.categorydescription}</b>
                    </h5>
                    <h6>
                      <b>Component ID: {searchData.componentid}</b>
                    </h6>
                    <h6>
                      <b>Model ID: {searchData.modelid}</b>{" "}
                    </h6>
                    <h6>
                      <b>Size: {searchData.sizes}</b>{" "}
                    </h6>
                    <h6>
                      <b>Price: {item ? item.price : 0}</b>{" "}
                    </h6>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Card>
              <Card.Body>
                <Row>
                  <Col className="col-12 col-sm-6 d-flex justify-content-around">
                    <Button
                      size="lg"
                      variant="primary"
                      onClick={() => this.renderProducts()}
                    >
                      <b>{item ? item.availablequantity : 0}</b> Available
                    </Button>
                    <Button
                      size="lg"
                      variant="primary"
                      onClick={() => this.renderProducts()}
                    >
                      <b>{item ? item.orderedquantity : 0}</b> Ordered
                    </Button>
                  </Col>
                  <Col className="col-12 col-sm-6 d-flex justify-content-around">
                    <Button
                      size="lg"
                      variant="primary"
                      onClick={() => this.addProduct()}
                    >
                      Add Product
                    </Button>
                    <Button
                      size="lg"
                      variant="primary"
                      onClick={() => this.addtoCart()}
                    >
                      Add to Cart
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title as="h5">
                  <a
                    href={DEMO.BLANK_LINK}
                    onClick={() => this.setState({ show: !show })}
                    aria-controls="accordion1"
                    aria-expanded={show}
                  >
                    Details
                  </a>
                </Card.Title>
              </Card.Header>
              <Collapse in={show}>
                <div id="accordion1">
                  <Card.Body>
                    <h6>
                      <b>Taxonomy:</b> {searchData.taxonomy}
                    </h6>
                    <h6>
                      <b>Category description: </b>
                      {searchData.categorydescription}
                    </h6>
                    <h6>
                      <b>Stockroomlabel: </b>
                      {searchData.stockroomlabel}
                    </h6>
                    <h6>
                      <b>Design Description: </b>
                      {searchData.designdescription}
                    </h6>
                    <h6>
                      <b>Elastomers: </b> {searchData.elastomers}
                    </h6>
                    <h6>
                      <b>Materials: </b>
                      {searchData.materials}
                    </h6>
                    <br />
                    <h6>
                      <b>Company Name: </b>
                      {searchData.companyname}
                    </h6>
                    <h6>
                      <b>Manufacturers Symbol: </b>
                      {searchData.manufacturerssymbol}
                    </h6>
                    <h6>
                      <b>Model Name: </b>
                      {searchData.mfgmodelnumber}
                    </h6>
                    <h6>
                      <b>Mfgpart Number: </b>
                      {searchData.mfgpartnumber}
                    </h6>
                    <h6>
                      <b>Manufacturer Id: </b>
                      {searchData.manufacturerid}
                    </h6>
                    <br />
                    <h6>
                      <b>Category Code: </b>
                      {searchData.categorycode}
                    </h6>
                    <h6>
                      <b>Configuration Key: </b>
                      {searchData.configurationkey}
                    </h6>
                    <h6>
                      <b>Subcomponent Configurations: </b>
                      {searchData.subcomponentconfigurations}
                    </h6>
                    <h6>
                      <b>Taxonomy Code: </b>
                      {searchData.taxonomycode}
                    </h6>
                    <h6>
                      <b>Universal Productcode: </b>
                      {searchData.universalproductcode}
                    </h6>
                    <h6>
                      <b>Configurations: </b>
                      {searchData.configurations}
                    </h6>
                  </Card.Body>
                </div>
              </Collapse>
            </Card>
          </>
        ) : (
          <Loader />
        )}
        {showAddToCartModal ? (
          <AddToCartModal
            idstock={item && item.idstock}
            addtoCart={this.addtoCart}
            history={history}
          />
        ) : (
          ""
        )}
      </Aux>
    );
  }
}

export default windowSize(ProductDetail);
