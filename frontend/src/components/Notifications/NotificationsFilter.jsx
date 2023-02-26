import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Select, Checkbox } from "antd";
import { MailOutlined, DeleteOutlined } from "@ant-design/icons";

const NotificationsFilter = ({
  filterBy,
  onChangeFilter,
  checkAll,
  numberSelectedNotifications,
  deleteSelectedNotifications,
  markAsRead
}) => {
  const onChange = value => onChangeFilter({ name: "sortBy", value });
  const [allChecked, setAllChecked] = useState(false);

  const { Option } = Select;

  return (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{ margin: "0 0 25px 10px" }}
    >
      <div className="">
        <Checkbox
          checked={allChecked}
          onChange={() => {
            checkAll(!allChecked);
            setAllChecked(!allChecked);
          }}
        >
          All Notifications
        </Checkbox>
      </div>
      <div className="">
        {!numberSelectedNotifications ? (
          <div className="d-flex align-items-center sort_by_filter">
            <p>Sort by:</p>
            <Select
              style={{ width: 500 }}
              onChange={onChange}
              value={filterBy.sortBy}
              // dropdownClassName="sort_by_select_dorpdown"
              dropdownClassName="dropdown_notification_types"
              suffixIcon={<img width={"10px"} src="/img/arrow-blue.png" />}
            >
              <Option className="sort_by_option" value="oldest_first">
                Oldest First
              </Option>
              <Option className="sort_by_option" value="newest_first">
                Newest First
              </Option>
              <Option className="sort_by_option" value="important_first">
                Important First
              </Option>
            </Select>
          </div>
        ) : (
          <div className="d-flex align-items-center">
            <p>Selected: {numberSelectedNotifications}</p>
            <div
              className="d-flex align-items-center"
              style={{ margin: "0 20px", color: "#455ECE", cursor: "pointer" }}
              onClick={markAsRead}
            >
              <MailOutlined style={{ marginRight: 10 }} />
              <p>Mark as Read</p>
            </div>
            <div
              className="d-flex align-items-center"
              style={{ color: "#E94614", cursor: "pointer" }}
              onClick={deleteSelectedNotifications}
            >
              <DeleteOutlined style={{ marginRight: 10 }} />
              <p>Delete Selected</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsFilter;
