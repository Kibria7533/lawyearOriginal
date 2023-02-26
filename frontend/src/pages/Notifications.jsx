import React, { useState } from "react";
import PageHeader from "../components/Shared/PageHeader";
import { DrossierInput } from "../components";
import { MoreOutlined, DownOutlined } from "@ant-design/icons";
import { ReactComponent as SvgBookMark } from "../assets/bookmark-outline.svg";
import { ReactComponent as SvgMute } from "../assets/mute.svg";
import NotificationsFilter from "../components/Notifications/NotificationsFilter";
import NotificationItem from "../components/Notifications/NotificationItem";
import { Divider, Dropdown, Menu, Alert } from "antd";
import DeleteConfirmNotification from "../components/Notifications/DeleteConfirmNotification";
import MuteNotificationsModal from "../components/Notifications/MuteNotificationsModal";
import { useMediaQuery } from 'react-responsive';


const Notifications = () => {
  const initNotificationTypes = [
    { id: 1, text: "All Types", number: 4, isMuted: false, isImportant: false },
    { id: 2, text: "File Completion", isMuted: false, isImportant: true },
    {
      id: 3,
      text: "Invitations",
      number: 1,
      isMuted: false,
      isImportant: true
    },
    { id: 4, text: "Reminders", isMuted: false, isImportant: false },
    {
      id: 5,
      text: "Collaboration Request",
      isMuted: false,
      isImportant: false
    },
    {
      id: 6,
      text: "Subscription",
      number: 3,
      isMuted: false,
      isImportant: false
    },
    { id: 7, text: "Billing", isMuted: true, isImportant: false }
  ];

  let initNotificationList = [
    {
      id: 1,
      text: "File of Shoaib Irshad (Client ID: 4311) has been completed",
      date: "1 February, 15:00",
      type: "File Completion",
      isRead: false,
      isChecked: false
    },
    {
      id: 2,
      text: "Shoaib Irshad (Client ID: 4311) has accepted your invitation",
      date: "1 February, 15:00",
      type: "Invitations",
      isRead: false,
      isChecked: false
    },
    {
      id: 3,
      text:
        "An automated reminder has been sent to Shoaib Irshad (Client ID: 4311)",
      date: "1 February, 15:00",
      type: "Reminders",
      isRead: false,
      isChecked: false
    },
    {
      id: 4,
      text:
        "David has sent a collaboration request for Shoaib Irshad (Client ID: 4311)",
      date: "1 February, 15:00",
      type: "Collaboration Request",
      isRead: true,
      isChecked: false
    },
    {
      id: 5,
      text: "Your subscription is expiring soon, Renew it now",
      date: "1 February, 15:00",
      type: "Subscription",
      isRead: true,
      isChecked: false
    },
    {
      id: 6,
      text:
        "Your Free trial is expiring soon, add a payment method to buy subscription",
      date: "1 February, 15:00",
      type: "Billing",
      isRead: true,
      isChecked: false
    },
    {
      id: 7,
      text:
        "Shoaib Irshad (Client ID: 4311) has not accepted the invitation. Set up automated reminders",
      date: "1 February, 15:00",
      type: "Reminders",
      isRead: true,
      isChecked: false
    },
    {
      id: 8,
      text:
        "Shoaib Irshad (Client ID: 4311) has not submitted any information. Set up automated reminders",
      date: "1 February, 15:00",
      type: "File Completion",
      isRead: true,
      isChecked: false
    }
  ];
  const [notificationList, setNotificationList] = useState(
    initNotificationList
  );
  const [notificationTypes, setNotificationTypes] = useState(
    initNotificationTypes
  );
  const [
    numberSelectedNotifications,
    setNumberSelectedNotifications
  ] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState(1);
  const deleteConfirmRef = React.useRef(null);
  const muteNotificationsRef = React.useRef(null);
  const isMobileView = useMediaQuery({ query: '(max-width: 500px)' });

  const defaultFilterOption = {
    sortBy: "oldest_first"
  };
  const [filterBy, setFilterBy] = useState(defaultFilterOption);
  const onChangeFilter = ({ name, value }) => {
    setFilterBy({ ...filterBy, [name]: value });
  };

  const checkAll = allChecked => {
    setNumberSelectedNotifications(allChecked);
    setNumberSelectedNotifications(allChecked ? notificationList.length : 0);
    let updatedNotifications = notificationList.map(notification => {
      if (notification.isChecked !== allChecked) {
        return { ...notification, isChecked: allChecked };
      }
      return notification;
    });
    setNotificationList(updatedNotifications);
  };

  const checkOne = id => {
    let updatedNotifications = notificationList.map(notification => {
      if (notification.id === id) {
        return { ...notification, isChecked: !notification.isChecked };
      }
      return notification;
    });
    setNotificationList(updatedNotifications);

    setNumberSelectedNotifications(
      updatedNotifications.filter(n => n.isChecked).length
    );
  };

  const deleteSelected = async notificationId => {
    let isConfirmed = false;
    try {
      const result = await deleteConfirmRef.current();
      if (result) {
        isConfirmed = true;
      }
    } catch (err) {
      //   console.log(err);
    }

    if (!isConfirmed) {
      return;
    }

    let updatedNotifications = notificationList.filter(
      notification => notification.id !== notificationId
    );
    setNotificationList(updatedNotifications);
  };

  const deleteSelectedNotifications = async () => {
    let isConfirmed = false;
    try {
      const result = await deleteConfirmRef.current();
      if (result) {
        isConfirmed = true;
      }
    } catch (err) {
      //   console.log(err);
    }

    if (!isConfirmed) {
      return;
    }

    let updatedNotifications = notificationList.filter(
      notification => !notification.isChecked
    );
    setNumberSelectedNotifications(0);
    setNotificationList(updatedNotifications);
  };

  const markAsRead = () => {
    let updatedNotifications = notificationList.map(notification => {
      if (notification.isChecked && !notification.isRead) {
        return { ...notification, isRead: true, isChecked: false };
      }
      return notification;
    });
    setNumberSelectedNotifications(0);
    setNotificationList(updatedNotifications);
  };

  const muteNotifications = async id => {
    try {
      const result = await muteNotificationsRef.current();
      // console.log(result);
    } catch (err) {
      //   console.log(err);
    }

    // Just give the logic for the time 

    let updatedTypeNotifications = notificationTypes.map(type => {
      if (type.id === id) {
        return { ...type, isMuted: true };
      }
      return type;
    });
    setNotificationTypes(updatedTypeNotifications);
  };

  const filterNotificationsByType = typeText => {
    let updatedTypeNotifications = notificationTypes.filter(type => type.text !== typeText);
    setNotificationTypes(updatedTypeNotifications);
  };

  const typeNotificationsNumber = type => {
    let number = notificationList.filter(notification => notification.type === type).length;
    return number;
  }

  const deleteAllNotifications = async () => {
    let isConfirmed = false;
    try {
      const result = await deleteConfirmRef.current();
      if (result) {
        isConfirmed = true;
      }
    } catch (err) {
      //   console.log(err);
    }

    if (!isConfirmed) {
      return;
    }

    setNotificationList([]);
  };

  const markTypeAsImportant = id => {
    let updatedTypeNotifications = notificationTypes.map(type => {
      if (type.id === id) {
        return { ...type, isImportant: true };
      }
      return type;
    });
    setNotificationTypes(updatedTypeNotifications);
  };

  const menu = typeId => (
    <div id="menu-notifications-types">
      <Menu>
        <Menu.Item
          style={{ border: "none", color: "#1F295A" }}
          onClick={() => muteNotifications(typeId)}
        >
          Mute by Type
        </Menu.Item>
        <Menu.Item
          style={{ border: "none", fontSize: 16, fontWeight: 400, color: "#1F295A" }}
          onClick={() => markTypeAsImportant(typeId)}
        >
          Mark Type as Important
        </Menu.Item>
        <Menu.Item
          danger
          style={{ border: "none" }}
          onClick={deleteAllNotifications}
        >
          Delete All Notifications
          <br /> by Type
        </Menu.Item>
      </Menu>
    </div>
  );

  return (
    <>
      <PageHeader title="Notifications" />
      <div id="notifications_page">
        <div className="notifications_divider" />
        <div className="row">
          <div className="col-sm-12 col-lg-5 col-xl-4 col-xxl-3">
            {notificationTypes.map(type => (
              <DrossierInput
                key={type.id}
                onClick={() => setSelectedTypeFilter(type.id)}
                prefix={
                  type.number && (
                    <div
                      className="notification_number"
                      onClick={() => setSelectedTypeFilter(type.id)}
                    >
                      {type.number}
                      {/* {typeNotificationsNumber(type.text)} */}
                    </div>
                  )
                }
                suffix={
                  <>
                    {type.isImportant && (
                      <SvgBookMark
                        onClick={() => {
                          setSelectedTypeFilter(type.id);
                        }}
                        style={{ height: 14, width: 14, cursor: "pointer", color: "#455ECE !important" }}
                      />
                    )}
                    {type.isMuted && (
                      <SvgMute
                        onClick={() => setSelectedTypeFilter(type.id)}
                        style={{ height: 14, width: 14, cursor: "pointer" }}
                      />
                    )}
                    <Dropdown overlay={menu(type.id)}>
                      <a
                        className="ant-dropdown-link"
                        onClick={e => {
                          e.preventDefault();
                        }}
                        style={{marginTop: -5}}
                      >
                        <MoreOutlined />
                      </a>
                    </Dropdown>
                  </>
                }
                className={`notification_type ${selectedTypeFilter ===
                  type.id && "marked"}`}
                value={type.text}
                readOnly={true}
                labelShow={true}
              />
            ))}
          </div>
          <div className="col-sm-12 col-lg-7 col-xl-8 col-xxl-9">
            <NotificationsFilter
              filterBy={filterBy}
              onChangeFilter={onChangeFilter}
              checkAll={checkAll}
              numberSelectedNotifications={numberSelectedNotifications}
              deleteSelectedNotifications={deleteSelectedNotifications}
              markAsRead={markAsRead}
            />

            {notificationList.map(notification => (
              <div key={notification.id}>
                <NotificationItem
                  notification={notification}
                  checkOne={checkOne}
                  deleteSelected={deleteSelected}
                />
                <Divider style={{ margin: 0 }} />
              </div>
            ))}

            {notificationList.length === 0 && (
              <Alert message="No Notifications" type="info" showIcon />
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmNotification deleteConfirmRef={deleteConfirmRef} />

      <MuteNotificationsModal muteNotificationsRef={muteNotificationsRef} />
    </>
  );
};

export default Notifications;
