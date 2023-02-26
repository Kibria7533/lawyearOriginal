import React from "react";
import { Modal, Button } from "antd";
import { useMediaQuery } from 'react-responsive';

const CustomNotificationModal = ({
  isVisible,
  children,
  close,
  height,
  className
}) => {
  const matchCustomizeWidth = useMediaQuery({ query: '(max-width: 500px)' });
  return (
    <Modal
      //   title="Basic Modal"
      visible={isVisible}
      //   onOk={() => setIsVisible(false)}
      //   className={`reminder_modal ${className}`}
      closeIcon={false}
      centered
      footer={null}
      title={null}
      bodyStyle={{
        borderRadius: "0.625rem",
        padding: "1.563rem 0.938rem 2.188rem",
        height: height
      }}
      width={matchCustomizeWidth ? "100%" : 484}
      onCancel={close}
    >
      {children}
    </Modal>
  );
};

export default CustomNotificationModal;
