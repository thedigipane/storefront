import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  FormGroup,
  FormControl,
  Modal,
  Button,
} from "react-bootstrap";
import DEMO from "../../../store/constant";
import windowSize from "react-window-size";
import Config from "../../../config";
import Aux from "../../../hoc/_Aux";
import Axios from "axios";
import { loadUserToken } from "../../../store/actions/authactions";
import { createNotification } from "../../../index";
import { FaShoppingCart } from "react-icons/fa";
import Select from "react-select";
let style = {
  width: "100%",
  background: "none",
  marginLeft: "0px",
  minHeight: "0px",
  zIndex: 0,
};
class DataGrid extends Component {
  state = {
    search: "",
    items: [],
    isLoading: false,
    check: false,
    timeout: null,
    selectedcheckbox: [],
    showAddToCartModal: false,
    show: false,
    carts: [],
    cart: null,
    itemshow: false,
  };
  componentDidMount() {
    window.addEventListener("keydown", this.renderCosmeticClicks);
    const { history } = this.props;
    Axios.get(Config.prod + "/api/cart/all", {
      params: {
        token: loadUserToken(),
      },
    })
      .then(({ data }) => {
        this.setState({
          carts: data,
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          createNotification("error", error.response.data.error);
        } else {
          createNotification("error", "Please Login Again");
          this.setState({ loading: false });
          history.push("/auth/session");
        }
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
  callSearchApi = (check, history, search) => {
    Axios.get(
      `${Config.prod}/api/component/${check ? search : `search?q=${search}`}`,
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
        if (error.response && error.response.status === 400) {
          createNotification("error", error.response.data.error);
        } else {
          createNotification("error", "Please Login Again");
          this.setState({ loading: false });
          history.push("/auth/session");
        }
      });
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
        this.callSearchApi(check, history, search);
      }, 500);
    } else {
      clearTimeout(timeout);
      this.setState({ timeout: null });
    }
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
  renderSelectedCheckbox = (id) => {
    const { selectedcheckbox } = this.state;
    const check = selectedcheckbox.findIndex((item) => item === id);
    if (check !== -1) {
      selectedcheckbox.splice(check, 1);
      this.setState({
        selectedcheckbox,
      });
    } else {
      selectedcheckbox.push(id);
      this.setState({
        selectedcheckbox,
      });
    }
  };
  onCancelCheckout = () => {
    this.setState((state) => ({
      showAddToCartModal: !state.showAddToCartModal,
      show: !state.show,
    }));
  };
  renderAddtocartbutton = () => {
    const { history } = this.props;
    const { selectedcheckbox, cart } = this.state;
    if (selectedcheckbox.length == 0) {
      createNotification("error", "Please Select Atleast One Item");
      return;
    }
    Axios.post(
      `${Config.prod}/api/cart/${cart.idcart}/products`,
      { cmpIds: selectedcheckbox },
      {
        params: {
          token: loadUserToken(),
        },
      }
    )
      .then(({ data }) => {
        console.log(data);
        if (data.code === "ER_DUP_ENTRY") {
          createNotification("error", data.message);
        } else {
          createNotification("success", "Added To Cart");
          this.onCancelCheckout();
        }
        // this.setState({ items: data })
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          this.onCancelCheckout();
          createNotification("error", error.response.data.error);
        } else {
          createNotification("error", "Please Login Again");
          this.setState({ loading: false });
          history.push("/auth/session");
        }
      });
  };
  renderSelect = () => {
    this.setState((state) => ({
      itemshow: !state.itemshow,
    }));
  };
  renderItem = (item) => {
    this.setState({
      cart: item,
    });
  };
  addToCart = () => {
    const { cart } = this.state;
    if (!cart) {
      createNotification("error", "Please Select Cart");
      return;
    }
    this.renderAddtocartbutton();
  };

  render() {
    const {
      items,
      check,
      showAddToCartModal,
      show,
      itemshow,
      carts,
      cart,
    } = this.state;
    const { history } = this.props;
    return (
      <Aux>
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
            <Col className="col-12 col-sm-6 col-lg-4  mb-2 px-1" key={index}>
              <div className="bg-white h-100">
                <Card
                  className="mb-0"
                  style={{
                    borderRadius: "5px",
                    cursor: "pointer",
                    background: "none",
                    boxShadow: "none",
                  }}
                  onClick={() => {
                    history.push(`/basic/detail/${item.componentid}`);
                    localStorage.setItem("searchitem", JSON.stringify(item));
                  }}
                >
                  <Row className="p-2 pt-3" noGutters>
                    <Col className="col-5 p-2">
                      {
                        <img
                          alt={item.imagedescription}
                          src={item.images[0]}
                          className="img-fluid"
                        />
                      }
                    </Col>
                    <Col className="col-7 pt-3 text-right pr-3">
                      <h6>
                        <b>{item.categorydescription}</b>
                      </h6>
                      <h6>
                        Part# <b>{item.componentid}</b>
                      </h6>
                      <h6>
                        Company: <b>{item.companyname}</b>
                      </h6>
                      <h6>
                        Model Name: <b>{item.mfgmodelnumber}</b>
                      </h6>
                      {/* <h6  ><b>Supplier-Company:</b> {item.companyname}</h6> */}
                    </Col>
                  </Row>
                  <Card.Body className="py-0">
                    <div>
                      <h6>
                        <b>Taxonomy: </b> {item.taxonomy}
                      </h6>
                      <h6>
                        <b>Elastomers: </b>
                        {item.elastomers}
                      </h6>
                      <h6>
                        <b>Materials: </b>
                        {item.materials}
                      </h6>
                    </div>
                  </Card.Body>
                </Card>
                <div className="text-right">
                  <div className="checkbox checkbox-fill d-inline">
                    <input
                      type="checkbox"
                      name={`checkbox-fill-item-${index}`}
                      id={`checkbox-fill-item-${index}`}
                      onClick={() =>
                        this.renderSelectedCheckbox(item.componentid)
                      }
                    />
                    <label
                      htmlFor={`checkbox-fill-item-${index}`}
                      className="cr"
                    ></label>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <div
          className="search-add-to-cart-button"
          onClick={() => {
            this.setState({ cart: null });
            this.onCancelCheckout();
          }}
        >
          <FaShoppingCart />
        </div>
        {showAddToCartModal ? (
          <Modal
            size="md"
            show={show}
            onHide={() => this.onCancelCheckout()}
            aria-labelledby="example-modal-sizes-title-lg"
            centered
          >
            <Card>
              <Card.Body>
                <Form.Group as={Col} className="p-0">
                  <Select
                    ref={(r) => {
                      this.refs = r;
                    }}
                    options={carts.map((item) => {
                      return {
                        label: `${item.title} -- ${item.customerreferencenumber}, OC: ${item.idOC}, CostCenter: ${item.costcenterid}, Cart: ${item.idcart}`,
                        value: item,
                      };
                    })}
                    onChange={(e) => {
                      this.renderItem(e.value);
                    }}
                  />
                </Form.Group>

                <h6>
                  <b>Cart:</b> {cart && cart.idcart}
                </h6>
                <h6>
                  <b>OC:</b> {cart && cart.idOC}
                </h6>
              </Card.Body>
            </Card>
            <Row className="px-3">
              <Col>
                <Button
                  variant="danger"
                  onClick={() => this.onCancelCheckout()}
                >
                  Cancel
                </Button>
              </Col>
              <Col className="text-right" onClick={() => this.addToCart()}>
                <Button>Add</Button>
              </Col>
            </Row>
          </Modal>
        ) : (
          ""
        )}
      </Aux>
    );
  }
}

export default windowSize(DataGrid);
