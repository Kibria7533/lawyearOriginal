import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SettingsLayout from "../components/Settings/SettingsLayout";
import {
  getPaymentMethods,
  getInvoices,
  detachPaymentMethod,
  getCurrentSubscription,
} from "../store/actions/subscription";
import {useDispatch} from "react-redux";
import {Spin} from "antd";
import {getAuthData} from "../util";
import moment from "moment";

const Billing = () => {
    const [openMonth, setOpenMonth] = useState(false);
    const [openYear, setOpenYear] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState({});
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useHistory();

    useEffect(async () => {
        setLoading(true)
        let paymentMethods = await getAllPaymentMethods();
        let invoices = await getAllInvoices();
        let subscription = await getSubscription(
            getAuthData().stripe_subscription_id
        );
        setCurrentSubscription(subscription);
        setPaymentMethods(paymentMethods)
        setInvoices(invoices)
        setLoading(false)
    }, []);

    const getSubscription = async (subscriptionId) => {
        return await dispatch(getCurrentSubscription(subscriptionId));
    };

    const style = {
        fontSize: 16,
        color: "#1F295A",
        fontWeight: "400",
        margin: 10,
    };

    const getAllPaymentMethods = async () => {
        return await dispatch(getPaymentMethods());
    }

    const getAllInvoices = async () => {
        return await dispatch(getInvoices());
    }

    const removePaymentMethod = async (paymentMethodId) => {
        setLoading(true)
        await dispatch(detachPaymentMethod({
            paymentMethodId : paymentMethodId
        }))

        // Refresh data
        let paymentMethods = await getAllPaymentMethods();
        let invoices = await getAllInvoices();
        setPaymentMethods(paymentMethods)
        setInvoices(invoices)

        setLoading(false)
    }

    return (
        <Spin spinning={loading}>
            <SettingsLayout navbar={false}>
                <div className="billing_back">
                    <div
                        style={{
                            fontSize: 22,
                            fontWeight: "700",
                            color: "#1F295A",
                            lineHeight: 1.4,
                            marginBottom: 8,
                            fontWeight: "400",
                        }}
                    >
                        Billing
                    </div>
                    <div className="d-flex align-items-center" style={{gap: 4}}>
                        <img src="/img/arrow_left.svg" style={{width: 13, height: 6}}/>
                        <p style={{color: "#455ECE", fontSize: 16}}>Back to Settings</p>
                    </div>
                </div>

                <h1 className="payment_method_title">Payment Methods</h1>

                <div style={{maxWidth: 451}} className="paragraph_billing_page">
                    <p>
                        Your free trial expires on
                        <span style={{fontWeight: "700"}}> {moment(currentSubscription.expires_in).format("Do MMMM YYYY")}</span>
                    </p>
                        {
                            paymentMethods.length == 0 ? (
                                <p>Please add a payment method to renew it automatically</p>
                            ) : <></>
                        }
                </div>
                <div className="grid_container_card">
                    {paymentMethods?.map((item) => (
                        <div className="card_added_payment_container">
                            <div
                                className="card_added_payment_container_top"
                                style={{opacity: item.blurred ? "50%" : " 100%"}}
                            >
                                <div className="card_added_payment_container_top_first">
                                    <img src={item.img} style={{width: "80%"}}/>
                                </div>
                                <div className="card_added_payment_container_top_second">
                                    <div>
                                        <p style={{color: "black", fontWeight: "400"}}>
                                            Your card ending in {item.endingNumber}
                                        </p>
                                        <p style={{color: "#9D9D9D", fontWeight: "400"}}>
                                            Expires: {item.expiration}
                                        </p>
                                    </div>
                                    {item.status === "Primary Card" ? (
                                        <img src="/img/mcq.svg"/>
                                    ) : (
                                        <img src="/img/circle_gray.svg"/>
                                    )}
                                </div>
                            </div>
                            <div className="card_added_payment_container_bottom">
                                <p
                                    className="status_card"
                                    style={{
                                        color:
                                            item.status === "Transaction Declined"
                                                ? "#E94614"
                                                : "black",
                                        fontWeight: "400",
                                    }}
                                >
                                    {item.status}
                                </p>
                                <div style={{display: "flex", gap: 20}}>
                                    {item.fix && <p className="button_action_card">Fix</p>}
                                    <p style={{cursor:"pointer"}} className="button_action_card">Edit</p>
                                    <p style={{cursor:"pointer"}} className="button_action_card" onClick={()=>removePaymentMethod(item.id)}>Remove</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {
                        paymentMethods.length == 0 ? (
                            <div
                                className="add_payment_container"
                                onClick={() => router.push("/payment-method")}
                            >
                                <img src="/img/plus-logo.png"/>
                                <p>Add New Payment Method</p>
                            </div>
                        ) : <></>
                    }
                </div>
                <div
                    className="billing_title_table"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                    }}
                >
                    <div style={{color: "#1F295A", fontSize: 16, fontWeight: "700"}}>
                        Billing History
                    </div>
                    <div className="container_billing_date">
                        <div
                            style={{
                                display: "flex",
                                gap: 6,
                                alignItems: "center",
                                position: "relative",
                            }}
                            onClick={() => setOpenYear(!openYear)}
                        >
                            <p style={{fontSize: 18, color: "#455ECE", cursor: "pointer"}}>
                                2021
                            </p>
                            <img src="/img/arrow_down.svg" style={{height: 4, width: 8}}/>
                            {openYear && (
                                <DropDownYear openYear={openYear} setOpenYear={setOpenYear}/>
                            )}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: 6,
                                alignItems: "center",
                                position: "relative",
                            }}
                            onClick={() => setOpenMonth(!openMonth)}
                        >
                            <p style={{fontSize: 18, color: "#455ECE", cursor: "pointer"}}>
                                All Months
                            </p>
                            <img src="/img/arrow_down.svg" style={{height: 4, width: 8}}/>
                            {openMonth && (
                                <DropDown openMonth={openMonth} setOpenMonth={setOpenMonth}/>
                            )}
                        </div>
                    </div>
                </div>

        <div className="table_desktop_container">
          <div className="d-flex">
            <div
              style={{
                width: "20%",
                fontSize: 16,
                color: "#9D9D9D",
                margin: 10,
              }}
            >
              Date
            </div>
            <div
              style={{
                width: "30%",
                fontSize: 16,
                color: "#9D9D9D",
                margin: 10,
              }}
            >
              Bill Number
            </div>
            <div
              style={{
                width: "10%",
                fontSize: 16,
                color: "#9D9D9D",
                margin: 10,
              }}
            >
              Sum
            </div>
            <div
              style={{
                width: "40%",
                fontSize: 16,
                color: "#9D9D9D",
                margin: 10,
              }}
            >
              Plan
            </div>
          </div>

                    {invoices?.map((item) => (
                        item.status !== "draft" && (<div
                            className="d-flex align-items-center table_desktop"
                            style={{
                                border:
                                    item.status === "paid"
                                        ? "1px solid #E1E1E1"
                                        : "1px solid #E94614",
                                marginBottom: 12,
                                borderRadius: 10,
                            }}
                        >
                            <div style={{width: "20%", ...style}} className="table_item">
                                {item.created_at}
                            </div>
                            <div style={{width: "30%", ...style}} className="table_item">
                                {item.id}
                            </div>
                            <div style={{width: "10%", ...style}} className="table_item">
                                {item.amount/100}
                            </div>
                            <div
                                style={{
                                    width: "40%",
                                    ...style,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    border: "none",
                                }}
                            >
                                <div>{item.plan}</div>
                                <div
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "700",
                                        color: item.status === "paid" ? "#455ECE" : "#E94614",
                                    }}
                                >
                                    {item.status == "paid" ? (<a target="_blank" href={item.hosted_invoice_url}>Download</a>): item.status}
                                </div>
                            </div>
                        </div>)
                    ))}
                </div>

        <div className="table_mobile">
          {invoices?.map((item) => (
            <div
              className="table_mobile_item"
              style={{
                border:
                  item.status === "Payment Declined" ? "1px solid #EB5757" : "",
              }}
            >
              <div className="table_mobile_item_row">
                <p className="title_table_mobile_billing">Date</p>
                <p className="result_table_mobile_billing">
                  {item?.created_at}
                </p>
              </div>
              <div className="table_mobile_item_row">
                <p className="title_table_mobile_billing">Bill Number</p>
                <p className="result_table_mobile_billing">{item?.id}</p>
              </div>
              <div className="table_mobile_item_row">
                <p className="title_table_mobile_billing">Sum</p>
                <p className="result_table_mobile_billing">
                  {item.amount / 100}
                </p>
              </div>
              <div className="table_mobile_item_row_no_border">
                <p className="title_table_mobile_billing">Plan</p>
                <p className="result_table_mobile_billing">{item.plan}</p>
              </div>
              <div
                className="last_item_table_mobile_billing"
                style={{
                  color: item.status === "Payment Declined" ? "#EB5757" : "",
                  fontWeight:
                    item.status === "Payment Declined" ? "400" : "600",
                }}
              >
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </SettingsLayout>
    </Spin>
  );
};

export default Billing;

const DropDown = ({ openMonth, setOpenMonth }) => {
  const [type, setType] = useState({
    name: "Short Answer",
    icon: "/img/shortAnswer.svg",
  });

  const Months = [
    "All Months",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "100%",
        background: "white",
        zIndex: "999",
        border: "1px solid #AFD2E9",
        fontSize: 16,
        color: "#1F295A",
        overflow: "hidden",
        fontWeight: "400",
        borderRadius: 10,
        marginBottom: 50,
        minWidth: 172,
      }}
    >
      {Months.map((item, index) => (
        <div
          key={index}
          style={{
            cursor: "pointer",
            height: 40,
            padding: "4px 20px",
            background: `${item?.name === type?.name ? "#DBF1FF" : ""}`,
            flexWrap: "wrap",
          }}
          className="dropdown_item_months d-flex align-items-center justify-content-between"
          onClick={() => {
            setOpenMonth(!openMonth);
          }}
        >
          <div className="d-flex align-items-center" style={{ gap: 8 }}>
            <img src="/img/checkbox.svg" style={{ height: 16, width: 16 }} />
            <p>{item}</p>
          </div>
          {index === 0 && (
            <img src="/img/arrow_up.svg" style={{ height: 8, width: 12 }} />
          )}
        </div>
      ))}
    </div>
  );
};

const DropDownYear = ({ openYear, setOpenYear }) => {
  const [type, setType] = useState({
    name: "Short Answer",
    icon: "/img/shortAnswer.svg",
  });

  const Years = [2022, 2021, 2020];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        /*      right: 0, */
        width: "100%",
        background: "white",
        zIndex: "999",
        border: "1px solid #AFD2E9",
        fontSize: 16,
        color: "#1F295A",
        overflow: "hidden",
        fontWeight: "400",
        borderRadius: 10,
        marginBottom: 50,
        minWidth: 172,
      }}
      className="drop_down_years"
    >
      {Years.map((item, index) => (
        <div
          key={index}
          style={{
            cursor: "pointer",
            height: 40,
            padding: "4px 20px",
            background: `${item?.name === type?.name ? "#DBF1FF" : ""}`,
            flexWrap: "wrap",
          }}
          className="dropdown_item_months d-flex align-items-center justify-content-between"
          onClick={() => {
            setOpenYear(!openYear);
          }}
        >
          <div className="d-flex align-items-center" style={{ gap: 8 }}>
            <img src="/img/checkbox.svg" style={{ height: 16, width: 16 }} />
            <p>{item}</p>
          </div>
          {index === 0 && (
            <img src="/img/arrow_up.svg" style={{ height: 8, width: 12 }} />
          )}
        </div>
      ))}
    </div>
  );
};
