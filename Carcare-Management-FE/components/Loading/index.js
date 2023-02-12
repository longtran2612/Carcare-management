import { Alert, Row, Spin } from "antd";
import React from "react";

function Loading({ loading = false }) {
  return (
    <>
      {loading && (
        <div className="wrapper-loading">
          <div className="spinner-3"></div>
        </div>
      )}
    </>
  );
}

export default Loading;
