import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect
} from "react";
import CustomNotificationModal from "./CustomNotificationModal";
import { Button, Radio, Space } from "antd";
import DateRangeModal from "./DateRangeModal";
import { useMediaQuery } from "react-responsive";

const MuteNotificationsModal = ({ muteNotificationsRef }) => {
  const [promiseInfo, setPromiseInfo] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [muteOption, setMuteOption] = useState("height_hour");
  const [dateRange, setDateRange] = useState({});
  const dateRangeRef = React.useRef(null);
  const matchCustomizeRadioWidth = useMediaQuery({ query: '(max-width: 500px)' });

  const optionStyle = {
    border: "1px solid #AFD2E9",
    borderRadius: 10,
    width: matchCustomizeRadioWidth ? "100%" : 444,
    height: 40,
    padding: "0 16px"
  };

  const muteOptions = [
    { value: "one_hour", text: "1 Hour" },
    { value: "height_hour", text: "8 Hours" },
    { value: "one_week", text: "1 Week" },
    { value: "always", text: "Always" }
  ];

  React.useEffect(() => {
    muteNotificationsRef.current = show;
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
    promiseInfo.resolve(Object.keys(dateRange).length !== 0 ? dateRange : muteOption);
  };

  const chooseDateRange = async () => {
    try {
      const result = await dateRangeRef.current();
    //   console.log(result);

      setDateRange(result);
      setMuteOption("date_range");
    } catch (err) {
      //   console.log(err);
    }
  };

  return (
    <>
      <CustomNotificationModal isVisible={isVisible} close={close} height={469}>
        <div
          className="d-flex flex-column align-items-center justify-content-around"
          style={{ height: "100%" }}
        >
          <p style={{ textAlign: "center", fontSize: 18 }}>
            Mute Invitations Notifications For
          </p>
          <Radio.Group
            onChange={e => setMuteOption(e.target.value)}
            value={muteOption}
            style={{width: "100%"}}
          >
            <Space direction="vertical" style={{width: "100%"}}>
              {muteOptions.map(option => (
                <div
                  key={option.value}
                  className="d-flex align-items-center"
                  style={{
                    ...optionStyle,
                    backgroundColor:
                      option.value === muteOption ? "#DBF1FF" : ""
                  }}
                >
                  <Radio value={option.value}>{option.text}</Radio>
                </div>
              ))}
              {/* For Date Range */}
              {Object.keys(dateRange).length !== 0 && (
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{
                    ...optionStyle,
                    marginTop: 10,
                    backgroundColor: "#DBF1FF"
                  }}
                >
                  <Radio value="date_range">Date Range: 9 Feb - 23 Feb</Radio>
                  <Button
                    type="text"
                    style={{
                      color: "#455ECE",
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                    onClick={chooseDateRange}
                  >
                    Change
                  </Button>
                </div>
              )}
            </Space>
          </Radio.Group>

          {Object.keys(dateRange).length === 0 && (
            <Button
              type="text"
              style={{ color: "#455ECE" }}
              onClick={chooseDateRange}
            >
              Choose a Date Range
            </Button>
          )}

          <div>
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
              Mute
            </Button>
          </div>
        </div>
      </CustomNotificationModal>
      <DateRangeModal dateRangeRef={dateRangeRef} />
    </>
  );
};

export default MuteNotificationsModal;
