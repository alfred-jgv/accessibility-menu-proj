import React, { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles

function ToastMessage({ show, message, title }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1050,
      }}
    >
      <Toast show={show} animation>
        <Toast.Header>
          
          <strong className="me-auto">{title}</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </div>
  );
}

export default ToastMessage;
