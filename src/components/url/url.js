import React, { useState } from "react";
import {
  Spinner,
  Button,
  FormGroup,
  ModalFooter,
  Input,
  CustomInput,
  Row,
  Col,
} from "reactstrap";
import moment from "moment";
import Modal from "./Modal";
import AuthContext from "../../context/auth-context";
import QRCode from "qrcode.react";

const Url = ({ url, clickHandler, deleteHandler, updateHandler, ind }) => {
  const { longUrl, shortUrl, clicks, _id, lastDate, status, createdAt } = url;
  const [del, changeDel] = useState(false);
  const [update, changeUpdate] = useState(false);
  const [modal, setModal] = useState(false);
  const [last, changeLast] = useState("");
  const [newStatus, changeStatus] = useState(status);
  const [click, setClick] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <React.Fragment>
            <Modal modal={modal} toggle={toggle} title="URL Details">
              <Row>
                <Col sm="12" md="8">
                  <FormGroup>
                    <div className="p">
                      <b>Original URL: </b>
                      <br />
                      <a
                        className="barLink"
                        href={`${longUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {longUrl}
                      </a>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <div className="p">
                      <b>Compressed URL: </b> <br />
                      <a
                        className="barLink"
                        href={`${shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {shortUrl}
                      </a>
                      <span
                        onClick={async () => {
                          setClick(true);
                          navigator.clipboard.writeText(shortUrl);
                          await setTimeout(() => setClick(false), 1000);
                        }}
                        className={`copyBtn ${click && "copyAnimation"}`}
                      >
                        &#x2398;
                      </span>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <div className="p">
                      <b>Date of Creation:</b> &nbsp;&nbsp;
                      {moment(createdAt).format("Do MMM YYYY")}
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <div className="p">
                      <b>No. of CLicks:</b> &nbsp;&nbsp;{clicks}
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <div className="p">
                      <b>Date of Expiration:</b> &nbsp;&nbsp;
                      {lastDate ? (
                        <div style={{ display: "inline", fontSize: "1.05rem" }}>
                          {moment(lastDate).format("Do MMM YYYY")} @{" "}
                          {moment(lastDate).fromNow()}
                        </div>
                      ) : (
                        "Not Applicable"
                      )}
                    </div>
                    <Input
                      type="date"
                      onChange={(e) => changeLast(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="statusDiv">
                    <div className="p">
                      <b>Status:</b> &nbsp;&nbsp;
                      <span
                        className={`badge badge-secondary ${
                          newStatus ? "active" : ""
                        }`}
                      >
                        Inactive
                      </span>
                      <CustomInput
                        type="switch"
                        id="exampleCustomSwitch"
                        name="customSwitch"
                        checked={newStatus}
                        onChange={(e) => changeStatus(e.currentTarget.checked)}
                      />
                      <span
                        className={`badge badge-success ${
                          !newStatus ? "active" : ""
                        }`}
                      >
                        Active
                      </span>
                    </div>
                  </FormGroup>
                </Col>
                <Col className="QRContainer" sm="12" md="4">
                  {shortUrl ? (
                    <QRCode
                      value={`${shortUrl}`}
                      size="192"
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="H"
                    />
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
              <ModalFooter>
                <Button
                  color="danger"
                  type="submit"
                  onClick={async () => {
                    changeDel(true);
                    await deleteHandler(ind, _id.toString());
                    changeDel(false);
                    toggle();
                  }}
                >
                  Delete &nbsp;
                  {del && (
                    <>
                      &nbsp;
                      <Spinner
                        color="white"
                        size="sm"
                        className="smallSpinner"
                      />
                      &nbsp;
                    </>
                  )}
                </Button>{" "}
                <div>
                  <Button
                    className="mr-1"
                    color="primary"
                    type="submit"
                    onClick={async () => {
                      changeUpdate(true);
                      await updateHandler(ind, _id.toString(), last, newStatus);
                      changeUpdate(false);
                      toggle();
                    }}
                  >
                    Update &nbsp;
                    {update && (
                      <>
                        &nbsp;
                        <Spinner
                          color="white"
                          size="sm"
                          className="smallSpinner"
                        />
                        &nbsp;
                      </>
                    )}
                  </Button>{" "}
                  <Button color="secondary" onClick={toggle}>
                    Cancel
                  </Button>
                </div>
              </ModalFooter>
            </Modal>
            <li className="item">
              <section>
                <p>
                  <a
                    href={`${longUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="barLink"
                  >
                    {longUrl}
                  </a>
                </p>
              </section>
              <section className="brief">
                <div>
                  <p>
                    <a
                      href={`${shortUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="barLink"
                      onClick={() => {
                        clickHandler(ind);
                      }}
                    >
                      {shortUrl}
                    </a>
                  </p>
                  <span
                    onClick={async () => {
                      setClick(true);
                      navigator.clipboard.writeText(shortUrl);
                      await setTimeout(() => setClick(false), 1000);
                    }}
                    className={`copyBtn ${click && "copyAnimation"}`}
                  >
                    &#x2398;
                  </span>
                </div>
                <Button
                  color="danger"
                  onClick={() => {
                    context.createMessage(false, null);
                    toggle();
                  }}
                >
                  Details
                </Button>
              </section>
            </li>
          </React.Fragment>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default Url;
