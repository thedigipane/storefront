import React, { Component } from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
import DEMO from "../../../../store/constant";
import windowSize from "react-window-size";
import Config from "../../../../config";
import Aux from "../../../../hoc/_Aux";
import Axios from "axios";
import { loadUserToken } from "../../../../store/actions/authactions";
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
  renderTimelineDetailEdit = () => {
    const {
      history,
      match: { params },
    } = this.props;
    history.push(`/basic/reports/timeline/edit/detail/${params.id}`);
  };
  render() {
    const { loading, items, job, shipment } = this.state;
    const fontFamilyName = "Calibri, sans-serif";
    const lineSpacing = "200%";
    const fontSizeBig = "22px";
    const fontSizeMedium = "16px";
    const fontSizeSmall = "15px";
    return (
      <Aux>
        {loading && <Loader />}
        <Row noGutters>
          <Col className="px-3">
            <Button size="lg" onClick={() => this.renderTimelineDetailEdit()}>
              Edit
            </Button>
          </Col>
          <Col>
            <ReactToPrint
              trigger={() => {
                return (
                  <Row noGutters>
                    <Col className="text-right">
                      <a href="#" className="btn btn-primary btn-lg mb-3">
                        Print
                      </a>
                    </Col>
                  </Row>
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
                      lineHeight: lineSpacing,
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
                      lineHeight: lineSpacing,
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
                      lineHeight: lineSpacing,
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
                      lineHeight: lineSpacing,
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
          <br />
          <br />
          <br />
          <br />
          <br />
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
                  fontSize: fontSizeSmall,
                }}
              >
                <th
                  style={{
                    width: "9%",
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
                    width: "58%",
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
                    width: "10%",
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
                    <span>{item.lineItem}</span>
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
                      className="mb-0"
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
                        color: "#d9272b",
                      }}
                    >
                      Part# {item.idcmp}
                    </p>
                    <div
                      className="mb-0"
                      style={{
                        fontSize: fontSizeMedium,
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                      }}
                    >
                      {item.reportDescription}
                    </div>
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
