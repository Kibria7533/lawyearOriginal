import React, { useEffect, useState } from "react";
import { Checkbox, DatePicker, Modal, notification } from "antd";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { DrossierButton } from "..";
import { onUpdateRemainder } from "../../store/actions";

const SetReminderModal = ({
  visible,
  setVisible,
  edit = false,
  setEdit,
  getCategoryAnswer,
  updateRemainder,
  className = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [remainder, setRemainder] = useState(defState);
  const dateFormat = "YYYY-MM-DD";
  console.log(visible);
  useEffect(() => {
    if (typeof visible === "object") {
      setRemainder({
        remainderDate: visible.remainderDate,
        weeklyRemainder: visible.weeklyRemainder,
        threeRemainder: visible.threeRemainder,
        tenRemainder: visible.tenRemainder,
      });
    } else {
      setRemainder(defState);
    }
  }, [edit, visible]);
  // console.log(remainder);
  const history = useHistory();

  const onChange = (date) => {
    setRemainder({ ...remainder, remainderDate: date?.format() || "" });
  };
  const setReminder = async () => {
    setLoading(true);
    const remainderData = await onUpdateRemainder({
      id: visible?.id || visible,
      remainder,
    });
    if (remainderData.success) {
      setVisible(false);
      if (typeof updateRemainder === "function") {
        updateRemainder({ id: visible?.id || visible, ...remainder });
      } else {
        history.push("/client/list");
      }
    }
    setLoading(false);
  };
  console.log(remainder);
  return (
    <Modal
      visible={visible}
      className={`reminder_modal ${className}`}
      closeIcon={false}
      centered
      footer={null}
      title={null}
      bodyStyle={{
        borderRadius: "0.625rem",
        padding: "1.563rem 0.938rem 2.188rem",
      }}
    >
      {!edit ? (
        <>
          <div className="d-flex justify-content-center">
            <p className="modal_title mb-0">Set Up the Reminder</p>
          </div>
          <DatePicker
            value={
              remainder?.remainderDate
                ? moment(remainder.remainderDate, dateFormat)
                : null
            }
            onChange={onChange}
            // disabledDate={(current) =>
            //   current && current < moment().endOf("day")
            // }
          />
          <div className="checkbox_wrapper">
            <Checkbox
              checked={remainder.threeRemainder}
              onChange={(e) => {
                setRemainder({
                  ...remainder,
                  threeRemainder: e.target.checked,
                });
              }}
            >
              Remind After Three Days
            </Checkbox>
          </div>
          <div className="checkbox_wrapper">
            <Checkbox
              checked={remainder.weeklyRemainder}
              onChange={(e) => {
                setRemainder({
                  ...remainder,
                  weeklyRemainder: e.target.checked,
                });
              }}
            >
              Weekly Reminder
            </Checkbox>
          </div>
          <div className="checkbox_wrapper">
            <Checkbox
              checked={remainder.tenRemainder}
              onChange={(e) => {
                setRemainder({ ...remainder, tenRemainder: e.target.checked });
              }}
            >
              Reminder Every 10 Days
            </Checkbox>
          </div>
          <p className="desclimer">
            Clients will be reminded to fill in the missing details to complete
            their files
          </p>
          <div className="btn_wrapper">
            <DrossierButton
              text="Set Up"
              loading={loading}
              onClick={setReminder}
            />
            <p
              className="canl_btn"
              onClick={() => {
                setVisible(false);
                history.push("/client/list");
              }}
            >
              Cancel
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex justify-content-center">
            <p className="modal_title mb-0">Reminder</p>
          </div>
          <div className="remainder_for">
            <div className="inner_border">
              <span className="client_label">Full Name</span>
              <span className="client_value">
                {getCategoryAnswer(visible.request_questions, "First name")}
                {getCategoryAnswer(visible.request_questions, "Last name")}
              </span>
            </div>

            <div className="inner_border">
              <span className="client_label">Client ID</span>
              <span className="client_value">{visible.client_id}</span>
            </div>
            {visible?.remainderDate && (
              <div className="inner_border">
                <span className="client_label">Date</span>
                <span className="client_value">
                  {moment(visible.remainderDate).format("D MMMM")}
                </span>
              </div>
            )}
          </div>
          {visible.threeRemainder && (
            <p className="single_remainder">Remind After Three Days</p>
          )}
          {visible.weeklyRemainder && (
            <p className="single_remainder">Weekly Reminder</p>
          )}
          {visible.tenRemainder && (
            <p className="single_remainder">Remind After Ten Days</p>
          )}
          <div className="btn_wrapper edit_btn_df">
            <DrossierButton text="Edit" onClick={() => setEdit(false)} />
          </div>

          <p
            className="canl_btn text-center mt-3"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setVisible(false);
            }}
          >
            Cancel
          </p>
        </>
      )}
    </Modal>
  );
};

export default SetReminderModal;

const defState = {
  remainderDate: "",
  weeklyRemainder: false,
  threeRemainder: false,
  tenRemainder: false,
};
