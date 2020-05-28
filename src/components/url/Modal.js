import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

const ModalBox = ({ modal, toggle, title, children }) => {
  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
    </Modal>
  );
};

export default ModalBox;
