import React, { Component } from "react";
import { Row, Col, Button, Table, Form } from "react-bootstrap";
import DEMO from "../../../../store/constant";
import windowSize from "react-window-size";
import Config from "../../../../config";
import Aux from "../../../../hoc/_Aux";
import Axios from "axios";
import {
  loadHeaders,
  loadUserToken,
} from "../../../../store/actions/authactions";
import { createNotification } from "../../../../index";
import Loader from "../../../../App/layout/Loader";
import ReactToPrint from "react-to-print";
import moment from "moment";

class TimelineDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: false,
      job: null,
      shipment: null,
    };
  }
  componentDidMount() {
    const {
      history,
      match: { params },
    } = this.props;
    this.setState({ loading: true });
    this.renderShipment();
    this.renderJob();
    this.renderTimelineDetail(history, params);
  }
  renderShipment = () => {
    const shipment = JSON.parse(localStorage.getItem("shipment"));
    this.setState({ shipment });
  };
  renderJob = () => {
    const job = JSON.parse(localStorage.getItem("job"));
    this.setState({ job });
  };
  renderTimelineDetail = (history, params) => {
    Axios.get(`${Config.prod}/api/report/cart/shipment/${params.id}`, {
      params: {
        token: loadUserToken(),
      },
    })
      .then(({ data }) => {
        this.setState({ loading: false, items: data });
      })
      .catch((error) => {
        createNotification("error", "Please Login Again");
        history.push("/auth/session");
      });
  };
  renderBack = () => {
    const { history } = this.props;
    history.goBack();
  };
  renderupdate = () => {
    const {
      history,
      match: { params },
    } = this.props;
    const { items, shipment } = this.state;
    let reportBox = [];
    items.map((item) => {
      reportBox.push({
        reportDescription: item.reportDescription,
        idcartTx: item.idcartTx,
        idreport_shipment: item.idreport_shipment,
        lineItem: item.lineItem,
        idcmp: item.idcmp,
        idstock: item.idstock,
      });
      return item;
    });
    this.setState({ loading: true });
    Axios.put(
      `${Config.prod}/api/report/cart/shipment/${params.id}`,
      { shipment: reportBox },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: { token: loadUserToken() },
      }
    )
      .then(({ data }) => {
        this.setState({ loading: false });
        createNotification("success", "Successfully updated|");
        history.goBack();
      })
      .catch((error) => {
        createNotification("error", "Please Login Again");
        history.push("/auth/session");
      });
  };
  renderReportBox = (value, item, index) => {
    item.reportDescription = value;
    const { items } = this.state;
    items[index] = item;
    this.setState({
      items,
    });
  };
  renderlineItem = (value, item, index) => {
    item.lineItem = value;
    const { items } = this.state;
    items[index] = item;
    this.setState({
      items,
    });
  };
  render() {
    const { loading, items, job, shipment } = this.state;
    const fontFamilyName = "Calibri, sans-serif";
    const fontSizeBig = "22px";
    const fontSizeMedium = "18px";
    const fontSizeSmall = "16px";
    return (
      <Aux>
        {loading && <Loader />}
        <Row noGutters>
          <Col>
            <Button size="lg" onClick={() => this.renderBack()}>
              Cancel
            </Button>
            <Button size="lg" onClick={() => this.renderupdate()}>
              Save
            </Button>
          </Col>
          <Col>
            <ReactToPrint
              trigger={() => {
                return (
                  <div className="text-right">
                    <a
                      href="#"
                      className="btn btn-primary btn-lg mb-3 disabled"
                    >
                      Print
                    </a>
                  </div>
                );
              }}
              content={() => this.componentRef}
            />
          </Col>
        </Row>

        <div className="p-3" ref={(el) => (this.componentRef = el)}>
          <div
            style={{
              maxWidth: "450px",
              height: "95px",
              padding: "0px",
            }}
          >
            <img
              src={shipment && shipment.image}
              alt="ProcessTec Logo"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </div>
          <Table borderless>
            <tbody>
              <tr className="bg-white">
                <td style={{ border: "none" }}>
                  <div
                    style={{
                      height: "200px",
                      // background: "#e6e6e6",
                      color: "black",
                      borderRadius: "5px",
                      padding: "10px",
                      display: "inline-block",
                      width: "300px",
                    }}
                  >
                    <p
                      className="mb-0"
                      style={{
                        fontFamily: fontFamilyName,
                        color: "black",
                        fontWeight: "bold",
                        fontSize: fontSizeBig,
                      }}
                    >
                      PACKING-SLIP
                    </p>
                    <p
                      className="mb-0"
                      style={{
                        fontFamily: fontFamilyName,
                        fontSize: fontSizeMedium,
                      }}
                    >
                      Status:{" "}
                      {shipment && shipment.status === 1
                        ? "Partial"
                        : "Completed"}
                    </p>

                    <p
                      className="mb-0"
                      style={{
                        fontFamily: fontFamilyName,
                        fontSize: fontSizeMedium,
                      }}
                    >
                      Order: {shipment && shipment.orderConfirmationCode}
                    </p>
                    <p
                      className="mb-0"
                      style={{
                        fontFamily: fontFamilyName,
                        fontSize: fontSizeMedium,
                      }}
                    >
                      {job && (
                        <>
                          {job.fname} {job.lname}
                        </>
                      )}
                    </p>

                    <div className="text-left">
                      <p
                        className="mb-0"
                        style={{
                          fontFamily: fontFamilyName,
                          fontSize: fontSizeMedium,
                        }}
                      >
                        ID: {shipment && shipment.idcart_tx}
                      </p>
                      <p
                        style={{
                          fontFamily: fontFamilyName,
                          fontSize: fontSizeMedium,
                        }}
                      >
                        Date:{" "}
                        {shipment &&
                          moment(shipment.creaatedon).format("MMM-DD-YYYY")}
                      </p>
                    </div>
                  </div>
                </td>

                <td style={{ border: "none" }}>
                  <div
                    className="text-left ml-auto "
                    style={{
                      height: "220px",
                      width: "400px",
                      color: "black",
                      // background: "#dedede",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontWeight: "bold",
                          fontFamily: fontFamilyName,
                          textAlign: "right",
                        }}
                      >
                        PROCESSTEC, Inc.
                      </h3>
                    </div>
                    <div>
                      <p
                        className="mb-0"
                        style={{
                          fontFamily: fontFamilyName,
                          fontSize: fontSizeMedium,
                          wordBreak: "break-all",
                          textAlign: "right",
                        }}
                      >
                        <span>
                          345 E Tulare Ave, Unit E, <br />
                          Visalia CA 93278
                        </span>
                        <br />
                        <span>Phone: (559) 429-4227</span>
                        <br />
                        <span>Fax: (559) 429-4228</span>
                        <br />
                        <span>E-mail: info@processtec.com</span> <br />
                        <span>Contractor License: 804551</span>
                      </p>
                      {/* <p className="mb-0">Contractor License # 804551</p> */}
                    </div>
                  </div>
                </td>
              </tr>
              <tr></tr>
            </tbody>
          </Table>

          <Table borderless>
            <tbody>
              <tr className="bg-white">
                <td style={{ border: "none" }}>
                  <div
                    style={{
                      // background: "#e6e6e6",
                      color: "black",
                      borderRadius: "5px",
                      padding: "10px",
                      height: "180px",
                      maxWidth: "250px",
                      display: "inline-block",
                      whiteSpace: "pre-line",
                    }}
                  >
                    <p
                      className="m-0"
                      style={{
                        fontFamily: fontFamilyName,
                        fontSize: fontSizeMedium,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: fontFamilyName,
                          fontSize: fontSizeBig,
                          fontWeight: "bold",
                        }}
                      >
                        Ship To :<br />
                      </span>{" "}
                      {shipment && shipment.projectSiteAddress}
                    </p>
                  </div>
                </td>
                <td style={{ border: "none" }}>
                  <div
                    style={{
                      // background: "#e6e6e6",
                      color: "black",
                      borderRadius: "5px",
                      padding: "10px",
                      width: "400px",
                      marginLeft: "auto",
                      height: "180px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: fontFamilyName,
                        fontSize: fontSizeMedium,
                        textAlign: "right",
                      }}
                    >
                      Customer Reference: PO#{" "}
                      <span>
                        {shipment && shipment.customerReferenceNumber}
                      </span>
                    </p>
                    {/* <p>
                      Tracking: <span className="font-weight-bold">Todo</span>
                    </p> */}
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
          <Table
            striped
            bordered
            style={{
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "center",
                  color: "black",
                  fontFamily: fontFamilyName,
                  fontSize: fontSizeMedium,
                }}
              >
                <th
                  style={{
                    width: "12%",
                  }}
                >
                  <b>
                    Line
                    <br /> Item
                  </b>
                </th>
                <th
                  style={{
                    width: "10%",
                  }}
                >
                  <b>Image</b>
                </th>
                <th
                  style={{
                    width: "57%",
                  }}
                >
                  <b>Item Description</b>
                </th>
                {/* <th
                  style={{
                    width: "10%",
                  }}
                >
                  <b>Price</b>
                </th> */}
                <th
                  style={{
                    width: "8%",
                  }}
                >
                  <b>
                    Total
                    <br />
                    Ordered
                  </b>
                </th>
                <th
                  style={{
                    width: "9%",
                  }}
                >
                  <b>
                    Shipping
                    <br />
                    now
                  </b>
                </th>
                <th
                  style={{
                    width: "8%",
                  }}
                >
                  <b>
                    Back <br />
                    Order
                  </b>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    background: "white",
                    fontFamily: fontFamilyName,
                    fontSize: fontSizeMedium,
                    color: "black",
                  }}
                >
                  <td style={{ textAlign: "center", color: "black" }}>
                    <Form.Control
                      type="number"
                      min="0"
                      name="lineItem"
                      value={item.lineItem || 0}
                      onChange={(e) =>
                        this.renderlineItem(e.target.value, item, index)
                      }
                    />
                    {/* <span>{item.lineItem}</span> */}
                  </td>
                  <td>
                    <img
                      src={item.componentImage[0]}
                      alt={item.componentUrl}
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                    />
                  </td>
                  <td>
                    <p
                      className="mb-0 overflow-hidden"
                      style={{
                        fontWeight: "bold",
                        fontSize: fontSizeMedium,
                      }}
                    >
                      {item.cmpDescription}
                    </p>
                    <p
                      className="mb-0"
                      style={{
                        fontSize: fontSizeMedium,
                      }}
                    >
                      {item.cmpModel}
                    </p>
                    <p
                      className="mb-0"
                      style={{
                        fontSize: fontSizeMedium,
                      }}
                    >
                      Part# {item.idcmp}
                    </p>
                    <textarea
                      className="mb-0 w-100 form-control"
                      style={{
                        fontSize: fontSizeMedium,
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        display: "block",
                        wordWrap: "break-word",
                      }}
                      value={item.reportDescription}
                      onChange={(e) =>
                        this.renderReportBox(e.target.value, item, index)
                      }
                    >
                      {item.reportDescription}
                    </textarea>
                  </td>
                  {/* <td style={{ textAlign: "center", color: "black" }}>
                    <span>{item.saleprice}</span>
                  </td> */}
                  <td style={{ textAlign: "center", color: "black" }}>
                    <span>{item.quantity}</span>
                  </td>
                  <td style={{ textAlign: "center", color: "black" }}>
                    <span>{item.shippedQuantity}</span>
                  </td>
                  <td style={{ textAlign: "center", color: "black" }}>
                    <span>{item.backOrderQuantity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Aux>
    );
  }
}

export default windowSize(TimelineDetailComponent);
