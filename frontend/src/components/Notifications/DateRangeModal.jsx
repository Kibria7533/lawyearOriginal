import React, { useState, forwardRef, useImperativeHandle } from "react";
import CustomNotificationModal from "./CustomNotificationModal";
import { Button, DatePicker } from "antd";

const { RangePicker } = DatePicker;

const DateRangeModal = ({ dateRangeRef }) => {
  const [promiseInfo, setPromiseInfo] = useState({});
  const [isVisible, setIsVisible] = useState(false);


  React.useEffect(() => {
    dateRangeRef.current = show;
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
    promiseInfo.reject();
  };

  const confirm = async () => {
    setIsVisible(false);
    promiseInfo.resolve({
        startDate: "9 Feb",
        endDate: "23 Feb"
    });
  };

  function onChange(date, dateString) {
    console.log(dateString);
  }

  return (
    <CustomNotificationModal isVisible={isVisible} close={close} height={469}>
      <div
        className="d-flex flex-column align-items-center justify-content-around"
        style={{ height: "100%" }}
      >
        <p style={{ textAlign: "center", fontSize: 18 }}>
          Mute Invitations Notifications For
        </p>
        {/* <div>Date Picker</div> */}
        <RangePicker size="small" onChange={onChange}/>
        <p>Date Range: 9 Feb - 23 Feb</p>
        <Button
          type="primary"
          style={{
            backgroundColor: "#455ECE",
            height: 52,
            width: 220,
            borderRadius: 10
          }}
          onClick={confirm}
        >
          Choose a Date Range
        </Button>
        <Button
          type="text"
          style={{
            color: "#9D9D9D"
          }}
          onClick={close}
        >
          Cancel
        </Button>
      </div>
    </CustomNotificationModal>
  );
};

export default DateRangeModal;
