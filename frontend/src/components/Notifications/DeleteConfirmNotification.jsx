import React, { useState, forwardRef, useImperativeHandle } from "react";
import CustomNotificationModal from "./CustomNotificationModal";
import { Button } from "antd";

const DeleteConfirmNotification = ({
  deleteConfirmRef
}) => {
  const [promiseInfo, setPromiseInfo] = useState({});
  const [isVisible, setIsVisible] = useState(false)

  React.useEffect(() => {
    deleteConfirmRef.current = show;
  }, []);

  const show = async () => {
    setIsVisible(true);
    return new Promise((resolve, reject) => {
      setPromiseInfo({
        resolve,
        reject
      });
    });
  };

  const close = async () => {
    setIsVisible(false);
    promiseInfo.reject()
  };

  const confirm = async () => {
    setIsVisible(false);
    promiseInfo.resolve(true)
  };

  return (
    <CustomNotificationModal isVisible={isVisible} close={close} height={210}>
      <div
        className="d-flex flex-column align-items-center justify-content-around"
        style={{ height: "100%" }}
      >
        <p style={{ maxWidth: 261, textAlign: "center", fontSize: 18 }}>
          Are you sure you want to delete selected notifications?
        </p>
        <div>
          <Button
            type="text"
            style={{ color: "#9D9D9D", fontSize: 16 }}
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="text"
            style={{ color: "#E94614", fontSize: 16 }}
            onClick={confirm}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </CustomNotificationModal>
  );
};

export default DeleteConfirmNotification;
