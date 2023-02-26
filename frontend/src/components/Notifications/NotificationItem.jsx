import React, { useState } from "react";
import { Checkbox } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const NotificationItem = props => {

  return (
    <div
      className="d-flex justify-content-between notification-item"
      style={{ backgroundColor: props.notification.isChecked ? "#DBF1FF" : null }}
    >
      <Checkbox
        checked={props.notification.isChecked}
        onChange={() => {
          props.checkOne(props.notification.id);
        }}
      >
        <div className="d-flex align-items-center">
          {!props.notification.isRead && (
            <div
              style={{
                minHeight: 10,
                minWidth: 10,
                borderRadius: "50%",
                backgroundColor: "#455ECE",
                marginRight: 12,
                marginLeft: 13
              }}
            />
          )}
          <div
            style={{
              color: props.notification.isRead ? "#1F295A" : "#455ECE",
              marginLeft: props.notification.isRead ? 11 : 0
            }}
          >
            {props.notification.text}
          </div>
        </div>
        <span
          style={{
            marginRight: 28,
            marginLeft: props.notification.isRead ? 11 : 35,
            color: !props.notification.isRead ? "#1F295A" : "#9D9D9D"
          }}
        >
          {props.notification.date}
        </span>
        <span
          style={{ color: props.notification.isRead ? "#9D9D9D" : "#455ECE" }}
        >
          {props.notification.type}
        </span>
      </Checkbox>
      <div>
        <DeleteOutlined
          style={{ fontSize: 20, cursor: "pointer" }}
          onClick={() => props.deleteSelected(props.notification.id)}
        />
      </div>
    </div>
  );
};

export default NotificationItem;
